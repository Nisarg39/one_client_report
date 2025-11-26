/**
 * Google Analytics Data Transformers
 *
 * Transform GA4 API responses to normalized format
 */

import { NormalizedMetric } from '../types';
import { GA4Response, GA_METRIC_MAP, GA_DIMENSION_MAP } from './types';

/**
 * Transform GA4 API response to normalized metrics
 *
 * @param response - GA4 API response
 * @returns Array of normalized metrics
 */
export function transformGA4Response(response: GA4Response): NormalizedMetric[] {
  const results: NormalizedMetric[] = [];

  if (!response.rows || response.rows.length === 0) {
    return results;
  }

  response.rows.forEach((row) => {
    // Extract dimensions
    const dimensions: Record<string, string> = {};

    if (row.dimensionValues && response.dimensionHeaders) {
      row.dimensionValues.forEach((dim, index) => {
        const dimensionName = response.dimensionHeaders![index].name;
        dimensions[dimensionName] = dim.value;
      });
    }

    // Extract metrics
    if (row.metricValues && response.metricHeaders) {
      row.metricValues.forEach((metric, index) => {
        const metricName = response.metricHeaders![index].name;
        const metricValue = parseFloat(metric.value) || 0;

        results.push({
          date: dimensions.date || new Date().toISOString().split('T')[0],
          metric: metricName,
          value: metricValue,
          dimensions,
          metadata: {
            platform: 'google-analytics',
            metricType: response.metricHeaders![index].type,
          },
        });
      });
    }
  });

  return results;
}

/**
 * Map user-friendly metric name to GA4 API name
 *
 * @param metricName - User-friendly metric name
 * @returns GA4 API metric name
 */
export function mapMetricName(metricName: string): string {
  return GA_METRIC_MAP[metricName] || metricName;
}

/**
 * Map user-friendly dimension name to GA4 API name
 *
 * @param dimensionName - User-friendly dimension name
 * @returns GA4 API dimension name
 */
export function mapDimensionName(dimensionName: string): string {
  return GA_DIMENSION_MAP[dimensionName] || dimensionName;
}

/**
 * Map multiple metric names
 *
 * @param metrics - Array of user-friendly metric names
 * @returns Array of GA4 API metric names
 */
export function mapMetricNames(metrics: string[]): string[] {
  return metrics.map(mapMetricName);
}

/**
 * Map multiple dimension names
 *
 * @param dimensions - Array of user-friendly dimension names
 * @returns Array of GA4 API dimension names
 */
export function mapDimensionNames(dimensions: string[]): string[] {
  return dimensions.map(mapDimensionName);
}

/**
 * Reverse map GA4 API metric name to user-friendly name
 *
 * @param apiName - GA4 API metric name
 * @returns User-friendly metric name
 */
export function reverseMapMetricName(apiName: string): string {
  for (const [friendly, api] of Object.entries(GA_METRIC_MAP)) {
    if (api === apiName) {
      return friendly;
    }
  }
  return apiName;
}

/**
 * Reverse map GA4 API dimension name to user-friendly name
 *
 * @param apiName - GA4 API dimension name
 * @returns User-friendly dimension name
 */
export function reverseMapDimensionName(apiName: string): string {
  for (const [friendly, api] of Object.entries(GA_DIMENSION_MAP)) {
    if (api === apiName) {
      return friendly;
    }
  }
  return apiName;
}

/**
 * Format metric value based on type
 *
 * @param value - Metric value
 * @param metricType - GA4 metric type
 * @returns Formatted value
 */
export function formatMetricValue(
  value: number,
  metricType?: string
): string | number {
  switch (metricType) {
    case 'TYPE_CURRENCY':
      return `$${value.toFixed(2)}`;
    case 'TYPE_PERCENT':
      return `${(value * 100).toFixed(2)}%`;
    case 'TYPE_SECONDS':
      return `${Math.round(value)}s`;
    case 'TYPE_INTEGER':
      return Math.round(value);
    default:
      return value;
  }
}
