/**
 * LinkedIn Ads API Client
 *
 * Handles communication with LinkedIn Marketing API
 */

import {
  LinkedInAdsAnalyticsRequest,
  LinkedInAdsAnalyticsResponse,
  LinkedInAdAccount,
  LinkedInCampaign,
  LINKEDIN_ADS_CONFIG,
} from './types';

/**
 * LinkedIn Ads API Client
 */
export class LinkedInAdsClient {
  private accessToken: string;
  private apiVersion: string;
  private baseUrl: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.apiVersion = LINKEDIN_ADS_CONFIG.apiVersion;
    this.baseUrl = 'https://api.linkedin.com/rest'; // API version goes in headers, not URL
  }

  /**
   * Get ad analytics
   *
   * @param request - Analytics request parameters
   * @returns Analytics response
   */
  async getAnalytics(
    request: LinkedInAdsAnalyticsRequest
  ): Promise<LinkedInAdsAnalyticsResponse> {
    // LinkedIn requires nested format per RestLi protocol
    // IMPORTANT: Parentheses and colons in dateRange must NOT be encoded
    const dateRange = `(start:(year:${request.dateRange.start.year},month:${request.dateRange.start.month},day:${request.dateRange.start.day}),end:(year:${request.dateRange.end.year},month:${request.dateRange.end.month},day:${request.dateRange.end.day}))`;

    // Encode URNs but keep List() format
    // Per LinkedIn docs: List(urn%3Ali%3AsponsoredAccount%3A123)
    const encodedAccounts = request.accounts.map(acc => acc.replace(/:/g, '%3A'));
    const accountsList = `List(${encodedAccounts.join(',')})`;

    // Fields should be comma-separated without encoding
    const fieldsParam = request.fields.join(',');

    // Build URL params
    const baseParams = new URLSearchParams({
      q: 'analytics',
      pivot: request.pivot,
      timeGranularity: request.timeGranularity,
    });

    // Manually construct URL - do NOT encode dateRange parentheses/colons
    // but DO encode the accountsList
    const url = `${this.baseUrl}/adAnalytics?${baseParams}&dateRange=${dateRange}&accounts=${accountsList}&fields=${fieldsParam}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202411',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `LinkedIn API error (${response.status}): ${
          error.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  /**
   * List ad accounts
   *
   * @returns List of ad accounts
   */
  async listAdAccounts(): Promise<LinkedInAdAccount[]> {
    // Use the simple finder API to get all ad accounts the user has access to
    const url = `${this.baseUrl}/adAccounts?q=search`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202411',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage = 'Failed to fetch ad accounts';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.serviceErrorCode || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(
        `LinkedIn API error (${response.status}): ${errorMessage}`
      );
    }

    const data = await response.json();

    const accounts = data.elements?.map((account: any) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      status: account.status,
      currency: account.currency,
    })) || [];

    return accounts;
  }

  /**
   * Get campaigns for an ad account
   *
   * @param accountId - Ad account ID (URN format)
   * @returns List of campaigns
   */
  async getCampaigns(accountId: string): Promise<LinkedInCampaign[]> {
    // Original implementation - campaigns fetching is optional
    // If it fails, we continue without campaigns (metrics still work)
    // This method is used to populate the campaigns array in LinkedInAdsData
    // but errors are caught and handled gracefully in fetchData.ts
    
    // For now, return empty array to avoid API errors
    // Campaigns can be fetched separately if needed in the future
    return [];
  }

  /**
   * Get campaign groups (formerly campaign groups)
   *
   * @param accountId - Ad account ID
   * @returns List of campaign groups
   */
  async getCampaignGroups(accountId: string): Promise<any[]> {
    const params = new URLSearchParams({
      q: 'search',
      search: `(account:(values:List(${accountId})))`,
      'search.status.values[0]': 'ACTIVE',
      'search.status.values[1]': 'PAUSED',
    });

    const url = `${this.baseUrl}/adCampaignGroups?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202411',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `LinkedIn API error (${response.status}): ${
          error.message || 'Failed to fetch campaign groups'
        }`
      );
    }

    const data = await response.json();
    return data.elements || [];
  }

  /**
   * Create a TEST ad account for free testing (no billing required)
   *
   * @param name - Name for the test account
   * @returns Created test ad account
   */
  async createTestAdAccount(name: string = 'Test Account'): Promise<LinkedInAdAccount> {
    const payload = {
      name,
      type: 'BUSINESS',
      currency: 'USD',
      test: true, // This flag makes it a TEST account - no billing required!
    };

    const url = `${this.baseUrl}/adAccounts`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202411',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to create test account (${response.status}): ${
          error.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status || 'TEST',
      currency: data.currency,
    };
  }

  /**
   * Test API connection
   *
   * @returns True if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listAdAccounts();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user profile info (for verification)
   *
   * @returns User profile info
   */
  async getUserProfile(): Promise<any> {
    const url = `${this.baseUrl}/userinfo`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202411',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }
}
