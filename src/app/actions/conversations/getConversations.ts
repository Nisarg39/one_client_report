/**
 * Get Conversations Server Action
 * Retrieves all conversations for the authenticated user
 * Optionally filtered by clientId
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

export interface ConversationSummary {
  conversationId: string;
  clientId: string;
  summary: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}

export interface GetConversationsResult {
  success: boolean;
  conversations?: ConversationSummary[];
  error?: string;
}

/**
 * Get all conversations for the current user
 * @param clientId - Optional client ID to filter by
 */
export async function getConversations(
  clientId?: string
): Promise<GetConversationsResult> {
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

    // Get conversations (filtered by client if provided)
    const conversations = await ConversationModel.findActiveByUser(
      user.id,
      clientId
    );

    return {
      success: true,
      conversations: conversations.map((conv: any) => ({
        conversationId: conv.conversationId,
        clientId: String(conv.clientId),
        summary: conv.getSummary(),
        messageCount: conv.messageCount,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt?.toISOString() || new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error('[getConversations] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch conversations. Please try again.',
    };
  }
}
