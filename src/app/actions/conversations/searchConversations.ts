/**
 * Search Conversations Server Action
 * Full-text search on conversation messages and titles
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';
import type { ConversationSummary } from './getConversations';

export interface SearchConversationsResult {
  success: boolean;
  conversations?: ConversationSummary[];
  error?: string;
}

/**
 * Search conversations by text query
 * Uses MongoDB text index for full-text search
 *
 * @param query - Search query string
 * @param clientId - Optional client ID to filter by
 * @param limit - Maximum number of results (default: 20)
 */
export async function searchConversations(
  query: string,
  clientId?: string,
  limit: number = 20
): Promise<SearchConversationsResult> {
  try {
    // Validate query
    if (!query || query.trim().length < 2) {
      return {
        success: false,
        error: 'Search query must be at least 2 characters',
      };
    }

    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Connect to database
    await connectDB();

    // Search conversations
    const conversations = await ConversationModel.searchConversations(
      user.id,
      query.trim(),
      clientId,
      Math.min(limit, 50) // Cap at 50 results
    );

    return {
      success: true,
      conversations: conversations.map((conv: any) => ({
        conversationId: conv.conversationId,
        clientId: String(conv.clientId),
        summary: conv.title || conv.getSummary(),
        messageCount: conv.messageCount,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt?.toISOString() || new Date().toISOString(),
        title: conv.title || '',
        isPinned: conv.isPinned || false,
        status: conv.status,
      })),
    };
  } catch (error) {
    console.error('[searchConversations] Error:', error);
    return {
      success: false,
      error: 'Failed to search conversations. Please try again.',
    };
  }
}
