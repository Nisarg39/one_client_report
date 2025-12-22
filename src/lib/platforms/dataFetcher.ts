/**
 * Unified Platform Data Fetcher
 *
 * Routes between real API data and mock data based on:
 * 1. User account type and restrictions (allowRealAPIs)
 * 2. Client data source (real vs mock)
 *
 * This is the single entry point for fetching platform data in the chat system
 */

import { IUser } from '@/models/User';
import { IClient } from '@/models/Client';
import { IPlatformConnection } from '@/models/PlatformConnection';
import MockDataScenarioModel from '@/models/MockDataScenario';
import { connectDB } from '@/lib/db';

// Real API fetchers
import { fetchAllGoogleAnalyticsProperties } from './googleAnalytics/fetchData';
import { fetchGoogleAdsData } from './google-ads/fetchData';
import { fetchMetaAdsData } from './meta-ads/fetchData';
import { fetchLinkedInAdsData } from './linkedin-ads/fetchData';

// Mock data generators
import { generateMockPlatformData, type PlatformData } from './mock/generator';
import { selectScenarioTemplate } from './mock/scenarios';

/**
 * Platform data response with metadata
 */
export interface PlatformDataResponse {
  data: PlatformData;
  source: 'real' | 'mock' | 'mock-cached';
  scenarioName?: string;
  scenarioId?: string;
  difficulty?: string;
}

/**
 * In-memory cache for generated mock data (24-hour TTL)
 * Key: clientId, Value: { data, generatedAt }
 */
const mockDataCache = new Map<
  string,
  {
    data: PlatformData;
    scenarioName: string;
    scenarioId: string;
    difficulty: string;
    generatedAt: number;
  }
>();

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetch mock platform data (either from DB scenario or generate from template)
 *
 * @param client - Client document
 * @param user - User document (for education metadata)
 * @returns Mock platform data response
 */
async function fetchMockPlatformData(
  client: any,
  user: IUser
): Promise<PlatformDataResponse> {
  const clientId = String(client._id);

  // Check cache first (24-hour TTL)
  const cached = mockDataCache.get(clientId);
  if (cached && Date.now() - cached.generatedAt < CACHE_TTL) {
    return {
      data: cached.data,
      source: 'mock-cached',
      scenarioName: cached.scenarioName,
      scenarioId: cached.scenarioId,
      difficulty: cached.difficulty,
    };
  }

  // If client has assigned scenario, load from database
  if (client.mockScenario) {
    try {
      await connectDB();
      const scenario = await MockDataScenarioModel.findById(client.mockScenario);

      if (scenario) {
        // Increment usage count
        await scenario.incrementUsage();

        const responseData = {
          data: scenario.platformData as PlatformData,
          source: 'mock' as const,
          scenarioName: scenario.name,
          scenarioId: String(scenario._id),
          difficulty: scenario.difficulty,
        };

        // Cache for 24 hours
        mockDataCache.set(clientId, {
          data: scenario.platformData as PlatformData,
          scenarioName: scenario.name,
          scenarioId: String(scenario._id),
          difficulty: scenario.difficulty,
          generatedAt: Date.now(),
        });

        return responseData;
      }
    } catch (dbError) {
      console.error('[Mock Data] Error loading scenario from DB:', dbError);
      // Fall through to generate from template
    }
  }

  // No assigned scenario - generate from template
  // Select template based on client's education metadata or user preferences
  const difficulty = client.educationMetadata?.difficulty;
  const industry = client.educationMetadata?.industry;

  const template = selectScenarioTemplate(difficulty, industry);
  const generatedData = generateMockPlatformData(template);

  const responseData = {
    data: generatedData,
    source: 'mock' as const,
    scenarioName: template.name,
    scenarioId: template.id,
    difficulty: template.difficulty,
  };

  // Cache for 24 hours
  mockDataCache.set(clientId, {
    data: generatedData,
    scenarioName: template.name,
    scenarioId: template.id,
    difficulty: template.difficulty,
    generatedAt: Date.now(),
  });

  return responseData;
}

/**
 * Fetch real platform data from connected APIs
 *
 * @param connections - Array of platform connections
 * @param dateRange - Optional date range for data fetching
 * @returns Real platform data
 */
