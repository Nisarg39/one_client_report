/**
 * Disconnect Platform Server Action
 *
 * Disconnects and removes a platform connection
 */

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { connectDB } from '@/lib/db';

const DisconnectPlatformSchema = z.object({
  connectionId: z.string().min(1, 'Connection ID is required'),
});

export async function disconnectPlatform(
  input: z.infer<typeof DisconnectPlatformSchema>
) {
  try {
    // Validate input
    const validated = DisconnectPlatformSchema.parse(input);

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

    // Delete connection
    await (PlatformConnectionModel as any).deleteConnection(validated.connectionId);

    return {
      success: true,
      message: 'Platform disconnected successfully',
    };
  } catch (error) {
    console.error('[disconnectPlatform] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect platform',
    };
  }
}
