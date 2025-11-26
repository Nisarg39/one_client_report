/**
 * Google Analytics API Client
 *
 * Handles communication with Google Analytics Data API (GA4)
 */

import { GA4RunReportRequest, GA4Response, GA4Property } from './types';

/**
 * Google Analytics API Client
 */
export class GoogleAnalyticsClient {
  private accessToken: string;
  private apiVersion: string = 'v1beta';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Run a GA4 report
   *
   * @param request - Report request parameters
   * @returns GA4 API response
   */
  async runReport(request: GA4RunReportRequest): Promise<GA4Response> {
    const url = `https://analyticsdata.googleapis.com/${this.apiVersion}/properties/${request.propertyId}:runReport`;

    const body = {
      dateRanges: request.dateRanges,
      metrics: request.metrics,
      dimensions: request.dimensions || [],
      limit: request.limit || 10000,
      offset: request.offset || 0,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Analytics API error (${response.status}): ${errorText}`
      );
    }

    return response.json();
  }

  /**
   * List accessible GA4 properties
   *
   * @returns List of GA4 properties
   */
  async listProperties(): Promise<GA4Property[]> {
    const url = `https://analyticsadmin.googleapis.com/v1beta/accountSummaries`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Analytics Admin API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();

    // Extract properties from account summaries
    const properties: GA4Property[] = [];

    if (data.accountSummaries) {
      for (const account of data.accountSummaries) {
        if (account.propertySummaries) {
          for (const property of account.propertySummaries) {
            properties.push({
              name: property.property,
              propertyId: property.property.split('/')[1], // Extract ID from "properties/123456789"
              displayName: property.displayName,
            });
          }
        }
      }
    }

    return properties;
  }

  /**
   * Get property details
   *
   * @param propertyId - GA4 property ID
   * @returns Property details
   */
  async getProperty(propertyId: string): Promise<GA4Property> {
    const url = `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Analytics Admin API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();

    return {
      name: data.name,
      propertyId: data.name.split('/')[1],
      displayName: data.displayName,
      timeZone: data.timeZone,
      currencyCode: data.currencyCode,
    };
  }

  /**
   * Test API connection
   *
   * @returns True if connection is successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listProperties();
      return true;
    } catch (error) {
      console.error('Google Analytics connection test failed:', error);
      return false;
    }
  }

  /**
   * Get metadata (available dimensions and metrics)
   *
   * @param propertyId - GA4 property ID
   * @returns Metadata response
   */
  async getMetadata(propertyId: string): Promise<any> {
    const url = `https://analyticsdata.googleapis.com/${this.apiVersion}/properties/${propertyId}/metadata`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Analytics API error (${response.status}): ${errorText}`
      );
    }

    return response.json();
  }

  /**
   * Run a real-time report to get current active users
   *
   * @param propertyId - GA4 property ID
   * @returns Real-time metrics including active users
   */
  async runRealtimeReport(propertyId: string): Promise<{
    activeUsers: number;
    activeUsersByDevice?: Array<{ device: string; users: number }>;
    activeUsersByCountry?: Array<{ country: string; users: number }>;
  }> {
    const url = `https://analyticsdata.googleapis.com/${this.apiVersion}/properties/${propertyId}:runRealtimeReport`;

    const body = {
      metrics: [
        { name: 'activeUsers' },
      ],
      dimensions: [
        { name: 'deviceCategory' },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Analytics Realtime API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();

    // Parse the response
    let totalActiveUsers = 0;
    const activeUsersByDevice: Array<{ device: string; users: number }> = [];

    if (data.rows) {
      for (const row of data.rows) {
        const device = row.dimensionValues?.[0]?.value || 'unknown';
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
        totalActiveUsers += users;
        activeUsersByDevice.push({ device, users });
      }
    }

    return {
      activeUsers: totalActiveUsers,
      activeUsersByDevice,
    };
  }
}