async function fetchRealPlatformData(
  connections: IPlatformConnection[],
  dateRange?: { startDate?: string; endDate?: string },
  selectedPropertyId?: string,
  selectedMetaCampaignId?: string
): Promise<PlatformData> {
  const platformData: PlatformData = {};

  // Fetch Google Analytics data
  const gaConnection = connections.find(
    (conn) => conn.platformId === 'google-analytics' && conn.status === 'active'
  );

  if (gaConnection && !gaConnection.isExpired()) {
    try {
      const gaData = await fetchAllGoogleAnalyticsProperties(
        gaConnection,
        dateRange?.startDate,
        dateRange?.endDate,
        selectedPropertyId
      );
      if (gaData) {
        platformData.googleAnalyticsMulti = gaData;
      }
    } catch (gaError) {
      console.error('[Real Data] Error fetching Google Analytics:', gaError);
    }
  }

  // Fetch Google Ads data
  const googleAdsConnection = connections.find(
    (conn) => conn.platformId === 'google-ads' && conn.status === 'active'
  );

  if (googleAdsConnection && !googleAdsConnection.isExpired()) {
    try {
      const googleAdsData = await fetchGoogleAdsData(
        googleAdsConnection,
        dateRange?.startDate,
        dateRange?.endDate
      );
      if (googleAdsData) {
        platformData.googleAds = googleAdsData;
      }
    } catch (adsError) {
      console.error('[Real Data] Error fetching Google Ads:', adsError);
    }
  }

  // Fetch Meta Ads data
  const metaConnection = connections.find(
    (conn) => conn.platformId === 'meta-ads' && conn.status === 'active'
  );

  if (metaConnection && !metaConnection.isExpired()) {
    try {
      const metaData = await fetchMetaAdsData(
        metaConnection,
        dateRange?.startDate,
        dateRange?.endDate,
        selectedMetaCampaignId
      );
      if (metaData) {
        platformData.metaAds = metaData;
      }
    } catch (metaError) {
      console.error('[Real Data] Error fetching Meta Ads:', metaError);
    }
  }

  // Fetch LinkedIn Ads data
  const linkedInConnection = connections.find(
    (conn) => conn.platformId === 'linkedin-ads' && conn.status === 'active'
  );

  if (linkedInConnection && !linkedInConnection.isExpired()) {
    try {
      const linkedInData = await fetchLinkedInAdsData(
        linkedInConnection,
        dateRange?.startDate,
        dateRange?.endDate
      );
      if (linkedInData) {
        platformData.linkedInAds = linkedInData;
      }
    } catch (linkedInError) {
      console.error('[Real Data] Error fetching LinkedIn Ads:', linkedInError);
    }
  }

  return platformData;
}

/**
 * Main entry point: Fetch platform data (real or mock)
 *
 * Logic:
 * 1. Check user.restrictions.allowRealAPIs AND client.dataSource
 * 2. If education mode OR mock source: return mock data
 * 3. If business mode AND real source: return real API data
 *
 * @param client - Client document
 * @param user - User document
 * @param connections - Platform connections (for real data)
 * @param dateRange - Optional date range
 * @returns Platform data with source metadata
 */
export async function fetchPlatformData(
  client: any,
  user: IUser,
  connections: IPlatformConnection[] = [],
  dateRange?: { startDate?: string; endDate?: string },
  selectedPropertyId?: string,
  selectedMetaCampaignId?: string
): Promise<PlatformDataResponse> {
  // Determine if we should use mock data
  const useMockData =
    !user.restrictions.allowRealAPIs || // User restricted from real APIs
    client.dataSource === 'mock' || // Client explicitly set to mock
    user.accountType === 'education'; // Education account (safety check)

  if (useMockData) {
    return await fetchMockPlatformData(client, user);
  }

  // Use real API data
  const realData = await fetchRealPlatformData(connections, dateRange, selectedPropertyId, selectedMetaCampaignId);

  return {
    data: realData,
    source: 'real',
  };
}

/**
 * Clear mock data cache for a specific client
 * (useful when client scenario is reassigned)
 */
export function clearMockDataCache(clientId: string): void {
  mockDataCache.delete(clientId);
}

/**
 * Clear all mock data cache
 * (useful for development/testing)
 */
export function clearAllMockDataCache(): void {
  mockDataCache.clear();
}
