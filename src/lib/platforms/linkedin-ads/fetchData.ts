/**
 * LinkedIn Ads Data Fetching Service
 *
 * Fetches ad performance data from LinkedIn Marketing API
 * for use in AI chat context
 */

import { LinkedInAdsClient } from './client';
import { IPlatformConnection } from '@/models/PlatformConnection';
import { LinkedInAdAccount, LinkedInCampaign } from './types';

/**
 * LinkedIn Ads data format for AI system prompt
 */
export interface LinkedInAdsData {
  accounts: Array<{
    id: string;
    name: string;
    status: string;
    currency: string;
  }>;
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversions: number;
    likes: number;
    comments: number;
    shares: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  dateRange: string;
}

/**
 * Fetch LinkedIn Ads data for AI context
 *
 * @param connection - Platform connection with decrypted tokens
 * @returns Formatted LinkedIn Ads data for AI
 */
export async function fetchLinkedInAdsData(
  connection: IPlatformConnection
): Promise<LinkedInAdsData | null> {
  try {
    // Get the access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('[LinkedIn Ads] No access token available');
      return null;
    }

    // Create client
    const client = new LinkedInAdsClient(accessToken);

    // Get all ad accounts
    let accounts: LinkedInAdAccount[] = [];
    try {
      accounts = await client.listAdAccounts();
      console.log(`[LinkedIn Ads] Found ${accounts.length} ad accounts`);
    } catch (accountError: any) {
      console.error('[LinkedIn Ads] Failed to list ad accounts:', accountError.message);
      return null;
    }

    if (accounts.length === 0) {
      console.log('[LinkedIn Ads] No ad accounts found');
      return {
        accounts: [],
        metrics: {
          impressions: 0,
          clicks: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          conversions: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
        campaigns: [],
        dateRange: getDateRangeString(),
      };
    }

    // Date range: last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const dateRange = {
      start: {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1, // LinkedIn uses 1-indexed months
        day: startDate.getDate(),
      },
      end: {
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate(),
      },
    };

    // Aggregate metrics from all accounts
    let totalMetrics = {
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    const allCampaigns: LinkedInAdsData['campaigns'] = [];

    // Fetch data for each account (limit to first 3 to avoid rate limits)
    const accountsToFetch = accounts.slice(0, 3);

    for (const account of accountsToFetch) {
      try {
        // Get account-level analytics
        const accountUrn = `urn:li:sponsoredAccount:${account.id}`;

        const analyticsResponse = await client.getAnalytics({
          accounts: [accountUrn],
          dateRange,
          timeGranularity: 'ALL',
          pivot: 'ACCOUNT',
          fields: [
            'impressions',
            'clicks',
            'costInLocalCurrency',
            'externalWebsiteConversions',
            'likes',
            'comments',
            'shares',
          ],
        });

        // Sum up metrics from response
        if (analyticsResponse.elements && analyticsResponse.elements.length > 0) {
          for (const element of analyticsResponse.elements) {
            totalMetrics.impressions += element.impressions || 0;
            totalMetrics.clicks += element.clicks || 0;
            totalMetrics.spend += element.costInLocalCurrency || 0;
            totalMetrics.conversions += element.externalWebsiteConversions || 0;
            totalMetrics.likes += element.likes || 0;
            totalMetrics.comments += element.comments || 0;
            totalMetrics.shares += element.shares || 0;
          }
        }

        // Get campaigns for this account
        try {
          const campaigns = await client.getCampaigns(accountUrn);

          // Get analytics per campaign
          if (campaigns.length > 0) {
            const campaignAnalytics = await client.getAnalytics({
              accounts: [accountUrn],
              dateRange,
              timeGranularity: 'ALL',
              pivot: 'CAMPAIGN',
              fields: ['impressions', 'clicks', 'costInLocalCurrency'],
            });

            // Map campaign IDs to analytics
            const campaignMetricsMap = new Map<string, any>();
            for (const element of campaignAnalytics.elements || []) {
              if (element.pivotValue) {
                campaignMetricsMap.set(element.pivotValue, element);
              }
            }

            // Add campaign data with metrics
            for (const campaign of campaigns.slice(0, 5)) { // Limit to 5 campaigns
              const campaignUrn = `urn:li:sponsoredCampaign:${campaign.id}`;
              const metrics = campaignMetricsMap.get(campaignUrn) || {};

              allCampaigns.push({
                id: campaign.id,
                name: campaign.name,
                status: campaign.status,
                type: campaign.type,
                impressions: metrics.impressions || 0,
                clicks: metrics.clicks || 0,
                spend: metrics.costInLocalCurrency || 0,
              });
            }
          }
        } catch (campaignError: any) {
          console.log(`[LinkedIn Ads] Could not fetch campaigns for ${account.name}: ${campaignError.message}`);
        }

        console.log(`[LinkedIn Ads] ${account.name}: ${totalMetrics.impressions} impressions, $${totalMetrics.spend.toFixed(2)} spend`);
      } catch (analyticsError: any) {
        console.log(`[LinkedIn Ads] Could not fetch analytics for ${account.name}: ${analyticsError.message}`);
      }
    }

    // Calculate derived metrics
    const ctr = totalMetrics.impressions > 0
      ? (totalMetrics.clicks / totalMetrics.impressions) * 100
      : 0;
    const cpc = totalMetrics.clicks > 0
      ? totalMetrics.spend / totalMetrics.clicks
      : 0;

    return {
      accounts: accounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        status: acc.status,
        currency: acc.currency,
      })),
      metrics: {
        impressions: totalMetrics.impressions,
        clicks: totalMetrics.clicks,
        spend: Math.round(totalMetrics.spend * 100) / 100, // Round to 2 decimals
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        conversions: totalMetrics.conversions,
        likes: totalMetrics.likes,
        comments: totalMetrics.comments,
        shares: totalMetrics.shares,
      },
      campaigns: allCampaigns,
      dateRange: getDateRangeString(),
    };
  } catch (error) {
    console.error('[LinkedIn Ads] Error fetching data:', error);

    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('401')) {
      console.error('[LinkedIn Ads] Access token may be expired - needs refresh');
    }

    return null;
  }
}

/**
 * Helper to get formatted date range string
 */
function getDateRangeString(): string {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
}
