/**
 * Get Google Analytics Properties
 *
 * Fetches available GA properties for a connection
 */

'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { GoogleAnalyticsClient } from '@/lib/platforms/google-analytics/client';

interface GAProperty {
  id: string;
  name: string;
}

interface GetGAPropertiesResult {
  success: boolean;
  properties?: GAProperty[];
  selectedPropertyId?: string;
  error?: string;
}

export async function getGAProperties(params: {
  connectionId: string;
}): Promise<GetGAPropertiesResult> {
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

    // Get access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      return { success: false, error: 'Could not retrieve access token' };
    }

    // Create client and fetch properties
    const client = new GoogleAnalyticsClient(accessToken);
    const gaProperties = await client.listProperties();

    // Transform to simpler format
    const properties: GAProperty[] = gaProperties.map((p) => ({
      id: p.propertyId,
      name: p.displayName,
    }));

    return {
      success: true,
      properties,
      selectedPropertyId: connection.metadata?.propertyId,
    };
  } catch (error: any) {
    console.error('[getGAProperties] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch properties',
    };
  }
}
