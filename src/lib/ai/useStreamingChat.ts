/**
 * useStreamingChat Hook
 *
 * Client-side hook for consuming Server-Sent Events from AI streaming
 */

'use client';

import { useState, useCallback } from 'react';
import { sendMessageStream } from '@/app/actions/chat/sendMessage';
import type { Message, PlatformHealthIssue } from '@/types/chat';

interface UseStreamingChatOptions {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string, conversationId: string | null) => void;
  onError?: (error: string) => void;
  onPlatformStatus?: (issues: PlatformHealthIssue[]) => void;
}

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false);

  /**
   * Send a message and stream the response
   */
  const streamMessage = useCallback(
    async (
      conversationId: string | null,
      messages: Message[],
      clientId: string | null,
      options: UseStreamingChatOptions = {},
      dateRange?: { startDate?: string; endDate?: string }
    ) => {
      const { onToken, onComplete, onError, onPlatformStatus } = options;

      setIsStreaming(true);
      let fullResponse = '';
      let receivedConversationId: string | null = conversationId;

      try {
        // Get streaming response from Server Action
        const stream = await sendMessageStream(conversationId, messages, clientId, dateRange);

        // Read the stream
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE data
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix

              if (data === '[DONE]') {
                // Stream complete
                if (onComplete) {
                  onComplete(fullResponse, receivedConversationId);
                }
                setIsStreaming(false);
                return;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.error) {
                  // Error occurred
                  if (onError) {
                    onError(parsed.error);
                  }
                  setIsStreaming(false);
                  return;
                }

                if (parsed.platformHealthIssues) {
                  // Platform health issues received
                  if (onPlatformStatus) {
                    onPlatformStatus(parsed.platformHealthIssues);
                  }
                }

                if (parsed.conversationId) {
                  // Conversation ID received (for new conversations)
                  receivedConversationId = parsed.conversationId;
                }

                if (parsed.content) {
                  // New token received
                  fullResponse += parsed.content;

                  if (onToken) {
                    onToken(parsed.content);
                  }
                }
              } catch (e) {
                // Ignore JSON parse errors (incomplete chunks)
              }
            }
          }
        }

        // If stream ended without [DONE] signal, call onComplete
        if (onComplete) {
          onComplete(fullResponse, receivedConversationId);
        }
        setIsStreaming(false);
      } catch (error) {
        console.error('Streaming error:', error);
        setIsStreaming(false);

        if (onError) {
          onError(
            error instanceof Error ? error.message : 'Failed to stream response'
          );
        }
      }
    },
    []
  );

  return {
    streamMessage,
    isStreaming,
  };
}
