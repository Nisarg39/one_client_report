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
    metrics: {
      impressions: number;
      clicks: number;
      spend: number;
    };
  }>;
  dateRange: string;
  apiResponse?: any; // The whole API response for debugging
}

/**
 * Helper to map LinkedIn API element to our internal metrics structure
 */
function mapMetrics(target: any, source: any) {
  if (!source) return;
  target.impressions = source.impressions || 0;
  target.clicks = source.clicks || 0;
  target.spend = parseFloat(source.costInLocalCurrency || '0');
  target.totalEngagements = source.totalEngagements || 0;
  target.likes = source.likes || 0;
  target.comments = source.comments || 0;
  target.shares = source.shares || 0;
  target.follows = source.follows || 0;
  target.conversions = source.externalWebsiteConversions || 0;
  target.postClickConversions = source.externalWebsitePostClickConversions || 0;
  target.postViewConversions = source.externalWebsitePostViewConversions || 0;
  target.landingPageClicks = source.landingPageClicks || 0;
  target.leads = source.oneClickLeads || 0;
  target.qualifiedLeads = source.qualifiedLeads || 0;
  target.leadFormOpens = source.oneClickLeadFormOpens || 0;
  target.videoStarts = source.videoStarts || 0;
  target.videoViews = source.videoViews || 0;
  target.videoCompletions = source.videoCompletions || 0;
  target.uniqueMembers = source.approximateMemberReach || 0;
  target.averageDwellTime = source.averageDwellTime || 0;
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
  endDate?: string,
  selectedCampaignId?: string
): Promise<LinkedInAdsData | null> {
  // DEBUG LOGGING
  console.log(`[LinkedIn Data] fetchLinkedInAdsData called for aggregate data.`);

  try {
    // Calculate date range string at the start for use in early returns
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const defaultEndDate = new Date();
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const start = startDate || formatDate(defaultStartDate);
    const end = endDate || formatDate(defaultEndDate);
    const dateRangeString = `${start} to ${end}`;

    // Convert to LinkedIn's date format
    const dateRange = {
      start: convertToLinkedInDate(start),
      end: convertToLinkedInDate(end),
    };

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
    } catch (accountError: any) {
      console.error('[LinkedIn Ads] Failed to list ad accounts:', accountError.message);
      return null;
    }

    if (accounts.length === 0) {
      console.log('[LinkedIn Ads] No ad accounts found for this connection.');
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
    let fullApiResponse: any = { accountAnalytics: [], campaignAnalytics: [] };

    // Fetch data for each account (limit to first 3 to avoid rate limits)
    const accountsToFetch = accounts.slice(0, 3);

    for (const account of accountsToFetch) {
      try {
        // Get account-level analytics
        const accountUrn = `urn:li:sponsoredAccount:${account.id}`;

        // Define analytics fields (LinkedIn allows max 20 metrics per request)
        const fields = [
          'pivotValues',
          'impressions',
          'clicks',
          'costInLocalCurrency',
          'totalEngagements',
          'likes',
          'comments',
          'shares',
          'follows',
          'externalWebsiteConversions',
          'externalWebsitePostClickConversions',
          'externalWebsitePostViewConversions',
          'landingPageClicks',
          'oneClickLeads',
          'qualifiedLeads',
          'oneClickLeadFormOpens',
          'videoStarts',
          'videoViews',
          'videoCompletions',
          'approximateMemberReach',
        ];

        // 1. Get account-level insights
        const analyticsResponse = await client.getAnalytics({
          accounts: [accountUrn],
          dateRange,
          timeGranularity: 'ALL',
          pivot: 'ACCOUNT',
          fields,
        });

        fullApiResponse.accountAnalytics.push({ accountId: account.id, data: analyticsResponse });

        if (analyticsResponse.elements && analyticsResponse.elements.length > 0) {
          for (const element of analyticsResponse.elements) {
            totalMetrics.impressions += element.impressions || 0;
            totalMetrics.clicks += element.clicks || 0;
            totalMetrics.spend += Number(element.costInLocalCurrency || 0);
            totalMetrics.totalEngagements += element.totalEngagements || 0;
            totalMetrics.likes += element.likes || 0;
            totalMetrics.comments += element.comments || 0;
            totalMetrics.shares += element.shares || 0;
            totalMetrics.follows += element.follows || 0;
            totalMetrics.conversions += element.externalWebsiteConversions || 0;
            totalMetrics.postClickConversions += element.externalWebsitePostClickConversions || 0;
            totalMetrics.postViewConversions += element.externalWebsitePostViewConversions || 0;
            totalMetrics.landingPageClicks += element.landingPageClicks || 0;
            totalMetrics.leads += element.oneClickLeads || 0;
            totalMetrics.qualifiedLeads += element.qualifiedLeads || 0;
            totalMetrics.leadFormOpens += element.oneClickLeadFormOpens || 0;
            totalMetrics.videoStarts += element.videoStarts || 0;
            totalMetrics.videoViews += element.videoViews || 0;
            totalMetrics.videoCompletions += element.videoCompletions || 0;
            totalMetrics.uniqueMembers += element.approximateMemberReach || 0;
            totalMetrics.averageDwellTime += element.averageDwellTime || 0;
          }
        }

        // 2. Fetch campaigns AND campaign groups for this account to populate the list
        try {
          const [campaigns, campaignGroups] = await Promise.all([
            client.getCampaigns(account.id),
            client.getCampaignGroups(account.id)
          ]);

          if (campaigns.length > 0 || campaignGroups.length > 0) {
            const [campaignAnalytics, groupAnalytics] = await Promise.all([
              campaigns.length > 0 ? client.getAnalytics({
                accounts: [accountUrn],
                dateRange,
                timeGranularity: 'ALL',
                pivot: 'CAMPAIGN',
                fields: ['pivotValues', 'impressions', 'clicks', 'costInLocalCurrency'],
              }) : Promise.resolve({ elements: [] }),
              campaignGroups.length > 0 ? client.getAnalytics({
                accounts: [accountUrn],
                dateRange,
                timeGranularity: 'ALL',
                pivot: 'CAMPAIGN_GROUP',
                fields: ['pivotValues', 'impressions', 'clicks', 'costInLocalCurrency'],
              }) : Promise.resolve({ elements: [] })
            ]);

            fullApiResponse.campaignAnalytics.push({
              accountId: account.id,
              campaigns: campaignAnalytics,
              groups: groupAnalytics
            });

            const metricsMap = new Map<string, any>();

            campaignAnalytics.elements?.forEach(element => {
              const pivotUrn = element.pivotValues?.length === 1 ? element.pivotValues[0] : element.pivotValue;
              if (pivotUrn && pivotUrn.includes(':sponsoredCampaign:')) {
                metricsMap.set(pivotUrn, element);
              }
            });

            groupAnalytics.elements?.forEach(element => {
              const pivotUrn = element.pivotValues?.length === 1 ? element.pivotValues[0] : element.pivotValue;
              if (pivotUrn && pivotUrn.toString().indexOf('sponsoredCampaignGroup') !== -1) {
                metricsMap.set(pivotUrn, element);
              }
            });

            // Add Campaign Groups to result
            for (const group of campaignGroups) {
              const groupUrn = `urn:li:sponsoredCampaignGroup:${group.id}`;
              const metrics = metricsMap.get(groupUrn) || {};
              allCampaigns.push({
                id: groupUrn,
                name: group.name,
                status: group.status,
                type: 'CAMPAIGN_GROUP',
                metrics: {
                  impressions: metrics.impressions || 0,
                  clicks: metrics.clicks || 0,
                  spend: Number(metrics.costInLocalCurrency || 0),
                }
              });
            }

            // Add Individual Campaigns to result
            if (selectedCampaignId) {
              console.log(`[LinkedIn UI] Filtering for Campaign ID: ${selectedCampaignId}`);
              const selectedCampaign = campaigns.find((c: any) => String(c.id) === String(selectedCampaignId));

              if (selectedCampaign) {
                console.log(`[LinkedIn UI] Found Campaign: ${selectedCampaign.name}`);
              } else {
                console.warn(`[LinkedIn UI] Campaign NOT found in list! Available IDs:`, campaigns.map((c: any) => c.id));
              }
            }

            for (const campaign of campaigns) {
              const campaignUrn = `urn:li:sponsoredCampaign:${campaign.id}`;
              const metrics = metricsMap.get(campaignUrn) || {};
              allCampaigns.push({
                id: campaignUrn,
                name: campaign.name,
                status: campaign.status,
                type: 'CAMPAIGN',
                metrics: {
                  impressions: metrics.impressions || 0,
                  clicks: metrics.clicks || 0,
                  spend: Number(metrics.costInLocalCurrency || 0),
                }
              });
            }
          }
        } catch (campaignError: any) {
          console.error(`[LinkedIn Ads] Error fetching campaigns for account ${account.id}:`, campaignError.message);
        }
      } catch (analyticsError: any) {
        console.error(`[LinkedIn Ads] Error fetching analytics for account ${account.id}:`, analyticsError.message);
      }
    }

    // Calculate derived metrics
    const ctr = totalMetrics.impressions > 0 ? (totalMetrics.clicks / totalMetrics.impressions) * 100 : 0;
    const cpc = totalMetrics.clicks > 0 ? totalMetrics.spend / totalMetrics.clicks : 0;
    const engagementRate = totalMetrics.impressions > 0 ? (totalMetrics.totalEngagements / totalMetrics.impressions) * 100 : 0;
    const costPerEngagement = totalMetrics.totalEngagements > 0 ? totalMetrics.spend / totalMetrics.totalEngagements : 0;
    const costPerConversion = totalMetrics.conversions > 0 ? totalMetrics.spend / totalMetrics.conversions : 0;
    const leadQualityRate = totalMetrics.leads > 0 ? (totalMetrics.qualifiedLeads / totalMetrics.leads) * 100 : 0;
    const costPerLead = totalMetrics.leads > 0 ? totalMetrics.spend / totalMetrics.leads : 0;
    const videoCompletionRate = totalMetrics.videoStarts > 0 ? (totalMetrics.videoCompletions / totalMetrics.videoStarts) * 100 : 0;

    // Determine primary currency
    const primaryCurrency = accounts.find(acc => acc.status === 'ACTIVE')?.currency || accounts[0]?.currency || 'USD';

    // Determine if video or reach data exists
    const hasVideoData = totalMetrics.videoStarts > 0 || totalMetrics.videoViews > 0 || totalMetrics.videoCompletions > 0;
    const hasReachData = totalMetrics.uniqueMembers > 0 || totalMetrics.averageDwellTime > 0;

    const result: LinkedInAdsData = {
      accounts: accounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        status: acc.status,
        currency: acc.currency,
      })),
      metrics: {
        impressions: totalMetrics.impressions,
        clicks: totalMetrics.clicks,
        ctr: Math.round(ctr * 100) / 100,
        spend: Math.round(totalMetrics.spend * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        currency: primaryCurrency,
        engagement: {
          likes: totalMetrics.likes,
          comments: totalMetrics.comments,
          shares: totalMetrics.shares,
          totalEngagements: totalMetrics.totalEngagements,
          reactions: totalMetrics.reactions || 0,
          follows: totalMetrics.follows,
          companyPageClicks: totalMetrics.companyPageClicks || 0,
          otherEngagements: totalMetrics.otherEngagements || 0,
          engagementRate: Math.round(engagementRate * 100) / 100,
          costPerEngagement: Math.round(costPerEngagement * 100) / 100,
        },
        conversions: {
          total: totalMetrics.conversions,
          postClick: totalMetrics.postClickConversions,
          postView: totalMetrics.postViewConversions,
          landingPageClicks: totalMetrics.landingPageClicks,
          costPerConversion: Math.round(costPerConversion * 100) / 100,
        },
        leads: {
          total: totalMetrics.leads,
          qualified: totalMetrics.qualifiedLeads,
          formOpens: totalMetrics.leadFormOpens,
          qualityRate: Math.round(leadQualityRate * 100) / 100,
          costPerLead: Math.round(costPerLead * 100) / 100,
        },
        ...(hasVideoData && {
          video: {
            starts: totalMetrics.videoStarts,
            views: totalMetrics.videoViews,
            completions: totalMetrics.videoCompletions,
            completionRate: Math.round(videoCompletionRate * 100) / 100,
          },
        }),
        ...(hasReachData && {
          reach: {
            uniqueMembers: totalMetrics.uniqueMembers,
            averageDwellTime: Math.round(totalMetrics.averageDwellTime * 100) / 100,
          },
        }),
      },
      campaigns: allCampaigns,
      dateRange: dateRangeString,
      apiResponse: fullApiResponse,
    };

    console.log(`[LinkedIn Data] Aggregate Fetch Complete. Total Campaigns: ${allCampaigns.length}, Total Spend: ${result.metrics.spend}`);
    // Log first few campaign IDs for debugging
    if (allCampaigns.length > 0) {
      console.log(`[LinkedIn Data] Sample Campaign IDs:`, allCampaigns.slice(0, 3).map(c => c.id));
    }
    return result;
  } catch (error) {
    console.error('[LinkedIn Ads] Critical error fetching data:', error);
    return null;
  }
}
