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
    this.baseUrl = 'https://api.linkedin.com';
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
    const params = new URLSearchParams({
      q: 'analytics',
      pivot: request.pivot,
      timeGranularity: request.timeGranularity,
      'dateRange.start.year': String(request.dateRange.start.year),
      'dateRange.start.month': String(request.dateRange.start.month),
      'dateRange.start.day': String(request.dateRange.start.day),
      'dateRange.end.year': String(request.dateRange.end.year),
      'dateRange.end.month': String(request.dateRange.end.month),
      'dateRange.end.day': String(request.dateRange.end.day),
      fields: request.fields.join(','),
    });

    // Add account filters
    request.accounts.forEach((account) => {
      params.append('accounts', account);
    });

    const url = `${this.baseUrl}/${this.apiVersion}/adAnalytics?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202511',
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
    const url = `${this.baseUrl}/${this.apiVersion}/adAccounts?q=search`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202511',
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

    return (
      data.elements?.map((account: any) => ({
        id: account.id,
        name: account.name,
        type: account.type,
        status: account.status,
        currency: account.currency,
      })) || []
    );
  }

  /**
   * Get campaigns for an ad account
   *
   * @param accountId - Ad account ID (URN format)
   * @returns List of campaigns
   */
  async getCampaigns(accountId: string): Promise<LinkedInCampaign[]> {
    const params = new URLSearchParams({
      q: 'search',
      search: `(account:(values:List(${accountId})))`,
      'search.status.values[0]': 'ACTIVE',
      'search.status.values[1]': 'PAUSED',
    });

    const url = `${this.baseUrl}/${this.apiVersion}/adCampaigns?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202511',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `LinkedIn API error (${response.status}): ${
          error.message || 'Failed to fetch campaigns'
        }`
      );
    }

    const data = await response.json();

    return (
      data.elements?.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        type: campaign.type,
        costType: campaign.costType,
        account: campaign.account,
      })) || []
    );
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

    const url = `${this.baseUrl}/${this.apiVersion}/adCampaignGroups?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202511',
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

    const url = `${this.baseUrl}/${this.apiVersion}/adAccounts`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202511',
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
      console.error('LinkedIn Ads connection test failed:', error);
      return false;
    }
  }

  /**
   * Get user profile info (for verification)
   *
   * @returns User profile info
   */
  async getUserProfile(): Promise<any> {
    const url = `${this.baseUrl}/${this.apiVersion}/userinfo`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': '202511',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }
}
