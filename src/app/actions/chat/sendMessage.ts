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
import { connectDB } from '@/lib/db';
import { saveMessage } from '@/app/actions/conversations/saveMessage';
import { checkRateLimit, getTimeUntilReset } from '@/lib/rateLimit';

/**
 * Send a message to the AI and get a streaming response
 *
 * @param conversationId - ID of the conversation (null for new conversation)
 * @param messages - Conversation history
 * @param clientId - ID of the current client
 * @returns ReadableStream for SSE
 */
export async function sendMessageStream(
  conversationId: string | null,
  messages: Message[],
  clientId: string | null
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
    let platformData = null;

    if (clientId) {
      try {
        await connectDB();
        const clientDoc = await ClientModel.findByClientId(clientId, user.id);

        if (clientDoc) {
          // Convert to plain object for the prompt
          client = {
            id: String(clientDoc._id),
            name: clientDoc.name,
            email: clientDoc.email,
            platforms: {
              googleAnalytics: clientDoc.platforms?.googleAnalytics?.connected ? {
                connected: true,
                status: clientDoc.platforms.googleAnalytics.status
              } : undefined,
              googleAds: clientDoc.platforms?.googleAds?.connected ? {
                connected: true,
                status: clientDoc.platforms.googleAds.status
              } : undefined,
              metaAds: clientDoc.platforms?.metaAds?.connected ? {
                connected: true,
                status: clientDoc.platforms.metaAds.status
              } : undefined,
              linkedInAds: clientDoc.platforms?.linkedInAds?.connected ? {
                connected: true,
                status: clientDoc.platforms.linkedInAds.status
              } : undefined,
            },
          };

          // Extract platform metrics for AI context
          platformData = {
            googleAnalytics: clientDoc.platforms?.googleAnalytics?.metrics || null,
            googleAds: clientDoc.platforms?.googleAds?.campaigns || null,
            metaAds: clientDoc.platforms?.metaAds?.campaigns || null,
            linkedInAds: clientDoc.platforms?.linkedInAds?.campaigns || null,
          };
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
    const wrappedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        try {
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
 * @returns AI response with conversationId
 */
export async function sendMessage(
  conversationId: string | null,
  messages: Message[],
  clientId: string | null
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
    let platformData = null;

    if (clientId) {
      try {
        await connectDB();
        const clientDoc = await ClientModel.findByClientId(clientId, user.id);

        if (clientDoc) {
          client = {
            id: String(clientDoc._id),
            name: clientDoc.name,
            email: clientDoc.email,
            platforms: {
              googleAnalytics: clientDoc.platforms?.googleAnalytics?.connected ? {
                connected: true,
                status: clientDoc.platforms.googleAnalytics.status
              } : undefined,
              googleAds: clientDoc.platforms?.googleAds?.connected ? {
                connected: true,
                status: clientDoc.platforms.googleAds.status
              } : undefined,
              metaAds: clientDoc.platforms?.metaAds?.connected ? {
                connected: true,
                status: clientDoc.platforms.metaAds.status
              } : undefined,
              linkedInAds: clientDoc.platforms?.linkedInAds?.connected ? {
                connected: true,
                status: clientDoc.platforms.linkedInAds.status
              } : undefined,
            },
          };

          platformData = {
            googleAnalytics: clientDoc.platforms?.googleAnalytics?.metrics || null,
            googleAds: clientDoc.platforms?.googleAds?.campaigns || null,
            metaAds: clientDoc.platforms?.metaAds?.campaigns || null,
            linkedInAds: clientDoc.platforms?.linkedInAds?.campaigns || null,
          };
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
