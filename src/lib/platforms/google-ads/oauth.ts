/**
 * Google Ads OAuth Configuration
 *
 * Handles OAuth 2.0 flow for Google Ads API access
 */

import { GOOGLE_ADS_CONFIG } from './types';
import { OAuthTokenResponse } from '../types';

/**
 * Google Ads OAuth Handler
 */
export class GoogleAdsOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(redirectUri?: string) {
    this.clientId = process.env.GOOGLE_ADS_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET || '';
    this.redirectUri =
      redirectUri || `${process.env.NEXTAUTH_URL}/api/platforms/google-ads/callback`;

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        '⚠️  Google Ads OAuth credentials not configured. Set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET environment variables.'
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
      scope: GOOGLE_ADS_CONFIG.oauthScopes.join(' '),
      access_type: 'offline', // Request refresh token
      prompt: 'consent', // Force consent screen to get refresh token
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
        'Google Ads OAuth not configured. Please set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET.'
      );
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Ads token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in || 3600, // Usually 1 hour
    };
  }

  /**
   * Refresh access token using refresh token
   *
   * @param refreshToken - Refresh token from initial authorization
   * @returns New access token and expiration
   */
  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'Google Ads OAuth not configured. Please set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET.'
      );
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Ads token refresh failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: refreshToken, // Keep the same refresh token
      expiresIn: data.expires_in || 3600,
    };
  }

  /**
   * Revoke access token or refresh token
   *
   * @param token - Token to revoke
   */
  async revokeToken(token: string): Promise<void> {
    const params = new URLSearchParams({
      token,
    });

    const response = await fetch('https://oauth2.googleapis.com/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to revoke Google Ads token');
    }
  }

  /**
   * Validate OAuth configuration
   */
  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }
}
