/**
 * Meta Ads Data Fetching Service
 *
 * Fetches ad performance data from Meta (Facebook/Instagram) Marketing API
 * for use in AI chat context
 */

import { MetaAdsClient } from './client';
import { IPlatformConnection } from '@/models/PlatformConnection';
import { MetaAdAccount } from './types';

/**
 * Meta Ads data format for AI system prompt
 */
export interface MetaAdsData {
  accounts: Array<{
    id: string;
    name: string;
    status: string;
    currency: string;
  }>;
  metrics: {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    cpm: number;
    frequency: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    objective: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  dateRange: string;
}

/**
 * Map Meta account status codes to readable strings
 */
function getAccountStatusString(status: number): string {
  const statusMap: Record<number, string> = {
    1: 'ACTIVE',
    2: 'DISABLED',
    3: 'UNSETTLED',
    7: 'PENDING_RISK_REVIEW',
    8: 'PENDING_SETTLEMENT',
    9: 'IN_GRACE_PERIOD',
    100: 'PENDING_CLOSURE',
    101: 'CLOSED',
    201: 'ANY_ACTIVE',
    202: 'ANY_CLOSED',
  };
  return statusMap[status] || 'UNKNOWN';
}

/**
 * Fetch Meta Ads data for AI context
 *
 * @param connection - Platform connection with decrypted tokens
 * @returns Formatted Meta Ads data for AI
 */
export async function fetchMetaAdsData(
  connection: IPlatformConnection,
  startDate?: string,
  endDate?: string
): Promise<MetaAdsData | null> {
  try {
    // Calculate date range string at the start for use in early returns
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const defaultEndDate = new Date();
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const start = startDate || formatDate(defaultStartDate);
    const end = endDate || formatDate(defaultEndDate);
    const dateRangeString = `${start} to ${end}`;

    // Get the access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('[Meta Ads] No access token available');
      return null;
    }

    // Create client
    const client = new MetaAdsClient(accessToken);

    // Get all ad accounts
    let accounts: MetaAdAccount[] = [];
    try {
      accounts = await client.listAdAccounts();
    } catch (accountError: any) {
      console.error('[Meta Ads] Failed to list ad accounts:', accountError.message);
      return null;
    }

    if (accounts.length === 0) {
      return {
        accounts: [],
        metrics: {
          impressions: 0,
          reach: 0,
          clicks: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
          frequency: 0,
        },
        campaigns: [],
        dateRange: dateRangeString,
      };
    }

    // Aggregate metrics from all accounts
    let totalMetrics = {
      impressions: 0,
      reach: 0,
      clicks: 0,
      spend: 0,
    };

    const allCampaigns: MetaAdsData['campaigns'] = [];

    // Fetch data for each account (limit to first 3 to avoid rate limits)
    const accountsToFetch = accounts.slice(0, 3);

    for (const account of accountsToFetch) {
      try {
        // Get account-level insights
        const insightsParams: any = {
          adAccountId: account.id,
          fields: [
            'impressions',
            'reach',
            'clicks',
            'spend',
            'ctr',
            'cpc',
            'cpm',
            'frequency',
          ],
          level: 'account',
        };

        // Use time_range if custom dates provided, otherwise use preset
        if (startDate && endDate) {
          insightsParams.time_range = { since: start, until: end };
        } else {
          insightsParams.datePreset = 'last_30d';
        }

        const insightsResponse = await client.getInsights(insightsParams);

        // Sum up metrics from response
        if (insightsResponse.data && insightsResponse.data.length > 0) {
          for (const row of insightsResponse.data) {
            totalMetrics.impressions += parseInt(row.impressions || '0', 10);
            totalMetrics.reach += parseInt(row.reach || '0', 10);
            totalMetrics.clicks += parseInt(row.clicks || '0', 10);
            totalMetrics.spend += parseFloat(row.spend || '0');
          }
        }

        // Get campaigns for this account
        try {
          const campaigns = await client.getCampaigns(account.id);

          // Get campaign-level insights
          if (campaigns.length > 0) {
            const campaignInsightsParams: any = {
              adAccountId: account.id,
              fields: ['campaign_id', 'campaign_name', 'impressions', 'clicks', 'spend'],
              level: 'campaign',
            };

            // Use time_range if custom dates provided, otherwise use preset
            if (startDate && endDate) {
              campaignInsightsParams.time_range = { since: start, until: end };
            } else {
              campaignInsightsParams.datePreset = 'last_30d';
            }

            const campaignInsights = await client.getInsights(campaignInsightsParams);

            // Map campaign IDs to insights
            const campaignMetricsMap = new Map<string, any>();
            for (const row of campaignInsights.data || []) {
              if (row.campaign_id) {
                campaignMetricsMap.set(row.campaign_id, row);
              }
            }

            // Add campaign data with metrics
            for (const campaign of campaigns.slice(0, 5)) { // Limit to 5 campaigns
              const metrics = campaignMetricsMap.get(campaign.id) || {};

              allCampaigns.push({
                id: campaign.id,
                name: campaign.name,
                status: campaign.effective_status || campaign.status,
                objective: campaign.objective || 'N/A',
                impressions: parseInt(metrics.impressions || '0', 10),
                clicks: parseInt(metrics.clicks || '0', 10),
                spend: parseFloat(metrics.spend || '0'),
              });
            }
          }
        } catch (campaignError: any) {
          // Campaign fetch failed, continue without campaign details
        }
      } catch (insightsError: any) {
        // Insights fetch failed, continue without insights
      }
    }

    // Calculate derived metrics
    const ctr = totalMetrics.impressions > 0
      ? (totalMetrics.clicks / totalMetrics.impressions) * 100
      : 0;
    const cpc = totalMetrics.clicks > 0
      ? totalMetrics.spend / totalMetrics.clicks
      : 0;
    const cpm = totalMetrics.impressions > 0
      ? (totalMetrics.spend / totalMetrics.impressions) * 1000
      : 0;
    const frequency = totalMetrics.reach > 0
      ? totalMetrics.impressions / totalMetrics.reach
      : 0;

    return {
      accounts: accounts.map((acc) => ({
        id: acc.account_id || acc.id,
        name: acc.name,
        status: getAccountStatusString(acc.account_status),
        currency: acc.currency,
      })),
      metrics: {
        impressions: totalMetrics.impressions,
        reach: totalMetrics.reach,
        clicks: totalMetrics.clicks,
        spend: Math.round(totalMetrics.spend * 100) / 100, // Round to 2 decimals
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        cpm: Math.round(cpm * 100) / 100,
        frequency: Math.round(frequency * 100) / 100,
      },
      campaigns: allCampaigns,
      dateRange: dateRangeString,
    };
  } catch (error) {
    console.error('[Meta Ads] Error fetching data:', error);

    // Check if it's an auth error
    if (error instanceof Error && (error.message.includes('190') || error.message.includes('expired'))) {
      console.error('[Meta Ads] Access token may be expired - needs refresh');
    }

    return null;
  }
}
