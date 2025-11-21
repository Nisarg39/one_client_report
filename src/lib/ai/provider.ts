/**
 * AI Provider Interface
 *
 * Abstraction layer for AI providers (OpenAI, Claude, etc.)
 * Currently using OpenAI GPT-4o-mini
 */

import type { Message } from '@/types/chat';

/**
 * AI Chat Response
 * Represents a complete AI response
 */
export interface AIChatResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * AI Provider Interface
 * Implement this for different AI providers
 */
export interface AIProvider {
  /**
   * Generate a chat completion
   * @param messages - Conversation history
   * @param systemPrompt - System instructions for the AI
   * @returns AI response
   */
  generateChatCompletion(
    messages: Message[],
    systemPrompt: string
  ): Promise<AIChatResponse>;

  /**
   * Generate a streaming chat completion
   * @param messages - Conversation history
   * @param systemPrompt - System instructions for the AI
   * @param onToken - Callback for each token
   * @returns ReadableStream for streaming response
   */
  generateStreamingCompletion(
    messages: Message[],
    systemPrompt: string,
    onToken?: (token: string) => void
  ): Promise<ReadableStream<Uint8Array>>;
}

/**
 * Get the current AI provider
 * Currently returns OpenAI provider
 */
export async function getAIProvider(): Promise<AIProvider> {
  const { openAIProvider } = await import('./openai');
  return openAIProvider;
}
