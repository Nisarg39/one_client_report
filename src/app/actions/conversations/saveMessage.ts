/**
 * Save Message Server Action
 * Saves a message to a conversation (creates conversation if doesn't exist)
 */

'use server';

import { z } from 'zod';
import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';
import { nanoid } from 'nanoid';

/**
 * Input validation schema
 */
const saveMessageSchema = z.object({
  conversationId: z.string().nullable(),
  clientId: z.string().min(1, 'Client ID is required'),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content is required').max(10000, 'Message too long'),
});

export type SaveMessageInput = z.infer<typeof saveMessageSchema>;

export interface SaveMessageResult {
  success: boolean;
  conversationId?: string;
  error?: string;
}

/**
 * Save a message to a conversation
 * Creates a new conversation if conversationId is null
 */
export async function saveMessage(
  data: SaveMessageInput
): Promise<SaveMessageResult> {
  try {
    // Validate input
    const validated = saveMessageSchema.parse(data);

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

    let conversation;

    // If conversationId provided, find existing conversation
    if (validated.conversationId) {
      conversation = await ConversationModel.findByConversationId(
        validated.conversationId,
        user.id
      );

      if (!conversation) {
        return {
          success: false,
          error: 'Conversation not found',
        };
      }
    } else {
      // Create new conversation
      const newConversationId = nanoid();
      conversation = await ConversationModel.createConversation(
        newConversationId,
        user.id,
        validated.clientId
      );
    }

    // Add message to conversation
    await conversation.addMessage(validated.role, validated.content);

    return {
      success: true,
      conversationId: conversation.conversationId,
    };
  } catch (error) {
    console.error('[saveMessage] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to save message. Please try again.',
    };
  }
}
