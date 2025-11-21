/**
 * Get Conversation By ID Server Action
 * Retrieves a specific conversation with all messages
 */

'use server';

import ConversationModel from '@/models/Conversation';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';
import type { Message } from '@/types/chat';

export interface ConversationDetail {
  conversationId: string;
  clientId: string;
  messages: Message[];
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationByIdResult {
  success: boolean;
  conversation?: ConversationDetail;
  error?: string;
}

/**
 * Get conversation by ID (with ownership verification)
 */
export async function getConversationById(
  conversationId: string
): Promise<GetConversationByIdResult> {
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

    // Get conversation (with ownership verification)
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

    return {
      success: true,
      conversation: {
        conversationId: conversation.conversationId,
        clientId: String(conversation.clientId),
        messages: conversation.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          feedback: msg.feedback,
          messageId: msg.messageId,
        })),
        messageCount: conversation.messageCount,
        lastMessageAt: conversation.lastMessageAt.toISOString(),
        createdAt: conversation.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: conversation.updatedAt?.toISOString() || new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('[getConversationById] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch conversation. Please try again.',
    };
  }
}
