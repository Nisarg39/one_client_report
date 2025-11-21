/**
 * Create Conversation Server Action
 * Creates a new conversation for a user and client
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
const createConversationSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export interface CreateConversationResult {
  success: boolean;
  conversation?: {
    conversationId: string;
    clientId: string;
    createdAt: string;
  };
  error?: string;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  data: CreateConversationInput
): Promise<CreateConversationResult> {
  try {
    // Validate input
    const validated = createConversationSchema.parse(data);

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

    // Generate unique conversation ID
    const conversationId = nanoid();

    // Create conversation
    const conversation = await ConversationModel.createConversation(
      conversationId,
      user.id,
      validated.clientId
    );

    return {
      success: true,
      conversation: {
        conversationId: conversation.conversationId,
        clientId: String(conversation.clientId),
        createdAt: conversation.createdAt?.toISOString() || new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('[createConversation] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to create conversation. Please try again.',
    };
  }
}
