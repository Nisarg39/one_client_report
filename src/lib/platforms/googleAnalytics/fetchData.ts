/**
 * Google Analytics Data Fetching Service
 *
 * Fetches real-time data from Google Analytics API
 * for use in AI chat context
 */

import { GoogleAnalyticsClient } from '../google-analytics/client';
import { IPlatformConnection } from '@/models/PlatformConnection';
import { getCached, setCache } from './cache';

/**
 * GA property data format - Enhanced with comprehensive metrics
 */
export interface GAPropertyData {
  propertyId: string;
  propertyName: string;
  // Real-time data
  realtime?: {
    activeUsers: number;
    byDevice?: Array<{ device: string; users: number }>;
  };
  // Historical metrics (last 30 days)
  metrics: {
    sessions: number;
    users: number;
    newUsers: number;
    returningUsers: number; // PHASE 1: Added!
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
    engagementRate: number;
    sessionsPerUser: number;
    eventCount: number;
    conversions?: number;
    purchaseRevenue?: number;
    totalRevenue?: number;
    transactions?: number;
    engagedSessions?: number;
    userLtvTotalRevenue?: number;
    // Google Ads metrics integrated in GA
    adsSpend?: number;
    adsImpressions?: number;
    adsClicks?: number;
  };
  // Dimensional breakdowns
  dimensions: {
    topSources: Array<{ source: string; sessions: number; users: number }>;
    devices: Array<{ device: string; sessions: number; percentage: number }>;
    topPages: Array<{ page: string; title: string; views: number; avgTime: number }>;
    countries: Array<{ country: string; users: number }>;
    daily: Array<{
      date: string;
      sessions: number;
      users: number;
      pageviews: number;
      engagedSessions?: number;
      engagementRate?: number;
    }>;
  };

  // Ecommerce Metrics
  ecommerce?: {
    totalRevenue: number;
    purchaseRevenue: number;
    transactions: number;
    conversionRate: number;
    add_to_carts: number;
    checkouts: number;
    items?: Array<{
      name: string;
      id: string;
      brand: string;
      category: string;
      quantity: number;
      revenue: number;
    }>;
  };

  // Conversion Metrics
  conversions?: {
    totalConversions: number;
    sessionConversionRate: number;
    userConversionRate: number;
  };

  // Retention & LTV
  retention?: {
    retentionRate?: number;
    userLtvTotalRevenue?: number;
    userLtvAverageRevenue?: number;
  };

  // Advanced Geography & Technology
  techBreakdown?: {
    operatingSystem: Array<{ name: string; sessions: number }>;
    language: Array<{ name: string; sessions: number }>;
    screenResolution: Array<{ name: string; sessions: number }>;
  };

  // NEW: Enhanced metrics (Phase 2 - Campaign, Events, Landing/Exit, Geography)
  topCampaigns?: Array<{
    source: string;
    medium: string;
    campaign: string;
    sessions: number;
    users: number;
  }>;

  topEvents?: Array<{
    eventName: string;
    eventCount: number;
  }>;

  topLandingPages?: Array<{
    page: string;
    sessions: number;
    bounceRate: number;
  }>;

  topCities?: Array<{
    city: string;
    country: string;
    sessions: number;
  }>;

  topRegions?: Array<{
    region: string;
    country: string;
    sessions: number;
  }>;

  // PHASE 1: Browser breakdown
  browserBreakdown?: Array<{
    browser: string;
    sessions: number;
  }>;
}

/**
 * GA data format for AI system prompt (single property - backward compatible)
 */
