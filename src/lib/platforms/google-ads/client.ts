import { GoogleAdsApi, enums } from 'google-ads-api';
import {
  GoogleAdsQueryRequest,
  GoogleAdsQueryResponse,
  GoogleAdsCustomerRow,
  GoogleAdsCampaign,
} from './types';

/**
 * Google Ads API Client using the official google-ads-api library
 */
export class GoogleAdsClient {
  private api: GoogleAdsApi;
  private refreshToken: string;
  private loginCustomerId: string;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
    this.loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '';

    this.api = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    });
  }

  /**
   * Get a Customer instance
   */
  private getCustomerInstance(customerId: string, loginCustomerId?: string | null) {
    const cid = customerId.replace(/-/g, '');

    // Use provided lcid, or fallback to constructor one, or undefined if null
    let lcid: string | undefined;
    if (loginCustomerId === null) {
      lcid = undefined;
    } else {
      const rawLcid = loginCustomerId || this.loginCustomerId;
      lcid = rawLcid ? rawLcid.replace(/-/g, '') : undefined;
    }

    return this.api.Customer({
      customer_id: cid,
      refresh_token: this.refreshToken,
      login_customer_id: lcid,
    });
  }

  /**
   * Execute a Google Ads Query Language (GAQL) query
   */
  async query(request: GoogleAdsQueryRequest, loginCustomerId?: string | null): Promise<GoogleAdsQueryResponse> {
    const customer = this.getCustomerInstance(request.customerId, loginCustomerId);

    try {
      const results = await customer.query(request.query);
      return {
        results: results as any[],
        fieldMask: '',
      };
    } catch (error: any) {
      // Library errors often have detailed information in error.errors or error.message
      let detailedError = '';

      if (error && typeof error === 'object') {
        if (error.errors && Array.isArray(error.errors)) {
          detailedError = JSON.stringify(error);
        } else if (error.message) {
          detailedError = error.message;
        } else {
          detailedError = JSON.stringify(error);
        }
      } else {
        detailedError = String(error);
      }

      console.error(`[Google Ads SDK] Query failed for ${request.customerId}:`, detailedError);
      throw new Error(`Google Ads Query Error: ${detailedError}`);
    }
  }

  /**
   * List accessible customer accounts
   */
  async listAccessibleCustomers(): Promise<string[]> {
    try {
      // The library's listAccessibleCustomers uses the developer token and refresh token
      const customers = await this.api.listAccessibleCustomers(this.refreshToken);
      return customers.resource_names || [];
    } catch (error: any) {
      throw new Error(`Google Ads List Customers Error: ${error.message}`);
    }
  }

  /**
   * Get customer details
   */
  async getCustomer(customerId: string, loginCustomerId?: string | null): Promise<GoogleAdsCustomerRow> {
    const query = `
      SELECT
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone,
        customer.manager
      FROM customer
      WHERE customer.id = ${customerId.replace(/-/g, '')}
    `;

    const response = await this.query({
      customerId,
      query,
    }, loginCustomerId);

    if (response.results.length === 0) {
      throw new Error(`Customer ${customerId} not found`);
    }

    const result = response.results[0];
    return {
      resourceName: result.customer.resource_name,
      id: result.customer.id,
      descriptiveName: result.customer.descriptive_name,
      currencyCode: result.customer.currency_code,
      timeZone: result.customer.time_zone,
      manager: result.customer.manager,
    };
  }

  /**
   * Get campaigns for a customer
   */
  async getCampaigns(customerId: string, loginCustomerId?: string | null): Promise<GoogleAdsCampaign[]> {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY campaign.name
    `;

    const response = await this.query({
      customerId,
      query,
    }, loginCustomerId);

    return response.results
      .filter((result) => result.campaign)
      .map((result) => ({
        resourceName: result.campaign.resource_name || '',
        id: result.campaign.id,
        name: result.campaign.name,
        status: result.campaign.status,
        advertisingChannelType: result.campaign.advertising_channel_type || '',
      }));
  }

  /**
   * Get metrics for a date range
   */
  async getMetrics(
    customerId: string,
    metrics: string[],
    startDate: string,
    endDate: string,
    loginCustomerId?: string | null
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
    }, loginCustomerId);
  }

  /**
   * Test API connection
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
