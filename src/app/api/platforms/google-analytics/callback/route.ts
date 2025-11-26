/**
 * Google Analytics OAuth Callback Handler
 *
 * Handles the OAuth callback from Google Analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/adapter';
import { GoogleAnalyticsService } from '@/lib/platforms/google-analytics';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/signin?error=unauthorized', request.url));
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth error
    if (error) {
      console.error('[Google Analytics OAuth] Error:', error);
      return NextResponse.redirect(
        new URL(`/settings/platforms?error=${error}`, request.url)
      );
    }

    // Validate code
    if (!code) {
      return NextResponse.redirect(
        new URL('/settings/platforms?error=no_code', request.url)
      );
    }

    // Validate state (should contain clientId and returnPath)
    if (!state) {
      return NextResponse.redirect(
        new URL('/settings/platforms?error=invalid_state', request.url)
      );
    }

    // Decode state - supports both old format (plain clientId) and new format (base64 JSON)
    let clientId: string;
    let returnPath = '/settings/platforms';

    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
      clientId = decoded.clientId;
      returnPath = decoded.returnPath || '/settings/platforms';
    } catch {
      // Fallback for old format where state is just clientId
      clientId = state;
    }

    // Exchange code for tokens
    const service = new GoogleAnalyticsService();
    const credentials = await service.handleCallback(code, state);

    // Connect to database
    await connectDB();

    // Fetch GA properties to auto-select the first one
    let metadata: Record<string, any> = credentials.metadata || {};
    try {
      const properties = await service.listProperties({
        ...credentials,
        id: '',
        userId: user.id,
        clientId,
      });

      if (properties.length > 0) {
        // Auto-select first property
        metadata = {
          propertyId: properties[0].id,
          propertyName: properties[0].name,
        };
        console.log(`[Google Analytics OAuth] Auto-selected property: ${properties[0].name} (${properties[0].id})`);
      }
    } catch (propError) {
      console.error('[Google Analytics OAuth] Failed to fetch properties:', propError);
      // Continue without property selection - user can configure later
    }

    // Check if connection already exists
    const existingConnection = await (PlatformConnectionModel as any).findByUserAndPlatform(
      user.id,
      clientId,
      'google-analytics'
    );

    if (existingConnection) {
      // Update existing connection with new tokens and metadata
      await (PlatformConnectionModel as any).updateTokens(
        existingConnection._id.toString(),
        credentials.accessToken,
        credentials.refreshToken,
        new Date(credentials.expiresAt)
      );
      // Also update metadata if we have property info
      if (metadata.propertyId) {
        await PlatformConnectionModel.findByIdAndUpdate(
          existingConnection._id,
          { metadata }
        );
      }
    } else {
      // Create new connection
      await (PlatformConnectionModel as any).createConnection({
        userId: user.id,
        clientId,
        platformId: 'google-analytics',
        platformName: 'Google Analytics',
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        expiresAt: new Date(credentials.expiresAt),
        scopes: credentials.scopes || [],
        metadata, // Use metadata with auto-selected property
      });
    }

    // Redirect to appropriate page with success
    return NextResponse.redirect(
      new URL(`${returnPath}?success=google-analytics`, request.url)
    );
  } catch (error: any) {
    console.error('[Google Analytics OAuth] Callback error:', error);
    // For errors, try to decode returnPath from state if possible
    let errorReturnPath = '/settings/platforms';
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
        errorReturnPath = decoded.returnPath || '/settings/platforms';
      } catch {
        // Use default
      }
    }
    return NextResponse.redirect(
      new URL(`${errorReturnPath}?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
