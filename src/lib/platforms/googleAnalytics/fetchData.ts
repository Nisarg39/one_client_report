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
  };
  // Dimensional breakdowns
  dimensions: {
    topSources: Array<{ source: string; sessions: number; users: number }>;
    devices: Array<{ device: string; sessions: number; percentage: number }>;
    topPages: Array<{ page: string; views: number; avgTime: number }>;
    countries: Array<{ country: string; users: number }>;
    daily: Array<{ date: string; sessions: number; users: number; pageviews: number }>;
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
}

/**
 * Multi-property GA data for AI
 */
export interface GAMultiPropertyData {
  properties: GAPropertyData[];
  dateRange: string;
  selectedPropertyId?: string;
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

    const topSources = (sourcesResponse.rows || []).map((row) => ({
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

    const totalDeviceSessions = (devicesResponse.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
      0
    );

    const devices = (devicesResponse.rows || []).map((row) => {
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

    const topPages = (pagesResponse.rows || []).map((row) => ({
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

        // 2. BATCH FETCH: Split into 3 batches (GA4 API limit: 5 requests per batch)
        // Batch 1: Essential metrics (Reports 0-4)
        const batch1 = await client.batchRunReports(prop.propertyId, [
          // Report 0: Comprehensive historical metrics
          {
            dateRanges,
            metrics: [
              { name: 'sessions' },
              { name: 'totalUsers' }, // PHASE 1: Changed from activeUsers to get total unique users
              { name: 'newUsers' },
              { name: 'screenPageViews' },
              { name: 'bounceRate' },
              { name: 'averageSessionDuration' },
              { name: 'engagementRate' },
              { name: 'sessionsPerUser' },
              { name: 'eventCount' },
            ],
          },
          // Report 1: Top traffic sources with users
          {
            dateRanges,
            metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
            dimensions: [{ name: 'sessionSource' }],
            limit: 5,
          },
          // Report 2: Device breakdown (including browser!)
          {
            dateRanges,
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'deviceCategory' }, { name: 'browser' }], // PHASE 1: Added browser!
          },
          // Report 3: Top pages
          {
            dateRanges,
            metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
            dimensions: [{ name: 'pagePath' }],
            limit: 5,
          },
          // Report 4: Top countries
          {
            dateRanges,
            metrics: [{ name: 'activeUsers' }],
            dimensions: [{ name: 'country' }],
            limit: 5,
          },
        ]);

        // Batch 2: Enhanced metrics (Reports 5-9)
        const batch2 = await client.batchRunReports(prop.propertyId, [
          // Report 5: Daily breakdown
          {
            dateRanges: [{ startDate: start, endDate: end }],
            metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }],
            dimensions: [{ name: 'date' }],
          },
          // Report 6: Top campaigns
          {
            dateRanges,
            metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
            dimensions: [
              { name: 'sessionSource' },
              { name: 'sessionMedium' },
              { name: 'sessionCampaignName' },
            ],
            limit: 10,
          },
          // Report 7: Top events
          {
            dateRanges,
            metrics: [{ name: 'eventCount' }],
            dimensions: [{ name: 'eventName' }],
            limit: 10,
          },
          // Report 8: Top landing pages
          {
            dateRanges,
            metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
            dimensions: [{ name: 'landingPage' }],
            limit: 10,
          },
          // Report 9: Top cities
          {
            dateRanges,
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'city' }, { name: 'country' }],
            limit: 10,
          },
        ]);

        // Batch 3: Geography (Report 10)
        const batch3 = await client.batchRunReports(prop.propertyId, [
          // Report 10: Top regions
          {
            dateRanges,
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'region' }, { name: 'country' }],
            limit: 10,
          },
        ]);

        // Combine all batches
        const batchResponses = [...batch1, ...batch2, ...batch3];

        // Parse Report 0: Metrics
        const metricsRow = batchResponses[0]?.rows?.[0];
        const totalUsers = parseInt(metricsRow?.metricValues?.[1]?.value || '0', 10);
        const newUsers = parseInt(metricsRow?.metricValues?.[2]?.value || '0', 10);

