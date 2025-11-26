/**
 * LinkedIn Ads OAuth Configuration
 *
 * Handles OAuth 2.0 flow for LinkedIn Marketing API access
 */

import { LINKEDIN_ADS_CONFIG } from './types';
import { OAuthTokenResponse } from '../types';

/**
 * LinkedIn Ads OAuth Handler
 */
export class LinkedInAdsOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(redirectUri?: string) {
    this.clientId = process.env.LINKEDIN_CLIENT_ID || '';
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
    this.redirectUri =
      redirectUri || `${process.env.NEXTAUTH_URL}/api/platforms/linkedin-ads/callback`;

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        '⚠️  LinkedIn Ads OAuth credentials not configured. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.'
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
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: LINKEDIN_ADS_CONFIG.oauthScopes.join(' '),
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  /**
   * Exchange authorization code for tokens
   *
   * @param code - Authorization code from callback
   * @returns Access token and expiration
   */
  async getTokens(code: string): Promise<OAuthTokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'LinkedIn Ads OAuth not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.'
      );
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token, // LinkedIn does provide refresh tokens
      expiresIn: data.expires_in || 5184000, // 60 days default
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
        'LinkedIn Ads OAuth not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.'
      );
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn token refresh failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken, // Keep old refresh token if not provided
      expiresIn: data.expires_in || 5184000,
    };
  }

  /**
   * Revoke access token
   *
   * @param token - Token to revoke
   */
  async revokeToken(token: string): Promise<void> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'LinkedIn Ads OAuth not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.'
      );
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token,
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to revoke LinkedIn token');
    }
  }

  /**
   * Validate OAuth configuration
   */
  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }
}
