/**
 * Update Google Analytics Property Selection
 *
 * Updates the selected GA property for a connection
 */

'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';

interface UpdateGAPropertyResult {
  success: boolean;
  error?: string;
}

export async function updateGAProperty(params: {
  connectionId: string;
  propertyId: string;
  propertyName: string;
}): Promise<UpdateGAPropertyResult> {
  try {
    // Verify authentication
    const user = await requireAuth();

    // Connect to database
    await connectDB();

    // Find the connection
    const connection = await PlatformConnectionModel.findById(params.connectionId);

    if (!connection) {
      return { success: false, error: 'Connection not found' };
    }

    // Verify ownership
    if (connection.userId.toString() !== user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify it's a GA connection
    if (connection.platformId !== 'google-analytics') {
      return { success: false, error: 'Not a Google Analytics connection' };
    }

    // Update the metadata with new property selection
    await PlatformConnectionModel.findByIdAndUpdate(params.connectionId, {
      metadata: {
        ...connection.metadata,
        propertyId: params.propertyId,
        propertyName: params.propertyName,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('[updateGAProperty] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update property',
    };
  }
}
