/**
 * Get Conversations by Status Server Action
 * Filter conversations by status (active, archived, all) with pagination
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';
import type { ConversationSummary } from './getConversations';
import type { ConversationFilter } from '@/types/chat';

export interface GetConversationsByStatusResult {
  success: boolean;
  conversations?: ConversationSummary[];
  totalCount?: number;
  hasMore?: boolean;
  error?: string;
}

const PAGE_SIZE = 15;

/**
 * Get conversations filtered by status with pagination
 *
 * @param status - Filter: 'active', 'archived', or 'all'
 * @param clientId - Optional client ID to filter by
 * @param page - Page number (0-indexed)
 */
export async function getConversationsByStatus(
  status: ConversationFilter = 'active',
  clientId?: string,
  page: number = 0
): Promise<GetConversationsByStatusResult> {
  try {
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

    // Get total count for pagination
    const totalCount = await ConversationModel.countByStatus(
      user.id,
      status,
      clientId
    );

    // Get conversations by status with pagination
    const skip = page * PAGE_SIZE;
    const conversations = await ConversationModel.findByStatus(
      user.id,
      status,
      clientId,
      PAGE_SIZE,
      skip
    );

    const hasMore = skip + conversations.length < totalCount;

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
      totalCount,
      hasMore,
    };
  } catch (error) {
    console.error('[getConversationsByStatus] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch conversations. Please try again.',
    };
  }
}
