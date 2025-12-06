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
    // Core Traffic Metrics
    impressions: number;
    clicks: number;
    ctr: number; // Calculated: (clicks / impressions) * 100

    // Core Cost Metrics
    spend: number;
    cpc: number; // Calculated: spend / clicks
    currency: string; // Currency code (e.g., "INR", "USD")

    // Engagement Metrics (grouped)
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      totalEngagements: number;
      reactions: number;
      follows: number;
      companyPageClicks: number;
      otherEngagements: number;
      engagementRate: number; // Calculated: (totalEngagements / impressions) * 100
      costPerEngagement: number; // Calculated: spend / totalEngagements
    };

    // Conversion Metrics (grouped)
    conversions: {
      total: number; // externalWebsiteConversions
      postClick: number; // externalWebsitePostClickConversions
      postView: number; // externalWebsitePostViewConversions
      landingPageClicks: number;
      costPerConversion: number; // Calculated: spend / total
    };

    // Lead Generation Metrics (grouped)
    leads: {
      total: number; // oneClickLeads
      qualified: number; // qualifiedLeads
      formOpens: number; // oneClickLeadFormOpens
      qualityRate: number; // Calculated: (qualified / total) * 100
      costPerLead: number; // Calculated: spend / total
    };

    // Video Metrics (grouped, optional)
    video?: {
      starts: number;
      views: number;
      completions: number;
      completionRate: number; // Calculated: (completions / starts) * 100
    };

    // Reach Metrics (grouped, optional)
    reach?: {
      uniqueMembers: number; // approximateMemberReach
      averageDwellTime: number; // in seconds
    };
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
 * Helper to convert ISO 8601 date string to LinkedIn's date format
 */
function convertToLinkedInDate(isoDateString: string): { year: number; month: number; day: number } {
  const date = new Date(isoDateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // LinkedIn uses 1-indexed months
    day: date.getDate(),
  };
}

/**
 * Fetch LinkedIn Ads data for AI context
 *
 * @param connection - Platform connection with decrypted tokens
 * @param startDate - Optional start date in ISO 8601 format (YYYY-MM-DD)
 * @param endDate - Optional end date in ISO 8601 format (YYYY-MM-DD)
 * @returns Formatted LinkedIn Ads data for AI
 */
