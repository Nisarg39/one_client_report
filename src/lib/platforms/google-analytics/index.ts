/**
 * Google Analytics Platform Service
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
import { GoogleAnalyticsOAuth } from './oauth';
import { GoogleAnalyticsClient } from './client';
import {
  transformGA4Response,
  mapMetricNames,
  mapDimensionNames,
} from './transformers';
import {
  GA_CONFIG,
  AVAILABLE_GA_METRICS,
  AVAILABLE_GA_DIMENSIONS,
  GA4RunReportRequest,
} from './types';

/**
 * Google Analytics Service
 */
export class GoogleAnalyticsService extends BasePlatform {
  config = GA_CONFIG;
  private oauth: GoogleAnalyticsOAuth;

  constructor() {
    super();
    this.oauth = new GoogleAnalyticsOAuth();
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(redirectUri: string, state: string): string {
    const oauth = new GoogleAnalyticsOAuth(redirectUri);
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

      // Calculate expiration date
      const expiresAt = this.calculateExpirationDate(tokens.expiresIn);

      // Return credentials (will be saved by caller)
      return {
        id: '', // Will be set by database
        userId: '', // Will be set by caller
        clientId: '', // Will be set by caller
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
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<PlatformCredentials> {
    try {
      const tokens = await this.oauth.refreshToken(refreshToken);

      const expiresAt = this.calculateExpirationDate(tokens.expiresIn);

      return {
        id: '',
        userId: '',
        clientId: '',
        platformId: this.config.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || refreshToken, // Use old refresh token if new one not provided
        expiresAt,
        scopes: this.config.oauthScopes,
        metadata: {},
      };
    } catch (error: any) {
      this.handleApiError(error, 'Token refresh');
    }
  }

  /**
   * Fetch metrics from Google Analytics
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
          'Access token expired. Please reconnect your Google Analytics account.'
        );
      }

      // Get property ID from metadata
      const propertyId = credentials.metadata?.propertyId;
      if (!propertyId) {
        return this.createErrorResponse(
          'No Google Analytics property selected. Please configure your property.'
        );
      }

      // Create API client
      const client = new GoogleAnalyticsClient(credentials.accessToken);

      // Map friendly names to GA4 API names
      const apiMetrics = mapMetricNames(query.metrics);
      const apiDimensions = query.dimensions
        ? mapDimensionNames(query.dimensions)
        : [];

      // Build request
      const request: GA4RunReportRequest = {
        propertyId,
        dateRanges: [
          {
            startDate: query.startDate,
            endDate: query.endDate,
          },
        ],
        metrics: apiMetrics.map((name) => ({ name })),
        dimensions: apiDimensions.map((name) => ({ name })),
        limit: query.limit,
      };

      // Fetch data
      const response = await client.runReport(request);

      // Transform to normalized format
      const normalizedData = transformGA4Response(response);

      return this.createSuccessResponse(normalizedData);
    } catch (error: any) {
      console.error('[Google Analytics] Fetch metrics error:', error);
      return this.createErrorResponse(error.message);
    }
  }

  /**
   * Test connection
   */
  async testConnection(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const client = new GoogleAnalyticsClient(credentials.accessToken);
      return await client.testConnection();
    } catch (error) {
      console.error('[Google Analytics] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available metrics
   */
  getAvailableMetrics(): MetricDefinition[] {
    return AVAILABLE_GA_METRICS;
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions(): DimensionDefinition[] {
    return AVAILABLE_GA_DIMENSIONS;
  }

  /**
   * List accessible properties for user
   */
  async listProperties(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string }>> {
    try {
      const client = new GoogleAnalyticsClient(credentials.accessToken);
      const properties = await client.listProperties();

      return properties.map((prop) => ({
        id: prop.propertyId,
        name: prop.displayName,
      }));
    } catch (error: any) {
      console.error('[Google Analytics] List properties error:', error);
      return [];
    }
  }
}

// Export everything
export * from './types';
export { GoogleAnalyticsOAuth } from './oauth';
export { GoogleAnalyticsClient } from './client';
export * from './transformers';
