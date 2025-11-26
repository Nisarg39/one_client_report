/**
 * Google Ads API Client
 *
 * Handles communication with Google Ads API v14
 */

import {
  GoogleAdsQueryRequest,
  GoogleAdsQueryResponse,
  GoogleAdsCustomer,
  GoogleAdsCampaign,
  GOOGLE_ADS_CONFIG,
} from './types';

/**
 * Google Ads API Client
 */
export class GoogleAdsClient {
  private accessToken: string;
  private developerToken: string;
  private apiVersion: string;

  constructor(accessToken: string, developerToken?: string) {
    this.accessToken = accessToken;
    this.developerToken = developerToken || process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';
    this.apiVersion = GOOGLE_ADS_CONFIG.apiVersion;

    if (!this.developerToken) {
      console.warn(
        '⚠️  Google Ads Developer Token not configured. Set GOOGLE_ADS_DEVELOPER_TOKEN environment variable.'
      );
    }
  }

  /**
   * Execute a Google Ads Query Language (GAQL) query
   *
   * @param request - Query request with customer ID and GAQL query
   * @returns Query response with results
   */
  async query(request: GoogleAdsQueryRequest): Promise<GoogleAdsQueryResponse> {
    if (!this.developerToken) {
      throw new Error(
        'Google Ads Developer Token not configured. Please set GOOGLE_ADS_DEVELOPER_TOKEN.'
      );
    }

    const url = `https://googleads.googleapis.com/${this.apiVersion}/customers/${request.customerId}/googleAds:searchStream`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'developer-token': this.developerToken,
      },
      body: JSON.stringify({
        query: request.query,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Google Ads API error (${response.status}): ${error}`
      );
    }

    // Google Ads API returns newline-delimited JSON
    const text = await response.text();
    const lines = text.trim().split('\n');
    const results: any[] = [];

    for (const line of lines) {
      if (line.trim()) {
        const parsed = JSON.parse(line);
        if (parsed.results) {
          results.push(...parsed.results);
        }
      }
    }

    return {
      results,
      fieldMask: '',
    };
  }

  /**
   * List accessible customer accounts
   *
   * @returns List of customer accounts
   */
  async listAccessibleCustomers(): Promise<string[]> {
    if (!this.developerToken) {
      throw new Error(
        'Google Ads Developer Token not configured. Please set GOOGLE_ADS_DEVELOPER_TOKEN.'
      );
    }

    const url = `https://googleads.googleapis.com/${this.apiVersion}/customers:listAccessibleCustomers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'developer-token': this.developerToken,
        'login-customer-id': this.developerToken, // Some Google Ads setups require this
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Google Ads API error (${response.status}): ${error}`
      );
    }

    const data = await response.json();
    return data.resourceNames || [];
  }

  /**
   * Get customer details
   *
   * @param customerId - Customer ID (without hyphens)
   * @returns Customer details
   */
  async getCustomer(customerId: string): Promise<GoogleAdsCustomer> {
    const query = `
      SELECT
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone,
        customer.manager
      FROM customer
      WHERE customer.id = ${customerId}
    `;

    const response = await this.query({
      customerId,
      query,
    });

    if (response.results.length === 0) {
      throw new Error(`Customer ${customerId} not found`);
    }

    const result = response.results[0];
    return {
      resourceName: result.customer.resourceName,
      id: result.customer.id,
      descriptiveName: result.customer.descriptiveName,
      currencyCode: result.customer.currencyCode,
      timeZone: result.customer.timeZone,
      manager: result.customer.manager,
    };
  }

  /**
   * Get campaigns for a customer
   *
   * @param customerId - Customer ID
   * @returns List of campaigns
   */
  async getCampaigns(customerId: string): Promise<GoogleAdsCampaign[]> {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.bidding_strategy_type
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY campaign.name
    `;

    const response = await this.query({
      customerId,
      query,
    });

    return response.results
      .filter((result) => result.campaign)
      .map((result) => ({
        resourceName: result.campaign!.resourceName || '',
        id: result.campaign!.id,
        name: result.campaign!.name,
        status: result.campaign!.status,
        advertisingChannelType: result.campaign!.advertisingChannelType || '',
        biddingStrategyType: result.campaign!.biddingStrategyType,
      }));
  }

  /**
   * Get metrics for a date range
   *
   * @param customerId - Customer ID
   * @param metrics - Metrics to fetch
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Query response with metrics
   */
  async getMetrics(
    customerId: string,
    metrics: string[],
    startDate: string,
    endDate: string
  ): Promise<GoogleAdsQueryResponse> {
    const metricFields = metrics.join(', ');

    const query = `
      SELECT
        segments.date,
        campaign.id,
        campaign.name,
        ${metricFields}
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY segments.date DESC
    `;

    return this.query({
      customerId,
      query,
    });
  }

  /**
   * Test API connection
   *
   * @returns True if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listAccessibleCustomers();
      return true;
    } catch (error) {
      console.error('Google Ads connection test failed:', error);
      return false;
    }
  }
}
