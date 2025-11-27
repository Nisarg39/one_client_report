/**
 * Pin/Unpin Conversation Server Action
 * Pin conversations to keep them at the top of the list
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

export interface PinConversationResult {
  success: boolean;
  error?: string;
  isPinned?: boolean;
}

/**
 * Toggle pin status of a conversation
 * If pinned, unpins it. If unpinned, pins it.
 *
 * @param conversationId - The conversation ID to toggle pin
 */
export async function togglePinConversation(
  conversationId: string
): Promise<PinConversationResult> {
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

    // Toggle pin status
    await conversation.togglePin();

    return {
      success: true,
      isPinned: conversation.isPinned,
    };
  } catch (error) {
    console.error('[togglePinConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to update pin status. Please try again.',
    };
  }
}

/**
 * Pin a conversation
 *
 * @param conversationId - The conversation ID to pin
 */
export async function pinConversation(
  conversationId: string
): Promise<PinConversationResult> {
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

    // Pin the conversation
    await conversation.pin();

    return {
      success: true,
      isPinned: true,
    };
  } catch (error) {
    console.error('[pinConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to pin conversation. Please try again.',
    };
  }
}

/**
 * Unpin a conversation
 *
 * @param conversationId - The conversation ID to unpin
 */
export async function unpinConversation(
  conversationId: string
): Promise<PinConversationResult> {
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

    // Unpin the conversation
    await conversation.unpin();

    return {
      success: true,
      isPinned: false,
    };
  } catch (error) {
    console.error('[unpinConversation] Error:', error);
    return {
      success: false,
      error: 'Failed to unpin conversation. Please try again.',
    };
  }
}
