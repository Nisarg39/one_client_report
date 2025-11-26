/**
 * Connect Platform Server Action
 *
 * Initiates OAuth flow for connecting a platform
 */

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import { PlatformServiceFactory } from '@/lib/platforms';

const ConnectPlatformSchema = z.object({
  platformId: z.enum(['google-analytics', 'meta-ads', 'google-ads', 'linkedin-ads']),
  clientId: z.string().min(1, 'Client ID is required'),
  returnPath: z.string().optional(), // Optional path to redirect after OAuth (e.g., '/onboarding')
});

export async function connectPlatform(input: z.infer<typeof ConnectPlatformSchema>) {
  try {
    // Validate input
    const validated = ConnectPlatformSchema.parse(input);

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Get platform service
    const service = PlatformServiceFactory.create(validated.platformId);

    // Get OAuth URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/platforms/${validated.platformId}/callback`;

    // Encode state with clientId and optional returnPath
    const stateData = {
      clientId: validated.clientId,
      returnPath: validated.returnPath || '/settings/platforms',
    };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

    const authUrl = service.getAuthUrl(redirectUri, state);

    return {
      success: true,
      authUrl,
    };
  } catch (error) {
    console.error('[connectPlatform] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate platform connection',
    };
  }
}
