/**
 * OpenAI Provider Implementation
 *
 * Implements the AI provider interface using OpenAI's API
 * Model: GPT-4o-mini (cost-efficient, fast)
 */

import OpenAI from 'openai';
import type { Message } from '@/types/chat';
import type { AIProvider, AIChatResponse } from './provider';

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not set. Please add it to your .env.local file.\n' +
        'Get your API key from: https://platform.openai.com/api-keys'
    );
  }

  return new OpenAI({
    apiKey,
  });
}

/**
 * Convert our Message format to OpenAI format
 */
function convertToOpenAIMessages(
  messages: Message[],
  systemPrompt: string
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];
}

/**
 * OpenAI Provider Implementation
 */
export const openAIProvider: AIProvider = {
  /**
   * Generate a non-streaming chat completion
   */
  async generateChatCompletion(
    messages: Message[],
    systemPrompt: string
  ): Promise<AIChatResponse> {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: convertToOpenAIMessages(messages, systemPrompt),
      temperature: 0.7,
      max_tokens: 1000,
    });

    const choice = response.choices[0];

    if (!choice?.message?.content) {
      throw new Error('No response from OpenAI');
    }

    return {
      content: choice.message.content,
      model: response.model,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  },

  /**
   * Generate a streaming chat completion
   * Returns a ReadableStream for Server-Sent Events
   */
  async generateStreamingCompletion(
    messages: Message[],
    systemPrompt: string,
    onToken?: (token: string) => void
  ): Promise<ReadableStream<Uint8Array>> {
    const client = getOpenAIClient();

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: convertToOpenAIMessages(messages, systemPrompt),
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    // Create a ReadableStream for SSE
    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              // Call onToken callback if provided
              if (onToken) {
                onToken(content);
              }

              // Send as Server-Sent Event
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });
  },
};
