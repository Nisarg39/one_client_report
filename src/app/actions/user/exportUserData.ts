/**
 * Export User Data Server Action
 *
 * Phase 6.6: GDPR compliance - export all user data
 * Exports user profile, clients, conversations, and platform connections
 */

'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import ClientModel from '@/models/Client';
import ConversationModel from '@/models/Conversation';
import PlatformConnectionModel from '@/models/PlatformConnection';

export interface ExportUserDataResult {
  success: boolean;
  data?: {
    exportDate: string;
    user: any;
    clients: any[];
    conversations: any[];
    platformConnections: any[];
  };
  error?: string;
}

/**
 * Export all user data in JSON format
 */
export async function exportUserData(): Promise<ExportUserDataResult> {
  try {
    // Get authenticated user
    const authUser = await requireAuth();

    // Connect to database
    await connectDB();

    // Fetch all user data in parallel
    const [user, clients, conversations, platformConnections] = await Promise.all([
      UserModel.findById(authUser.id).lean(),
      ClientModel.find({ userId: authUser.id }).lean(),
      ConversationModel.find({ userId: authUser.id, status: { $ne: 'deleted' } }).lean(),
      PlatformConnectionModel.find({ userId: authUser.id }).lean(),
    ]);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Remove sensitive/internal fields
    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      provider: user.provider,
      role: user.role,
      status: user.status,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const sanitizedClients = clients.map((client: any) => ({
      id: client._id.toString(),
      clientId: client.clientId,
      name: client.name,
      email: client.email,
      logo: client.logo,
      platforms: client.platforms,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));

    const sanitizedConversations = conversations.map((conv: any) => ({
      id: conv._id.toString(),
      conversationId: conv.conversationId,
      title: conv.title,
      clientId: conv.clientId?.toString(),
      status: conv.status,
      messageCount: conv.messageCount,
      tokenUsage: conv.tokenUsage,
      messages: conv.messages,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    const sanitizedPlatformConnections = platformConnections.map((conn: any) => ({
      id: conn._id.toString(),
      platformId: conn.platformId,
      clientId: conn.clientId?.toString(),
      status: conn.status,
      propertyId: conn.propertyId,
      accountId: conn.accountId,
      expiresAt: conn.expiresAt,
      createdAt: conn.createdAt,
      updatedAt: conn.updatedAt,
      // Note: Access tokens and refresh tokens are excluded for security
    }));

    return {
      success: true,
      data: {
        exportDate: new Date().toISOString(),
        user: sanitizedUser,
        clients: sanitizedClients,
        conversations: sanitizedConversations,
        platformConnections: sanitizedPlatformConnections,
      },
    };
  } catch (error) {
    console.error('[exportUserData] Error:', error);

    return {
      success: false,
      error: 'Failed to export user data. Please try again.',
    };
  }
}
