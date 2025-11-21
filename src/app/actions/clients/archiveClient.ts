/**
 * Archive Client Server Action
 * Archives (soft deletes) a client
 */

'use server';

import { z } from 'zod';
import ClientModel from '@/models/Client';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const archiveClientSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
});

export type ArchiveClientInput = z.infer<typeof archiveClientSchema>;

export interface ArchiveClientResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Archive a client (soft delete)
 */
export async function archiveClient(
  data: ArchiveClientInput
): Promise<ArchiveClientResult> {
  try {
    // Validate input
    const validated = archiveClientSchema.parse(data);

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

    // Archive client
    await client.archive();

    return {
      success: true,
      message: 'Client archived successfully',
    };
  } catch (error) {
    console.error('[archiveClient] Error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to archive client. Please try again.',
    };
  }
}
