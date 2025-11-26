/**
 * Meta Ads OAuth Configuration
 *
 * Handles OAuth 2.0 flow for Meta (Facebook) Ads API access
 */

import { META_CONFIG } from './types';
import { OAuthTokenResponse } from '../types';

/**
 * Meta Ads OAuth Handler
 */
export class MetaAdsOAuth {
  private appId: string;
  private appSecret: string;
  private redirectUri: string;

  constructor(redirectUri?: string) {
    this.appId = process.env.META_APP_ID || '';
    this.appSecret = process.env.META_APP_SECRET || '';
    this.redirectUri =
      redirectUri || `${process.env.NEXTAUTH_URL}/api/platforms/meta-ads/callback`;

    if (!this.appId || !this.appSecret) {
      console.warn(
        '⚠️  Meta Ads OAuth credentials not configured. Set META_APP_ID and META_APP_SECRET environment variables.'
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
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      state,
      scope: META_CONFIG.oauthScopes.join(','),
      response_type: 'code',
    });

    return `https://www.facebook.com/${META_CONFIG.apiVersion}/dialog/oauth?${params}`;
  }

  /**
   * Exchange authorization code for tokens
   *
   * @param code - Authorization code from callback
   * @returns Access token and expiration
   */
  async getTokens(code: string): Promise<OAuthTokenResponse> {
    if (!this.appId || !this.appSecret) {
      throw new Error(
        'Meta Ads OAuth not configured. Please set META_APP_ID and META_APP_SECRET.'
      );
    }

    const params = new URLSearchParams({
      client_id: this.appId,
      client_secret: this.appSecret,
      redirect_uri: this.redirectUri,
      code,
    });

    const response = await fetch(
      `https://graph.facebook.com/${META_CONFIG.apiVersion}/oauth/access_token?${params}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Meta token exchange failed: ${error}`);
    }

    const data = await response.json();

    // Exchange for long-lived token (60 days)
    const longLivedToken = await this.getLongLivedToken(data.access_token);

    return longLivedToken;
  }

  /**
   * Exchange short-lived token for long-lived token (60 days)
   *
   * @param shortLivedToken - Short-lived access token
   * @returns Long-lived token and expiration
   */
  async getLongLivedToken(
    shortLivedToken: string
  ): Promise<OAuthTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.appId,
      client_secret: this.appSecret,
      fb_exchange_token: shortLivedToken,
    });

    const response = await fetch(
      `https://graph.facebook.com/${META_CONFIG.apiVersion}/oauth/access_token?${params}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Long-lived token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: undefined, // Meta doesn't use refresh tokens
      expiresIn: data.expires_in || 5184000, // 60 days default
    };
  }

  /**
   * Refresh access token (Meta doesn't support refresh, need to re-authenticate)
   *
   * @param refreshToken - Not used by Meta
   * @returns Error - Meta requires re-authentication
   */
  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    throw new Error(
      'Meta Ads does not support token refresh. Please re-authenticate.'
    );
  }

  /**
   * Validate OAuth configuration
   */
  isConfigured(): boolean {
    return Boolean(this.appId && this.appSecret);
  }
}
