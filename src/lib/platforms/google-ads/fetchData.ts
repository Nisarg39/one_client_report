/**
 * Google Ads Data Fetching Service
 *
 * Fetches ad performance data from Google Ads API
 * for use in AI chat context
 *
 * Note: Requires GOOGLE_ADS_DEVELOPER_TOKEN environment variable
 */

import { GoogleAdsClient } from './client';
import { IPlatformConnection } from '@/models/PlatformConnection';
import { GoogleAdsCustomer, GoogleAdsCampaign } from './types';

/**
 * Google Ads data format for AI system prompt
 */
export interface GoogleAdsData {
  customers: Array<{
    id: string;
    name: string;
    currency: string;
    timeZone: string;
  }>;
  metrics: {
    impressions: number;
    clicks: number;
    cost: number; // In actual currency (converted from micros)
    conversions: number;
    ctr: number;
    avgCpc: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    impressions: number;
    clicks: number;
    cost: number;
  }>;
  dateRange: string;
  developerTokenStatus: 'active' | 'pending' | 'missing';
}

/**
 * Fetch Google Ads data for AI context
 *
 * @param connection - Platform connection with decrypted tokens
 * @returns Formatted Google Ads data for AI
 */
export async function fetchGoogleAdsData(
  connection: IPlatformConnection,
  startDate?: string,
  endDate?: string
): Promise<GoogleAdsData | null> {
  // Calculate date range string at the start for use in early returns
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const defaultEndDate = new Date();
  const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const start = startDate || formatDate(defaultStartDate);
  const end = endDate || formatDate(defaultEndDate);
  const dateRangeString = `${start} to ${end}`;

  // Check for developer token first
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  if (!developerToken) {
    console.warn('[Google Ads] Developer token not configured - returning limited data');
    return {
      customers: [],
      metrics: {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        ctr: 0,
        avgCpc: 0,
      },
      campaigns: [],
      dateRange: dateRangeString,
      developerTokenStatus: 'missing',
    };
  }

  try {
    // Get the access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('[Google Ads] No access token available');
      return null;
    }

    // Create client
    const client = new GoogleAdsClient(accessToken, developerToken);

    // Get accessible customers
    let customerResourceNames: string[] = [];
    try {
      customerResourceNames = await client.listAccessibleCustomers();
    } catch (customerError: any) {
      console.error('[Google Ads] Failed to list customers:', customerError.message);

      // Check if it's a pending developer token issue
      if (customerError.message.includes('DEVELOPER_TOKEN_NOT_APPROVED')) {
        return {
          customers: [],
          metrics: {
            impressions: 0,
            clicks: 0,
            cost: 0,
            conversions: 0,
            ctr: 0,
            avgCpc: 0,
          },
          campaigns: [],
          dateRange: dateRangeString,
          developerTokenStatus: 'pending',
        };
      }

      return null;
    }

    if (customerResourceNames.length === 0) {
      return {
        customers: [],
        metrics: {
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0,
          ctr: 0,
          avgCpc: 0,
        },
        campaigns: [],
        dateRange: dateRangeString,
        developerTokenStatus: 'active',
      };
    }

    // Extract customer IDs from resource names (format: customers/1234567890)
    const customerIds = customerResourceNames.map((name) =>
      name.replace('customers/', '')
    );

    // Aggregate metrics
    let totalMetrics = {
      impressions: 0,
      clicks: 0,
      costMicros: 0,
      conversions: 0,
    };

    const allCustomers: GoogleAdsData['customers'] = [];
    const allCampaigns: GoogleAdsData['campaigns'] = [];

    // Fetch data for each customer (limit to first 3 to avoid rate limits)
    const customersToFetch = customerIds.slice(0, 3);

    for (const customerId of customersToFetch) {
      try {
        // Get customer details
        const customer = await client.getCustomer(customerId);
        allCustomers.push({
          id: customer.id,
          name: customer.descriptiveName,
          currency: customer.currencyCode,
          timeZone: customer.timeZone,
        });

        // Get campaign metrics for this customer
        const metricsResponse = await client.getMetrics(
          customerId,
          [
            'metrics.impressions',
            'metrics.clicks',
            'metrics.cost_micros',
            'metrics.conversions',
          ],
          start,
          end
        );

        // Aggregate metrics and collect campaigns
        const campaignMetrics = new Map<string, any>();

        for (const result of metricsResponse.results) {
          if (result.metrics) {
            totalMetrics.impressions += parseInt(result.metrics.impressions || '0', 10);
            totalMetrics.clicks += parseInt(result.metrics.clicks || '0', 10);
            totalMetrics.costMicros += parseInt(result.metrics.cost_micros || '0', 10);
            totalMetrics.conversions += result.metrics.conversions || 0;
          }

          // Collect campaign-level data
          if (result.campaign) {
            const campaignId = result.campaign.id;
            if (!campaignMetrics.has(campaignId)) {
              campaignMetrics.set(campaignId, {
                id: campaignId,
                name: result.campaign.name,
                status: result.campaign.status,
                type: result.campaign.advertisingChannelType || 'UNKNOWN',
                impressions: 0,
                clicks: 0,
                costMicros: 0,
              });
            }

            const campaign = campaignMetrics.get(campaignId);
            if (result.metrics) {
              campaign.impressions += parseInt(result.metrics.impressions || '0', 10);
              campaign.clicks += parseInt(result.metrics.clicks || '0', 10);
              campaign.costMicros += parseInt(result.metrics.cost_micros || '0', 10);
            }
          }
        }

        // Add campaigns to list (limit to top 5 by impressions)
        const campaignList = Array.from(campaignMetrics.values())
          .sort((a, b) => b.impressions - a.impressions)
          .slice(0, 5)
          .map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            type: c.type,
            impressions: c.impressions,
            clicks: c.clicks,
            cost: c.costMicros / 1_000_000, // Convert micros to actual currency
          }));

        allCampaigns.push(...campaignList);
      } catch (customerError: any) {
        // Customer data fetch failed, continue without this customer
      }
    }

    // Convert cost from micros
    const totalCost = totalMetrics.costMicros / 1_000_000;

    // Calculate derived metrics
    const ctr = totalMetrics.impressions > 0
      ? (totalMetrics.clicks / totalMetrics.impressions) * 100
      : 0;
    const avgCpc = totalMetrics.clicks > 0
      ? totalCost / totalMetrics.clicks
      : 0;

    return {
      customers: allCustomers,
      metrics: {
        impressions: totalMetrics.impressions,
        clicks: totalMetrics.clicks,
        cost: Math.round(totalCost * 100) / 100, // Round to 2 decimals
        conversions: Math.round(totalMetrics.conversions * 100) / 100,
        ctr: Math.round(ctr * 100) / 100,
        avgCpc: Math.round(avgCpc * 100) / 100,
      },
      campaigns: allCampaigns.slice(0, 10), // Limit total campaigns to 10
      dateRange: dateRangeString,
      developerTokenStatus: 'active',
    };
  } catch (error) {
    console.error('[Google Ads] Error fetching data:', error);

    // Check if it's an auth error
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('UNAUTHENTICATED')) {
        console.error('[Google Ads] Access token may be expired - needs refresh');
      }
      if (error.message.includes('DEVELOPER_TOKEN')) {
        console.error('[Google Ads] Developer token issue');
        return {
          customers: [],
          metrics: {
            impressions: 0,
            clicks: 0,
            cost: 0,
            conversions: 0,
            ctr: 0,
            avgCpc: 0,
          },
          campaigns: [],
          dateRange: dateRangeString,
          developerTokenStatus: 'pending',
        };
      }
    }

    return null;
  }
}

