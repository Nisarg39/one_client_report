/**
 * Save Message Feedback Server Action
 *
 * Saves user feedback (thumbs up/down) for AI messages
 */

'use server';

import { z } from 'zod';
import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';
import type { MessageFeedback } from '@/types/chat';

/**
 * Input validation schema
 */
const saveFeedbackSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  messageIndex: z.number().int().min(0, 'Message index must be a non-negative integer'),
  feedback: z.enum(['positive', 'negative', 'null']),
});

export interface SaveFeedbackInput {
  conversationId: string;
  messageIndex: number;
  feedback: 'positive' | 'negative' | 'null';
}

export interface SaveFeedbackResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Save feedback for a message
 *
 * @param data - Feedback data (conversationId, messageIndex, feedback)
 * @returns Success/error response
 */
export async function saveFeedback(
  data: SaveFeedbackInput
): Promise<SaveFeedbackResult> {
  try {
    // Validate input
    const validated = saveFeedbackSchema.parse(data);

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

    // Validate message index
    if (validated.messageIndex >= conversation.messages.length) {
      return {
        success: false,
        error: 'Invalid message index',
      };
    }

    // Get the message
    const message = conversation.messages[validated.messageIndex];

    // Only allow feedback on assistant messages
    if (message.role !== 'assistant') {
      return {
        success: false,
        error: 'Feedback can only be provided for assistant messages',
      };
    }

    // Use MongoDB update operators for reliable nested array updates
    // Build the field path for this specific message's feedback
    const fieldPath = `messages.${validated.messageIndex}.feedback`;

    // Use $set to add/update feedback, or $unset to remove it
    const updateOperation = validated.feedback === 'null'
      ? { $unset: { [fieldPath]: '' } } // Remove feedback field entirely
      : { $set: { [fieldPath]: validated.feedback } }; // Set feedback value

    console.log('[saveFeedback] Updating:', {
      conversationId: validated.conversationId,
      messageIndex: validated.messageIndex,
      feedback: validated.feedback,
      operation: validated.feedback === 'null' ? '$unset' : '$set',
    });

    // Perform atomic update
    const updateResult = await ConversationModel.updateOne(
      {
        conversationId: validated.conversationId,
        userId: user.id,
      },
      updateOperation
    );

    console.log('[saveFeedback] Update result:', {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
    });

    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        error: 'Conversation not found or access denied',
      };
    }

    return {
      success: true,
      message: 'Feedback saved successfully',
    };
  } catch (error) {
    console.error('[saveFeedback] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Invalid input',
      };
    }

    return {
      success: false,
      error: 'Failed to save feedback. Please try again.',
    };
  }
}
