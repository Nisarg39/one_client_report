/**
 * Refresh Platform Connection Server Action
 *
 * Refreshes an expired platform connection using refresh token
 */

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { PlatformServiceFactory } from '@/lib/platforms';
import { connectDB } from '@/lib/db';

const RefreshPlatformConnectionSchema = z.object({
  connectionId: z.string().min(1, 'Connection ID is required'),
});

export async function refreshPlatformConnection(
  input: z.infer<typeof RefreshPlatformConnectionSchema>
) {
  try {
    // Validate input
    const validated = RefreshPlatformConnectionSchema.parse(input);

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Connect to database
    await connectDB();

    // Get connection
    const connection = await PlatformConnectionModel.findById(validated.connectionId);

    if (!connection) {
      return {
        success: false,
        error: 'Connection not found',
      };
    }

    // Verify ownership
    if (connection.userId.toString() !== user.id) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Get refresh token
    const refreshToken = connection.getDecryptedRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available. Please reconnect the platform.',
      };
    }

    // Get platform service
    const service = PlatformServiceFactory.create(
      connection.platformId as 'google-analytics' | 'meta-ads' | 'google-ads' | 'linkedin-ads'
    );

    // Refresh tokens
    const newCredentials = await service.refreshAccessToken(refreshToken);

    // Update connection in database
    await (PlatformConnectionModel as any).updateTokens(
      validated.connectionId,
      newCredentials.accessToken,
      newCredentials.refreshToken,
      new Date(newCredentials.expiresAt)
    );

    return {
      success: true,
      message: 'Connection refreshed successfully',
    };
  } catch (error) {
    console.error('[refreshPlatformConnection] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh connection',
    };
  }
}
