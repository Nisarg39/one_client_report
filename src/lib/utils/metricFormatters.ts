/**
 * Metric Formatting Utilities
 *
 * Formats various metric types for display in the metrics dashboard
 */

export type MetricFormat = 'number' | 'currency' | 'percentage' | 'duration' | 'decimal';

/**
 * Format a number with commas (e.g., 12345 → "12,345")
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Format a decimal number (e.g., 12.345 → "12.35")
 */
export function formatDecimal(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format currency (e.g., 1234.56 → "$1,234.56")
 */
export function formatCurrency(value: number | string, currency: string = 'USD'): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format percentage (e.g., 0.1234 → "12.3%")
 */
export function formatPercentage(value: number | string, decimals: number = 1): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';

  // If value is already in percentage form (>1), use as is
  // If value is a decimal (0-1), multiply by 100
  const percentage = num > 1 ? num : num * 100;

  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format duration in seconds (e.g., 125 → "2m 5s")
 */
export function formatDuration(seconds: number | string): string {
  const num = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
  if (isNaN(num) || num === 0) return '0s';

  const hours = Math.floor(num / 3600);
  const minutes = Math.floor((num % 3600) / 60);
  const secs = Math.floor(num % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Format metric based on type
 */
export function formatMetric(
  value: number | string,
  format: MetricFormat,
  options?: { currency?: string; decimals?: number }
): string {
  switch (format) {
    case 'number':
      return formatNumber(value);
    case 'currency':
      return formatCurrency(value, options?.currency);
    case 'percentage':
      return formatPercentage(value, options?.decimals);
    case 'duration':
      return formatDuration(value);
    case 'decimal':
      return formatDecimal(value, options?.decimals);
    default:
      return String(value);
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number | null {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

/**
 * Format percentage change with sign (e.g., +12.3%, -5.1%)
 */
export function formatPercentageChange(change: number | null): string {
  if (change === null) return 'N/A';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Get trend direction from percentage change
 */
export function getTrendDirection(change: number | null): 'up' | 'down' | 'neutral' {
  if (change === null || Math.abs(change) < 0.1) return 'neutral';
  return change > 0 ? 'up' : 'down';
}

/**
 * Get color for trend
 */
export function getTrendColor(direction: 'up' | 'down' | 'neutral'): string {
  switch (direction) {
    case 'up':
      return '#4ade80'; // green
    case 'down':
      return '#ef4444'; // red
    case 'neutral':
      return '#6CA3A2'; // teal
  }
}

/**
 * Abbreviate large numbers (e.g., 1000 → "1K", 1500000 → "1.5M")
 */
export function abbreviateNumber(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
  if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
  return `${(value / 1000000000).toFixed(1)}B`;
}
