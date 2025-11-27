/**
 * Send Message Server Action
 *
 * Handles sending messages to the AI and streaming responses back
 * Saves conversations to MongoDB for history
 */

'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { getAIProvider } from '@/lib/ai/provider';
import { buildSystemPrompt } from '@/lib/ai/systemPrompt';
import type { Message } from '@/types/chat';
import ClientModel from '@/models/Client';
import ConversationModel from '@/models/Conversation';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { connectDB } from '@/lib/db';
import { saveMessage } from '@/app/actions/conversations/saveMessage';
import { checkRateLimit, getTimeUntilReset } from '@/lib/rateLimit';
import { fetchAllGoogleAnalyticsProperties } from '@/lib/platforms/googleAnalytics/fetchData';
import { fetchLinkedInAdsData } from '@/lib/platforms/linkedin-ads/fetchData';
import { fetchMetaAdsData } from '@/lib/platforms/meta-ads/fetchData';
import { fetchGoogleAdsData } from '@/lib/platforms/google-ads/fetchData';
import type { PlatformHealthIssue } from '@/types/chat';

// Map platformId from PlatformConnection to the format expected by AI
const platformIdToKey: Record<string, string> = {
  'google-analytics': 'googleAnalytics',
  'google-ads': 'googleAds',
  'meta-ads': 'metaAds',
  'linkedin-ads': 'linkedInAds',
};

/**
 * Send a message to the AI and get a streaming response
 *
 * @param conversationId - ID of the conversation (null for new conversation)
 * @param messages - Conversation history
 * @param clientId - ID of the current client
 * @param dateRange - Optional date range for platform data fetching
 * @returns ReadableStream for SSE
 */
