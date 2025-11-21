/**
 * Create Client Server Action
 * Creates a new client for the authenticated user
 */

'use server';

import { z } from 'zod';
import ClientModel from '@/models/Client';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export interface CreateClientResult {
  success: boolean;
  client?: {
    id: string;
    userId: string;
    name: string;
    email?: string;
    logo?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

/**
 * Create a new client
 */
export async function createClient(
  data: CreateClientInput
): Promise<CreateClientResult> {
  try {
    // Validate input
    const validated = createClientSchema.parse(data);

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

    // Create client
    const client = await ClientModel.createClient(
      user.id,
      validated.name,
      validated.email || undefined,
      validated.logo || undefined
    );

    return {
      success: true,
      client: {
        id: String(client._id),
        userId: client.userId.toString(),
        name: client.name,
        email: client.email,
        logo: client.logo,
        status: client.status,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('[createClient] Error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to create client. Please try again.',
    };
  }
}