export interface GADataForAI {
  metrics: {
    sessions: number;
    users: number;
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  dimensions?: {
    topSources?: Array<{ source: string; sessions: number }>;
    devices?: Array<{ device: string; percentage: number }>;
    topPages?: Array<{ page: string; views: number }>;
  };
  dateRange: string;
  propertyName?: string;
  apiResponse?: any; // The whole API response for debugging
}

export interface GAMultiPropertyData {
  properties: GAPropertyData[];
  dateRange: string;
  selectedPropertyId?: string;
  apiResponse?: any; // The whole API response for debugging
}

/**
 * Fetch Google Analytics data for AI context
 *
 * @param connection - Platform connection with decrypted tokens
 * @returns Formatted GA data for AI
 */
export async function fetchGoogleAnalyticsData(
  connection: IPlatformConnection
): Promise<GADataForAI | null> {
  let fullApiResponse: any = {};
  try {
    // Get the access token
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('No access token available for Google Analytics');
      return null;
    }

    // Create client
    const client = new GoogleAnalyticsClient(accessToken);

    // Get property ID from metadata, or auto-select first property
    let propertyId = connection.metadata?.propertyId;
    let propertyName = connection.metadata?.propertyName;

    if (!propertyId) {
      try {
        const properties = await client.listProperties();
        if (properties.length > 0) {
          propertyId = properties[0].propertyId;
          propertyName = properties[0].displayName;
        } else {
          console.error('No GA properties found for this account');
          return null;
        }
      } catch (listError) {
        console.error('Failed to list GA properties:', listError);
        return null;
      }
    }

    // Date range: last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const dateRanges = [
      { startDate: formatDate(startDate), endDate: formatDate(endDate) },
    ];

    // Fetch overview metrics
    const metricsResponse = await client.runReport({
      propertyId,
      dateRanges,
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });
    fullApiResponse.overview = metricsResponse;

    // Parse metrics
    const metricsRow = metricsResponse.rows?.[0];
    const metrics = {
      sessions: parseInt(metricsRow?.metricValues?.[0]?.value || '0', 10),
      users: parseInt(metricsRow?.metricValues?.[1]?.value || '0', 10),
      pageviews: parseInt(metricsRow?.metricValues?.[2]?.value || '0', 10),
      bounceRate: parseFloat(metricsRow?.metricValues?.[3]?.value || '0'),
      avgSessionDuration: parseFloat(metricsRow?.metricValues?.[4]?.value || '0'),
    };

    // Fetch top traffic sources
    const sourcesResponse = await client.runReport({
      propertyId,
      dateRanges,
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionSource' }],
      limit: 5,
    });
    fullApiResponse.sources = sourcesResponse;

    const topSources = (sourcesResponse.rows || []).map((row: any) => ({
      source: row.dimensionValues?.[0]?.value || 'Unknown',
      sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
    }));

    // Fetch device breakdown
    const devicesResponse = await client.runReport({
      propertyId,
      dateRanges,
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'deviceCategory' }],
      limit: 5,
    });
    fullApiResponse.devices = devicesResponse;

    const totalDeviceSessions = (devicesResponse.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
      0
    );

    const devices = (devicesResponse.rows || []).map((row: any) => {
      const sessionCount = parseInt(row.metricValues?.[0]?.value || '0', 10);
      return {
        device: row.dimensionValues?.[0]?.value || 'Unknown',
        percentage: totalDeviceSessions > 0
          ? Math.round((sessionCount / totalDeviceSessions) * 100)
          : 0,
      };
    });

    // Fetch top pages
    const pagesResponse = await client.runReport({
      propertyId,
      dateRanges,
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
      limit: 5,
    });
    fullApiResponse.pages = pagesResponse;

    const topPages = (pagesResponse.rows || []).map((row: any) => ({
      page: row.dimensionValues?.[0]?.value || '/',
      views: parseInt(row.metricValues?.[0]?.value || '0', 10),
    }));

    return {
      metrics,
      dimensions: {
        topSources,
        devices,
        topPages,
      },
      dateRange: `${formatDate(startDate)} to ${formatDate(endDate)}`,
      propertyName,
      apiResponse: fullApiResponse,
    };
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);

    // Check if it's an auth error that needs token refresh
    if (error instanceof Error && error.message.includes('401')) {
      // TODO: Implement token refresh logic
      console.error('Access token may be expired - needs refresh');
    }

    return null;
  }
}

/**
 * Fetch comprehensive data from ALL Google Analytics properties
 *
 * @param connection - Platform connection with decrypted tokens
 * @returns Data from all accessible properties with enhanced metrics
 */
