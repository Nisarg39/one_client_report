/**
 * Update Client Server Action
 * Updates client details (name, email, logo)
 */

'use server';

import { z } from 'zod';
import ClientModel from '@/models/Client';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const updateClientSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  logo: z.string().url().optional().or(z.literal('')),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export interface UpdateClientResult {
  success: boolean;
  client?: {
    id: string;
    name: string;
    email?: string;
    logo?: string;
    updatedAt: string;
  };
  error?: string;
}

/**
 * Update client details
 */
export async function updateClient(
  data: UpdateClientInput
): Promise<UpdateClientResult> {
  try {
    // Validate input
    const validated = updateClientSchema.parse(data);

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

    // Find client (with ownership verification)
    const client = await ClientModel.findByClientId(validated.clientId, user.id);
    
    if (!client) {
      return {
        success: false,
        error: 'Client not found',
      };
    }

    // Update fields
    if (validated.name) client.name = validated.name;
    if (validated.email !== undefined) {
      client.email = validated.email || undefined;
    }
    if (validated.logo !== undefined) {
      client.logo = validated.logo || undefined;
    }

    // Save
    await client.save();

    return {
      success: true,
      client: {
        id: String(client._id),
        name: client.name,
        email: client.email,
        logo: client.logo,
        updatedAt: client.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('[updateClient] Error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to update client. Please try again.',
    };
  }
}
