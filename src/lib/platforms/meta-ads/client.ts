/**
 * Meta Ads API Client
 *
 * Handles communication with Meta (Facebook) Marketing API
 */

import {
  MetaInsightsRequest,
  MetaInsightsResponse,
  MetaAdAccount,
  META_CONFIG,
} from './types';

/**
 * Meta Ads API Client
 */
export class MetaAdsClient {
  private accessToken: string;
  private apiVersion: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.apiVersion = META_CONFIG.apiVersion;
  }

  /**
   * Get ad account insights
   *
   * @param request - Insights request parameters
   * @returns Insights response
   */
  async getInsights(request: MetaInsightsRequest): Promise<MetaInsightsResponse> {
    // Ensure account ID has 'act_' prefix
    const accountId = request.adAccountId.startsWith('act_')
      ? request.adAccountId
      : `act_${request.adAccountId}`;

    const params = new URLSearchParams({
      access_token: this.accessToken,
      fields: request.fields.join(','),
      level: request.level || 'account',
      limit: String(request.limit || 1000),
    });

    // Add date parameters
    if (request.datePreset) {
      params.append('date_preset', request.datePreset);
    } else if (request.timeRange) {
      params.append('time_range', JSON.stringify(request.timeRange));
    }

    // Add filtering if provided
    if (request.filtering && request.filtering.length > 0) {
      params.append('filtering', JSON.stringify(request.filtering));
    }

    // Add breakdowns if provided
    if (request.breakdowns && request.breakdowns.length > 0) {
      params.append('breakdowns', request.breakdowns.join(','));
    }

    const url = `https://graph.facebook.com/${this.apiVersion}/${accountId}/insights?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Meta API error (${response.status}): ${error.error?.message || response.statusText
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
  async listAdAccounts(): Promise<MetaAdAccount[]> {
    const params = new URLSearchParams({
      access_token: this.accessToken,
      fields: 'id,account_id,name,account_status,currency',
    });

    const url = `https://graph.facebook.com/${this.apiVersion}/me/adaccounts?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Meta API error (${response.status}): ${error.error?.message || 'Failed to fetch ad accounts'}`
      );
    }

    const data = await response.json();
    return data.data || [];
  }

  /**
   * Get campaigns for an ad account
   *
   * @param adAccountId - Ad account ID
   * @returns List of campaigns
   */
  async getCampaigns(adAccountId: string): Promise<any[]> {
    const accountId = adAccountId.startsWith('act_')
      ? adAccountId
      : `act_${adAccountId}`;

    const params = new URLSearchParams({
      access_token: this.accessToken,
      fields: 'id,name,status,objective,effective_status',
    });

    const url = `https://graph.facebook.com/${this.apiVersion}/${accountId}/campaigns?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Meta API error (${response.status}): ${error.error?.message || 'Failed to fetch campaigns'}`
      );
    }

    const data = await response.json();
    return data.data || [];
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
      console.error('Meta Ads connection test failed:', error);
      return false;
    }
  }

  /**
   * Get user info (for verification)
   *
   * @returns User info
   */
  async getUserInfo(): Promise<any> {
    const params = new URLSearchParams({
      access_token: this.accessToken,
      fields: 'id,name,email',
    });

    const url = `https://graph.facebook.com/${this.apiVersion}/me?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  }
}
