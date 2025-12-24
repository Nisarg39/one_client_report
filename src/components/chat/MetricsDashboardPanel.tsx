/**
 * Metrics Dashboard Panel Component
 *
 * Phase 6.7: Displays platform metrics alongside AI chatbot
 * Allows users to verify AI responses against raw data
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useChatStore, type PlatformType } from '@/stores/useChatStore';
import { PlatformTabs } from './PlatformTabs';
import { MetricsGrid } from './MetricsGrid';
import { PropertySelector } from './PropertySelector';
import { CampaignSelector } from './CampaignSelector';

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
    setMetricsDashboardVisible,
    setMetricsDashboardPlatform,
    setMetricsDashboardPropertyId,
    setMetricsDashboardCampaignId,
    setMetricsDashboardLinkedInCampaignGroupId,
  } = useChatStore();

  // Check if data is stale (>5 minutes old)
  const isStale =
    platformDataTimestamp && Date.now() - platformDataTimestamp > 5 * 60 * 1000;

  // Get connected platforms from platform data
  // Show tabs for ALL connected platforms, even if data is null
  const connectedPlatforms = platformData
    ? Object.entries(platformData.platforms)
      .map(([key]) => key as PlatformType)
    : [];

  // Extract Google Analytics properties for property selector
  const gaData = platformData?.platforms?.googleAnalytics;
  const gaProperties =
    gaData?.properties?.map((p: any) => ({
      propertyId: p.propertyId,
      propertyName: p.propertyName,
    })) || [];
  const isGoogleAnalyticsSelected = metricsDashboard.selectedPlatform === 'googleAnalytics';

  // Get Google Ads campaigns
  const googleAdsCampaigns = platformData?.platforms?.googleAds?.campaigns || [];
  const isGoogleAdsSelected = metricsDashboard.selectedPlatform === 'googleAds';
  const hasGoogleCampaigns = googleAdsCampaigns.length > 0;

  // Get Meta Ads campaigns
  const metaAdsCampaigns = platformData?.platforms?.metaAds?.campaigns || [];
  const isMetaAdsSelected = metricsDashboard.selectedPlatform === 'metaAds';
  const hasMetaCampaigns = metaAdsCampaigns.length > 0;

  // Get LinkedIn Ads campaigns and groups
  const allLinkedInItems = platformData?.platforms?.linkedInAds?.campaigns || [];
  const linkedInAdsCampaignGroups = allLinkedInItems.filter((c: any) => c.type === 'CAMPAIGN_GROUP');
  const linkedInAdsCampaigns = allLinkedInItems.filter((c: any) => c.type === 'CAMPAIGN');
  const isLinkedInAdsSelected = metricsDashboard.selectedPlatform === 'linkedInAds';
  const hasLinkedInGroups = linkedInAdsCampaignGroups.length > 0;
  const hasLinkedInCampaigns = linkedInAdsCampaigns.length > 0;
  const hasLinkedInData = hasLinkedInGroups || hasLinkedInCampaigns;

  const selectedPlatform = metricsDashboard.selectedPlatform;
  const selectedPropertyId = metricsDashboard.selectedPropertyId;
  const selectedMetaCampaignId = metricsDashboard.selectedMetaCampaignId;
  const selectedGoogleAdsCampaignId = metricsDashboard.selectedGoogleAdsCampaignId;
  const selectedLinkedInCampaignId = metricsDashboard.selectedLinkedInCampaignId;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 bg-[#1a1a1a] border-l border-[#222] overflow-hidden flex flex-col"
          style={{
            width: `${metricsDashboard.width}px`,
            zIndex: 40,
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-[#222] flex items-center justify-between bg-[#1a1a1a]">
            <div>
              <h2
                className="text-lg font-black text-white uppercase tracking-tighter italic leading-none"
              >
                Platform Metrics
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 rounded-full bg-[#6CA3A2] animate-pulse shadow-[0_0_4px_#6CA3A2]" />
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#555]">Live Dashboard</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="w-10 h-10 rounded-xl bg-[#1c1c1c] shadow-neu-raised flex items-center justify-center border border-white/10 hover:bg-[#222] transition-colors group"
              aria-label="Close metrics panel"
            >
              <X className="w-5 h-5 text-[#444] group-hover:text-[#666]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!platformData ? (
              // No data state
              <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-[#222]" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#6CA3A2] animate-spin border-transparent shadow-[0_0_15px_rgba(108,163,162,0.4)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#6CA3A2] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3
                    className="text-base font-black text-white uppercase tracking-tighter italic"
                  >
                    Metrics Initializing
                  </h3>
                  <p
                    className="text-[11px] text-[#444] font-bold italic"
                  >
                    Send a message to load platform metrics
                  </p>
                </div>
              </div>
            ) : connectedPlatforms.length === 0 ? (
              // No connected platforms state
              <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-[#1c1c1c] shadow-neu-raised flex items-center justify-center border border-white/10">
                  <span className="text-3xl grayscale opacity-20">📊</span>
                </div>
                <div className="space-y-2">
                  <h3
                    className="text-base font-black text-white uppercase tracking-tighter italic"
                  >
                    No Active Uplinks
                  </h3>
                  <p
                    className="text-[11px] text-[#444] font-bold italic"
                  >
                    Connect a platform to see metrics here
                  </p>
                </div>
              </div>
            ) : (
              // Has data - show platform tabs and content
              <div className="p-4 space-y-4">
                {/* Stale data indicator */}
                {isStale && (
                  <div className="px-3 py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10px] text-amber-500/60 font-black uppercase tracking-widest italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Data may be outdated
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

                {/* Campaign Selector - For Meta Ads, Google Ads, or LinkedIn Ads with multiple campaigns */}
                {isMetaAdsSelected && hasMetaCampaigns && (
                  <CampaignSelector
                    campaigns={metaAdsCampaigns}
                    selectedCampaignId={metricsDashboard.selectedMetaCampaignId}
                    onSelect={(campaignId) => setMetricsDashboardCampaignId(campaignId)}
                    color="#0866FF"
                  />
                )}

                {isGoogleAdsSelected && hasGoogleCampaigns && (
                  <CampaignSelector
                    campaigns={googleAdsCampaigns.map((c: any) => ({ id: c.id, name: c.name }))}
                    selectedCampaignId={metricsDashboard.selectedGoogleAdsCampaignId}
                    onSelect={(campaignId) => setMetricsDashboardCampaignId(campaignId)}
                    color="#4285F4"
                  />
                )}

                {isLinkedInAdsSelected && hasLinkedInGroups && (
                  <CampaignSelector
                    campaigns={linkedInAdsCampaignGroups.map((c: any) => ({ id: c.id, name: c.name }))}
                    selectedCampaignId={metricsDashboard.selectedLinkedInCampaignGroupId}
                    onSelect={(groupId) => setMetricsDashboardLinkedInCampaignGroupId(groupId)}
                    color="#0A66C2"
                    label="Campaign Group Filter"
                  />
                )}

                {isLinkedInAdsSelected && hasLinkedInCampaigns && (
                  <CampaignSelector
                    campaigns={linkedInAdsCampaigns.map((c: any) => ({ id: c.id, name: c.name }))}
                    selectedCampaignId={metricsDashboard.selectedLinkedInCampaignId}
                    onSelect={(campaignId) => setMetricsDashboardCampaignId(campaignId)}
                    color="#0A66C2"
                  />
                )}



                {/* Metrics content - Phase 2 implementation */}
                {metricsDashboard.selectedPlatform ? (
                  <MetricsGrid
                    platformType={selectedPlatform!}
                    platformData={platformData.platforms[selectedPlatform!]}
                    selectedPropertyId={
                      isGoogleAnalyticsSelected
                        ? selectedPropertyId
                        : null
                    }
                    selectedCampaignId={
                      isMetaAdsSelected
                        ? metricsDashboard.selectedMetaCampaignId
                        : isGoogleAdsSelected
                          ? metricsDashboard.selectedGoogleAdsCampaignId
                          : isLinkedInAdsSelected
                            ? metricsDashboard.selectedLinkedInCampaignId
                            : null
                    }
                    selectedCampaignGroupId={
                      isLinkedInAdsSelected
                        ? metricsDashboard.selectedLinkedInCampaignGroupId
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
            <div className="flex-shrink-0 px-6 py-4 border-t border-[#222] bg-[#151515]">
              <p
                className="text-[9px] font-black text-[#444] text-center uppercase tracking-[0.3em] italic"
              >
                DATA_SYNCED // {new Date(platformDataTimestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
