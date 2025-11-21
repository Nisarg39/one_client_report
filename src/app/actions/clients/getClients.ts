/**
 * Get Clients Server Action
 * Retrieves all clients for the authenticated user
 */

'use server';

import ClientModel from '@/models/Client';
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

    return {
      success: true,
      clients: clients.map((client) => {
        // Convert Mongoose document to plain object and serialize to remove all Mongoose metadata
        const plainClient = client.toObject();
        // Use JSON parse/stringify to fully convert nested Mongoose subdocuments to plain objects
        const serializedPlatforms = plainClient.platforms
          ? JSON.parse(JSON.stringify(plainClient.platforms))
          : {};

        return {
          id: String(client._id),
          userId: client.userId.toString(),
          name: client.name,
          email: client.email,
          logo: client.logo,
          status: client.status,
          platforms: serializedPlatforms, // Fully serialized platforms data
          connectedPlatforms: client.getConnectedPlatforms(),
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
