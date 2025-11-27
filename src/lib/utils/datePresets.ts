/**
 * Date Preset Utilities
 *
 * Provides utilities for calculating date ranges based on preset selections
 * Used by the DateRangeSelector component for quick date range selection
 */

export type DatePreset = 'last_7d' | 'last_30d' | 'last_90d' | 'ytd' | 'custom';

export interface DateRange {
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate: string;   // ISO 8601 format (YYYY-MM-DD)
}

/**
 * Format a Date object to ISO 8601 date string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get date range for a preset
 *
 * @param preset - The preset to calculate
 * @returns Date range with startDate and endDate in ISO 8601 format
 */
export function getDateRangeForPreset(preset: DatePreset): DateRange | null {
  const today = new Date();
  const endDate = formatDateToISO(today);

  switch (preset) {
    case 'last_7d': {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      return {
        startDate: formatDateToISO(start),
        endDate,
      };
    }

    case 'last_30d': {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      return {
        startDate: formatDateToISO(start),
        endDate,
      };
    }

    case 'last_90d': {
      const start = new Date(today);
      start.setDate(start.getDate() - 90);
      return {
        startDate: formatDateToISO(start),
        endDate,
      };
    }

    case 'ytd': {
      // Year to date - from January 1st of current year to today
      const start = new Date(today.getFullYear(), 0, 1);
      return {
        startDate: formatDateToISO(start),
        endDate,
      };
    }

    case 'custom':
      // Custom requires user input, return null
      return null;

    default:
      return null;
  }
}

/**
 * Get human-readable label for a preset
 *
 * @param preset - The preset
 * @returns Human-readable label
 */
export function getPresetLabel(preset: DatePreset): string {
  const labels: Record<DatePreset, string> = {
    last_7d: 'Last 7 days',
    last_30d: 'Last 30 days',
    last_90d: 'Last 90 days',
    ytd: 'Year to date',
    custom: 'Custom range',
  };
  return labels[preset];
}

/**
 * Get all available presets with their labels
 *
 * @returns Array of preset options
 */
export function getAllPresets(): Array<{ value: DatePreset; label: string }> {
  const presets: DatePreset[] = ['last_7d', 'last_30d', 'last_90d', 'ytd', 'custom'];
  return presets.map((preset) => ({
    value: preset,
    label: getPresetLabel(preset),
  }));
}

/**
 * Validate if a date string is in valid ISO 8601 format
 *
 * @param dateString - The date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidISODate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && formatDateToISO(date) === dateString;
}

/**
 * Parse a date range object into a formatted display string
 *
 * @param dateRange - The date range to format
 * @returns Formatted string like "2024-01-01 to 2024-01-31"
 */
export function formatDateRange(dateRange: DateRange): string {
  return `${dateRange.startDate} to ${dateRange.endDate}`;
}
