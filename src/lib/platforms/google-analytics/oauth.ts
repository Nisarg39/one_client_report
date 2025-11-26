/**
 * Google Analytics OAuth Configuration
 *
 * Handles OAuth 2.0 flow for Google Analytics API access
 */

import { GA_CONFIG } from './types';
import { OAuthTokenResponse } from '../types';

/**
 * Google Analytics OAuth Handler
 */
export class GoogleAnalyticsOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(redirectUri?: string) {
    this.clientId = process.env.GOOGLE_ANALYTICS_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || '';
    this.redirectUri =
      redirectUri ||
      `${process.env.NEXTAUTH_URL}/api/platforms/google-analytics/callback`;

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        '⚠️  Google Analytics OAuth credentials not configured. Set GOOGLE_ANALYTICS_CLIENT_ID and GOOGLE_ANALYTICS_CLIENT_SECRET environment variables.'
      );
    }
  }

  /**
   * Generate OAuth authorization URL
   *
   * @param state - CSRF protection state parameter
   * @returns Authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: GA_CONFIG.oauthScopes.join(' '),
      access_type: 'offline', // Request refresh token
      prompt: 'consent', // Force consent to get refresh token
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Exchange authorization code for tokens
   *
   * @param code - Authorization code from callback
   * @returns Access token, refresh token, and expiration
   */
  async getTokens(code: string): Promise<OAuthTokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'Google Analytics OAuth not configured. Please set GOOGLE_ANALYTICS_CLIENT_ID and GOOGLE_ANALYTICS_CLIENT_SECRET.'
      );
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google OAuth token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refresh expired access token
   *
   * @param refreshToken - Refresh token
   * @returns New access token and expiration
   */
  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'Google Analytics OAuth not configured. Please set GOOGLE_ANALYTICS_CLIENT_ID and GOOGLE_ANALYTICS_CLIENT_SECRET.'
      );
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google token refresh failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token, // May not be returned
      expiresIn: data.expires_in,
    };
  }

  /**
   * Validate OAuth configuration
   */
  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }
}
