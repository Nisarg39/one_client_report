/**
 * Archive/Unarchive Conversation Server Action
 * Soft archive a conversation (keeps data but hides from active list)
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

export interface ArchiveConversationResult {
  success: boolean;
  error?: string;
  status?: 'active' | 'archived';
}

/**
 * Archive a conversation
 * Sets status to 'archived' and records archivedAt timestamp
 *
 * @param conversationId - The conversation ID to archive
 */
export async function archiveConversation(
  conversationId: string
): Promise<ArchiveConversationResult> {
  try {
    // Validate input
    if (!conversationId) {
      return {
        success: false,
        error: 'Conversation ID is required',
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

    // Find conversation
    const conversation = await ConversationModel.findByConversationId(
      conversationId,
      user.id
    );

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Archive the conversation
    await conversation.archive();

    return {
      success: true,
      status: 'archived',
    };
  } catch (error) {
    console.error('[archiveConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to archive conversation. Please try again.',
    };
  }
}

/**
 * Unarchive a conversation
 * Sets status back to 'active' and clears archivedAt
 *
 * @param conversationId - The conversation ID to unarchive
 */
export async function unarchiveConversation(
  conversationId: string
): Promise<ArchiveConversationResult> {
  try {
    // Validate input
    if (!conversationId) {
      return {
        success: false,
        error: 'Conversation ID is required',
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

    // Find conversation
    const conversation = await ConversationModel.findByConversationId(
      conversationId,
      user.id
    );

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Unarchive the conversation
    await conversation.unarchive();

    return {
      success: true,
      status: 'active',
    };
  } catch (error) {
    console.error('[unarchiveConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to unarchive conversation. Please try again.',
    };
  }
}
