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
    // New metrics
    inline_link_clicks: number;
    video_p25_watched_actions: number;
    video_p50_watched_actions: number;
    video_p100_watched_actions: number;
    purchases: number;
    leads: number;
    cost_per_purchase: number;
    cost_per_lead: number;
    roas: number;
    // Enhanced conversion metrics
    registrations: number;
    add_to_carts: number;
    checkouts: number;
    content_views: number;
    cost_per_registration: number;
    cost_per_add_to_cart: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    objective: string;
    metrics: {
      impressions: number;
      reach: number;
      clicks: number;
      spend: number;
      ctr: number;
      cpc: number;
      cpm: number;
      frequency: number;
      inline_link_clicks: number;
      purchases: number;
      leads: number;
      cost_per_purchase: number;
      cost_per_lead: number;
      roas: number;
      registrations: number;
      add_to_carts: number;
      checkouts: number;
      content_views: number;
    };
  }>;
  // Breakdowns
  demographics: Array<{
    age: string;
    gender: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  geography: Array<{
    country: string;
    region: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  devices: Array<{
    device_platform: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  publisher_platforms: Array<{
    publisher_platform: string;
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
  endDate?: string,
  selectedMetaCampaignId?: string
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
          inline_link_clicks: 0,
          video_p25_watched_actions: 0,
          video_p50_watched_actions: 0,
          video_p100_watched_actions: 0,
          purchases: 0,
          leads: 0,
          cost_per_purchase: 0,
          cost_per_lead: 0,
          roas: 0,
          registrations: 0,
          add_to_carts: 0,
          checkouts: 0,
          content_views: 0,
          cost_per_registration: 0,
          cost_per_add_to_cart: 0,
        },
        campaigns: [],
        demographics: [],
        geography: [],
        devices: [],
        publisher_platforms: [],
        dateRange: dateRangeString,
      };
    }

    // Aggregate metrics from all accounts
    let totalMetrics = {
      impressions: 0,
      reach: 0,
      clicks: 0,
      spend: 0,
      inline_link_clicks: 0,
      video_p25: 0,
      video_p50: 0,
      video_p100: 0,
      purchases: 0,
      leads: 0,
      purchase_value: 0,
      registrations: 0,
      add_to_carts: 0,
      checkouts: 0,
      content_views: 0,
    };

    const allCampaigns: MetaAdsData['campaigns'] = [];

    // Fetch data for each account (limit to first 10 to avoid rate limits)
    const accountsToFetch = accounts.slice(0, 10);

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
            'inline_link_clicks',
            'video_p25_watched_actions',
            'video_p50_watched_actions',
            'video_p100_watched_actions',
            'actions',
            'action_values',
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
            totalMetrics.inline_link_clicks += parseInt(row.inline_link_clicks || '0', 10);

            // Handle video views (list of actions)
            if (row.video_p25_watched_actions) {
              const p25 = row.video_p25_watched_actions.find((a: any) => a.action_type === 'video_view');
              totalMetrics.video_p25 += parseInt(p25?.value || '0', 10);
            }
            if (row.video_p50_watched_actions) {
              const p50 = row.video_p50_watched_actions.find((a: any) => a.action_type === 'video_view');
              totalMetrics.video_p50 += parseInt(p50?.value || '0', 10);
            }
            if (row.video_p100_watched_actions) {
              const p100 = row.video_p100_watched_actions.find((a: any) => a.action_type === 'video_view');
              totalMetrics.video_p100 += parseInt(p100?.value || '0', 10);
            }

            // Handle conversions from actions - Enhanced tracking
            if (row.actions) {
              row.actions.forEach((action: any) => {
                const value = parseInt(action.value || '0', 10);
                switch (action.action_type) {
                  case 'purchase':
                    totalMetrics.purchases += value;
                    break;
                  case 'lead':
                    totalMetrics.leads += value;
                    break;
                  case 'complete_registration':
                    totalMetrics.registrations += value;
                    break;
                  case 'add_to_cart':
                    totalMetrics.add_to_carts += value;
                    break;
                  case 'initiate_checkout':
                    totalMetrics.checkouts += value;
                    break;
                  case 'view_content':
                    totalMetrics.content_views += value;
                    break;
                }
              });
            }

            // Handle purchase value for ROAS
            if (row.action_values) {
              const purchaseValue = row.action_values.find((a: any) => a.action_type === 'purchase');
              totalMetrics.purchase_value += parseFloat(purchaseValue?.value || '0');
            }
          }
        }

        // Get campaigns for this account
        try {
          const campaigns = await client.getCampaigns(account.id);

          // Get campaign-level insights
          if (campaigns.length > 0) {
            const campaignInsightsParams: any = {
              adAccountId: account.id,
              fields: [
                'campaign_id',
                'campaign_name',
                'impressions',
                'reach',
                'clicks',
                'spend',
                'ctr',
                'cpc',
                'cpm',
                'frequency',
                'inline_link_clicks',
                'actions',
                'action_values',
              ],
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

            // Priority: 1. Passed selectedMetaCampaignId, 2. Metadata metaCampaignId (if any)
            const activeCampId = selectedMetaCampaignId || connection.metadata?.metaCampaignId;

            // Add campaign data with metrics
            let campaignsToProcess = campaigns.slice(0, 25);

            // Ensure selected campaign is included
            if (activeCampId && !campaignsToProcess.find(c => c.id === activeCampId)) {
              const selectedCamp = campaigns.find(c => c.id === activeCampId);
              if (selectedCamp) {
                campaignsToProcess.push(selectedCamp);
              }
            }

            for (const campaign of campaignsToProcess) {
              const metrics = campaignMetricsMap.get(campaign.id) || {};

              // Extract campaign actions
              let campPurchases = 0;
              let campLeads = 0;
              let campRegs = 0;
              let campATC = 0;
              let campCheckouts = 0;
              let campContentViews = 0;
              let campPurchaseValue = 0;

              if (metrics.actions) {
                metrics.actions.forEach((a: any) => {
                  const val = parseInt(a.value || '0', 10);
                  switch (a.action_type) {
                    case 'purchase': campPurchases += val; break;
                    case 'lead': campLeads += val; break;
                    case 'complete_registration': campRegs += val; break;
                    case 'add_to_cart': campATC += val; break;
                    case 'initiate_checkout': campCheckouts += val; break;
                    case 'view_content': campContentViews += val; break;
                  }
                });
              }

              if (metrics.action_values) {
                const pVal = metrics.action_values.find((a: any) => a.action_type === 'purchase');
                campPurchaseValue = parseFloat(pVal?.value || '0');
              }

              const campSpend = parseFloat(metrics.spend || '0');

              allCampaigns.push({
                id: campaign.id,
                name: campaign.name,
                status: campaign.effective_status || campaign.status,
                objective: campaign.objective || 'N/A',
                metrics: {
                  impressions: parseInt(metrics.impressions || '0', 10),
                  reach: parseInt(metrics.reach || '0', 10),
                  clicks: parseInt(metrics.clicks || '0', 10),
                  spend: campSpend,
                  ctr: parseFloat(metrics.ctr || '0'),
                  cpc: parseFloat(metrics.cpc || '0'),
                  cpm: parseFloat(metrics.cpm || '0'),
                  frequency: parseFloat(metrics.frequency || '0'),
                  inline_link_clicks: parseInt(metrics.inline_link_clicks || '0', 10),
                  purchases: campPurchases,
                  leads: campLeads,
                  cost_per_purchase: campPurchases > 0 ? campSpend / campPurchases : 0,
                  cost_per_lead: campLeads > 0 ? campSpend / campLeads : 0,
                  roas: campSpend > 0 ? campPurchaseValue / campSpend : 0,
                  registrations: campRegs,
                  add_to_carts: campATC,
                  checkouts: campCheckouts,
                  content_views: campContentViews,
                },
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

    // Prepare promises for parallel fetching of breakdowns
    // We fetch these at the account level for the first account to avoid excessive API calls
    const mainAccount = accounts[0]; // Use primary account for breakdowns

    let demographics: MetaAdsData['demographics'] = [];
    let geography: MetaAdsData['geography'] = [];
    let devices: MetaAdsData['devices'] = [];
    let publisher_platforms: MetaAdsData['publisher_platforms'] = [];

    if (mainAccount) {
      const baseParams = {
        adAccountId: mainAccount.id,
        fields: ['impressions', 'clicks', 'spend'],
        level: 'account' as const,
        datePreset: (startDate && endDate) ? undefined : ('last_30d' as const),
        time_range: (startDate && endDate) ? { since: start, until: end } : undefined,
      };

      try {
        const [demoData, geoData, deviceData, platformData] = await Promise.all([
          client.getInsights({ ...baseParams, breakdowns: ['age', 'gender'] }),
          client.getInsights({ ...baseParams, breakdowns: ['country', 'region'] }),
          client.getInsights({ ...baseParams, breakdowns: ['device_platform'] }),
          client.getInsights({ ...baseParams, breakdowns: ['publisher_platform'] }),
        ]);

        // Process Demographics
        if (demoData.data) {
          demographics = demoData.data.map((row: any) => ({
            age: row.age || 'Unknown',
            gender: row.gender || 'Unknown',
            impressions: parseInt(row.impressions || '0', 10),
            clicks: parseInt(row.clicks || '0', 10),
            spend: parseFloat(row.spend || '0'),
          }));
        }

        // Process Geography
        if (geoData.data) {
          geography = geoData.data.map((row: any) => ({
            country: row.country || 'Unknown',
            region: row.region || 'Unknown',
            impressions: parseInt(row.impressions || '0', 10),
            clicks: parseInt(row.clicks || '0', 10),
            spend: parseFloat(row.spend || '0'),
          }));
        }

        // Process Devices
        if (deviceData.data) {
          devices = deviceData.data.map((row: any) => ({
            device_platform: row.device_platform || 'Unknown',
            impressions: parseInt(row.impressions || '0', 10),
            clicks: parseInt(row.clicks || '0', 10),
            spend: parseFloat(row.spend || '0'),
          }));
        }

        // Process Publisher Platforms
        if (platformData.data) {
          publisher_platforms = platformData.data.map((row: any) => ({
            publisher_platform: row.publisher_platform || 'Unknown',
            impressions: parseInt(row.impressions || '0', 10),
            clicks: parseInt(row.clicks || '0', 10),
            spend: parseFloat(row.spend || '0'),
          }));
        }

      } catch (breakdownError) {
        console.error('[Meta Ads] Error fetching breakdowns:', breakdownError);
        // Continue without breakdowns if they fail
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
        spend: Math.round(totalMetrics.spend * 100) / 100,
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        cpm: Math.round(cpm * 100) / 100,
        frequency: Math.round(frequency * 100) / 100,
        inline_link_clicks: totalMetrics.inline_link_clicks,
        video_p25_watched_actions: totalMetrics.video_p25,
        video_p50_watched_actions: totalMetrics.video_p50,
        video_p100_watched_actions: totalMetrics.video_p100,
        purchases: totalMetrics.purchases,
        leads: totalMetrics.leads,
        cost_per_purchase: totalMetrics.purchases > 0 ? Math.round((totalMetrics.spend / totalMetrics.purchases) * 100) / 100 : 0,
        cost_per_lead: totalMetrics.leads > 0 ? Math.round((totalMetrics.spend / totalMetrics.leads) * 100) / 100 : 0,
        roas: totalMetrics.spend > 0 ? Math.round((totalMetrics.purchase_value / totalMetrics.spend) * 100) / 100 : 0,
        registrations: totalMetrics.registrations,
        add_to_carts: totalMetrics.add_to_carts,
        checkouts: totalMetrics.checkouts,
        content_views: totalMetrics.content_views,
        cost_per_registration: totalMetrics.registrations > 0 ? Math.round((totalMetrics.spend / totalMetrics.registrations) * 100) / 100 : 0,
        cost_per_add_to_cart: totalMetrics.add_to_carts > 0 ? Math.round((totalMetrics.spend / totalMetrics.add_to_carts) * 100) / 100 : 0,
      },
      campaigns: allCampaigns,
      demographics,
      geography,
      devices,
      publisher_platforms,
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
