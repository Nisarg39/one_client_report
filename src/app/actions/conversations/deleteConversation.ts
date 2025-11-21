/**
 * Delete Conversation Server Action
 * Soft deletes a conversation (sets status to 'deleted')
 */

'use server';

import { z } from 'zod';
import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const deleteConversationSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
});

export type DeleteConversationInput = z.infer<typeof deleteConversationSchema>;

export interface DeleteConversationResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Delete a conversation (soft delete)
 */
export async function deleteConversation(
  data: DeleteConversationInput
): Promise<DeleteConversationResult> {
  try {
    // Validate input
    const validated = deleteConversationSchema.parse(data);

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

    // Find conversation (with ownership verification)
    const conversation = await ConversationModel.findByConversationId(
      validated.conversationId,
      user.id
    );

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Soft delete the conversation
    await conversation.softDelete();

    return {
      success: true,
      message: 'Conversation deleted successfully',
    };
  } catch (error) {
    console.error('[deleteConversation] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to delete conversation. Please try again.',
    };
  }
}
