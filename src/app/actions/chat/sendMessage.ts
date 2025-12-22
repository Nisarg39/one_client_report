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
import UserModel from '@/models/User';
import { connectDB } from '@/lib/db';
import { saveMessage } from '@/app/actions/conversations/saveMessage';
import type { PlatformHealthIssue } from '@/types/chat';
// Multi-agent system imports
import { routeQuery, executeAgent, getAgentMetadata } from '@/lib/ai/agents/orchestrator';
import type { AgentContext } from '@/lib/ai/agents/types';
// Unified data fetcher (routes between real and mock data)
import { fetchPlatformData } from '@/lib/platforms/dataFetcher';
// Trial period and message limit validation
import { checkTrialLimits } from '@/lib/utils/trialLimits';
import { checkSubscriptionLimits } from '@/lib/utils/subscriptionLimits';

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
  dateRange?: { startDate?: string; endDate?: string },
  selectedPropertyId?: string | null,
  selectedMetaCampaignId?: string | null
): Promise<ReadableStream<Uint8Array>> {
  try {
    // Verify authentication
    const authUser = await requireAuth();

    // Check subscription status first (Access Control)
    const subCheck = await checkSubscriptionLimits(authUser.id);
    if (!subCheck.allowed) {
      const redirectUrl = '/#pricing';
      return new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: subCheck.message,
                redirect: redirectUrl,
                reason: subCheck.reason,
              })}\n\n`
            )
          );
          controller.close();
        },
      });
    }

    // Fetch full user document to get accountType and restrictions
    await connectDB();
    const userDoc = await UserModel.findById(authUser.id);
    if (!userDoc) {
      throw new Error('User not found');
    }

    // Check trial period and daily message limit (7-day trial, 50 messages/day)
    const trialCheck = await checkTrialLimits(authUser.id);
    if (!trialCheck.allowed) {
      const errorMessage = trialCheck.message || 'Trial period expired or daily limit reached.';
      const redirectUrl = '/#pricing';

      // Return error stream with redirect information
      return new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: errorMessage,
                redirect: redirectUrl,
                reason: trialCheck.reason,
                daysRemaining: trialCheck.daysRemaining,
                messagesUsed: trialCheck.messagesUsed,
                messagesLimit: trialCheck.messagesLimit,
              })}\n\n`
            )
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
        const clientDoc = await ClientModel.findByClientId(clientId, authUser.id);

        if (clientDoc) {
          // Get platform connections from PlatformConnection collection
          const connections = await (PlatformConnectionModel as any).findByClientId(clientId);
          const userConnections = connections.filter(
            (conn: any) => conn.userId.toString() === authUser.id
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

          // Check for expired tokens BEFORE fetching data (only for business mode with real APIs)
          if (userDoc.restrictions?.allowRealAPIs && clientDoc.dataSource === 'real') {
            for (const conn of userConnections) {
              if (conn.status === 'active' && conn.isExpired()) {
                const platformNames: Record<string, string> = {
                  'google-analytics': 'Google Analytics',
                  'google-ads': 'Google Ads',
                  'meta-ads': 'Meta Ads',
                  'linkedin-ads': 'LinkedIn Ads',
                };

                platformHealthIssues.push({
                  connectionId: conn._id.toString(),
                  platformId: conn.platformId,
                  platformName: platformNames[conn.platformId] || conn.platformId,
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: conn.expiresAt,
                  hasRefreshToken: !!conn.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch platform data using unified fetcher (routes between real and mock)
          try {
            const platformDataResponse = await fetchPlatformData(
              clientDoc,
              userDoc,
              userConnections,
              dateRange,
              selectedPropertyId || undefined,
              selectedMetaCampaignId || undefined
            );

            platformData = platformDataResponse.data;

            // Add mock data metadata if applicable
            if (platformDataResponse.source !== 'real') {
              platformData._source = platformDataResponse.source;
              platformData.scenarioName = platformDataResponse.scenarioName;
              platformData.scenarioId = platformDataResponse.scenarioId;
              platformData.difficulty = platformDataResponse.difficulty;
            }
          } catch (fetchError: any) {
            console.error('Error fetching platform data:', fetchError);
            platformData = {};
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

    // MULTI-AGENT SYSTEM: Route query to appropriate agent
    let systemPrompt: string;
    let selectedAgentId: string | null = null;
    let selectedAgentName: string | null = null;

    if (lastUserMessage?.content) {
      try {
        // Build agent context with accountType and restrictions
        const agentContext: AgentContext = {
          client: client as any,
          platformData,
          conversationHistory: messages,
          query: lastUserMessage.content,
          dateRange,
          selectedPropertyId,
          selectedMetaCampaignId,
          accountType: userDoc.accountType,
          userRestrictions: {
            allowedAgents: userDoc.restrictions?.allowedAgents || [],
            aiModel: userDoc.restrictions?.aiModel,
          },
        };

        // Route query to appropriate agent
        const routeDecision = await routeQuery(lastUserMessage.content, agentContext);

        // Execute the selected agent to get its system prompt
        systemPrompt = executeAgent(routeDecision.primaryAgent, agentContext);

        // Store agent metadata for sending to client
        selectedAgentId = routeDecision.primaryAgent.id;
        selectedAgentName = routeDecision.primaryAgent.name;
      } catch (agentError) {
        console.error('Error in agent routing, falling back to default prompt:', agentError);
        // Fallback to default system prompt if agent routing fails
        systemPrompt = buildSystemPrompt(client as any, platformData, userDoc.accountType, selectedPropertyId, selectedMetaCampaignId);
      }
    } else {
      // No user message, use default prompt
      systemPrompt = buildSystemPrompt(client as any, platformData, userDoc.accountType, selectedPropertyId, selectedMetaCampaignId);
    }

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

          // Send agent metadata (which agent is responding)
          if (selectedAgentId && selectedAgentName) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  agentId: selectedAgentId,
                  agentName: selectedAgentName
                })}\n\n`
              )
            );
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

          // Phase 6.7: Send platform data to client for metrics dashboard
          if (platformData && Object.keys(platformData).length > 0) {
            // Build platform data payload
            const platformDataPayload = {
              timestamp: Date.now(),
              dateRange: {
                startDate: dateRange?.startDate || '',
                endDate: dateRange?.endDate || '',
              },
              platforms: {
                googleAnalytics: platformData.googleAnalyticsMulti || null,
                googleAds: platformData.googleAds || null,
                metaAds: platformData.metaAds || null,
                linkedInAds: platformData.linkedInAds || null,
              },
            };

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ platformData: platformDataPayload })}\n\n`
              )
            );
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
                  authUser.id
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
  dateRange?: { startDate?: string; endDate?: string },
  selectedPropertyId?: string | null,
  selectedMetaCampaignId?: string | null
): Promise<{
  content: string;
  conversationId?: string | null;
  error?: string;
  redirect?: string;
  reason?: 'trial_expired' | 'daily_limit_reached' | 'subscription_expired' | 'no_subscription';
  daysRemaining?: number;
  messagesUsed?: number;
  messagesLimit?: number;
}> {
  try {
    // Verify authentication
    const authUser = await requireAuth();

    // Check subscription status first
    const subCheck = await checkSubscriptionLimits(authUser.id);
    if (!subCheck.allowed) {
      return {
        content: '',
        error: subCheck.message,
        redirect: '/#pricing',
        reason: subCheck.reason,
      };
    }

    // Fetch full user document to get accountType and restrictions
    await connectDB();
    const userDoc = await UserModel.findById(authUser.id);
    if (!userDoc) {
      throw new Error('User not found');
    }

    // Check trial period and daily message limit (7-day trial, 50 messages/day)
    const trialCheck = await checkTrialLimits(authUser.id);
    if (!trialCheck.allowed) {
      const errorMessage = trialCheck.message || 'Trial period expired or daily limit reached.';
      const redirectUrl = '/#pricing';

      return {
        content: '',
        error: errorMessage,
        redirect: redirectUrl,
        reason: trialCheck.reason,
        daysRemaining: trialCheck.daysRemaining,
        messagesUsed: trialCheck.messagesUsed,
        messagesLimit: trialCheck.messagesLimit,
      };
    }

    // Fetch client data and platform data (same as streaming version)
    let client = null;
    let platformData: any = null;
    const platformHealthIssues: PlatformHealthIssue[] = [];

    if (clientId) {
      try {
        await connectDB();
        const clientDoc = await ClientModel.findByClientId(clientId, authUser.id);

        if (clientDoc) {
          // Get platform connections from PlatformConnection collection
          const connections = await (PlatformConnectionModel as any).findByClientId(clientId);
          const userConnections = connections.filter(
            (conn: any) => conn.userId.toString() === authUser.id
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

          // Check for expired tokens BEFORE fetching data (only for business mode with real APIs)
          if (userDoc.restrictions?.allowRealAPIs && clientDoc.dataSource === 'real') {
            for (const conn of userConnections) {
              if (conn.status === 'active' && conn.isExpired()) {
                const platformNames: Record<string, string> = {
                  'google-analytics': 'Google Analytics',
                  'google-ads': 'Google Ads',
                  'meta-ads': 'Meta Ads',
                  'linkedin-ads': 'LinkedIn Ads',
                };

                platformHealthIssues.push({
                  connectionId: conn._id.toString(),
                  platformId: conn.platformId,
                  platformName: platformNames[conn.platformId] || conn.platformId,
                  status: 'expired',
                  errorType: 'expired_token',
                  expiresAt: conn.expiresAt,
                  hasRefreshToken: !!conn.getDecryptedRefreshToken(),
                });
              }
            }
          }

          // Fetch platform data using unified fetcher (routes between real and mock)
          try {
            const platformDataResponse = await fetchPlatformData(
              clientDoc,
              userDoc,
              userConnections,
              dateRange,
              selectedPropertyId || undefined,
              selectedMetaCampaignId || undefined
            );

            platformData = platformDataResponse.data;

            // Add mock data metadata if applicable
            if (platformDataResponse.source !== 'real') {
              platformData._source = platformDataResponse.source;
              platformData.scenarioName = platformDataResponse.scenarioName;
              platformData.scenarioId = platformDataResponse.scenarioId;
              platformData.difficulty = platformDataResponse.difficulty;
            }
          } catch (fetchError: any) {
            console.error('Error fetching platform data:', fetchError);
            platformData = {};
          }
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    }

    // Build system prompt with accountType
    const systemPrompt = buildSystemPrompt(client as any, platformData, userDoc.accountType, selectedPropertyId, selectedMetaCampaignId);

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
            authUser.id
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
