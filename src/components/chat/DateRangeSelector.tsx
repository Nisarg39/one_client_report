'use client';

/**
 * DateRangeSelector Component
 *
 * Allows users to select date ranges for platform data filtering
 * Supports preset ranges (Last 7d, 30d, 90d, YTD) and custom range selection
 */

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/useChatStore';
import {
  type DatePreset,
  getDateRangeForPreset,
  getAllPresets,
  getPresetLabel,
  formatDateRange,
  isValidISODate,
} from '@/lib/utils/datePresets';

interface DateRangeSelectorProps {
  disabled?: boolean;
}

export function DateRangeSelector({ disabled = false }: DateRangeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [error, setError] = useState('');

  const {
    dateRangeFilter,
    selectedDatePreset,
    setDateRangeFilter,
    setSelectedDatePreset,
    clearDateRangeFilter,
  } = useChatStore();

  /**
   * Handle preset selection
   */
  const handlePresetSelect = (preset: DatePreset) => {
    setError('');

    if (preset === 'custom') {
      setShowCustomPicker(true);
      setSelectedDatePreset(preset);
      return;
    }

    // Calculate date range for preset
    const dateRange = getDateRangeForPreset(preset);
    if (dateRange) {
      setDateRangeFilter(dateRange);
      setSelectedDatePreset(preset);
      setShowCustomPicker(false);
    }
  };

  /**
   * Handle custom date range submission
   */
  const handleCustomSubmit = () => {
    setError('');

    // Validate dates
    if (!customStartDate || !customEndDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (!isValidISODate(customStartDate) || !isValidISODate(customEndDate)) {
      setError('Invalid date format');
      return;
    }

    const start = new Date(customStartDate);
    const end = new Date(customEndDate);

    if (start > end) {
      setError('Start date must be before end date');
      return;
    }

    // Check if date range is reasonable (not more than 2 years)
    const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 730) {
      setError('Date range cannot exceed 2 years');
      return;
    }

    // Set the custom date range
    setDateRangeFilter({
      startDate: customStartDate,
      endDate: customEndDate,
    });
    setSelectedDatePreset('custom');
    setShowCustomPicker(false);
  };

  /**
   * Handle clear filter
   */
  const handleClear = () => {
    clearDateRangeFilter();
    setShowCustomPicker(false);
    setCustomStartDate('');
    setCustomEndDate('');
    setError('');
  };

  /**
   * Get display text for current selection
   */
  const getDisplayText = (): string => {
    if (!dateRangeFilter) {
      return 'Last 30 days (default)';
    }

    if (selectedDatePreset === 'custom') {
      return `Custom: ${formatDateRange(dateRangeFilter)}`;
    }

    return getPresetLabel(selectedDatePreset);
  };

  const presets = getAllPresets();

  return (
    <div className="relative">
      {/* Header Button */}
      <button
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
          disabled
            ? 'text-[#808080] cursor-not-allowed opacity-60 bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]'
            : 'text-[#c0c0c0] bg-[#1a1a1a] shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]'
        }`}
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        title={disabled ? 'Date range cannot be changed after starting a conversation' : undefined}
      >
        <div className="flex items-center gap-2">
          {disabled ? (
            <Lock className="w-4 h-4 text-[#808080]" />
          ) : (
            <Calendar className="w-4 h-4 text-[#6CA3A2]" />
          )}
          <span className="font-medium">Date Range</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${disabled ? 'text-[#808080]' : 'text-[#c0c0c0]'}`}>
            {getDisplayText()}
          </span>
          {!disabled && (isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#6CA3A2]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6CA3A2]" />
          ))}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 space-y-3">
              {/* Preset Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    className={`px-3 py-2 text-xs rounded-xl font-medium transition-all ${
                      selectedDatePreset === preset.value
                        ? 'bg-[#6CA3A2] text-white shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)]'
                        : 'bg-[#1a1a1a] text-[#c0c0c0] shadow-[-2px_-2px_6px_rgba(60,60,60,0.3),2px_2px_6px_rgba(0,0,0,0.6)] hover:shadow-[-1px_-1px_4px_rgba(60,60,60,0.3),1px_1px_4px_rgba(0,0,0,0.6)]'
                    }`}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Picker */}
              <AnimatePresence>
                {showCustomPicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 pt-3 border-t border-gray-800/50"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-[#c0c0c0] mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.4)] focus:outline-none focus:border-[#6CA3A2] focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.5)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#c0c0c0] mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          End Date
                        </label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.4)] focus:outline-none focus:border-[#6CA3A2] focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.5)] transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-xl" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleCustomSubmit}
                      className="w-full px-4 py-2.5 text-xs font-medium bg-[#6CA3A2] text-white rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      Apply Custom Range
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear Filter Button */}
              {dateRangeFilter && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-medium bg-[#1a1a1a] text-[#c0c0c0] rounded-xl shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  <X className="w-3 h-3" />
                  Clear Filter (Use Default)
                </motion.button>
              )}

              {/* Info Text */}
              <p className="text-xs text-[#808080] text-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {dateRangeFilter
                  ? 'Platform data will be fetched for the selected date range'
                  : 'Using default range (last 30 days)'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disabled Info Banner */}
      {disabled && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-xs text-[#808080] bg-[#252525] px-3 py-2.5 rounded-xl shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2)] border border-gray-800/30" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            <Lock className="w-3 h-3 flex-shrink-0" />
            <span>Date range is locked for this conversation. Start a new chat to change it.</span>
          </div>
        </div>
      )}
    </div>
  );
}
