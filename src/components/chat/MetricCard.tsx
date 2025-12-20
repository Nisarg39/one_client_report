/**
 * Metric Card Component
 *
 * Phase 6.7: Displays a single metric with value, trend, and optional icon
 */

'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="p-4 rounded-2xl bg-[#151515] shadow-neu-inset border border-white/5 transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#6CA3A2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header with icon and label */}
      <div className="flex items-center gap-2 mb-3 opacity-60">
        {icon && (
          <div className="text-[#6CA3A2]">
            {/* Clone icon to apply specific size if it's a lucide icon */}
            {icon}
          </div>
        )}
        <span className="text-[9px] font-black text-[#888] uppercase tracking-[0.2em] italic">
          {label}
        </span>
      </div>

      {/* Value and trend */}
      <div className="flex items-end justify-between relative z-10">
        <div className="text-xl sm:text-2xl font-black text-white italic tracking-tighter leading-none">
          {formattedValue}
        </div>

        {/* Trend indicator */}
        {change !== null && (
          <div
            className="flex items-center gap-1 text-[10px] font-black italic"
            style={{ color: trendColor }}
          >
            <TrendIcon className="w-3 h-3" />
            <span>{formatPercentageChange(change)}</span>
          </div>
        )}
      </div>

      {/* Subtle indicator bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#6CA3A2]/10 group-hover:bg-[#6CA3A2]/30 transition-colors" />
    </motion.div>
  );
}

/**
 * Skeleton loader for MetricCard
 */
export function MetricCardSkeleton() {
  return (
    <div
      className="p-4 rounded-2xl bg-[#1c1c1c] shadow-neu-inset border border-white/5 animate-pulse"
    >
      <div className="h-2 w-16 bg-[#1a1a1a] rounded mb-4" />
      <div className="flex items-end justify-between">
        <div className="h-8 w-24 bg-[#1a1a1a] rounded" />
        <div className="h-4 w-12 bg-[#1a1a1a] rounded" />
      </div>
    </div>
  );
}
