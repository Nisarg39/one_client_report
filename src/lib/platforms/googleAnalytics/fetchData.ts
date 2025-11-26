/**
 * Google Analytics Data Fetching Service
 *
 * Fetches real-time data from Google Analytics API
 * for use in AI chat context
 */

import { GoogleAnalyticsClient } from '../google-analytics/client';
import { IPlatformConnection } from '@/models/PlatformConnection';

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
      console.log('[GA Fetch] No property ID in metadata, auto-selecting first property...');
      try {
        const properties = await client.listProperties();
        if (properties.length > 0) {
          propertyId = properties[0].propertyId;
          propertyName = properties[0].displayName;
          console.log(`[GA Fetch] Auto-selected property: ${propertyName} (${propertyId})`);
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
  connection: IPlatformConnection
): Promise<GAMultiPropertyData | null> {
  try {
    const accessToken = connection.getDecryptedAccessToken();
    if (!accessToken) {
      console.error('No access token available for Google Analytics');
      return null;
    }

    const client = new GoogleAnalyticsClient(accessToken);

    // Get all available properties
    const allProperties = await client.listProperties();
    if (allProperties.length === 0) {
      console.log('[GA Fetch] No properties found');
      return null;
    }

    console.log(`[GA Fetch] Found ${allProperties.length} properties, fetching comprehensive data...`);

    // Date range: last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const dateRanges = [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }];

    // Fetch data for each property (limit to first 5 to avoid rate limits)
    const propertiesToFetch = allProperties.slice(0, 5);
    const propertiesData: GAPropertyData[] = [];

    for (const prop of propertiesToFetch) {
      try {
        // 1. Fetch REAL-TIME active users first
        let realtime: GAPropertyData['realtime'] = undefined;
        try {
          const realtimeData = await client.runRealtimeReport(prop.propertyId);
          realtime = {
            activeUsers: realtimeData.activeUsers,
            byDevice: realtimeData.activeUsersByDevice,
          };
          console.log(`[GA Fetch] ${prop.displayName}: ${realtimeData.activeUsers} active users RIGHT NOW`);
        } catch (realtimeError: any) {
          // Real-time might not be available for all properties
          console.log(`[GA Fetch] Realtime not available for ${prop.displayName}: ${realtimeError.message}`);
        }

        // 2. Fetch comprehensive historical metrics
        const metricsResponse = await client.runReport({
          propertyId: prop.propertyId,
          dateRanges,
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'newUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
            { name: 'engagementRate' },
            { name: 'sessionsPerUser' },
            { name: 'eventCount' },
          ],
        });

        const metricsRow = metricsResponse.rows?.[0];
        const metrics = {
          sessions: parseInt(metricsRow?.metricValues?.[0]?.value || '0', 10),
          users: parseInt(metricsRow?.metricValues?.[1]?.value || '0', 10),
          newUsers: parseInt(metricsRow?.metricValues?.[2]?.value || '0', 10),
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

        // Only fetch dimensional data if there's traffic
        if (metrics.sessions > 0) {
          // 3. Fetch top traffic sources with users
          try {
            const sourcesResponse = await client.runReport({
              propertyId: prop.propertyId,
              dateRanges,
              metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
              dimensions: [{ name: 'sessionSource' }],
              limit: 5,
            });
            dimensions.topSources = (sourcesResponse.rows || []).map((row) => ({
              source: row.dimensionValues?.[0]?.value || 'Unknown',
              sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
              users: parseInt(row.metricValues?.[1]?.value || '0', 10),
            }));
          } catch (e) { /* skip on error */ }

          // 4. Fetch device breakdown
          try {
            const devicesResponse = await client.runReport({
              propertyId: prop.propertyId,
              dateRanges,
              metrics: [{ name: 'sessions' }],
              dimensions: [{ name: 'deviceCategory' }],
            });
            const totalSessions = metrics.sessions;
            dimensions.devices = (devicesResponse.rows || []).map((row) => {
              const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);
              return {
                device: row.dimensionValues?.[0]?.value || 'Unknown',
                sessions,
                percentage: totalSessions > 0 ? Math.round((sessions / totalSessions) * 100) : 0,
              };
            });
          } catch (e) { /* skip on error */ }

          // 5. Fetch top pages
          try {
            const pagesResponse = await client.runReport({
              propertyId: prop.propertyId,
              dateRanges,
              metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
              dimensions: [{ name: 'pagePath' }],
              limit: 5,
            });
            dimensions.topPages = (pagesResponse.rows || []).map((row) => ({
              page: row.dimensionValues?.[0]?.value || '/',
              views: parseInt(row.metricValues?.[0]?.value || '0', 10),
              avgTime: parseFloat(row.metricValues?.[1]?.value || '0'),
            }));
          } catch (e) { /* skip on error */ }

          // 6. Fetch top countries
          try {
            const countriesResponse = await client.runReport({
              propertyId: prop.propertyId,
              dateRanges,
              metrics: [{ name: 'activeUsers' }],
              dimensions: [{ name: 'country' }],
              limit: 5,
            });
            dimensions.countries = (countriesResponse.rows || []).map((row) => ({
              country: row.dimensionValues?.[0]?.value || 'Unknown',
              users: parseInt(row.metricValues?.[0]?.value || '0', 10),
            }));
          } catch (e) { /* skip on error */ }

          // 7. Fetch daily breakdown (last 7 days for trends)
          try {
            const last7Days = new Date();
            last7Days.setDate(last7Days.getDate() - 7);
            const dailyResponse = await client.runReport({
              propertyId: prop.propertyId,
              dateRanges: [{ startDate: formatDate(last7Days), endDate: formatDate(endDate) }],
              metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }],
              dimensions: [{ name: 'date' }],
            });
            dimensions.daily = (dailyResponse.rows || []).map((row) => ({
              date: row.dimensionValues?.[0]?.value || '',
              sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
              users: parseInt(row.metricValues?.[1]?.value || '0', 10),
              pageviews: parseInt(row.metricValues?.[2]?.value || '0', 10),
            })).sort((a, b) => a.date.localeCompare(b.date));
          } catch (e) { /* skip on error */ }
        }

        propertiesData.push({
          propertyId: prop.propertyId,
          propertyName: prop.displayName,
          realtime,
          metrics,
          dimensions,
        });

        console.log(`[GA Fetch] ${prop.displayName}: ${metrics.sessions} sessions (30d), ${realtime?.activeUsers || 0} active now`);
      } catch (propError: any) {
        // Skip properties that error (e.g., 429 rate limits on demo properties)
        console.log(`[GA Fetch] Skipping ${prop.displayName}: ${propError.message}`);
      }
    }

    return {
      properties: propertiesData,
      dateRange: `${formatDate(startDate)} to ${formatDate(endDate)}`,
      selectedPropertyId: connection.metadata?.propertyId,
    };
  } catch (error) {
    console.error('Error fetching all GA properties:', error);
    return null;
  }
}
