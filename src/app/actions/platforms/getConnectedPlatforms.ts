/**
 * Get Connected Platforms Server Action
 *
 * Retrieves all platform connections for a client
 */

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { connectDB } from '@/lib/db';

const GetConnectedPlatformsSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
});

export async function getConnectedPlatforms(
  input: z.infer<typeof GetConnectedPlatformsSchema>
) {
  try {
    // Validate input
    const validated = GetConnectedPlatformsSchema.parse(input);

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

    // Get all connections for this client
    const connections = await (PlatformConnectionModel as any).findByClientId(
      validated.clientId
    );

    // Filter by user (security check)
    const userConnections = connections.filter(
      (conn: any) => conn.userId.toString() === user.id
    );

    // Format response
    const platforms = userConnections.map((conn: any) => ({
      id: conn._id.toString(),
      platformId: conn.platformId,
      platformName: conn.platformName,
      status: conn.status,
      isExpired: conn.isExpired(),
      expiresAt: conn.expiresAt.toISOString(),
      lastSyncedAt: conn.lastSyncedAt?.toISOString(),
      metadata: conn.metadata,
      createdAt: conn.createdAt.toISOString(),
      updatedAt: conn.updatedAt.toISOString(),
    }));

    return {
      success: true,
      platforms,
    };
  } catch (error) {
    console.error('[getConnectedPlatforms] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch connected platforms',
    };
  }
}