export async function sendMessageStream(
  conversationId: string | null,
  messages: Message[],
  clientId: string | null,
  dateRange?: { startDate?: string; endDate?: string }
): Promise<ReadableStream<Uint8Array>> {
  try {
    // Verify authentication
    const user = await requireAuth();

    // Check rate limit
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      const minutesUntilReset = Math.ceil(getTimeUntilReset(user.id) / 60000);
      const errorMessage = `Rate limit exceeded. You can send ${rateLimit.remaining} more messages. Please try again in ${minutesUntilReset} minutes.`;

      // Return error stream
      return new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        },
      });
    }

    // Fetch client data and platform data if clientId provided
    let client = null;
    let platformData: any = null;
    const platformHealthIssues: PlatformHealthIssue[] = [];

    if (clientId) {
      try {
        await connectDB();
        const clientDoc = await ClientModel.findByClientId(clientId, user.id);

        if (clientDoc) {
          // Get platform connections from PlatformConnection collection
          const connections = await (PlatformConnectionModel as any).findByClientId(clientId);
          const userConnections = connections.filter(
            (conn: any) => conn.userId.toString() === user.id
          );

          // Build platforms object from actual connections
          const platforms: Record<string, { connected: boolean; status: string }> = {};
          for (const conn of userConnections) {
            const key = platformIdToKey[conn.platformId];
            if (key && (conn.status === 'active' || conn.status === 'connected')) {
              platforms[key] = {
                connected: true,
                status: conn.status,
              };
            }
          }

          // Convert to plain object for the prompt
          client = {
            id: String(clientDoc._id),
            name: clientDoc.name,
            email: clientDoc.email,
            platforms,
          };

          // Fetch real platform data from APIs
          platformData = {};

          // Fetch Google Analytics data from ALL properties if connected
          const gaConnection = userConnections.find(
            (conn: any) => conn.platformId === 'google-analytics' && conn.status === 'active'
          );
          if (gaConnection) {
            try {
              // Check if token is expired BEFORE fetching
              if (gaConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: gaConnection._id.toString(),
                  platformId: 'google-analytics',
                  platformName: 'Google Analytics',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: gaConnection.expiresAt,
                  hasRefreshToken: !!gaConnection.getDecryptedRefreshToken(),
                });
              } else {
                const gaMultiData = await fetchAllGoogleAnalyticsProperties(
                  gaConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (gaMultiData) {
                  platformData.googleAnalyticsMulti = gaMultiData;
                }
              }
            } catch (gaError: any) {
              console.error('Error fetching Google Analytics data:', gaError);
              // Only add to issues if not already added for expiration
              if (!platformHealthIssues.some(i => i.platformId === 'google-analytics')) {
                platformHealthIssues.push({
                  connectionId: gaConnection._id.toString(),
                  platformId: 'google-analytics',
                  platformName: 'Google Analytics',
                  status: 'error',
                  error: gaError.message,
                  errorType: gaError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!gaConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch LinkedIn Ads data if connected
          const linkedInConnection = userConnections.find(
            (conn: any) => conn.platformId === 'linkedin-ads' && conn.status === 'active'
          );
          if (linkedInConnection) {
            try {
              if (linkedInConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: linkedInConnection._id.toString(),
                  platformId: 'linkedin-ads',
                  platformName: 'LinkedIn Ads',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: linkedInConnection.expiresAt,
                  hasRefreshToken: !!linkedInConnection.getDecryptedRefreshToken(),
                });
              } else {
                const linkedInData = await fetchLinkedInAdsData(
                  linkedInConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (linkedInData) {
                  platformData.linkedInAds = linkedInData;
                }
              }
            } catch (linkedInError: any) {
              console.error('Error fetching LinkedIn Ads data:', linkedInError);
              if (!platformHealthIssues.some(i => i.platformId === 'linkedin-ads')) {
                platformHealthIssues.push({
                  connectionId: linkedInConnection._id.toString(),
                  platformId: 'linkedin-ads',
                  platformName: 'LinkedIn Ads',
                  status: 'error',
                  error: linkedInError.message,
                  errorType: linkedInError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!linkedInConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch Meta Ads data if connected
          const metaConnection = userConnections.find(
            (conn: any) => conn.platformId === 'meta-ads' && conn.status === 'active'
          );
          if (metaConnection) {
            try {
              if (metaConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: metaConnection._id.toString(),
                  platformId: 'meta-ads',
                  platformName: 'Meta Ads',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: metaConnection.expiresAt,
                  hasRefreshToken: !!metaConnection.getDecryptedRefreshToken(),
                });
              } else {
                const metaData = await fetchMetaAdsData(
                  metaConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (metaData) {
                  platformData.metaAds = metaData;
                }
              }
            } catch (metaError: any) {
              console.error('Error fetching Meta Ads data:', metaError);
              if (!platformHealthIssues.some(i => i.platformId === 'meta-ads')) {
                platformHealthIssues.push({
                  connectionId: metaConnection._id.toString(),
                  platformId: 'meta-ads',
                  platformName: 'Meta Ads',
                  status: 'error',
                  error: metaError.message,
                  errorType: metaError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!metaConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch Google Ads data if connected
          const googleAdsConnection = userConnections.find(
            (conn: any) => conn.platformId === 'google-ads' && conn.status === 'active'
          );
          if (googleAdsConnection) {
            try {
              if (googleAdsConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: googleAdsConnection._id.toString(),
                  platformId: 'google-ads',
                  platformName: 'Google Ads',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: googleAdsConnection.expiresAt,
                  hasRefreshToken: !!googleAdsConnection.getDecryptedRefreshToken(),
                });
              } else {
                const googleAdsData = await fetchGoogleAdsData(
                  googleAdsConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (googleAdsData) {
                  platformData.googleAds = googleAdsData;
                }
              }
            } catch (googleAdsError: any) {
              console.error('Error fetching Google Ads data:', googleAdsError);
              if (!platformHealthIssues.some(i => i.platformId === 'google-ads')) {
                platformHealthIssues.push({
                  connectionId: googleAdsConnection._id.toString(),
                  platformId: 'google-ads',
                  platformName: 'Google Ads',
                  status: 'error',
                  error: googleAdsError.message,
                  errorType: googleAdsError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!googleAdsConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        // Continue without client data - AI will tell user to select a client
      }
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];

    // Save user message to conversation (creates conversation if doesn't exist)
    let actualConversationId = conversationId;
    if (clientId && lastUserMessage?.role === 'user') {
      const saveResult = await saveMessage({
        conversationId,
        clientId,
        role: 'user',
        content: lastUserMessage.content,
      });

      if (saveResult.success && saveResult.conversationId) {
        actualConversationId = saveResult.conversationId;
      }
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(client as any, platformData);

    // Get AI provider
    const aiProvider = await getAIProvider();

    // Generate streaming completion
    const stream = await aiProvider.generateStreamingCompletion(
      messages,
      systemPrompt
    );

    // Wrap the stream to collect the full response for saving
    let fullResponse = '';
    let conversationIdSent = false;
    let platformIssuesSent = false;
    let tokenUsage: { promptTokens: number; completionTokens: number; totalTokens: number } | null = null; // Phase 6.6
    const wrappedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        try {
          // Send platform health issues FIRST (before conversationId)
          if (platformHealthIssues.length > 0 && !platformIssuesSent) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ platformHealthIssues })}\n\n`
              )
            );
            platformIssuesSent = true;
          }

          // Send conversationId as the first message (so frontend knows it immediately)
          if (actualConversationId && !conversationIdSent) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ conversationId: actualConversationId })}\n\n`
              )
            );
            conversationIdSent = true;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Forward the chunk to the client
            controller.enqueue(value);

            // Decode and extract content for saving
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.content) {
                    fullResponse += data.content;
                  }
                  // Phase 6.6: Capture usage from stream
                  if (data.usage) {
                    tokenUsage = data.usage;
                  }
                } catch (e) {
                  // Ignore JSON parse errors
                }
              }
            }
          }

          // Save the complete assistant response
          if (clientId && actualConversationId && fullResponse) {
            await saveMessage({
              conversationId: actualConversationId,
              clientId,
              role: 'assistant',
              content: fullResponse,
            });

            // Phase 6.6: Update token usage for cost tracking
            if (tokenUsage) {
              try {
                await connectDB();
                const conversation = await ConversationModel.findByConversationId(
                  actualConversationId,
                  user.id
                );

                if (conversation) {
                  // Update or initialize token usage
                  if (!conversation.tokenUsage) {
                    conversation.tokenUsage = {
                      promptTokens: 0,
                      completionTokens: 0,
                      totalTokens: 0,
                    };
                  }

                  // Add new token usage to existing totals
                  conversation.tokenUsage.promptTokens += tokenUsage.promptTokens;
                  conversation.tokenUsage.completionTokens += tokenUsage.completionTokens;
                  conversation.tokenUsage.totalTokens += tokenUsage.totalTokens;

                  await conversation.save();
                }
              } catch (tokenError) {
                console.error('Error updating token usage:', tokenError);
                // Don't fail the request if token tracking fails
              }
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return wrappedStream;
  } catch (error) {
    console.error('Error in sendMessageStream:', error);

    // Return error stream
    return new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
        );
        controller.close();
      },
    });
  }
}

/**
 * Send a message and get a non-streaming response
 * (For use cases that don't need streaming)
 *
 * @param conversationId - ID of the conversation
 * @param messages - Conversation history
 * @param clientId - ID of the current client
 * @param dateRange - Optional date range for platform data fetching
 * @returns AI response with conversationId
 */
export async function sendMessage(
  conversationId: string | null,
  messages: Message[],
  clientId: string | null,
  dateRange?: { startDate?: string; endDate?: string }
): Promise<{ content: string; conversationId?: string | null; error?: string }> {
  try {
    // Verify authentication
    const user = await requireAuth();

    // Check rate limit
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      const minutesUntilReset = Math.ceil(getTimeUntilReset(user.id) / 60000);
      return {
        content: '',
        error: `Rate limit exceeded. You can send ${rateLimit.remaining} more messages. Please try again in ${minutesUntilReset} minutes.`,
      };
    }

    // Fetch client data and platform data (same as streaming version)
    let client = null;
    let platformData: any = null;
    const platformHealthIssues: PlatformHealthIssue[] = [];

    if (clientId) {
      try {
        await connectDB();
        const clientDoc = await ClientModel.findByClientId(clientId, user.id);

        if (clientDoc) {
          // Get platform connections from PlatformConnection collection
          const connections = await (PlatformConnectionModel as any).findByClientId(clientId);
          const userConnections = connections.filter(
            (conn: any) => conn.userId.toString() === user.id
          );

          // Build platforms object from actual connections
          const platforms: Record<string, { connected: boolean; status: string }> = {};
          for (const conn of userConnections) {
            const key = platformIdToKey[conn.platformId];
            if (key && (conn.status === 'active' || conn.status === 'connected')) {
              platforms[key] = {
                connected: true,
                status: conn.status,
              };
            }
          }

          client = {
            id: String(clientDoc._id),
            name: clientDoc.name,
            email: clientDoc.email,
            platforms,
          };

          // Fetch real platform data from APIs
          platformData = {};

          // Fetch Google Analytics data from ALL properties if connected
          const gaConnection = userConnections.find(
            (conn: any) => conn.platformId === 'google-analytics' && conn.status === 'active'
          );
          if (gaConnection) {
            try {
              // Check if token is expired BEFORE fetching
              if (gaConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: gaConnection._id.toString(),
                  platformId: 'google-analytics',
                  platformName: 'Google Analytics',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: gaConnection.expiresAt,
                  hasRefreshToken: !!gaConnection.getDecryptedRefreshToken(),
                });
              } else {
                const gaMultiData = await fetchAllGoogleAnalyticsProperties(
                  gaConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (gaMultiData) {
                  platformData.googleAnalyticsMulti = gaMultiData;
                }
              }
            } catch (gaError: any) {
              console.error('Error fetching Google Analytics data:', gaError);
              // Only add to issues if not already added for expiration
              if (!platformHealthIssues.some(i => i.platformId === 'google-analytics')) {
                platformHealthIssues.push({
                  connectionId: gaConnection._id.toString(),
                  platformId: 'google-analytics',
                  platformName: 'Google Analytics',
                  status: 'error',
                  error: gaError.message,
                  errorType: gaError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!gaConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch LinkedIn Ads data if connected
          const linkedInConnection = userConnections.find(
            (conn: any) => conn.platformId === 'linkedin-ads' && conn.status === 'active'
          );
          if (linkedInConnection) {
            try {
              if (linkedInConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: linkedInConnection._id.toString(),
                  platformId: 'linkedin-ads',
                  platformName: 'LinkedIn Ads',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: linkedInConnection.expiresAt,
                  hasRefreshToken: !!linkedInConnection.getDecryptedRefreshToken(),
                });
              } else {
                const linkedInData = await fetchLinkedInAdsData(
                  linkedInConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (linkedInData) {
                  platformData.linkedInAds = linkedInData;
                }
              }
            } catch (linkedInError: any) {
              console.error('Error fetching LinkedIn Ads data:', linkedInError);
              if (!platformHealthIssues.some(i => i.platformId === 'linkedin-ads')) {
                platformHealthIssues.push({
                  connectionId: linkedInConnection._id.toString(),
                  platformId: 'linkedin-ads',
                  platformName: 'LinkedIn Ads',
                  status: 'error',
                  error: linkedInError.message,
                  errorType: linkedInError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!linkedInConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch Meta Ads data if connected
          const metaConnection = userConnections.find(
            (conn: any) => conn.platformId === 'meta-ads' && conn.status === 'active'
          );
          if (metaConnection) {
            try {
              if (metaConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: metaConnection._id.toString(),
                  platformId: 'meta-ads',
                  platformName: 'Meta Ads',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: metaConnection.expiresAt,
                  hasRefreshToken: !!metaConnection.getDecryptedRefreshToken(),
                });
              } else {
                const metaData = await fetchMetaAdsData(
                  metaConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (metaData) {
                  platformData.metaAds = metaData;
                }
              }
            } catch (metaError: any) {
              console.error('Error fetching Meta Ads data:', metaError);
              if (!platformHealthIssues.some(i => i.platformId === 'meta-ads')) {
                platformHealthIssues.push({
                  connectionId: metaConnection._id.toString(),
                  platformId: 'meta-ads',
                  platformName: 'Meta Ads',
                  status: 'error',
                  error: metaError.message,
                  errorType: metaError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!metaConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch Google Ads data if connected
          const googleAdsConnection = userConnections.find(
            (conn: any) => conn.platformId === 'google-ads' && conn.status === 'active'
          );
          if (googleAdsConnection) {
            try {
              if (googleAdsConnection.isExpired()) {
                platformHealthIssues.push({
                  connectionId: googleAdsConnection._id.toString(),
                  platformId: 'google-ads',
                  platformName: 'Google Ads',
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: googleAdsConnection.expiresAt,
                  hasRefreshToken: !!googleAdsConnection.getDecryptedRefreshToken(),
                });
              } else {
                const googleAdsData = await fetchGoogleAdsData(
                  googleAdsConnection,
                  dateRange?.startDate,
                  dateRange?.endDate
                );
                if (googleAdsData) {
                  platformData.googleAds = googleAdsData;
                }
              }
            } catch (googleAdsError: any) {
              console.error('Error fetching Google Ads data:', googleAdsError);
              if (!platformHealthIssues.some(i => i.platformId === 'google-ads')) {
                platformHealthIssues.push({
                  connectionId: googleAdsConnection._id.toString(),
                  platformId: 'google-ads',
                  platformName: 'Google Ads',
                  status: 'error',
                  error: googleAdsError.message,
                  errorType: googleAdsError.message.includes('401') ? 'expired_token' : 'api_error',
                  hasRefreshToken: !!googleAdsConnection.getDecryptedRefreshToken(),
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(client as any, platformData);

    // Get AI provider
    const aiProvider = await getAIProvider();

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];

    // Save user message to conversation (creates conversation if doesn't exist)
    let actualConversationId = conversationId;
    if (clientId && lastUserMessage?.role === 'user') {
      const saveResult = await saveMessage({
        conversationId,
        clientId,
        role: 'user',
        content: lastUserMessage.content,
      });

      if (saveResult.success && saveResult.conversationId) {
        actualConversationId = saveResult.conversationId;
      }
    }

    // Generate completion
    const response = await aiProvider.generateChatCompletion(
      messages,
      systemPrompt
    );

    // Save assistant response to conversation
    if (clientId && actualConversationId) {
      await saveMessage({
        conversationId: actualConversationId,
        clientId,
        role: 'assistant',
        content: response.content,
      });

      // Phase 6.6: Update token usage for cost tracking
      if (response.usage) {
        try {
          await connectDB();
          const conversation = await ConversationModel.findByConversationId(
            actualConversationId,
            user.id
          );

          if (conversation) {
            // Update or initialize token usage
            if (!conversation.tokenUsage) {
              conversation.tokenUsage = {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
              };
            }

            // Add new token usage to existing totals
            conversation.tokenUsage.promptTokens += response.usage.promptTokens;
            conversation.tokenUsage.completionTokens += response.usage.completionTokens;
            conversation.tokenUsage.totalTokens += response.usage.totalTokens;

            await conversation.save();
          }
        } catch (tokenError) {
          console.error('Error updating token usage:', tokenError);
          // Don't fail the request if token tracking fails
        }
      }
    }

    return {
      content: response.content,
      conversationId: actualConversationId,
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
