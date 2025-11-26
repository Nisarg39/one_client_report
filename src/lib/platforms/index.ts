/**
 * Platform Integration Index
 *
 * Main entry point for platform services
 * Provides factory for creating platform instances and utilities
 */

import {
  IPlatform,
  PlatformCredentials,
  SupportedPlatform,
  MetricQuery,
  PlatformResponse,
} from './types';
import { GoogleAnalyticsService } from './google-analytics';
import { MetaAdsService } from './meta-ads';
import { GoogleAdsService } from './google-ads';
import { LinkedInAdsService } from './linkedin-ads';

/**
 * Platform Service Factory
 *
 * Creates the appropriate platform service instance based on platform ID
 */
export class PlatformServiceFactory {
  /**
   * Create platform service instance
   *
   * @param platformId - The platform identifier
   * @param credentials - Platform credentials (optional for some operations)
   * @returns Platform service instance
   * @throws Error if platform is not supported
   */
  static create(platformId: SupportedPlatform): IPlatform {
    switch (platformId) {
      case 'google-analytics':
        return new GoogleAnalyticsService();

      case 'meta-ads':
        return new MetaAdsService();

      case 'google-ads':
        return new GoogleAdsService();

      case 'linkedin-ads':
        return new LinkedInAdsService();

      default:
        throw new Error(`Unsupported platform: ${platformId}`);
    }
  }

  /**
   * Get list of supported platforms
   */
  static getSupportedPlatforms(): SupportedPlatform[] {
    return ['google-analytics', 'meta-ads', 'google-ads', 'linkedin-ads'];
  }

  /**
   * Check if platform is supported
   */
  static isPlatformSupported(platformId: string): platformId is SupportedPlatform {
    return this.getSupportedPlatforms().includes(platformId as SupportedPlatform);
  }
}

/**
 * Fetch data from multiple platforms in parallel
 *
 * @param platforms - Array of platform IDs and credentials
 * @param query - Metric query to execute
 * @returns Array of platform responses
 */
export async function fetchFromMultiplePlatforms(
  platforms: Array<{ id: SupportedPlatform; credentials: PlatformCredentials }>,
  query: MetricQuery
): Promise<PlatformResponse[]> {
  const promises = platforms.map(async ({ id, credentials }) => {
    try {
      const service = PlatformServiceFactory.create(id);
      return await service.fetchMetrics(credentials, query);
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  });

  return Promise.all(promises);
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platformId: SupportedPlatform): string {
  const names: Record<SupportedPlatform, string> = {
    'google-analytics': 'Google Analytics',
    'meta-ads': 'Meta Ads',
    'google-ads': 'Google Ads',
    'linkedin-ads': 'LinkedIn Ads',
  };

  return names[platformId];
}

/**
 * Get platform icon/color
 */
export function getPlatformMeta(platformId: SupportedPlatform): {
  color: string;
  icon: string;
} {
  const meta: Record<SupportedPlatform, { color: string; icon: string }> = {
    'google-analytics': { color: '#E37400', icon: 'BarChart2' },
    'meta-ads': { color: '#1877F2', icon: 'Facebook' },
    'google-ads': { color: '#4285F4', icon: 'Search' },
    'linkedin-ads': { color: '#0A66C2', icon: 'Linkedin' },
  };

  return meta[platformId];
}

// Re-export types
export * from './types';
export { BasePlatform } from './base-platform';
export { encryptToken, decryptToken, generateEncryptionKey } from './encryption';
