/**
 * Get Client By ID Server Action
 * Retrieves a specific client with platform data
 */

'use server';

import ClientModel from '@/models/Client';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

export interface ClientWithPlatforms {
  id: string;
  userId: string;
  name: string;
  email?: string;
  logo?: string;
  platforms: any;
  status: string;
  connectedPlatforms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetClientByIdResult {
  success: boolean;
  client?: ClientWithPlatforms;
  error?: string;
}

/**
 * Get client by ID (with ownership verification)
 */
export async function getClientById(
  clientId: string
): Promise<GetClientByIdResult> {
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

    // Get client (with ownership verification)
    const client = await ClientModel.findByClientId(clientId, user.id);

    if (!client) {
      return {
        success: false,
        error: 'Client not found',
      };
    }

    return {
      success: true,
      client: {
        id: String(client._id),
        userId: client.userId.toString(),
        name: client.name,
        email: client.email,
        logo: client.logo,
        platforms: client.platforms,
        status: client.status,
        connectedPlatforms: client.getConnectedPlatforms(),
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('[getClientById] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch client. Please try again.',
    };
  }
}
