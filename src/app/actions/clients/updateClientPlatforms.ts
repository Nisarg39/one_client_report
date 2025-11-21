/**
 * Update Client Platforms Server Action
 * Updates platform configuration for a client
 */

'use server';

import { z } from 'zod';
import ClientModel from '@/models/Client';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const updatePlatformsSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  platformName: z.enum([
    'googleAnalytics',
    'googleAds',
    'metaAds',
    'linkedInAds',
  ]),
  platformData: z.any(), // Platform-specific data structure
});

export type UpdateClientPlatformsInput = z.infer<typeof updatePlatformsSchema>;

export interface UpdateClientPlatformsResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update client platform configuration
 */
export async function updateClientPlatforms(
  data: UpdateClientPlatformsInput
): Promise<UpdateClientPlatformsResult> {
  try {
    // Validate input
    const validated = updatePlatformsSchema.parse(data);

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

    // Update platform
    await client.updatePlatform(validated.platformName, validated.platformData);

    return {
      success: true,
      message: `${validated.platformName} updated successfully`,
    };
  } catch (error) {
    console.error('[updateClientPlatforms] Error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to update platform. Please try again.',
    };
  }
}
