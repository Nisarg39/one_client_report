/**
 * Google Ads OAuth Callback Handler
 *
 * Handles the OAuth callback from Google Ads
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/adapter';
import { GoogleAdsService } from '@/lib/platforms/google-ads';
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
      console.error('[Google Ads OAuth] Error:', error);
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
    const service = new GoogleAdsService();
    const credentials = await service.handleCallback(code, state);

    // Connect to database
    await connectDB();

    // Check if connection already exists
    const existingConnection = await (PlatformConnectionModel as any).findByUserAndPlatform(
      user.id,
      clientId,
      'google-ads'
    );

    if (existingConnection) {
      // Update existing connection
      await (PlatformConnectionModel as any).updateTokens(
        existingConnection._id.toString(),
        credentials.accessToken,
        credentials.refreshToken,
        new Date(credentials.expiresAt)
      );
    } else {
      // Create new connection
      await (PlatformConnectionModel as any).createConnection({
        userId: user.id,
        clientId,
        platformId: 'google-ads',
        platformName: 'Google Ads',
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        expiresAt: new Date(credentials.expiresAt),
        scopes: credentials.scopes || [],
        metadata: credentials.metadata || {},
      });
    }

    // Redirect to appropriate page with success
    return NextResponse.redirect(
      new URL(`${returnPath}?success=google-ads`, request.url)
    );
  } catch (error: any) {
    console.error('[Google Ads OAuth] Callback error:', error);
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
