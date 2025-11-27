/**
 * Delete Account Server Action
 *
 * Phase 6.6: GDPR compliance - complete account deletion
 * Performs cascade deletion of all user data:
 * - User profile
 * - All clients
 * - All conversations and messages
 * - All platform connections
 */

'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import ClientModel from '@/models/Client';
import ConversationModel from '@/models/Conversation';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { signOut } from 'next-auth/react';

export interface DeleteAccountResult {
  success: boolean;
  error?: string;
}

/**
 * Delete user account and all associated data
 *
 * IMPORTANT: This action is irreversible and will permanently delete:
 * - User profile
 * - All clients created by the user
 * - All conversations and messages
 * - All platform connections and credentials
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  try {
    // Get authenticated user
    const authUser = await requireAuth();

    // Connect to database
    await connectDB();

    // Delete all user data in sequence to ensure referential integrity
    // 1. Delete all conversations (includes messages)
    const deletedConversations = await ConversationModel.deleteMany({
      userId: authUser.id,
    });

    // 2. Delete all platform connections (includes access tokens)
    const deletedPlatformConnections = await PlatformConnectionModel.deleteMany({
      userId: authUser.id,
    });

    // 3. Delete all clients
    const deletedClients = await ClientModel.deleteMany({
      userId: authUser.id,
    });

    // 4. Finally, delete the user account
    const deletedUser = await UserModel.findByIdAndDelete(authUser.id);

    if (!deletedUser) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Log deletion summary for audit purposes
    console.log('[deleteAccount] Account deleted:', {
      userId: authUser.id,
      email: authUser.email,
      deletedConversations: deletedConversations.deletedCount,
      deletedPlatformConnections: deletedPlatformConnections.deletedCount,
      deletedClients: deletedClients.deletedCount,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('[deleteAccount] Error:', error);

    return {
      success: false,
      error: 'Failed to delete account. Please try again or contact support.',
    };
  }
}
