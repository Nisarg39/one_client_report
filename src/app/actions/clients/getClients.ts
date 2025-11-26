/**
 * Get Clients Server Action
 * Retrieves all clients for the authenticated user
 */

'use server';

import ClientModel from '@/models/Client';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

export interface ClientData {
  id: string;
  userId: string;
  name: string;
  email?: string;
  logo?: string;
  status: string;
  platforms: any; // Platform connection data
  connectedPlatforms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetClientsResult {
  success: boolean;
  clients?: ClientData[];
  error?: string;
}

// Map platformId from PlatformConnection to the format expected by UI
const platformIdToKey: Record<string, string> = {
  'google-analytics': 'googleAnalytics',
  'google-ads': 'googleAds',
  'meta-ads': 'metaAds',
  'linkedin-ads': 'linkedInAds',
};

/**
 * Get all clients for the current user
 */
export async function getClients(): Promise<GetClientsResult> {
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

    // Get clients
    const clients = await ClientModel.findByUserId(user.id);

    // Get all platform connections for this user
    const allConnections = await (PlatformConnectionModel as any).findByUserId(user.id);

    // Group connections by clientId
    const connectionsByClient: Record<string, any[]> = {};
    for (const conn of allConnections) {
      const clientId = conn.clientId.toString();
      if (!connectionsByClient[clientId]) {
        connectionsByClient[clientId] = [];
      }
      connectionsByClient[clientId].push(conn);
    }

    return {
      success: true,
      clients: clients.map((client) => {
        const clientId = String(client._id);
        const clientConnections = connectionsByClient[clientId] || [];

        // Build platforms object from PlatformConnection data
        const platforms: Record<string, { connected: boolean; status: string }> = {};

        for (const conn of clientConnections) {
          const key = platformIdToKey[conn.platformId];
          if (key && (conn.status === 'active' || conn.status === 'connected')) {
            platforms[key] = {
              connected: true,
              status: conn.status,
            };
          }
        }

        // Get list of connected platform names
        const connectedPlatforms: string[] = [];
        if (platforms.googleAnalytics?.connected) connectedPlatforms.push('Google Analytics');
        if (platforms.googleAds?.connected) connectedPlatforms.push('Google Ads');
        if (platforms.metaAds?.connected) connectedPlatforms.push('Meta Ads');
        if (platforms.linkedInAds?.connected) connectedPlatforms.push('LinkedIn Ads');

        return {
          id: clientId,
          userId: client.userId.toString(),
          name: client.name,
          email: client.email,
          logo: client.logo,
          status: client.status,
          platforms, // Platform connection data from PlatformConnection collection
          connectedPlatforms,
          createdAt: client.createdAt.toISOString(),
          updatedAt: client.updatedAt.toISOString(),
        };
      }),
    };
  } catch (error) {
    console.error('[getClients] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch clients. Please try again.',
    };
  }
}
