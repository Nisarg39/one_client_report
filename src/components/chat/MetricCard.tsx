/**
 * Metric Card Component
 *
 * Phase 6.7: Displays a single metric with value, trend, and optional icon
 */

'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  formatMetric,
  calculatePercentageChange,
  formatPercentageChange,
  getTrendDirection,
  getTrendColor,
  type MetricFormat,
} from '@/lib/utils/metricFormatters';

export interface MetricCardProps {
  label: string;
  value: number | string;
  previousValue?: number;
  format?: MetricFormat;
  icon?: React.ReactNode;
  formatOptions?: {
    currency?: string;
    decimals?: number;
  };
}

export function MetricCard({
  label,
  value,
  previousValue,
  format = 'number',
  icon,
  formatOptions,
}: MetricCardProps) {
  // Calculate trend
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const change = previousValue
    ? calculatePercentageChange(numValue, previousValue)
    : null;
  const trendDirection = getTrendDirection(change);
  const trendColor = getTrendColor(trendDirection);

  // Format the value
  const formattedValue = formatMetric(numValue, format, formatOptions);

  // Get trend icon
  const TrendIcon =
    trendDirection === 'up'
      ? TrendingUp
      : trendDirection === 'down'
      ? TrendingDown
      : Minus;

  return (
    <div
      className="p-4 rounded-xl bg-[#1a1a1a] shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] transition-all"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
    >
      {/* Header with icon and label */}
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-[#6CA3A2]">{icon}</div>}
        <span className="text-xs font-medium text-[#999] uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Value and trend */}
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-[#e0e0e0]">
          {formattedValue}
        </div>

        {/* Trend indicator */}
        {change !== null && (
          <div
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: trendColor }}
          >
            <TrendIcon className="w-4 h-4" />
            <span>{formatPercentageChange(change)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for MetricCard
 */
export function MetricCardSkeleton() {
  return (
    <div
      className="p-4 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] animate-pulse"
    >
      {/* Label skeleton */}
      <div className="h-3 w-20 bg-[#2a2a2a] rounded mb-3" />

      {/* Value skeleton */}
      <div className="flex items-end justify-between">
        <div className="h-8 w-24 bg-[#2a2a2a] rounded" />
        <div className="h-5 w-16 bg-[#2a2a2a] rounded" />
      </div>
    </div>
  );
}