        const metrics = {
          sessions: parseInt(metricsRow?.metricValues?.[0]?.value || '0', 10),
          users: totalUsers,
          newUsers: newUsers,
          returningUsers: Math.max(0, totalUsers - newUsers), // PHASE 1: Calculated from totalUsers - newUsers
          pageviews: parseInt(metricsRow?.metricValues?.[3]?.value || '0', 10),
          bounceRate: parseFloat(metricsRow?.metricValues?.[4]?.value || '0'),
          avgSessionDuration: parseFloat(metricsRow?.metricValues?.[5]?.value || '0'),
          engagementRate: parseFloat(metricsRow?.metricValues?.[6]?.value || '0'),
          sessionsPerUser: parseFloat(metricsRow?.metricValues?.[7]?.value || '0'),
          eventCount: parseInt(metricsRow?.metricValues?.[8]?.value || '0', 10),
        };

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
        dimensions.topSources = (batchResponses[1]?.rows || []).map((row) => ({
          source: row.dimensionValues?.[0]?.value || 'Unknown',
          sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
          users: parseInt(row.metricValues?.[1]?.value || '0', 10),
        }));

        // Parse Report 2: Device & Browser breakdown
        const totalSessions = metrics.sessions;
        const deviceBrowserMap = new Map<string, number>();
        const browserMap = new Map<string, number>();

        (batchResponses[2]?.rows || []).forEach((row) => {
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
          .sort((a, b) => b.sessions - a.sessions)
          .slice(0, 5);

        // Parse Report 3: Top pages
        dimensions.topPages = (batchResponses[3]?.rows || []).map((row) => ({
          page: row.dimensionValues?.[0]?.value || '/',
          views: parseInt(row.metricValues?.[0]?.value || '0', 10),
          avgTime: parseFloat(row.metricValues?.[1]?.value || '0'),
        }));

        // Parse Report 4: Top countries
        dimensions.countries = (batchResponses[4]?.rows || []).map((row) => ({
          country: row.dimensionValues?.[0]?.value || 'Unknown',
          users: parseInt(row.metricValues?.[0]?.value || '0', 10),
        }));

        // Parse Report 5: Daily breakdown
        dimensions.daily = (batchResponses[5]?.rows || [])
          .map((row) => ({
            date: row.dimensionValues?.[0]?.value || '',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
            users: parseInt(row.metricValues?.[1]?.value || '0', 10),
            pageviews: parseInt(row.metricValues?.[2]?.value || '0', 10),
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Parse Report 6: Top campaigns
        if (batchResponses[6]?.rows && batchResponses[6].rows.length > 0) {
          topCampaigns = batchResponses[6].rows.map((row) => ({
            source: row.dimensionValues?.[0]?.value || '(not set)',
            medium: row.dimensionValues?.[1]?.value || '(not set)',
            campaign: row.dimensionValues?.[2]?.value || '(not set)',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
            users: parseInt(row.metricValues?.[1]?.value || '0', 10),
          }));
        }

        // Parse Report 7: Top events
        if (batchResponses[7]?.rows && batchResponses[7].rows.length > 0) {
          topEvents = batchResponses[7].rows.map((row) => ({
            eventName: row.dimensionValues?.[0]?.value || 'unknown',
            eventCount: parseInt(row.metricValues?.[0]?.value || '0', 10),
          }));
        }

        // Parse Report 8: Top landing pages
        if (batchResponses[8]?.rows && batchResponses[8].rows.length > 0) {
          topLandingPages = batchResponses[8].rows.map((row) => ({
            page: row.dimensionValues?.[0]?.value || '/',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
            bounceRate: parseFloat(row.metricValues?.[1]?.value || '0'),
          }));
        }

        // Parse Report 9: Top cities
        if (batchResponses[9]?.rows && batchResponses[9].rows.length > 0) {
          topCities = batchResponses[9].rows.map((row) => ({
            city: row.dimensionValues?.[0]?.value || 'Unknown',
            country: row.dimensionValues?.[1]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
          }));
        }

        // Parse Report 10: Top regions
        if (batchResponses[10]?.rows && batchResponses[10].rows.length > 0) {
          topRegions = batchResponses[10].rows.map((row) => ({
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
      }), {
        sessions: 0, users: 0, newUsers: 0, returningUsers: 0, pageviews: 0,
        bounceRate: 0, avgSessionDuration: 0, engagementRate: 0, sessionsPerUser: 0, eventCount: 0
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
          .sort((a, b) => (b[metricKeys[0]] || 0) - (a[metricKeys[0]] || 0))
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
    };

    // Cache the result for 5 minutes
    setCache(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error fetching all GA properties:', error);
    return null;
  }
}
