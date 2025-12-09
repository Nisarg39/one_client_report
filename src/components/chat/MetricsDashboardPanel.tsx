/**
 * Metrics Dashboard Panel Component
 *
 * Phase 6.7: Displays platform metrics alongside AI chatbot
 * Allows users to verify AI responses against raw data
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { PlatformTabs } from './PlatformTabs';
import { MetricsGrid } from './MetricsGrid';
import { PropertySelector } from './PropertySelector';

interface MetricsDashboardPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function MetricsDashboardPanel({
  isVisible,
  onToggle,
}: MetricsDashboardPanelProps) {
  const {
    metricsDashboard,
    platformData,
    platformDataTimestamp,
    setMetricsDashboardPropertyId,
  } = useChatStore();

  // Check if data is stale (>5 minutes old)
  const isStale =
    platformDataTimestamp && Date.now() - platformDataTimestamp > 5 * 60 * 1000;

  // Get connected platforms from platform data
  // Show tabs for ALL connected platforms, even if data is null
  const connectedPlatforms = platformData
    ? Object.entries(platformData.platforms)
        .map(([key]) => key as any)
    : [];

  // Extract Google Analytics properties for property selector
  const gaData = platformData?.platforms?.googleAnalytics;
  const gaProperties =
    gaData?.properties?.map((p: any) => ({
      propertyId: p.propertyId,
      propertyName: p.propertyName,
    })) || [];
  const isGoogleAnalyticsSelected = metricsDashboard.selectedPlatform === 'googleAnalytics';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 bg-[#1a1a1a] border-l border-[#333] overflow-hidden flex flex-col"
          style={{
            width: `${metricsDashboard.width}px`,
            zIndex: 40,
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-[#333] flex items-center justify-between">
            <h2
              className="text-lg font-semibold text-[#e0e0e0]"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Platform Metrics
            </h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-[#252525] transition-colors"
              aria-label="Close metrics panel"
            >
              <X className="w-5 h-5 text-[#999]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!platformData ? (
              // No data state
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
                  <Loader2 className="w-8 h-8 text-[#6CA3A2] animate-spin" />
                </div>
                <h3
                  className="text-base font-medium text-[#c0c0c0] mb-2"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  No metrics data yet
                </h3>
                <p
                  className="text-sm text-[#808080]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Send a message to load platform metrics
                </p>
              </div>
            ) : connectedPlatforms.length === 0 ? (
              // No connected platforms state
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
                  <span className="text-2xl">📊</span>
                </div>
                <h3
                  className="text-base font-medium text-[#c0c0c0] mb-2"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  No platforms connected
                </h3>
                <p
                  className="text-sm text-[#808080] mb-4"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Connect a platform to see metrics here
                </p>
              </div>
            ) : (
              // Has data - show platform tabs and content
              <div className="p-4 space-y-4">
                {/* Stale data indicator */}
                {isStale && (
                  <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-400">
                    <p style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      ⚠️ Data may be outdated. Send a new message to refresh.
                    </p>
                  </div>
                )}

                {/* Platform tabs */}
                <PlatformTabs platforms={connectedPlatforms} />

                {/* Property Selector - Only for Google Analytics with multiple properties */}
                {isGoogleAnalyticsSelected && gaProperties.length > 1 && (
                  <PropertySelector
                    properties={gaProperties}
                    selectedPropertyId={metricsDashboard.selectedPropertyId}
                    onSelect={(propertyId) => setMetricsDashboardPropertyId(propertyId)}
                  />
                )}

                {/* Metrics content - Phase 2 implementation */}
                {metricsDashboard.selectedPlatform ? (
                  <MetricsGrid
                    platformType={metricsDashboard.selectedPlatform}
                    platformData={platformData.platforms[metricsDashboard.selectedPlatform]}
                    selectedPropertyId={
                      isGoogleAnalyticsSelected
                        ? metricsDashboard.selectedPropertyId
                        : null
                    }
                  />
                ) : (
                  <div className="py-8 text-center">
                    <p
                      className="text-sm text-[#808080]"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      Select a platform to view metrics
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with last updated timestamp */}
          {platformDataTimestamp && (
            <div className="flex-shrink-0 px-4 py-2 border-t border-[#333]">
              <p
                className="text-xs text-[#808080] text-center"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Last updated:{' '}
                {new Date(platformDataTimestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
