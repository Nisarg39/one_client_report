/**
 * Rename Conversation Server Action
 * Update the title of a conversation
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

export interface RenameConversationResult {
  success: boolean;
  error?: string;
  title?: string;
}

/**
 * Rename a conversation
 *
 * @param conversationId - The conversation ID to rename
 * @param newTitle - The new title (max 100 characters)
 */
export async function renameConversation(
  conversationId: string,
  newTitle: string
): Promise<RenameConversationResult> {
  try {
    // Validate input
    if (!conversationId) {
      return {
        success: false,
        error: 'Conversation ID is required',
      };
    }

    // Validate title
    const trimmedTitle = newTitle?.trim() || '';
    if (trimmedTitle.length > 100) {
      return {
        success: false,
        error: 'Title must be 100 characters or less',
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

    // Rename the conversation
    await conversation.rename(trimmedTitle);

    return {
      success: true,
      title: trimmedTitle,
    };
  } catch (error) {
    console.error('[renameConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to rename conversation. Please try again.',
    };
  }
}