export async function fetchLinkedInAdsData(
  connection: IPlatformConnection,
  startDate?: string,
  endDate?: string
): Promise<LinkedInAdsData | null> {
  const logPrefix = '[LinkedIn Ads Debug]';
  console.log(`${logPrefix} ========== START ==========`);
  console.log(`${logPrefix} Connection ID:`, connection._id);
  console.log(`${logPrefix} Connection Status:`, connection.status);
  console.log(`${logPrefix} Connection Platform:`, connection.platformId);
  console.log(`${logPrefix} Scopes:`, connection.scopes);
  console.log(`${logPrefix} Expires At:`, connection.expiresAt);
  console.log(`${logPrefix} Is Expired:`, connection.isExpired());

  try {
    // Calculate date range string at the start for use in early returns
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const defaultEndDate = new Date();
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const start = startDate || formatDate(defaultStartDate);
    const end = endDate || formatDate(defaultEndDate);
    const dateRangeString = `${start} to ${end}`;
    console.log(`${logPrefix} Date Range:`, dateRangeString);

    // Convert to LinkedIn's date format
    const dateRange = {
      start: convertToLinkedInDate(start),
      end: convertToLinkedInDate(end),
    };

    // Get the access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error(`${logPrefix} No access token available`);
      return null;
    }
    console.log(`${logPrefix} Access token retrieved (length: ${accessToken.length})`);

    // Create client
    const client = new LinkedInAdsClient(accessToken);

    // Get all ad accounts
    console.log(`${logPrefix} Attempting to list ad accounts...`);
    let accounts: LinkedInAdAccount[] = [];
    try {
      accounts = await client.listAdAccounts();
      console.log(`${logPrefix} Ad accounts response:`, {
        count: accounts.length,
        accounts: accounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          status: acc.status,
          type: acc.type,
        }))
      });
    } catch (accountError: any) {
      console.error(`${logPrefix} FAILED to list ad accounts:`, {
        message: accountError.message,
        status: accountError.status,
        stack: accountError.stack,
      });
      return null;
    }

    if (accounts.length === 0) {
      console.warn(`${logPrefix} No ad accounts found. Possible reasons:`);
      console.warn('  1. No ad accounts created in LinkedIn Campaign Manager');
      console.warn('  2. User lacks ad account access permissions');
      console.warn('  3. OAuth scopes not properly granted');
      console.warn('  4. API version incompatibility');

      return {
        accounts: [],
        metrics: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          spend: 0,
          cpc: 0,
          currency: 'USD',
          engagement: {
            likes: 0,
            comments: 0,
            shares: 0,
            totalEngagements: 0,
            reactions: 0,
            follows: 0,
            companyPageClicks: 0,
            otherEngagements: 0,
            engagementRate: 0,
            costPerEngagement: 0,
          },
          conversions: {
            total: 0,
            postClick: 0,
            postView: 0,
            landingPageClicks: 0,
            costPerConversion: 0,
          },
          leads: {
            total: 0,
            qualified: 0,
            formOpens: 0,
            qualityRate: 0,
            costPerLead: 0,
          },
        },
        campaigns: [],
        dateRange: dateRangeString,
      };
    }

    // Aggregate metrics from all accounts
    let totalMetrics = {
      impressions: 0,
      clicks: 0,
      spend: 0,
      // Engagement
      likes: 0,
      comments: 0,
      shares: 0,
      totalEngagements: 0,
      reactions: 0,
      follows: 0,
      companyPageClicks: 0,
      otherEngagements: 0,
      // Conversions
      conversions: 0,
      postClickConversions: 0,
      postViewConversions: 0,
      landingPageClicks: 0,
      // Leads
      leads: 0,
      qualifiedLeads: 0,
      leadFormOpens: 0,
      // Video
      videoStarts: 0,
      videoViews: 0,
      videoCompletions: 0,
      // Reach
      uniqueMembers: 0,
      averageDwellTime: 0,
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
            // Core metrics (3)
            'impressions',
            'clicks',
            'costInLocalCurrency',
            // Engagement metrics (5)
            'totalEngagements',
            'likes',
            'comments',
            'shares',
            'follows',
            // Conversion metrics (4)
            'externalWebsiteConversions',
            'externalWebsitePostClickConversions',
            'externalWebsitePostViewConversions',
            'landingPageClicks',
            // Lead metrics (3)
            'oneClickLeads',
            'qualifiedLeads',
            'oneClickLeadFormOpens',
            // Video metrics (3)
            'videoStarts',
            'videoViews',
            'videoCompletions',
            // Reach metrics (2)
            'approximateMemberReach',
            'averageDwellTime',
            // Total: 20 fields (respects LinkedIn's 20-metric limit)
          ],
        });

        // Sum up metrics from response
        if (analyticsResponse.elements && analyticsResponse.elements.length > 0) {
          for (const element of analyticsResponse.elements) {
            // Core metrics
            totalMetrics.impressions += element.impressions || 0;
            totalMetrics.clicks += element.clicks || 0;
            totalMetrics.spend += element.costInLocalCurrency || 0;
            // Engagement metrics
            totalMetrics.totalEngagements += element.totalEngagements || 0;
            totalMetrics.likes += element.likes || 0;
            totalMetrics.comments += element.comments || 0;
            totalMetrics.shares += element.shares || 0;
            totalMetrics.follows += element.follows || 0;
            // Conversion metrics
            totalMetrics.conversions += element.externalWebsiteConversions || 0;
            totalMetrics.postClickConversions += element.externalWebsitePostClickConversions || 0;
            totalMetrics.postViewConversions += element.externalWebsitePostViewConversions || 0;
            totalMetrics.landingPageClicks += element.landingPageClicks || 0;
            // Lead metrics
            totalMetrics.leads += element.oneClickLeads || 0;
            totalMetrics.qualifiedLeads += element.qualifiedLeads || 0;
            totalMetrics.leadFormOpens += element.oneClickLeadFormOpens || 0;
            // Video metrics
            totalMetrics.videoStarts += element.videoStarts || 0;
            totalMetrics.videoViews += element.videoViews || 0;
            totalMetrics.videoCompletions += element.videoCompletions || 0;
            // Reach metrics
            totalMetrics.uniqueMembers += element.approximateMemberReach || 0;
            totalMetrics.averageDwellTime += element.averageDwellTime || 0;
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
          // Log campaign fetch errors but continue
          console.error(`${logPrefix} Campaign fetch error for account ${account.id}:`, {
            message: campaignError.message,
            stack: campaignError.stack,
          });
        }
      } catch (analyticsError: any) {
        // Log analytics errors but continue
        console.error(`${logPrefix} Analytics fetch error for account ${account.id}:`, {
          message: analyticsError.message,
          stack: analyticsError.stack,
        });
      }
    }

    // Calculate derived metrics
    const ctr = totalMetrics.impressions > 0
      ? (totalMetrics.clicks / totalMetrics.impressions) * 100
      : 0;
    const cpc = totalMetrics.clicks > 0
      ? totalMetrics.spend / totalMetrics.clicks
      : 0;

    // Calculate engagement metrics
    const engagementRate = totalMetrics.impressions > 0
      ? (totalMetrics.totalEngagements / totalMetrics.impressions) * 100
      : 0;
    const costPerEngagement = totalMetrics.totalEngagements > 0
      ? totalMetrics.spend / totalMetrics.totalEngagements
      : 0;

    // Calculate conversion metrics
    const costPerConversion = totalMetrics.conversions > 0
      ? totalMetrics.spend / totalMetrics.conversions
      : 0;

    // Calculate lead metrics
    const leadQualityRate = totalMetrics.leads > 0
      ? (totalMetrics.qualifiedLeads / totalMetrics.leads) * 100
      : 0;
    const costPerLead = totalMetrics.leads > 0
      ? totalMetrics.spend / totalMetrics.leads
      : 0;

    // Calculate video metrics
    const videoCompletionRate = totalMetrics.videoStarts > 0
      ? (totalMetrics.videoCompletions / totalMetrics.videoStarts) * 100
      : 0;

    // Determine primary currency (use first active account's currency, or first account)
    const primaryCurrency = accounts.find(acc => acc.status === 'ACTIVE')?.currency || accounts[0]?.currency || 'USD';
    console.log(`${logPrefix} Using primary currency: ${primaryCurrency}`);

    // Determine if video or reach data exists
    const hasVideoData = totalMetrics.videoStarts > 0 || totalMetrics.videoViews > 0 || totalMetrics.videoCompletions > 0;
    const hasReachData = totalMetrics.uniqueMembers > 0 || totalMetrics.averageDwellTime > 0;

    return {
      accounts: accounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        status: acc.status,
        currency: acc.currency,
      })),
      metrics: {
        // Core metrics
        impressions: totalMetrics.impressions,
        clicks: totalMetrics.clicks,
        ctr: Math.round(ctr * 100) / 100,
        spend: Math.round(totalMetrics.spend * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        currency: primaryCurrency,

        // Engagement metrics
        engagement: {
          likes: totalMetrics.likes,
          comments: totalMetrics.comments,
          shares: totalMetrics.shares,
          totalEngagements: totalMetrics.totalEngagements,
          reactions: 0, // Not available in 20-metric limit, will be 0
          follows: totalMetrics.follows,
          companyPageClicks: 0, // Not available in 20-metric limit, will be 0
          otherEngagements: 0, // Not available in 20-metric limit, will be 0
          engagementRate: Math.round(engagementRate * 100) / 100,
          costPerEngagement: Math.round(costPerEngagement * 100) / 100,
        },

        // Conversion metrics
        conversions: {
          total: totalMetrics.conversions,
          postClick: totalMetrics.postClickConversions,
          postView: totalMetrics.postViewConversions,
          landingPageClicks: totalMetrics.landingPageClicks,
          costPerConversion: Math.round(costPerConversion * 100) / 100,
        },

        // Lead metrics
        leads: {
          total: totalMetrics.leads,
          qualified: totalMetrics.qualifiedLeads,
          formOpens: totalMetrics.leadFormOpens,
          qualityRate: Math.round(leadQualityRate * 100) / 100,
          costPerLead: Math.round(costPerLead * 100) / 100,
        },

        // Video metrics (optional)
        ...(hasVideoData && {
          video: {
            starts: totalMetrics.videoStarts,
            views: totalMetrics.videoViews,
            completions: totalMetrics.videoCompletions,
            completionRate: Math.round(videoCompletionRate * 100) / 100,
          },
        }),

        // Reach metrics (optional)
        ...(hasReachData && {
          reach: {
            uniqueMembers: totalMetrics.uniqueMembers,
            averageDwellTime: Math.round(totalMetrics.averageDwellTime * 100) / 100,
          },
        }),
      },
      campaigns: allCampaigns,
      dateRange: dateRangeString,
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
