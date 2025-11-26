/**
 * Google Ads Service
 *
 * Main service class for Google Ads integration
 */

import { BasePlatform } from '../base-platform';
import {
  IPlatform,
  PlatformCredentials,
  MetricQuery,
  PlatformResponse,
  MetricDefinition,
  DimensionDefinition,
} from '../types';
import { GOOGLE_ADS_CONFIG, AVAILABLE_GOOGLE_ADS_METRICS } from './types';
import { GoogleAdsOAuth } from './oauth';
import { GoogleAdsClient } from './client';
import { transformGoogleAdsResponse, buildGAQLQuery } from './transformers';

/**
 * Google Ads Service Implementation
 */
export class GoogleAdsService extends BasePlatform implements IPlatform {
  config = GOOGLE_ADS_CONFIG;
  private oauth: GoogleAdsOAuth;

  constructor() {
    super();
    this.oauth = new GoogleAdsOAuth();
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(redirectUri: string, state: string): string {
    const oauth = new GoogleAdsOAuth(redirectUri);
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
        metadata: {
          // Customer ID will be set later after user selects account
        },
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
        refreshToken: tokens.refreshToken || refreshToken,
        expiresAt,
        scopes: this.config.oauthScopes,
        metadata: {},
      };
    } catch (error: any) {
      this.handleApiError(error, 'Token refresh');
    }
  }

  /**
   * Fetch metrics from Google Ads
   *
   * @param credentials - Platform credentials
   * @param query - Metric query
   * @returns Platform response with metrics
   */
  async fetchMetrics(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): Promise<PlatformResponse> {
    try {
      this.validateQuery(query);

      // Check if token is expired
      if (this.isTokenExpired(credentials.expiresAt)) {
        return this.createErrorResponse(
          'Access token expired. Please refresh your connection.'
        );
      }

      // Get customer ID from credentials metadata
      const customerId = credentials.metadata?.customerId as string;
      if (!customerId) {
        return this.createErrorResponse(
          'Customer ID not found. Please reconnect your Google Ads account and select a customer.'
        );
      }

      // Check for developer token
      if (!process.env.GOOGLE_ADS_DEVELOPER_TOKEN) {
        return this.createErrorResponse(
          'Google Ads Developer Token not configured. Please set GOOGLE_ADS_DEVELOPER_TOKEN environment variable.'
        );
      }

      // Create client
      const client = new GoogleAdsClient(credentials.accessToken);

      // Build GAQL query
      const gaqlQuery = buildGAQLQuery(
        query.metrics,
        query.dimensions || [],
        query.startDate,
        query.endDate,
        query.filters
      );

      // Fetch data
      const response = await client.query({
        customerId,
        query: gaqlQuery,
      });

      // Transform response
      const normalizedData = transformGoogleAdsResponse(response);

      return this.createSuccessResponse(normalizedData);
    } catch (error: any) {
      console.error('Google Ads fetch error:', error);
      return this.createErrorResponse(error.message);
    }
  }

  /**
   * List accessible customer accounts
   *
   * @param credentials - Platform credentials
   * @returns Array of customers with id and name
   */
  async listCustomers(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string }>> {
    const client = new GoogleAdsClient(credentials.accessToken);

    // Get list of accessible customers
    const resourceNames = await client.listAccessibleCustomers();

    const customers: Array<{ id: string; name: string }> = [];

    // Fetch details for each customer
    for (const resourceName of resourceNames) {
      try {
        // Extract customer ID from resource name
        // Format: "customers/1234567890"
        const customerId = resourceName.split('/')[1];

        const customer = await client.getCustomer(customerId);

        customers.push({
          id: customer.id,
          name: customer.descriptiveName || `Customer ${customer.id}`,
        });
      } catch (error) {
        console.error(`Failed to fetch customer details for ${resourceName}:`, error);
        // Continue with next customer
      }
    }

    return customers;
  }

  /**
   * Get campaigns for a customer
   *
   * @param credentials - Platform credentials
   * @returns Array of campaigns
   */
  async getCampaigns(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string; status: string }>> {
    const customerId = credentials.metadata?.customerId as string;
    if (!customerId) {
      throw new Error('Customer ID not found in credentials');
    }

    const client = new GoogleAdsClient(credentials.accessToken);
    const campaigns = await client.getCampaigns(customerId);

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
    }));
  }

  /**
   * Test connection to Google Ads API
   *
   * @param credentials - Platform credentials
   * @returns True if connection successful
   */
  async testConnection(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const client = new GoogleAdsClient(credentials.accessToken);
      return await client.testConnection();
    } catch (error) {
      console.error('Google Ads connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available metrics
   */
  getAvailableMetrics(): MetricDefinition[] {
    return AVAILABLE_GOOGLE_ADS_METRICS;
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions(): DimensionDefinition[] {
    // Google Ads dimensions are dynamic based on the query
    // Return common dimensions
    return [
      {
        id: 'campaign_id',
        name: 'Campaign ID',
        description: 'Campaign identifier',
      },
      {
        id: 'campaign_name',
        name: 'Campaign Name',
        description: 'Campaign name',
      },
      {
        id: 'ad_group_id',
        name: 'Ad Group ID',
        description: 'Ad group identifier',
      },
      {
        id: 'ad_group_name',
        name: 'Ad Group Name',
        description: 'Ad group name',
      },
      {
        id: 'date',
        name: 'Date',
        description: 'Date of the data',
      },
      {
        id: 'device',
        name: 'Device',
        description: 'Device type',
      },
    ];
  }
}
