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
    const start = request.dateRange.start;
    const end = request.dateRange.end;
    const dateRange = `(start:(year:${start.year},month:${start.month},day:${start.day}),end:(year:${end.year},month:${end.month},day:${end.day}))`;

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
    let url = `${this.baseUrl}/adAnalytics?${baseParams}&dateRange=${dateRange}&fields=${fieldsParam}`;

    // Add accounts filter if provided (and not empty)
    if (request.accounts && request.accounts.length > 0) {
      const encodedAccounts = request.accounts.map(acc => acc.replace(/:/g, '%3A'));
      url += `&accounts=List(${encodedAccounts.join(',')})`;
    }

    // Add optional campaign/group filters (facets)
    if (request.campaigns && request.campaigns.length > 0) {
      const encodedCampaigns = request.campaigns.map(c => c.replace(/:/g, '%3A'));
      url += `&campaigns=List(${encodedCampaigns.join(',')})`;
    }

    if (request.campaignGroups && request.campaignGroups.length > 0) {
      const encodedGroups = request.campaignGroups.map(g => g.replace(/:/g, '%3A'));
      url += `&campaignGroups=List(${encodedGroups.join(',')})`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.serviceErrorCode || errorText;
      } catch (e) {
        errorMessage = errorText;
      }
      throw new Error(`LinkedIn API error (${response.status}): ${errorMessage}`);
    }

    return response.json();
  }

  /**
   * List ad accounts
   *
   * @returns List of ad accounts
   */
  async listAdAccounts(): Promise<LinkedInAdAccount[]> {
    const url = `${this.baseUrl}/adAccounts?q=search`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    return data.elements?.map((account: any) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      status: account.status,
      currency: account.currency,
    })) || [];
  }

  /**
   * Get campaigns for an ad account
   *
   * @param accountId - Ad account ID (numeric)
   * @returns List of campaigns
   */
  async getCampaigns(accountId: string | number): Promise<LinkedInCampaign[]> {
    const url = `${this.baseUrl}/adAccounts/${accountId}/adCampaigns?q=search&search=(status:(values:List(ACTIVE,PAUSED,DRAFT)))`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    return data.elements?.map((campaign: any) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      type: campaign.type,
      costType: campaign.costType,
      account: campaign.account,
    })) || [];
  }

  /**
   * Get campaign groups
   *
   * @param accountId - Ad account ID (numeric)
   * @returns List of campaign groups
   */
  async getCampaignGroups(accountId: string | number): Promise<any[]> {
    const url = `${this.baseUrl}/adAccounts/${accountId}/adCampaignGroups?q=search&search=(status:(values:List(ACTIVE,PAUSED,DRAFT)))`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    return data.elements?.map((group: any) => ({
      id: group.id,
      name: group.name,
      status: group.status,
      account: group.account,
    })) || [];
  }

  /**
   * Get user profile (me)
   *
   * @returns User profile data
   */
  async getUserProfile(): Promise<any> {
    const url = 'https://api.linkedin.com/v2/userinfo'; // UserInfo endpoint provides basic profile

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Create a TEST ad account
   *
   * @param name - Name for the test account
   * @returns Created ad account
   */
  async createTestAdAccount(name: string): Promise<any> {
    const url = `${this.baseUrl}/adAccounts`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        type: 'BUSINESS',
        status: 'CANDIDATE', // Test accounts start as candidates
        currency: 'USD',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Test if the connection is valid by fetching a lightweight resource
   *
   * @returns True if connection is valid
   */
  async testConnection(): Promise<boolean> {
    try {
      // Fetching adAccounts is a good test of both auth and ads reach
      await this.listAdAccounts();
      return true;
    } catch (error) {
      console.error('LinkedIn connection test failed:', error);
      return false;
    }
  }
}
