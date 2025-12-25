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
    spend: number;
    currency: string;
    conversions: number;
    conversionsValue: number;
    costPerConversion: number;
    conversionRate: number;
    viewThroughConversions: number;
    interactions: number;
    interactionRate: number;
    ctr: number;
    cpc: number;
    searchImpressionShare: number;
    searchAbsTopImpressionShare: number;
    searchBudgetLostImpressionShare: number;
    searchRankLostImpressionShare: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    conversionRate: number;
  }>;
  dateRange: string;
  developerTokenStatus: 'active' | 'pending' | 'missing';
  apiError?: string;
  apiResponse?: any[]; // The whole API response for debugging
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
  endDate?: string,
  selectedCampaignId?: string
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
        spend: 0,
        currency: 'USD',
        conversions: 0,
        conversionsValue: 0,
        costPerConversion: 0,
        conversionRate: 0,
        viewThroughConversions: 0,
        interactions: 0,
        interactionRate: 0,
        ctr: 0,
        cpc: 0,
        searchImpressionShare: 0,
        searchAbsTopImpressionShare: 0,
        searchBudgetLostImpressionShare: 0,
        searchRankLostImpressionShare: 0,
      },
      campaigns: [],
      dateRange: dateRangeString,
      developerTokenStatus: 'missing',
      apiError: 'Google Ads Developer Token is missing in .env.local',
    };
  }

  try {
    // Get the tokens - library prefers refresh_token for automatic rotation
    const refreshToken = connection.getDecryptedRefreshToken();
    const accessToken = connection.getDecryptedAccessToken();

    if (!refreshToken && !accessToken) {
      console.error('[Google Ads] No tokens available');
      return null;
    }

    // Create client - we use the refresh_token if available, otherwise fallback to access_token
    // Note: google-ads-api works best with refresh_token
    const client = new GoogleAdsClient(refreshToken || accessToken);

    // Get accessible customers
    let customerResourceNames: string[] = [];

    // If connection metadata already has a customerId, use it directly
    const savedCustomerId = connection.metadata?.customerId;
    if (savedCustomerId) {
      customerResourceNames = [`customers/${savedCustomerId}`];
      console.log(`[Google Ads] Using saved customer ID: ${savedCustomerId}`);
    } else {
      // Retry mechanism for listAccessibleCustomers (flaky gRPC connection)
      let retries = 3;
      while (retries > 0) {
        try {
          customerResourceNames = await client.listAccessibleCustomers();
          break; // Success
        } catch (customerError: any) {
          retries--;
          console.warn(`[Google Ads] listAccessibleCustomers failed (retries left: ${retries}):`, customerError.message);

          if (retries === 0) {
            console.error('[Google Ads] Failed to list customers after 3 attempts:', customerError.message);

            // Check if it's a pending developer token issue
            if (customerError.message.includes('DEVELOPER_TOKEN_NOT_APPROVED')) {
              return {
                customers: [],
                metrics: {
                  impressions: 0,
                  clicks: 0,
                  spend: 0,
                  conversions: 0,
                  conversionsValue: 0,
                  costPerConversion: 0,
                  conversionRate: 0,
                  viewThroughConversions: 0,
                  interactions: 0,
                  interactionRate: 0,
                  ctr: 0,
                  cpc: 0,
                  searchImpressionShare: 0,
                  searchAbsTopImpressionShare: 0,
                  searchBudgetLostImpressionShare: 0,
                  searchRankLostImpressionShare: 0,
                  currency: 'USD',
                },
                campaigns: [],
                dateRange: dateRangeString,
                developerTokenStatus: 'pending',
              };
            }

            // FALLBACK: If listing fails, try the specific test account ID from environment if provided
            const testId = process.env.GOOGLE_ADS_TEST_CUSTOMER_ID;
            if (testId) {
              console.log(`[Google Ads] Listing failed, falling back to test ID: ${testId}`);
              customerResourceNames = [`customers/${testId.replace(/-/g, '')}`];
            } else {
              // If no fallback, return the actual error
              return {
                customers: [],
                metrics: {
                  impressions: 0,
                  clicks: 0,
                  spend: 0,
                  conversions: 0,
                  conversionsValue: 0,
                  costPerConversion: 0,
                  conversionRate: 0,
                  viewThroughConversions: 0,
                  interactions: 0,
                  interactionRate: 0,
                  ctr: 0,
                  cpc: 0,
                  searchImpressionShare: 0,
                  searchAbsTopImpressionShare: 0,
                  searchBudgetLostImpressionShare: 0,
                  searchRankLostImpressionShare: 0,
                  currency: 'USD',
                },
                campaigns: [],
                dateRange: dateRangeString,
                developerTokenStatus: 'active',
                apiError: customerError.message,
              };
            }
          }

          // Wait 1s before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (customerResourceNames.length === 0) {
      const testId = process.env.GOOGLE_ADS_TEST_CUSTOMER_ID;
      if (testId) {
        customerResourceNames = [`customers/${testId.replace(/-/g, '')}`];
      } else {
        return {
          customers: [],
          metrics: {
            impressions: 0,
            clicks: 0,
            spend: 0,
            currency: 'USD',
            conversions: 0,
            conversionsValue: 0,
            costPerConversion: 0,
            conversionRate: 0,
            viewThroughConversions: 0,
            interactions: 0,
            interactionRate: 0,
            ctr: 0,
            cpc: 0,
            searchImpressionShare: 0,
            searchAbsTopImpressionShare: 0,
            searchBudgetLostImpressionShare: 0,
            searchRankLostImpressionShare: 0,
          },
          campaigns: [],
          dateRange: dateRangeString,
          developerTokenStatus: 'active',
          apiError: 'No accessible Google Ads accounts found. If you are using a Manager Account, please set GOOGLE_ADS_TEST_CUSTOMER_ID in .env.local to target a specific sub-account.',
        };
      }
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
      conversionsValue: 0,
      viewThroughConversions: 0,
      interactions: 0,
      searchImpressionShareSum: 0,
      searchAbsTopImpressionShareSum: 0,
      searchBudgetLostImpressionShareSum: 0,
      searchRankLostImpressionShareSum: 0,
      accountsWithImpressionShare: 0,
    };

    const allCustomers: GoogleAdsData['customers'] = [];
    const allCampaigns: GoogleAdsData['campaigns'] = [];
    let fullApiResponse: any[] = [];

    // Fetch data for each customer
    const customersToFetch = customerIds;
    let lastError: any = null;

    for (const customerId of customersToFetch) {
      try {
        // Adaptive logic: Try direct access first, then via manager if needed
        let customer: any = null;
        let usedLcid: string | null = null;

        try {
          // Strategy 1: Direct access (no login-customer-id)
          customer = await client.getCustomer(customerId, null);
          usedLcid = null;
        } catch (e: any) {
          // Strategy 2: Via manager (if configured)
          if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) {
            customer = await client.getCustomer(customerId, process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
            usedLcid = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
          } else {
            throw e; // Re-throw if no manager ID to try
          }
        }

        if (customer.manager) {
          console.log(`[Google Ads] Skipping manager account: ${customer.descriptiveName} (${customerId})`);
          continue;
        }

        console.log(`[Google Ads] Fetching data for customer: ${customer.descriptiveName} (${customerId}) using ${usedLcid ? 'manager' : 'direct'} access`);

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
            'metrics.conversions_value',
            'metrics.conversions_from_interactions_rate',
            'metrics.view_through_conversions',
            'metrics.interactions',
            'metrics.interaction_rate',
            'metrics.search_impression_share',
            'metrics.search_absolute_top_impression_share',
            'metrics.search_budget_lost_impression_share',
            'metrics.search_rank_lost_impression_share',
          ],
          start,
          end,
          usedLcid // Pass the login-customer-id if manager access was used
        );

        // Store raw response
        if (customer) {
          fullApiResponse.push({ customer_raw: customer });
        }

        if (metricsResponse.results && metricsResponse.results.length > 0) {
          fullApiResponse = [...fullApiResponse, ...metricsResponse.results];
        }

        // Get campaign list for this customer
        const campaigns = await client.getCampaigns(customerId, usedLcid);

        // Store raw response
        if (campaigns && campaigns.length > 0) {
          fullApiResponse.push({ campaigns_raw: campaigns });
        }

        // Aggregate metrics and collect campaigns
        const campaignMetrics = new Map<string, any>();

        // Initialize campaignMetrics with campaign names and types from the campaigns list
        for (const campaign of campaigns) {
          campaignMetrics.set(campaign.id, {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            type: campaign.advertisingChannelType || 'UNKNOWN',
            impressions: 0,
            clicks: 0,
            costMicros: 0,
            conversions: 0,
            conversionRate: 0,
          });
        }

        for (const result of metricsResponse.results) {
          const isSelectedContext = !selectedCampaignId ||
            (result.campaign && String(result.campaign.id) === String(selectedCampaignId));

          if (result.metrics && isSelectedContext) {
            totalMetrics.impressions += parseInt(result.metrics.impressions || '0', 10);
            totalMetrics.clicks += parseInt(result.metrics.clicks || '0', 10);
            totalMetrics.costMicros += parseInt(result.metrics.cost_micros || '0', 10);
            totalMetrics.conversions += result.metrics.conversions || 0;
            totalMetrics.conversionsValue += result.metrics.conversions_value || 0;
            totalMetrics.viewThroughConversions += result.metrics.view_through_conversions || 0;
            totalMetrics.interactions += parseInt(result.metrics.interactions || '0', 10);

            // Impression share metrics are percentages as doubles (0-1)
            if (result.metrics.search_impression_share !== undefined && typeof result.metrics.search_impression_share === 'number') {
              totalMetrics.searchImpressionShareSum += result.metrics.search_impression_share;
              totalMetrics.searchAbsTopImpressionShareSum += result.metrics.search_absolute_top_impression_share || 0;
              totalMetrics.searchBudgetLostImpressionShareSum += result.metrics.search_budget_lost_impression_share || 0;
              totalMetrics.searchRankLostImpressionShareSum += result.metrics.search_rank_lost_impression_share || 0;
              totalMetrics.accountsWithImpressionShare++;
            }
          }

          // Collect campaign-level data
          if (result.campaign) {
            const campaignId = result.campaign.id;
            if (!campaignMetrics.has(campaignId)) {
              campaignMetrics.set(campaignId, {
                id: campaignId,
                name: result.campaign.name,
                status: result.campaign.status,
                type: result.campaign.advertising_channel_type || 'UNKNOWN',
                impressions: 0,
                clicks: 0,
                costMicros: 0,
                conversions: 0,
                conversionRate: 0,
              });
            }

            const campaign = campaignMetrics.get(campaignId);
            if (result.metrics) {
              campaign.impressions += parseInt(result.metrics.impressions || '0', 10);
              campaign.clicks += parseInt(result.metrics.clicks || '0', 10);
              campaign.costMicros += parseInt(result.metrics.cost_micros || '0', 10);
              campaign.conversions += result.metrics.conversions || 0;
              // Average conv rate for the campaign (will divide later)
              campaign.conversionRate = result.metrics.conversions_from_interactions_rate || 0;
            }
          }
        }

        // Add campaigns to list (sorted by impressions)
        const campaignList = Array.from(campaignMetrics.values())
          .sort((a, b) => b.impressions - a.impressions)
          .map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            type: c.type,
            impressions: c.impressions,
            clicks: c.clicks,
            spend: c.costMicros / 1_000_000,
            conversions: c.conversions || 0,
            conversionRate: Math.round((c.conversionRate || 0) * 10000) / 100, // Format as 0-100 percentage
          }));

        allCampaigns.push(...campaignList);
      } catch (customerError: any) {
        // Specific handling for common per-customer errors
        const errMsg = customerError.message || '';
        if (errMsg.includes('CUSTOMER_NOT_ENABLED')) {
          console.warn(`[Google Ads] Skipping disabled customer ${customerId}`);
        } else if (errMsg.includes('USER_PERMISSION_DENIED')) {
          console.warn(`[Google Ads] No permission for customer ${customerId}`);
        } else if (errMsg.includes('REQUESTED_METRICS_FOR_MANAGER')) {
          // This should be caught by our if (customer.manager) check, but as a safety:
          console.log(`[Google Ads] Skipping manager metrics for ${customerId}`);
        } else {
          console.error(`[Google Ads] Error fetching data for customer ${customerId}:`, errMsg);
        }
        lastError = customerError;
      }
    }

    // If we have no data but we had errors, propagate the last error
    if (allCustomers.length === 0 && lastError) {
      return {
        customers: [],
        metrics: {
          impressions: 0,
          clicks: 0,
          spend: 0,
          currency: 'USD',
          conversions: 0,
          conversionsValue: 0,
          costPerConversion: 0,
          conversionRate: 0,
          viewThroughConversions: 0,
          interactions: 0,
          interactionRate: 0,
          ctr: 0,
          cpc: 0,
          searchImpressionShare: 0,
          searchAbsTopImpressionShare: 0,
          searchBudgetLostImpressionShare: 0,
          searchRankLostImpressionShare: 0,
        },
        campaigns: [],
        dateRange: dateRangeString,
        developerTokenStatus: 'active',
        apiError: lastError.message,
      };
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
        spend: Math.round(totalCost * 100) / 100,
        currency: allCustomers.length > 0 ? allCustomers[0].currency : 'USD',
        conversions: Math.round(totalMetrics.conversions * 100) / 100,
        conversionsValue: Math.round(totalMetrics.conversionsValue * 100) / 100,
        costPerConversion: totalMetrics.conversions > 0 ? Math.round((totalCost / totalMetrics.conversions) * 100) / 100 : 0,
        conversionRate: totalMetrics.interactions > 0 ? Math.round((totalMetrics.conversions / totalMetrics.interactions) * 10000) / 100 : 0,
        viewThroughConversions: totalMetrics.viewThroughConversions || 0,
        interactions: totalMetrics.interactions,
        interactionRate: totalMetrics.impressions > 0 ? Math.round((totalMetrics.interactions / totalMetrics.impressions) * 10000) / 100 : 0,
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(avgCpc * 100) / 100,
        searchImpressionShare: totalMetrics.accountsWithImpressionShare > 0 ? Math.round((totalMetrics.searchImpressionShareSum / totalMetrics.accountsWithImpressionShare) * 10000) / 100 : 0,
        searchAbsTopImpressionShare: totalMetrics.accountsWithImpressionShare > 0 ? Math.round((totalMetrics.searchAbsTopImpressionShareSum / totalMetrics.accountsWithImpressionShare) * 10000) / 100 : 0,
        searchBudgetLostImpressionShare: totalMetrics.accountsWithImpressionShare > 0 ? Math.round((totalMetrics.searchBudgetLostImpressionShareSum / totalMetrics.accountsWithImpressionShare) * 10000) / 100 : 0,
        searchRankLostImpressionShare: totalMetrics.accountsWithImpressionShare > 0 ? Math.round((totalMetrics.searchRankLostImpressionShareSum / totalMetrics.accountsWithImpressionShare) * 10000) / 100 : 0,
      },
      campaigns: allCampaigns,
      dateRange: dateRangeString,
      developerTokenStatus: 'active',
      apiResponse: fullApiResponse,
    };
  } catch (error: any) {
    console.error('[Google Ads] Error fetching data:', error);
    return {
      customers: [],
      metrics: {
        impressions: 0,
        clicks: 0,
        spend: 0,
        currency: 'USD',
        conversions: 0,
        conversionsValue: 0,
        costPerConversion: 0,
        conversionRate: 0,
        viewThroughConversions: 0,
        interactions: 0,
        interactionRate: 0,
        ctr: 0,
        cpc: 0,
        searchImpressionShare: 0,
        searchAbsTopImpressionShare: 0,
        searchBudgetLostImpressionShare: 0,
        searchRankLostImpressionShare: 0,
      },
      campaigns: [],
      dateRange: dateRangeString,
      developerTokenStatus: 'pending',
      apiError: error.message,
    };
  }
}