export async function fetchAllGoogleAnalyticsProperties(
  connection: IPlatformConnection,
  startDate?: string,
  endDate?: string,
  selectedPropertyId?: string
): Promise<GAMultiPropertyData | null> {
  try {
    // Date range: use provided dates or default to last 30 days
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const defaultEndDate = new Date();
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const start = startDate || formatDate(defaultStartDate);
    const end = endDate || formatDate(defaultEndDate);

    // Check cache first (5-minute TTL) - Include date range in cache key
    const cacheKey = `ga-all-${connection.userId}-${connection.clientId}-${start}-${end}`;
    const cached = getCached<GAMultiPropertyData>(cacheKey);
    if (cached) {
      return cached;
    }

    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('No access token available for Google Analytics');
      return null;
    }

    const client = new GoogleAnalyticsClient(accessToken);

    // Get all available properties
    const allProperties = await client.listProperties();
    if (allProperties.length === 0) {
      return null;
    }

    // Create date ranges array for API calls
    const dateRanges = [{ startDate: start, endDate: end }];

    // Priority: 1. Passed selectedPropertyId, 2. Metadata propertyId
    const activePropId = selectedPropertyId || connection.metadata?.propertyId;

    // Fetch data for each property (limit to 20 for performance)
    // Always include the active property if it's not in the first 20
    let propertiesToFetch = allProperties.slice(0, 20);

    if (activePropId && activePropId !== 'all' && !propertiesToFetch.find(p => p.propertyId === activePropId)) {
      const selectedProp = allProperties.find(p => p.propertyId === activePropId);
      if (selectedProp) {
        propertiesToFetch.push(selectedProp);
      }
    }

    // Fetch all properties in parallel for better performance
    let fullMultiApiResponse: any[] = [];
    const propertiesDataPromises = propertiesToFetch.map(async (prop) => {
      try {
        // 1. Fetch REAL-TIME active users first
        let realtime: GAPropertyData['realtime'] = undefined;
        try {
          const realtimeData = await client.runRealtimeReport(prop.propertyId);
          realtime = {
            activeUsers: realtimeData.activeUsers,
            byDevice: realtimeData.activeUsersByDevice,
          };
        } catch (realtimeError: any) {
          // Real-time might not be available for all properties - silently continue
        }

        // 2. BATCH FETCH: Fetch independently to prevent one failure from killing all data
        const batchResponses: any[] = new Array(18).fill(null); // Initialize with nulls for 18 expected reports

        // Helper to safely populate batch results at correct offsets
        const fetchBatch = async (requests: any[], offset: number) => {
          try {
            const results = await client.batchRunReports(prop.propertyId, requests);
            results.forEach((res, i) => {
              batchResponses[offset + i] = res;
            });
          } catch (err: any) {
            console.error(`Batch at offset ${offset} failed for ${prop.propertyId}:`, err.message);
          }
        };

        await Promise.all([
          // Batch 1 (Reports 0-4)
          fetchBatch([
            {
              dateRanges,
              metrics: [
                { name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' },
                { name: 'screenPageViews' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' },
                { name: 'engagementRate' }, { name: 'sessionsPerUser' }, { name: 'eventCount' },
                { name: 'conversions' }
              ],
            },
            { dateRanges, metrics: [{ name: 'sessions' }, { name: 'activeUsers' }], dimensions: [{ name: 'sessionSource' }], limit: 5 },
            { dateRanges, metrics: [{ name: 'sessions' }], dimensions: [{ name: 'deviceCategory' }, { name: 'browser' }] },
            { dateRanges, metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }], dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }], limit: 5 },
            { dateRanges, metrics: [{ name: 'activeUsers' }], dimensions: [{ name: 'country' }], limit: 5 }
          ], 0),

          // Batch 2 (Reports 5-9)
          fetchBatch([
            { dateRanges: [{ startDate: start, endDate: end }], metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }, { name: 'engagedSessions' }, { name: 'engagementRate' }], dimensions: [{ name: 'date' }] },
            { dateRanges, metrics: [{ name: 'sessions' }, { name: 'activeUsers' }], dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }, { name: 'sessionCampaignName' }], limit: 10 },
            { dateRanges, metrics: [{ name: 'eventCount' }], dimensions: [{ name: 'eventName' }], limit: 10 },
            { dateRanges, metrics: [{ name: 'sessions' }, { name: 'bounceRate' }], dimensions: [{ name: 'landingPage' }], limit: 10 },
            { dateRanges, metrics: [{ name: 'sessions' }], dimensions: [{ name: 'city' }, { name: 'country' }], limit: 10 }
          ], 5),

          // Batch 3 (Reports 10-13)
          fetchBatch([
            { dateRanges, metrics: [{ name: 'sessions' }], dimensions: [{ name: 'region' }, { name: 'country' }], limit: 10 },
            { dateRanges, metrics: [{ name: 'sessionConversionRate' }, { name: 'userConversionRate' }] },
            { dateRanges, metrics: [{ name: 'addToCarts' }, { name: 'checkouts' }] },
            {
              dateRanges,
              metrics: [
                { name: 'purchaseRevenue' },
                { name: 'totalRevenue' },
                { name: 'transactions' },
                { name: 'engagedSessions' }
                // userLtvTotalRevenue removed due to compatibility issues on some properties
              ],
            }
          ], 10),

          // Batch 4 (Reports 14-17)
          fetchBatch([
            { dateRanges, metrics: [{ name: 'sessions' }], dimensions: [{ name: 'operatingSystem' }], limit: 5 },
            { dateRanges, metrics: [{ name: 'sessions' }], dimensions: [{ name: 'language' }], limit: 5 },
            { dateRanges, metrics: [{ name: 'sessions' }], dimensions: [{ name: 'screenResolution' }], limit: 5 },
            { dateRanges, metrics: [{ name: 'itemRevenue' }, { name: 'itemPurchaseQuantity' }], dimensions: [{ name: 'itemName' }, { name: 'itemId' }, { name: 'itemBrand' }, { name: 'itemCategory' }], limit: 5 }
          ], 14)
        ]);

        if (!batchResponses[0]) {
          throw new Error('Essential metrics (Batch 1) failed');
        }

        const metricsRow = batchResponses[0]?.rows?.[0];
        const advancedMetricsRow = batchResponses[13]?.rows?.[0];
        const totalUsers = parseInt(metricsRow?.metricValues?.[1]?.value || '0', 10);
        const newUsers = parseInt(metricsRow?.metricValues?.[2]?.value || '0', 10);

        const metrics = {
          sessions: parseInt(metricsRow?.metricValues?.[0]?.value || '0', 10),
          users: totalUsers,
          newUsers: newUsers,
          returningUsers: Math.max(0, totalUsers - newUsers),
          pageviews: parseInt(metricsRow?.metricValues?.[3]?.value || '0', 10),
          bounceRate: parseFloat(metricsRow?.metricValues?.[4]?.value || '0'),
          avgSessionDuration: parseFloat(metricsRow?.metricValues?.[5]?.value || '0'),
          engagementRate: parseFloat(metricsRow?.metricValues?.[6]?.value || '0'),
          sessionsPerUser: parseFloat(metricsRow?.metricValues?.[7]?.value || '0'),
          eventCount: parseInt(metricsRow?.metricValues?.[8]?.value || '0', 10),
          conversions: parseInt(metricsRow?.metricValues?.[9]?.value || '0', 10),
          purchaseRevenue: parseFloat(advancedMetricsRow?.metricValues?.[0]?.value || '0'),
          totalRevenue: parseFloat(advancedMetricsRow?.metricValues?.[1]?.value || '0'),
          transactions: parseInt(advancedMetricsRow?.metricValues?.[2]?.value || '0', 10),
          engagedSessions: parseInt(advancedMetricsRow?.metricValues?.[3]?.value || '0', 10),
          userLtvTotalRevenue: 0, // Placeholder
          adsSpend: 0,
          adsImpressions: 0,
          adsClicks: 0,
        };

        const ecommerce: GAPropertyData['ecommerce'] = {
          totalRevenue: metrics.totalRevenue,
          purchaseRevenue: metrics.purchaseRevenue,
          transactions: metrics.transactions,
          conversionRate: 0,
          add_to_carts: parseInt(batchResponses[12]?.rows?.[0]?.metricValues?.[0]?.value || '0', 10),
          checkouts: parseInt(batchResponses[12]?.rows?.[0]?.metricValues?.[1]?.value || '0', 10),
          items: (batchResponses[17]?.rows || []).map((row: any) => ({
            name: row.dimensionValues?.[0]?.value || 'Unknown',
            id: row.dimensionValues?.[1]?.value || 'Unknown',
            brand: row.dimensionValues?.[2]?.value || 'Unknown',
            category: row.dimensionValues?.[3]?.value || 'Unknown',
            quantity: parseInt(row.metricValues?.[1]?.value || '0', 10),
            revenue: parseFloat(row.metricValues?.[0]?.value || '0'),
          })),
        };

        const conversions: GAPropertyData['conversions'] = {
          totalConversions: metrics.conversions,
          sessionConversionRate: parseFloat(batchResponses[11]?.rows?.[0]?.metricValues?.[0]?.value || '0'),
          userConversionRate: parseFloat(batchResponses[11]?.rows?.[0]?.metricValues?.[1]?.value || '0'),
        };

        ecommerce.conversionRate = conversions.sessionConversionRate;

        const retention: GAPropertyData['retention'] = {
          userLtvTotalRevenue: metrics.userLtvTotalRevenue,
        };

        const techBreakdown: GAPropertyData['techBreakdown'] = {
          operatingSystem: (batchResponses[14]?.rows || []).map((row: any) => ({
            name: row.dimensionValues?.[0]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10)
          })),
          language: (batchResponses[15]?.rows || []).map((row: any) => ({
            name: row.dimensionValues?.[0]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10)
          })),
          screenResolution: (batchResponses[16]?.rows || []).map((row: any) => ({
            name: row.dimensionValues?.[0]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10)
          })),
        };

        // 3. Optional: Fetch Google Ads metrics in a separate protected request
        // This prevents the entire property fetch from failing if Ads are not linked
        try {
          const adsResponse = await client.runReport({
            propertyId: prop.propertyId,
            dateRanges,
            metrics: [
              { name: 'advertiserAdCost' },
              { name: 'advertiserAdImpressions' },
              { name: 'advertiserAdClicks' },
            ],
          });

          const adsRow = adsResponse.rows?.[0];
          if (adsRow) {
            metrics.adsSpend = parseFloat(adsRow.metricValues?.[0]?.value || '0');
            metrics.adsImpressions = parseInt(adsRow.metricValues?.[1]?.value || '0', 10);
            metrics.adsClicks = parseInt(adsRow.metricValues?.[2]?.value || '0', 10);
          }
        } catch (adsError) {
          // Ads not linked or other API issue - keep defaults
        }

        // Initialize dimensions
        const dimensions: GAPropertyData['dimensions'] = {
          topSources: [],
          devices: [],
          topPages: [],
          countries: [],
          daily: [],
        };

        // Initialize enhanced metrics
        let topCampaigns: GAPropertyData['topCampaigns'] = undefined;
        let topEvents: GAPropertyData['topEvents'] = undefined;
        let topLandingPages: GAPropertyData['topLandingPages'] = undefined;
        let topCities: GAPropertyData['topCities'] = undefined;
        let topRegions: GAPropertyData['topRegions'] = undefined;
        let browserBreakdown: Array<{ browser: string; sessions: number }> = [];

        // Parse Report 1: Top sources
        dimensions.topSources = (batchResponses[1]?.rows || []).map((row: any) => ({
          source: row.dimensionValues?.[0]?.value || 'Unknown',
          sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
          users: parseInt(row.metricValues?.[1]?.value || '0', 10),
        }));

        // Parse Report 2: Device & Browser breakdown
        const totalSessions = metrics.sessions;
        const deviceBrowserMap = new Map<string, number>();
        const browserMap = new Map<string, number>();

        (batchResponses[2]?.rows || []).forEach((row: any) => {
          const device = row.dimensionValues?.[0]?.value || 'Unknown';
          const browser = row.dimensionValues?.[1]?.value || 'Unknown';
          const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);

          // Aggregate by device
          deviceBrowserMap.set(device, (deviceBrowserMap.get(device) || 0) + sessions);

          // Aggregate by browser
          browserMap.set(browser, (browserMap.get(browser) || 0) + sessions);
        });

        dimensions.devices = Array.from(deviceBrowserMap.entries()).map(([device, sessions]) => ({
          device,
          sessions,
          percentage: totalSessions > 0 ? Math.round((sessions / totalSessions) * 100) : 0,
        }));

        browserBreakdown = Array.from(browserMap.entries())
          .map(([browser, sessions]) => ({ browser, sessions }))
          .sort((a: any, b: any) => b.sessions - a.sessions)
          .slice(0, 5);

        // Parse Report 3: Top pages
        dimensions.topPages = (batchResponses[3]?.rows || []).map((row: any) => ({
          page: row.dimensionValues?.[0]?.value || '/',
          title: row.dimensionValues?.[1]?.value || 'No Title',
          views: parseInt(row.metricValues?.[0]?.value || '0', 10),
          avgTime: parseFloat(row.metricValues?.[1]?.value || '0'),
        }));

        // Parse Report 4: Top countries
        dimensions.countries = (batchResponses[4]?.rows || []).map((row: any) => ({
          country: row.dimensionValues?.[0]?.value || 'Unknown',
          users: parseInt(row.metricValues?.[0]?.value || '0', 10),
        }));

        // Parse Report 5: Daily breakdown
        dimensions.daily = (batchResponses[5]?.rows || [])
          .map((row: any) => ({
            date: row.dimensionValues?.[0]?.value || '',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
            users: parseInt(row.metricValues?.[1]?.value || '0', 10),
            pageviews: parseInt(row.metricValues?.[2]?.value || '0', 10),
            engagedSessions: parseInt(row.metricValues?.[3]?.value || '0', 10),
            engagementRate: parseFloat(row.metricValues?.[4]?.value || '0'),
          }))
          .sort((a: any, b: any) => a.date.localeCompare(b.date));

        // Parse Report 6: Top campaigns
        if (batchResponses[6]?.rows && batchResponses[6].rows.length > 0) {
          topCampaigns = batchResponses[6].rows.map((row: any) => ({
            source: row.dimensionValues?.[0]?.value || '(not set)',
            medium: row.dimensionValues?.[1]?.value || '(not set)',
            campaign: row.dimensionValues?.[2]?.value || '(not set)',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
            users: parseInt(row.metricValues?.[1]?.value || '0', 10),
          }));
        }

        // Parse Report 7: Top events
        if (batchResponses[7]?.rows && batchResponses[7].rows.length > 0) {
          topEvents = batchResponses[7].rows.map((row: any) => ({
            eventName: row.dimensionValues?.[0]?.value || 'unknown',
            eventCount: parseInt(row.metricValues?.[0]?.value || '0', 10),
          }));
        }

        // Parse Report 8: Top landing pages
        if (batchResponses[8]?.rows && batchResponses[8].rows.length > 0) {
          topLandingPages = batchResponses[8].rows.map((row: any) => ({
            page: row.dimensionValues?.[0]?.value || '/',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
            bounceRate: parseFloat(row.metricValues?.[1]?.value || '0'),
          }));
        }

        // Parse Report 9: Top cities
        if (batchResponses[9]?.rows && batchResponses[9].rows.length > 0) {
          topCities = batchResponses[9].rows.map((row: any) => ({
            city: row.dimensionValues?.[0]?.value || 'Unknown',
            country: row.dimensionValues?.[1]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
          }));
        }

        // Parse Report 10: Top regions
        if (batchResponses[10]?.rows && batchResponses[10].rows.length > 0) {
          topRegions = batchResponses[10].rows.map((row: any) => ({
            region: row.dimensionValues?.[0]?.value || 'Unknown',
            country: row.dimensionValues?.[1]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
          }));
        }

        return {
          propertyId: prop.propertyId,
          propertyName: prop.displayName,
          realtime,
          metrics,
          dimensions,
          ecommerce,
          conversions,
          retention,
          techBreakdown,
          // NEW: Include enhanced metrics
          topCampaigns,
          topEvents,
          topLandingPages,
          topCities,
          topRegions,
          // PHASE 1: Browser breakdown
          browserBreakdown: browserBreakdown.length > 0 ? browserBreakdown : undefined,
        };
      } catch (propError: any) {
        // Skip properties that error (e.g., 429 rate limits on demo properties)
        console.error(`Error fetching data for GA property ${prop.displayName}:`, propError);
        return null;
      }
    });

    // Wait for all properties to be fetched in parallel
    const propertiesResults = await Promise.all(propertiesDataPromises);
    const propertiesData = propertiesResults.filter((p) => p !== null) as GAPropertyData[];

    // PHASE 2: Add virtual "All Properties" entry with cumulative data
    if (propertiesData.length > 1) {
      const allMetrics = propertiesData.reduce((acc, prop) => ({
        sessions: acc.sessions + (prop.metrics.sessions || 0),
        users: acc.users + (prop.metrics.users || 0),
        newUsers: acc.newUsers + (prop.metrics.newUsers || 0),
        returningUsers: acc.returningUsers + (prop.metrics.returningUsers || 0),
        pageviews: acc.pageviews + (prop.metrics.pageviews || 0),
        bounceRate: acc.bounceRate + ((prop.metrics.bounceRate || 0) * (prop.metrics.sessions || 1)),
        avgSessionDuration: acc.avgSessionDuration + ((prop.metrics.avgSessionDuration || 0) * (prop.metrics.sessions || 1)),
        engagementRate: acc.engagementRate + ((prop.metrics.engagementRate || 0) * (prop.metrics.sessions || 1)),
        sessionsPerUser: acc.sessionsPerUser + ((prop.metrics.sessionsPerUser || 0) * (prop.metrics.users || 1)),
        eventCount: acc.eventCount + (prop.metrics.eventCount || 0),
        conversions: acc.conversions + (prop.metrics.conversions || 0),
        purchaseRevenue: acc.purchaseRevenue + (prop.metrics.purchaseRevenue || 0),
        totalRevenue: acc.totalRevenue + (prop.metrics.totalRevenue || 0),
        transactions: acc.transactions + (prop.metrics.transactions || 0),
        engagedSessions: acc.engagedSessions + (prop.metrics.engagedSessions || 0),
        userLtvTotalRevenue: acc.userLtvTotalRevenue + (prop.metrics.userLtvTotalRevenue || 0),
        adsSpend: acc.adsSpend + (prop.metrics.adsSpend || 0),
        adsImpressions: acc.adsImpressions + (prop.metrics.adsImpressions || 0),
        adsClicks: acc.adsClicks + (prop.metrics.adsClicks || 0),
      }), {
        sessions: 0, users: 0, newUsers: 0, returningUsers: 0, pageviews: 0,
        bounceRate: 0, avgSessionDuration: 0, engagementRate: 0, sessionsPerUser: 0, eventCount: 0,
        conversions: 0, purchaseRevenue: 0, totalRevenue: 0, transactions: 0,
        engagedSessions: 0, userLtvTotalRevenue: 0, adsSpend: 0, adsImpressions: 0, adsClicks: 0
      });

      // Calculate weighted averages
      if (allMetrics.sessions > 0) {
        allMetrics.bounceRate = allMetrics.bounceRate / allMetrics.sessions;
        allMetrics.avgSessionDuration = allMetrics.avgSessionDuration / allMetrics.sessions;
        allMetrics.engagementRate = allMetrics.engagementRate / allMetrics.sessions;
      }
      if (allMetrics.users > 0) {
        allMetrics.sessionsPerUser = allMetrics.sessionsPerUser / allMetrics.users;
      }

      // Aggregation for dimensional data
      const aggregateList = (list: any[], labelKeys: string[], metricKeys: string[]) => {
        const map = new Map<string, any>();
        list.forEach(item => {
          const label = labelKeys.map(k => item[k]).filter(Boolean).join('_');
          if (!label) return;
          const existing = map.get(label);
          if (existing) {
            metricKeys.forEach(m => {
              existing[m] = (existing[m] || 0) + (item[m] || 0);
            });
          } else {
            map.set(label, { ...item });
          }
        });
        return Array.from(map.values())
          .sort((a: any, b: any) => (b[metricKeys[0]] || 0) - (a[metricKeys[0]] || 0))
          .slice(0, 10);
      };

      const allProperty: GAPropertyData = {
        propertyId: 'all',
        propertyName: 'All Properties',
        metrics: allMetrics,
        dimensions: {
          topSources: aggregateList(propertiesData.flatMap(p => p.dimensions.topSources || []), ['source'], ['sessions', 'users']),
          countries: aggregateList(propertiesData.flatMap(p => p.dimensions.countries || []), ['country'], ['users']),
          devices: aggregateList(propertiesData.flatMap(p => p.dimensions.devices || []), ['device'], ['sessions']),
          topPages: aggregateList(propertiesData.flatMap(p => p.dimensions.topPages || []), ['page'], ['views', 'sessions']),
          daily: [], // Daily is complex for aggregate
        },
        ecommerce: {
          totalRevenue: allMetrics.totalRevenue,
          purchaseRevenue: allMetrics.purchaseRevenue,
          transactions: allMetrics.transactions,
          conversionRate: allMetrics.sessions > 0 ? (allMetrics.conversions / allMetrics.sessions) : 0,
          add_to_carts: propertiesData.reduce((sum, p) => sum + (p.ecommerce?.add_to_carts || 0), 0),
          checkouts: propertiesData.reduce((sum, p) => sum + (p.ecommerce?.checkouts || 0), 0),
          items: aggregateList(propertiesData.flatMap(p => p.ecommerce?.items || []), ['name'], ['revenue', 'quantity']),
        },
        conversions: {
          totalConversions: allMetrics.conversions,
          sessionConversionRate: allMetrics.sessions > 0 ? (allMetrics.conversions / allMetrics.sessions) : 0,
          userConversionRate: allMetrics.users > 0 ? (allMetrics.conversions / allMetrics.users) : 0,
        },
        retention: {
          userLtvTotalRevenue: allMetrics.userLtvTotalRevenue,
        },
        techBreakdown: {
          operatingSystem: aggregateList(propertiesData.flatMap(p => p.techBreakdown?.operatingSystem || []), ['name'], ['sessions']),
          language: aggregateList(propertiesData.flatMap(p => p.techBreakdown?.language || []), ['name'], ['sessions']),
          screenResolution: aggregateList(propertiesData.flatMap(p => p.techBreakdown?.screenResolution || []), ['name'], ['sessions']),
        },
        topCampaigns: aggregateList(propertiesData.flatMap(p => p.topCampaigns || []), ['campaign'], ['sessions', 'users']),
        topEvents: aggregateList(propertiesData.flatMap(p => p.topEvents || []), ['eventName'], ['eventCount']),
        topCities: aggregateList(propertiesData.flatMap(p => p.topCities || []), ['city', 'country'], ['sessions']),
        browserBreakdown: aggregateList(propertiesData.flatMap(p => p.browserBreakdown || []), ['browser'], ['sessions']),
      };

      propertiesData.unshift(allProperty);
    }

    const result = {
      properties: propertiesData,
      dateRange: `${start} to ${end}`,
      selectedPropertyId: selectedPropertyId || (propertiesData.length > 1 ? 'all' : activePropId),
      apiResponse: propertiesData,
    };

    // Cache the result for 5 minutes
    setCache(cacheKey, result);

    return result;
  } catch (error: any) {
    if (error.message.includes('401') || error.message.includes('authentication')) {
      throw new Error('Google Analytics authentication failed. Please re-link your account in settings.');
    }
    console.error('Error fetching all GA properties:', error);
    return null;
  }
}
