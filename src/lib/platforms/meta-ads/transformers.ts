/**
 * Meta Ads Data Transformers
 *
 * Transform Meta API responses to normalized format
 */

import { NormalizedMetric } from '../types';
import { MetaInsightsResponse, META_METRIC_MAP, META_DIMENSION_MAP } from './types';

/**
 * Transform Meta Insights API response to normalized metrics
 *
 * @param response - Meta Insights API response
 * @returns Array of normalized metrics
 */
export function transformMetaInsights(
  response: MetaInsightsResponse
): NormalizedMetric[] {
  const results: NormalizedMetric[] = [];

  if (!response.data || response.data.length === 0) {
    return results;
  }

  response.data.forEach((row) => {
    const date = row.date_start || new Date().toISOString().split('T')[0];

    // Extract dimensions
    const dimensions: Record<string, string> = {};
    if (row.campaign_id) dimensions.campaign_id = row.campaign_id;
    if (row.campaign_name) dimensions.campaign_name = row.campaign_name;
    if (row.adset_id) dimensions.adset_id = row.adset_id;
    if (row.adset_name) dimensions.adset_name = row.adset_name;
    if (row.ad_id) dimensions.ad_id = row.ad_id;
    if (row.ad_name) dimensions.ad_name = row.ad_name;

    // Transform each metric
    Object.entries(row).forEach(([key, value]) => {
      // Skip meta fields
      if (key === 'date_start' || key === 'date_stop') return;
      if (key.includes('_id') || key.includes('_name')) return;

      // Parse metric value
      const metricValue = typeof value === 'number' ? value : parseFloat(value) || 0;

      results.push({
        date,
        metric: key,
        value: metricValue,
        dimensions,
        metadata: {
          platform: 'meta-ads',
          date_stop: row.date_stop,
        },
      });
    });
  });

  return results;
}

/**
 * Map user-friendly metric name to Meta API name
 *
 * @param metricName - User-friendly metric name
 * @returns Meta API metric name
 */
export function mapMetricName(metricName: string): string {
  return META_METRIC_MAP[metricName] || metricName;
}

/**
 * Map user-friendly dimension name to Meta API name
 *
 * @param dimensionName - User-friendly dimension name
 * @returns Meta API dimension name
 */
export function mapDimensionName(dimensionName: string): string {
  return META_DIMENSION_MAP[dimensionName] || dimensionName;
}

/**
 * Map multiple metric names
 *
 * @param metrics - Array of user-friendly metric names
 * @returns Array of Meta API metric names
 */
export function mapMetricNames(metrics: string[]): string[] {
  return metrics.map(mapMetricName);
}

/**
 * Map multiple dimension names
 *
 * @param dimensions - Array of user-friendly dimension names
 * @returns Array of Meta API dimension names
 */
export function mapDimensionNames(dimensions: string[]): string[] {
  return dimensions.map(mapDimensionName);
}

/**
 * Reverse map Meta API metric name to user-friendly name
 *
 * @param apiName - Meta API metric name
 * @returns User-friendly metric name
 */
export function reverseMapMetricName(apiName: string): string {
  for (const [friendly, api] of Object.entries(META_METRIC_MAP)) {
    if (api === apiName) {
      return friendly;
    }
  }
  return apiName;
}

/**
 * Convert date range to Meta time range format
 *
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Meta time range object
 */
export function createMetaTimeRange(
  startDate: string,
  endDate: string
): { since: string; until: string } {
  return {
    since: startDate,
    until: endDate,
  };
}

/**
 * Format currency value
 *
 * @param value - Currency value in cents
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return `$${(value / 100).toFixed(2)}`;
}

/**
 * Format percentage value
 *
 * @param value - Percentage value (0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
