/**
 * Google Ads Data Transformers
 *
 * Transform Google Ads API responses to normalized format
 */

import { NormalizedMetric } from '../types';
import {
  GoogleAdsQueryResponse,
  GOOGLE_ADS_METRIC_MAP,
  GOOGLE_ADS_DIMENSION_MAP,
} from './types';

/**
 * Transform Google Ads query response to normalized metrics
 *
 * @param response - Google Ads API response
 * @returns Array of normalized metrics
 */
export function transformGoogleAdsResponse(
  response: GoogleAdsQueryResponse
): NormalizedMetric[] {
  const results: NormalizedMetric[] = [];

  if (!response.results || response.results.length === 0) {
    return results;
  }

  response.results.forEach((row) => {
    // Extract dimensions
    const dimensions: Record<string, string> = {};

    if (row.campaign) {
      dimensions.campaign_id = row.campaign.id;
      dimensions.campaign_name = row.campaign.name;
      if (row.campaign.status) {
        dimensions.campaign_status = row.campaign.status;
      }
    }

    if (row.adGroup) {
      dimensions.ad_group_id = row.adGroup.id;
      dimensions.ad_group_name = row.adGroup.name;
    }

    if (row.segments) {
      if (row.segments.date) {
        dimensions.date = row.segments.date;
      }
      if (row.segments.device) {
        dimensions.device = row.segments.device;
      }
    }

    // Extract metrics
    if (row.metrics) {
      Object.entries(row.metrics).forEach(([key, value]) => {
        let metricValue: number;

        // Handle different metric formats
        if (key === 'cost_micros') {
          // Convert micros to dollars
          metricValue = parseInt(String(value)) / 1_000_000;
        } else if (typeof value === 'string') {
          metricValue = parseFloat(value) || 0;
        } else {
          metricValue = Number(value) || 0;
        }

        results.push({
          date: dimensions.date || new Date().toISOString().split('T')[0],
          metric: key,
          value: metricValue,
          dimensions,
          metadata: {
            platform: 'google-ads',
          },
        });
      });
    }
  });

  return results;
}

/**
 * Map user-friendly metric name to Google Ads API name
 *
 * @param metricName - User-friendly metric name
 * @returns Google Ads API metric name
 */
export function mapMetricName(metricName: string): string {
  return GOOGLE_ADS_METRIC_MAP[metricName] || metricName;
}

/**
 * Map user-friendly dimension name to Google Ads API name
 *
 * @param dimensionName - User-friendly dimension name
 * @returns Google Ads API dimension name
 */
export function mapDimensionName(dimensionName: string): string {
  return GOOGLE_ADS_DIMENSION_MAP[dimensionName] || dimensionName;
}

/**
 * Map multiple metric names
 *
 * @param metrics - Array of user-friendly metric names
 * @returns Array of Google Ads API metric names
 */
export function mapMetricNames(metrics: string[]): string[] {
  return metrics.map(mapMetricName);
}

/**
 * Map multiple dimension names
 *
 * @param dimensions - Array of user-friendly dimension names
 * @returns Array of Google Ads API dimension names
 */
export function mapDimensionNames(dimensions: string[]): string[] {
  return dimensions.map(mapDimensionName);
}

/**
 * Reverse map Google Ads API metric name to user-friendly name
 *
 * @param apiName - Google Ads API metric name
 * @returns User-friendly metric name
 */
export function reverseMapMetricName(apiName: string): string {
  for (const [friendly, api] of Object.entries(GOOGLE_ADS_METRIC_MAP)) {
    if (api === apiName) {
      return friendly;
    }
  }
  return apiName;
}

/**
 * Build Google Ads Query Language (GAQL) query
 *
 * @param metrics - Metrics to select
 * @param dimensions - Dimensions to select
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @param filters - Optional filters
 * @returns GAQL query string
 */
export function buildGAQLQuery(
  metrics: string[],
  dimensions: string[],
  startDate: string,
  endDate: string,
  filters?: Record<string, any>
): string {
  const mappedMetrics = mapMetricNames(metrics);
  const mappedDimensions = mapDimensionNames(dimensions);

  // Always include date segment
  const allDimensions = [...new Set(['segments.date', ...mappedDimensions])];

  const selectFields = [...allDimensions, ...mappedMetrics].join(', ');

  let query = `
    SELECT ${selectFields}
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
  `;

  // Add filters if provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      const mappedKey = mapDimensionName(key);
      if (typeof value === 'string') {
        query += ` AND ${mappedKey} = '${value}'`;
      } else {
        query += ` AND ${mappedKey} = ${value}`;
      }
    });
  }

  query += ' ORDER BY segments.date DESC';

  return query.trim();
}

/**
 * Convert cost from micros to currency
 *
 * @param costMicros - Cost in micros (1/1,000,000 of currency unit)
 * @returns Cost in currency units
 */
export function convertCostMicros(costMicros: number | string): number {
  const micros = typeof costMicros === 'string' ? parseInt(costMicros) : costMicros;
  return micros / 1_000_000;
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
