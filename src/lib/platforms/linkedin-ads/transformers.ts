/**
 * LinkedIn Ads Data Transformers
 *
 * Transform LinkedIn Marketing API responses to normalized format
 */

import { NormalizedMetric } from '../types';
import {
  LinkedInAdsAnalyticsResponse,
  LINKEDIN_ADS_METRIC_MAP,
  LINKEDIN_ADS_DIMENSION_MAP,
  LinkedInAdsDateRange,
} from './types';

/**
 * Transform LinkedIn Ads analytics response to normalized metrics
 *
 * @param response - LinkedIn Ads API response
 * @returns Array of normalized metrics
 */
export function transformLinkedInAdsResponse(
  response: LinkedInAdsAnalyticsResponse
): NormalizedMetric[] {
  const results: NormalizedMetric[] = [];

  if (!response.elements || response.elements.length === 0) {
    return results;
  }

  response.elements.forEach((element) => {
    // Extract date
    const date = element.dateRange
      ? formatLinkedInDate(element.dateRange.start)
      : new Date().toISOString().split('T')[0];

    // Extract dimensions
    const dimensions: Record<string, string> = {};

    if (element.pivotValue) {
      // Extract ID from URN (e.g., "urn:li:sponsoredCampaign:123456" -> "123456")
      const pivotId = element.pivotValue.split(':').pop() || element.pivotValue;
      dimensions.pivot_value = pivotId;
    }

    // Transform each metric in the element
    Object.entries(element).forEach(([key, value]) => {
      // Skip non-metric fields
      if (
        key === 'dateRange' ||
        key === 'pivotValue' ||
        value === null ||
        value === undefined
      ) {
        return;
      }

      const metricValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;

      results.push({
        date,
        metric: key,
        value: metricValue,
        dimensions,
        metadata: {
          platform: 'linkedin-ads',
        },
      });
    });
  });

  return results;
}

/**
 * Map user-friendly metric name to LinkedIn Ads API name
 *
 * @param metricName - User-friendly metric name
 * @returns LinkedIn Ads API metric name
 */
export function mapMetricName(metricName: string): string {
  return LINKEDIN_ADS_METRIC_MAP[metricName] || metricName;
}

/**
 * Map user-friendly dimension name to LinkedIn Ads API name
 *
 * @param dimensionName - User-friendly dimension name
 * @returns LinkedIn Ads API dimension name
 */
export function mapDimensionName(dimensionName: string): string {
  return LINKEDIN_ADS_DIMENSION_MAP[dimensionName] || dimensionName;
}

/**
 * Map multiple metric names
 *
 * @param metrics - Array of user-friendly metric names
 * @returns Array of LinkedIn Ads API metric names
 */
export function mapMetricNames(metrics: string[]): string[] {
  return metrics.map(mapMetricName);
}

/**
 * Map multiple dimension names
 *
 * @param dimensions - Array of user-friendly dimension names
 * @returns Array of LinkedIn Ads API dimension names
 */
export function mapDimensionNames(dimensions: string[]): string[] {
  return dimensions.map(mapDimensionName);
}

/**
 * Reverse map LinkedIn Ads API metric name to user-friendly name
 *
 * @param apiName - LinkedIn Ads API metric name
 * @returns User-friendly metric name
 */
export function reverseMapMetricName(apiName: string): string {
  for (const [friendly, api] of Object.entries(LINKEDIN_ADS_METRIC_MAP)) {
    if (api === apiName) {
      return friendly;
    }
  }
  return apiName;
}

/**
 * Convert date string to LinkedIn date object
 *
 * @param dateString - Date string (YYYY-MM-DD)
 * @returns LinkedIn date object
 */
export function parseLinkedInDate(dateString: string): {
  year: number;
  month: number;
  day: number;
} {
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // JavaScript months are 0-indexed
    day: date.getDate(),
  };
}

/**
 * Format LinkedIn date object to string
 *
 * @param date - LinkedIn date object
 * @returns Date string (YYYY-MM-DD)
 */
export function formatLinkedInDate(date: {
  year: number;
  month: number;
  day: number;
}): string {
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${date.year}-${month}-${day}`;
}

/**
 * Create LinkedIn date range from start and end strings
 *
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns LinkedIn date range object
 */
export function createLinkedInDateRange(
  startDate: string,
  endDate: string
): LinkedInAdsDateRange {
  return {
    start: parseLinkedInDate(startDate),
    end: parseLinkedInDate(endDate),
  };
}

/**
 * Format currency value
 *
 * @param value - Currency value
 * @param currencyCode - Currency code (e.g., 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

/**
 * Format percentage value
 *
 * @param value - Percentage value (0-1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Calculate derived metrics
 *
 * @param metrics - Raw metrics
 * @returns Metrics with calculated values
 */
export function calculateDerivedMetrics(metrics: Record<string, number>): Record<string, number> {
  const derived = { ...metrics };

  // Calculate CTR if we have impressions and clicks
  if (metrics.impressions && metrics.clicks) {
    derived.clickThroughRate = metrics.clicks / metrics.impressions;
  }

  // Calculate average CPC if we have cost and clicks
  if (metrics.costInLocalCurrency && metrics.clicks) {
    derived.averageCostPerClick = metrics.costInLocalCurrency / metrics.clicks;
  }

  // Calculate average CPM if we have cost and impressions
  if (metrics.costInLocalCurrency && metrics.impressions) {
    derived.averageCostPerImpression = (metrics.costInLocalCurrency / metrics.impressions) * 1000;
  }

  // Calculate engagement rate
  const engagementActions =
    (metrics.likes || 0) +
    (metrics.comments || 0) +
    (metrics.shares || 0) +
    (metrics.follows || 0);

  if (metrics.impressions && engagementActions) {
    derived.engagementRate = engagementActions / metrics.impressions;
  }

  return derived;
}
