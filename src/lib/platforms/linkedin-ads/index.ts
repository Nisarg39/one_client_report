/**
 * LinkedIn Ads Service
 *
 * Main service class for LinkedIn Ads integration
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
import { LINKEDIN_ADS_CONFIG, AVAILABLE_LINKEDIN_ADS_METRICS } from './types';
import { LinkedInAdsOAuth } from './oauth';
import { LinkedInAdsClient } from './client';
import {
  transformLinkedInAdsResponse,
  mapMetricNames,
  createLinkedInDateRange,
} from './transformers';

/**
 * LinkedIn Ads Service Implementation
 */
export class LinkedInAdsService extends BasePlatform implements IPlatform {
  config = LINKEDIN_ADS_CONFIG;
  private oauth: LinkedInAdsOAuth;

  constructor() {
    super();
    this.oauth = new LinkedInAdsOAuth();
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(redirectUri: string, state: string): string {
    const oauth = new LinkedInAdsOAuth(redirectUri);
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
          // Account ID will be set later after user selects account
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
   * Fetch metrics from LinkedIn Ads
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

      // Get account ID from credentials metadata
      const accountId = credentials.metadata?.accountId as string;
      if (!accountId) {
        return this.createErrorResponse(
          'Account ID not found. Please reconnect your LinkedIn Ads account and select an account.'
        );
      }

      // Create client
      const client = new LinkedInAdsClient(credentials.accessToken);

      // Map metric names
      const mappedMetrics = mapMetricNames(query.metrics);

      // Create date range
      const dateRange = createLinkedInDateRange(query.startDate, query.endDate);

      // Fetch analytics data
      const response = await client.getAnalytics({
        accounts: [accountId],
        dateRange,
        timeGranularity: 'DAILY',
        pivot: 'CAMPAIGN',
        fields: mappedMetrics,
      });

      // Transform response
      const normalizedData = transformLinkedInAdsResponse(response);

      return this.createSuccessResponse(normalizedData);
    } catch (error: any) {
      console.error('LinkedIn Ads fetch error:', error);
      return this.createErrorResponse(error.message);
    }
  }

  /**
   * List ad accounts
   *
   * @param credentials - Platform credentials
   * @returns Array of accounts with id and name
   */
  async listAdAccounts(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string }>> {
    const client = new LinkedInAdsClient(credentials.accessToken);
    const accounts = await client.listAdAccounts();

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
    }));
  }

  /**
   * Create a TEST ad account for free testing (no billing required)
   *
   * @param credentials - Platform credentials
   * @param name - Name for the test account
   * @returns Created test ad account
   */
  async createTestAdAccount(
    credentials: PlatformCredentials,
    name: string = 'API Test Account'
  ): Promise<{ id: string; name: string; status: string }> {
    const client = new LinkedInAdsClient(credentials.accessToken);
    const account = await client.createTestAdAccount(name);

    return {
      id: account.id,
      name: account.name,
      status: account.status,
    };
  }

  /**
   * Get campaigns for an account
   *
   * @param credentials - Platform credentials
   * @returns Array of campaigns
   */
  async getCampaigns(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string; status: string }>> {
    const accountId = credentials.metadata?.accountId as string;
    if (!accountId) {
      throw new Error('Account ID not found in credentials');
    }

    const client = new LinkedInAdsClient(credentials.accessToken);
    const campaigns = await client.getCampaigns(accountId);

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
    }));
  }

  /**
   * Get campaign groups for an account
   *
   * @param credentials - Platform credentials
   * @returns Array of campaign groups
   */
  async getCampaignGroups(
    credentials: PlatformCredentials
  ): Promise<Array<{ id: string; name: string }>> {
    const accountId = credentials.metadata?.accountId as string;
    if (!accountId) {
      throw new Error('Account ID not found in credentials');
    }

    const client = new LinkedInAdsClient(credentials.accessToken);
    const campaignGroups = await client.getCampaignGroups(accountId);

    return campaignGroups.map((group: any) => ({
      id: group.id,
      name: group.name,
    }));
  }

  /**
   * Test connection to LinkedIn Ads API
   *
   * @param credentials - Platform credentials
   * @returns True if connection successful
   */
  async testConnection(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const client = new LinkedInAdsClient(credentials.accessToken);
      return await client.testConnection();
    } catch (error) {
      console.error('LinkedIn Ads connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available metrics
   */
  getAvailableMetrics(): MetricDefinition[] {
    return AVAILABLE_LINKEDIN_ADS_METRICS;
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions(): DimensionDefinition[] {
    // LinkedIn Ads dimensions
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
        id: 'creative_id',
        name: 'Creative ID',
        description: 'Creative identifier',
      },
      {
        id: 'account_id',
        name: 'Account ID',
        description: 'Ad account identifier',
      },
      {
        id: 'date',
        name: 'Date',
        description: 'Date of the data',
      },
    ];
  }
}
