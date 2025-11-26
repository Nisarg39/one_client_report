/**
 * Meta Ads Platform Service
 *
 * Main service class implementing IPlatform interface
 */

import { BasePlatform } from '../base-platform';
import {
  PlatformCredentials,
  MetricQuery,
  PlatformResponse,
  MetricDefinition,
  DimensionDefinition,
} from '../types';
import { MetaAdsOAuth } from './oauth';
import { MetaAdsClient } from './client';
import {
  transformMetaInsights,
  mapMetricNames,
  createMetaTimeRange,
} from './transformers';
import {
  META_CONFIG,
  AVAILABLE_META_METRICS,
  AVAILABLE_META_DIMENSIONS,
  MetaInsightsRequest,
} from './types';

/**
 * Meta Ads Service
 */
export class MetaAdsService extends BasePlatform {
  config = META_CONFIG;
  private oauth: MetaAdsOAuth;

  constructor() {
    super();
    this.oauth = new MetaAdsOAuth();
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(redirectUri: string, state: string): string {
    const oauth = new MetaAdsOAuth(redirectUri);
    return oauth.getAuthUrl(state);
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(
    code: string,
    state: string
  ): Promise<PlatformCredentials> {
    try {
      const tokens = await this.oauth.getTokens(code);

      const expiresAt = this.calculateExpirationDate(tokens.expiresIn);

      return {
        id: '',
        userId: '',
        clientId: '',
        platformId: this.config.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
        scopes: this.config.oauthScopes,
        metadata: {},
      };
    } catch (error: any) {
      this.handleApiError(error, 'OAuth callback');
    }
  }

  /**
   * Refresh access token
   * Note: Meta doesn't support refresh tokens, will throw error
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<PlatformCredentials> {
    throw new Error(
      'Meta Ads does not support token refresh. Please reconnect your Meta Ads account.'
    );
  }

  /**
   * Fetch metrics from Meta Ads
   */
  async fetchMetrics(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): Promise<PlatformResponse> {
    try {
      // Validate query
      this.validateQuery(query);

      // Check if token is expired
      if (this.isTokenExpired(credentials.expiresAt)) {
        return this.createErrorResponse(
          'Access token expired. Please reconnect your Meta Ads account.'
        );
      }

      // Get ad account ID from metadata
      const adAccountId = credentials.metadata?.adAccountId;
      if (!adAccountId) {
        return this.createErrorResponse(
          'No Meta Ads account selected. Please configure your ad account.'
        );
      }

      // Create API client
      const client = new MetaAdsClient(credentials.accessToken);

      // Map friendly names to Meta API names
      const apiMetrics = mapMetricNames(query.metrics);

      // Build request
      const request: MetaInsightsRequest = {
        adAccountId,
        timeRange: createMetaTimeRange(query.startDate, query.endDate),
        fields: apiMetrics,
        level: 'account', // Default to account level
        limit: query.limit || 1000,
      };

      // Fetch data
      const response = await client.getInsights(request);

      // Transform to normalized format
      const normalizedData = transformMetaInsights(response);

      return this.createSuccessResponse(normalizedData);
    } catch (error: any) {
      console.error('[Meta Ads] Fetch metrics error:', error);
      return this.createErrorResponse(error.message);
    }
  }

  /**
   * Test connection
   */
  async testConnection(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const client = new MetaAdsClient(credentials.accessToken);
      return await client.testConnection();
    } catch (error) {
      console.error('[Meta Ads] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available metrics
   */
  getAvailableMetrics(): MetricDefinition[] {
    return AVAILABLE_META_METRICS;
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions(): DimensionDefinition[] {
    return AVAILABLE_META_DIMENSIONS;
  }

  /**
   * List accessible ad accounts for user
   */
  async listAdAccounts(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string }>> {
    try {
      const client = new MetaAdsClient(credentials.accessToken);
      const accounts = await client.listAdAccounts();

      return accounts.map((account) => ({
        id: account.account_id,
        name: account.name,
      }));
    } catch (error: any) {
      console.error('[Meta Ads] List ad accounts error:', error);
      return [];
    }
  }
}

// Export everything
export * from './types';
export { MetaAdsOAuth } from './oauth';
export { MetaAdsClient } from './client';
export * from './transformers';
