/**
 * Metrics Grid Component
 *
 * Phase 6.7: Responsive grid layout for metric cards
 * Desktop: 2 columns, Mobile: 1 column
 */

'use client';

import {
  Users,
  MousePointerClick,
  Eye,
  Activity,
  Clock,
  TrendingUp,
  Globe,
  Search,
  Link,
  Share2,
  Mail,
  ExternalLink,
  Target,
  MapPin,
  FileText,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { MetricCard, MetricCardSkeleton } from './MetricCard';
import { DimensionalDataSection } from './DimensionalDataSection';
import { DataTable, type DataTableRow } from './DataTable';
import type { PlatformType } from '@/stores/useChatStore';
import { formatDuration } from '@/lib/utils/metricFormatters';

/**
 * Helper: Get icon for traffic source
 */
function getSourceIcon(source: string) {
  const sourceLower = source.toLowerCase();
  if (sourceLower.includes('google') || sourceLower.includes('search')) {
    return <Search className="w-4 h-4" />;
  }
  if (sourceLower.includes('social') || sourceLower.includes('facebook') || sourceLower.includes('twitter')) {
    return <Share2 className="w-4 h-4" />;
  }
  if (sourceLower.includes('direct')) {
    return <Globe className="w-4 h-4" />;
  }
  if (sourceLower.includes('referral') || sourceLower.includes('link')) {
    return <ExternalLink className="w-4 h-4" />;
  }
  if (sourceLower.includes('email')) {
    return <Mail className="w-4 h-4" />;
  }
  return <Link className="w-4 h-4" />;
}

/**
 * Helper: Get icon for event type
 */
function getEventIcon(eventName: string) {
  const eventLower = eventName.toLowerCase();
  if (eventLower.includes('click') || eventLower.includes('button')) {
    return <MousePointerClick className="w-4 h-4" />;
  }
  if (eventLower.includes('view') || eventLower.includes('page')) {
    return <Eye className="w-4 h-4" />;
  }
  if (eventLower.includes('purchase') || eventLower.includes('conversion')) {
    return <Target className="w-4 h-4" />;
  }
  return <Zap className="w-4 h-4" />;
}

/**
 * Helper: Get icon for device category
 */
function getDeviceIcon(device: string) {
  const deviceLower = device.toLowerCase();
  if (deviceLower.includes('mobile')) {
    return <Smartphone className="w-4 h-4" />;
  }
  if (deviceLower.includes('tablet')) {
    return <Tablet className="w-4 h-4" />;
  }
  if (deviceLower.includes('desktop')) {
    return <Monitor className="w-4 h-4" />;
  }
  return <Monitor className="w-4 h-4" />;
}

/**
 * Helper: Format number with commas
 */
function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('en-US');
}

interface MetricsGridProps {
  platformType: PlatformType;
  platformData: any;
  isLoading?: boolean;
  selectedPropertyId?: string | null;
  selectedCampaignId?: string | null;
  selectedCampaignGroupId?: string | null;
}

export function MetricsGrid({
  platformType,
  platformData,
  isLoading = false,
  selectedPropertyId = null,
  selectedCampaignId = null,
  selectedCampaignGroupId = null,
}: MetricsGridProps) {
  // Show loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No data
  if (!platformData) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#808080]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          No data available
        </p>
      </div>
    );
  }

  // Render metrics based on platform type
  switch (platformType) {
    case 'googleAnalytics':
      return (
        <GoogleAnalyticsMetrics
          data={platformData}
          selectedPropertyId={selectedPropertyId}
        />
      );
    case 'googleAds':
      return (
        <GoogleAdsMetrics
          data={platformData}
          selectedCampaignId={selectedCampaignId}
        />
      );
    case 'metaAds':
      return (
        <MetaAdsMetrics
          data={platformData}
          selectedCampaignId={selectedCampaignId}
        />
      );
    case 'linkedInAds':
      return (
        <LinkedInAdsMetrics
          data={platformData}
          selectedCampaignId={selectedCampaignId}
          selectedCampaignGroupId={selectedCampaignGroupId}
        />
      );
    default:
      return null;
  }
}

/**
 * Google Analytics metrics grid
 */
function GoogleAnalyticsMetrics({
  data,
  selectedPropertyId,
}: {
  data: any;
  selectedPropertyId?: string | null;
}) {
  // Data structure: { properties: [...], dateRange: string, selectedPropertyId: string }
  const properties = data?.properties || [];

  // Property selection logic with fallback chain:
  // 1. Use selectedPropertyId prop if provided (from store)
  // 2. Fallback to data.selectedPropertyId (from backend/settings)
  // 3. Fallback to first property
  let selectedProperty = null;

  if (selectedPropertyId) {
    selectedProperty = properties.find(
      (p: any) => p.propertyId === selectedPropertyId
    );
  }

  if (!selectedProperty && data?.selectedPropertyId) {
    selectedProperty = properties.find(
      (p: any) => p.propertyId === data.selectedPropertyId
    );
  }

  if (!selectedProperty && properties.length > 0) {
    selectedProperty = properties[0];
  }

  if (!selectedProperty || !selectedProperty.metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#808080]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          No metrics available for this property
        </p>
      </div>
    );
  }

  const metrics = selectedProperty.metrics;
  const dimensions = selectedProperty.dimensions || {};

  // Calculate total sessions for percentage calculations
  const totalSessions = metrics.sessions || 0;

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <h3
        className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1"
      >
        Key Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard
          label="Sessions"
          value={metrics.sessions || 0}
          format="number"
          icon={<MousePointerClick className="w-4 h-4" />}
        />
        <MetricCard
          label="Users"
          value={metrics.users || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="New Users"
          value={metrics.newUsers || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Returning Users"
          value={metrics.returningUsers || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Pageviews"
          value={metrics.pageviews || 0}
          format="number"
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Bounce Rate"
          value={metrics.bounceRate || 0}
          format="percentage"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Avg. Session Duration"
          value={metrics.avgSessionDuration || 0}
          format="duration"
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          label="Engagement Rate"
          value={metrics.engagementRate || 0}
          format="percentage"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Google Ads Performance (Integrated in GA) */}
      {metrics.adsSpend !== undefined && metrics.adsSpend > 0 && (
        <div className="space-y-3 pt-2">
          <h3
            className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1 flex items-center gap-2"
          >
            Google Ads Performance <span className="text-[8px] bg-[#6CA3A2]/10 text-[#6CA3A2] px-1.5 py-0.5 rounded italic lowercase font-bold tracking-normal border border-[#6CA3A2]/20">via ga4</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard
              label="Ad Spend"
              value={metrics.adsSpend}
              format="currency"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <MetricCard
              label="Ad Impressions"
              value={metrics.adsImpressions || 0}
              format="number"
              icon={<Eye className="w-4 h-4" />}
            />
            <MetricCard
              label="Ad Clicks"
              value={metrics.adsClicks || 0}
              format="number"
              icon={<MousePointerClick className="w-4 h-4" />}
            />
          </div>
        </div>
      )}

      {/* Traffic Sources */}
      {dimensions.topSources && dimensions.topSources.length > 0 && (
        <DimensionalDataSection
          title="Traffic Sources"
          icon={<Globe className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={dimensions.topSources.map((source: any) => ({
              icon: getSourceIcon(source.source || 'Unknown'),
              label: source.source || 'Unknown',
              value: formatNumber(source.sessions || 0),
              progressBar: {
                value: source.sessions || 0,
                max: totalSessions || 1,
                color: '#6CA3A2',
              },
              secondaryValue: totalSessions ? `${Math.round(((source.sessions || 0) / totalSessions) * 100)}%` : '0%',
            }))}
            emptyMessage="No traffic source data available"
          />
        </DimensionalDataSection>
      )}

      {/* Campaigns */}
      {dimensions.topCampaigns && dimensions.topCampaigns.length > 0 && (
        <DimensionalDataSection
          title="Top Campaigns"
          icon={<Target className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={dimensions.topCampaigns.map((campaign: any) => ({
              icon: <Target className="w-4 h-4" />,
              label: campaign.campaign || 'Unknown',
              value: formatNumber(campaign.sessions || 0),
              progressBar: {
                value: campaign.sessions || 0,
                max: totalSessions || 1,
                color: '#6CA3A2',
              },
              secondaryValue: totalSessions ? `${Math.round(((campaign.sessions || 0) / totalSessions) * 100)}%` : '0%',
            }))}
            emptyMessage="No campaign data available"
          />
        </DimensionalDataSection>
      )}

      {/* Geographic Insights */}
      {(dimensions.countries || selectedProperty.topCities || selectedProperty.topRegions) && (
        <DimensionalDataSection
          title="Geographic Insights"
          icon={<MapPin className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {/* Countries */}
            {dimensions.countries && dimensions.countries.length > 0 && (
              <div>
                <h4
                  className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-2.5 px-1 italic"
                >
                  Regional Distribution
                </h4>
                <DataTable
                  rows={dimensions.countries.map((country: any) => ({
                    icon: <MapPin className="w-4 h-4" />,
                    label: country.country || 'Unknown',
                    value: formatNumber(country.users || 0),
                    progressBar: {
                      value: country.users || 0,
                      max: metrics.users || 1,
                      color: '#6CA3A2',
                    },
                    secondaryValue: metrics.users ? `${Math.round(((country.users || 0) / metrics.users) * 100)}%` : '0%',
                  }))}
                  compact
                />
              </div>
            )}

            {/* Cities */}
            {selectedProperty.topCities && selectedProperty.topCities.length > 0 && (
              <div>
                <h4
                  className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-2.5 px-1 italic"
                >
                  Node Density
                </h4>
                <DataTable
                  rows={selectedProperty.topCities.map((city: any) => ({
                    icon: <MapPin className="w-4 h-4" />,
                    label: `${city.city}, ${city.country}`,
                    value: formatNumber(city.sessions || 0),
                    progressBar: {
                      value: city.sessions || 0,
                      max: totalSessions || 1,
                      color: '#6CA3A2',
                    },
                    secondaryValue: totalSessions ? `${Math.round(((city.sessions || 0) / totalSessions) * 100)}%` : '0%',
                  }))}
                  compact
                />
              </div>
            )}

            {/* Regions */}
            {selectedProperty.topRegions && selectedProperty.topRegions.length > 0 && (
              <div>
                <h4
                  className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-2.5 px-1 italic"
                >
                  Zone Analysis
                </h4>
                <DataTable
                  rows={selectedProperty.topRegions.map((region: any) => ({
                    icon: <MapPin className="w-4 h-4" />,
                    label: `${region.region}, ${region.country}`,
                    value: formatNumber(region.sessions || 0),
                    progressBar: {
                      value: region.sessions || 0,
                      max: totalSessions || 1,
                      color: '#6CA3A2',
                    },
                    secondaryValue: totalSessions ? `${Math.round(((region.sessions || 0) / totalSessions) * 100)}%` : '0%',
                  }))}
                  compact
                />
              </div>
            )}
          </div>
        </DimensionalDataSection>
      )}

      {/* Page Performance */}
      {(dimensions.topPages || dimensions.topLandingPages) && (
        <DimensionalDataSection
          title="Page Performance"
          icon={<FileText className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {/* Top Pages */}
            {dimensions.topPages && dimensions.topPages.length > 0 && (
              <div>
                <h4
                  className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-2.5 px-1 italic"
                >
                  Path Velocity
                </h4>
                <DataTable
                  rows={dimensions.topPages.map((page: any) => ({
                    icon: <FileText className="w-4 h-4" />,
                    label: page.page || 'Unknown',
                    value: formatNumber(page.pageviews || 0),
                    progressBar: {
                      value: page.pageviews || 0,
                      max: (dimensions.topPages[0]?.pageviews || 1),
                      color: '#6CA3A2',
                    },
                    secondaryValue: page.avgTimeOnPage ? formatDuration(page.avgTimeOnPage) : undefined,
                  }))}
                  compact
                />
              </div>
            )}

            {/* Landing Pages */}
            {dimensions.topLandingPages && dimensions.topLandingPages.length > 0 && (
              <div>
                <h4
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Top Landing Pages
                </h4>
                <DataTable
                  rows={dimensions.topLandingPages.map((page: any) => ({
                    icon: <FileText className="w-4 h-4" />,
                    label: page.landingPage || 'Unknown',
                    value: formatNumber(page.sessions || 0),
                    progressBar: {
                      value: page.sessions || 0,
                      max: (dimensions.topLandingPages[0]?.sessions || 1),
                      color: '#6CA3A2',
                    },
                  }))}
                  compact
                />
              </div>
            )}

          </div>
        </DimensionalDataSection>
      )}

      {/* User Behavior (Events) */}
      {dimensions.topEvents && dimensions.topEvents.length > 0 && (
        <DimensionalDataSection
          title="User Behavior"
          icon={<Zap className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={dimensions.topEvents.map((event: any) => ({
              icon: getEventIcon(event.eventName || 'Unknown'),
              label: event.eventName || 'Unknown',
              value: formatNumber(event.eventCount || 0),
              progressBar: {
                value: event.eventCount || 0,
                max: (dimensions.topEvents[0]?.eventCount || 1),
                color: '#6CA3A2',
              },
            }))}
            emptyMessage="No event data available"
          />
        </DimensionalDataSection>
      )}

      {/* Technology (Devices & Browsers) */}
      {(dimensions.devices && dimensions.devices.length > 0) || (selectedProperty.browserBreakdown && selectedProperty.browserBreakdown.length > 0) ? (
        <DimensionalDataSection
          title="Technology"
          icon={<Monitor className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {/* Devices */}
            {dimensions.devices && dimensions.devices.length > 0 && (
              <div>
                <h4
                  className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-2.5 px-1 italic"
                >
                  Hardware Ecosystem
                </h4>
                <DataTable
                  rows={dimensions.devices.map((device: any) => ({
                    icon: getDeviceIcon(device.device || device.deviceCategory || 'Unknown'),
                    label: device.device || device.deviceCategory || 'Unknown',
                    value: formatNumber(device.sessions || 0),
                    progressBar: {
                      value: device.sessions || 0,
                      max: totalSessions || 1,
                      color: '#6CA3A2',
                    },
                    secondaryValue: totalSessions ? `${Math.round(((device.sessions || 0) / totalSessions) * 100)}%` : '0%',
                  }))}
                  compact
                />
              </div>
            )}

            {/* Browser Breakdown - PHASE 1: NEW! */}
            {selectedProperty.browserBreakdown && selectedProperty.browserBreakdown.length > 0 && (
              <div>
                <h4
                  className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-2.5 px-1 italic"
                >
                  Engine Breakdown
                </h4>
                <DataTable
                  rows={selectedProperty.browserBreakdown.map((browser: any) => ({
                    icon: <Monitor className="w-4 h-4" />,
                    label: browser.browser || 'Unknown',
                    value: formatNumber(browser.sessions || 0),
                    progressBar: {
                      value: browser.sessions || 0,
                      max: totalSessions || 1,
                      color: '#6CA3A2',
                    },
                    secondaryValue: totalSessions ? `${Math.round(((browser.sessions || 0) / totalSessions) * 100)}%` : '0%',
                  }))}
                  compact
                />
              </div>
            )}
          </div>
        </DimensionalDataSection>
      ) : null}
    </div>
  );
}

/**
 * Google Ads metrics grid
 */
function GoogleAdsMetrics({
  data,
  selectedCampaignId,
}: {
  data: any;
  selectedCampaignId?: string | null;
}) {
  const customers = data?.customers || [];
  const campaigns = data?.campaigns || [];
  let metrics = data?.metrics || {};

  // If a specific campaign is selected, use that campaign's metrics instead of account-wide
  if (selectedCampaignId) {
    const selectedCampaign = campaigns.find((c: any) => c.id === selectedCampaignId);
    if (selectedCampaign) {
      // Metrics are flat in Google Ads campaign response
      metrics = {
        spend: selectedCampaign.spend || 0,
        impressions: selectedCampaign.impressions || 0,
        clicks: selectedCampaign.clicks || 0,
        ctr: selectedCampaign.ctr || 0,
        cpc: selectedCampaign.cpc || 0,
        conversions: selectedCampaign.conversions || 0,
        conversionRate: selectedCampaign.conversionRate || 0,
        // Optional metrics (default to 0 if not present in campaign data)
        interactions: selectedCampaign.interactions || 0,
        interactionRate: selectedCampaign.interactionRate || 0,
        conversionsValue: selectedCampaign.conversionsValue || 0,
        costPerConversion: selectedCampaign.costPerConversion || 0,
        viewThroughConversions: selectedCampaign.viewThroughConversions || 0,
        searchImpressionShare: selectedCampaign.searchImpressionShare || 0,
        searchAbsTopImpressionShare: selectedCampaign.searchAbsTopImpressionShare || 0,
        searchBudgetLostImpressionShare: selectedCampaign.searchBudgetLostImpressionShare || 0,
        searchRankLostImpressionShare: selectedCampaign.searchRankLostImpressionShare || 0,
        currency: data.metrics?.currency || 'USD',
      };
    }
  }

  // 1. Check for explicit API error first
  if (data?.apiError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-red-900/30 rounded-xl bg-red-950/10">
        <div className="w-16 h-16 rounded-full bg-red-950/20 flex items-center justify-center mb-4 border border-red-500/20">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-base font-medium text-red-400 mb-2">Google Ads API Error</h3>
        <p className="text-sm text-[#a0a0a0] max-w-sm font-mono text-[11px] leading-relaxed">
          {data.apiError}
        </p>
        <p className="mt-4 text-xs text-[#666]">
          This usually indicates a permission mismatch between the logged-in email and the manager ID.
        </p>
      </div>
    );
  }

  // 2. Check if metrics are missing entirely
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
          <span className="text-2xl">📊</span>
        </div>
        <h3
          className="text-base font-medium text-[#c0c0c0] mb-2"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          No Google Ads data available
        </h3>
        <p
          className="text-sm text-[#808080] max-w-xs"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Ensure your account is connected and has active campaigns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Account Info / Warnings */}
      {customers.length > 1 && (
        <div className="bg-[#6CA3A2]/5 border border-[#6CA3A2]/20 rounded-lg p-2.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#6CA3A2]/10 flex items-center justify-center shrink-0">
            <Globe className="w-3.5 h-3.5 text-[#6CA3A2]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6CA3A2] uppercase tracking-wider italic">Cross-Account View</p>
            <p className="text-[9px] text-[#888] leading-tight">Aggregating data from {customers.length} client accounts.</p>
          </div>
        </div>
      )}

      {/* 1. Core Performance */}
      <h3 className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1">Performance Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard label="Ad Spend" value={metrics.spend || 0} format="currency" formatOptions={{ currency: metrics.currency || 'USD' }} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard label="Impressions" value={metrics.impressions || 0} format="number" icon={<Eye className="w-4 h-4" />} />
        <MetricCard label="Clicks" value={metrics.clicks || 0} format="number" icon={<MousePointerClick className="w-4 h-4" />} />
        <MetricCard label="CTR" value={metrics.ctr || 0} format="percentage" icon={<Activity className="w-4 h-4" />} />
        <MetricCard label="Avg. CPC" value={metrics.cpc || 0} format="currency" formatOptions={{ currency: metrics.currency || 'USD' }} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard label="Interactions" value={metrics.interactions || 0} format="number" icon={<MousePointerClick className="w-4 h-4" />} />
      </div>

      {/* 2. Conversions */}
      <h3 className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1 pt-2">Conversion Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard label="Conversions" value={metrics.conversions || 0} format="number" icon={<Target className="w-4 h-4" />} />
        <MetricCard label="Conv. Value" value={metrics.conversionsValue || 0} format="currency" formatOptions={{ currency: metrics.currency || 'USD' }} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard label="Conv. Rate" value={metrics.conversionRate || 0} format="percentage" icon={<Activity className="w-4 h-4" />} />
        <MetricCard label="Cost per Conv." value={metrics.costPerConversion || 0} format="currency" formatOptions={{ currency: metrics.currency || 'USD' }} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard label="View-Through" value={metrics.viewThroughConversions || 0} format="number" icon={<Eye className="w-4 h-4" />} />
      </div>

      {/* 3. Competitive Data */}
      <h3 className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1 pt-2">Competitive Positioning</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard label="Search Impr. Share" value={metrics.searchImpressionShare || 0} format="percentage" icon={<Globe className="w-4 h-4" />} />
        <MetricCard label="Abs. Top IS" value={metrics.searchAbsTopImpressionShare || 0} format="percentage" icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard label="Lost IS (Budget)" value={metrics.searchBudgetLostImpressionShare || 0} format="percentage" icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard label="Lost IS (Rank)" value={metrics.searchRankLostImpressionShare || 0} format="percentage" icon={<Target className="w-4 h-4" />} />
      </div>

      {/* Campaigns Section */}
      {campaigns.length > 0 && (
        <DimensionalDataSection
          title="Top Campaigns"
          icon={<Target className="w-4 h-4" />}
          defaultExpanded={true}
        >
          <DataTable
            rows={campaigns.map((campaign: any) => ({
              icon: <Target className="w-4 h-4" />,
              label: campaign.name || 'Unknown',
              value: formatNumber(campaign.impressions || 0),
              progressBar: {
                value: campaign.impressions || 0,
                max: Math.max(...campaigns.map((c: any) => c.impressions)) || 1,
                color: '#6CA3A2',
              },
              secondaryValue: `$${Number(campaign.spend).toFixed(2)}`,
            }))}
            emptyMessage="No campaign data available"
          />
        </DimensionalDataSection>
      )}
    </div>
  );
}

/**
 * Meta Ads metrics grid
 */
function MetaAdsMetrics({
  data,
  selectedCampaignId
}: {
  data: any;
  selectedCampaignId: string | null;
}) {
  // Determine metrics to display (favor selected campaign metrics)
  const activeCampaign = selectedCampaignId
    ? data.campaigns?.find((c: any) => String(c.id) === String(selectedCampaignId))
    : null;

  const displayMetrics = activeCampaign ? activeCampaign.metrics : data.metrics;
  const currency = displayMetrics?.currency || data.metrics?.currency || 'USD';

  if (!displayMetrics) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
          <span className="text-2xl">📊</span>
        </div>
        <h3
          className="text-base font-medium text-[#c0c0c0] mb-2"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          No Meta Ads data available
        </h3>
        <p
          className="text-sm text-[#808080] max-w-xs"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Unable to fetch metrics. This may be due to expired authentication or API access issues. Try refreshing your connection.
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <h3
        className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1"
      >
        Campaign Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard
          label="Ad Spend"
          value={displayMetrics.spend || 0}
          format="currency"
          formatOptions={{ currency }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Impressions"
          value={displayMetrics.impressions || 0}
          format="number"
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Clicks"
          value={displayMetrics.clicks || 0}
          format="number"
          icon={<MousePointerClick className="w-4 h-4" />}
        />
        <MetricCard
          label="CTR"
          value={displayMetrics.ctr || 0}
          format="percentage"
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          label="Reach"
          value={displayMetrics.reach || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="ROAS"
          value={displayMetrics.roas || 0}
          format="decimal"
          formatOptions={{ decimals: 2 }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Purchases"
          value={displayMetrics.purchases || 0}
          format="number"
          icon={<Target className="w-4 h-4" />}
        />
        <MetricCard
          label="Cost per Purchase"
          value={displayMetrics.cost_per_purchase || 0}
          format="currency"
          formatOptions={{ currency }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Leads"
          value={displayMetrics.leads || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="Cost per Lead"
          value={displayMetrics.cost_per_lead || 0}
          format="currency"
          formatOptions={{ currency }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Video Views (100%)"
          value={displayMetrics.video_p100_watched_actions || 0}
          format="number"
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Inline Link Clicks"
          value={displayMetrics.inline_link_clicks || 0}
          format="number"
          icon={<Link className="w-4 h-4" />}
        />
      </div>

      {/* Enhanced Conversion Funnel Metrics */}
      {(displayMetrics.registrations > 0 || displayMetrics.add_to_carts > 0 || displayMetrics.checkouts > 0 || displayMetrics.content_views > 0) && (
        <>
          <h3
            className="text-xs font-medium text-[#999] uppercase tracking-wider px-1 mt-4"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Conversion Funnel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayMetrics.content_views > 0 && (
              <MetricCard
                label="Content Views"
                value={displayMetrics.content_views || 0}
                format="number"
                icon={<Eye className="w-4 h-4" />}
              />
            )}
            {displayMetrics.add_to_carts > 0 && (
              <>
                <MetricCard
                  label="Add to Cart"
                  value={displayMetrics.add_to_carts || 0}
                  format="number"
                  icon={<Target className="w-4 h-4" />}
                />
                <MetricCard
                  label="Cost per Add to Cart"
                  value={displayMetrics.cost_per_add_to_cart || 0}
                  format="currency"
                  formatOptions={{ currency }}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </>
            )}
            {displayMetrics.checkouts > 0 && (
              <MetricCard
                label="Initiated Checkouts"
                value={displayMetrics.checkouts || 0}
                format="number"
                icon={<Target className="w-4 h-4" />}
              />
            )}
            {displayMetrics.registrations > 0 && (
              <>
                <MetricCard
                  label="Registrations"
                  value={displayMetrics.registrations || 0}
                  format="number"
                  icon={<Users className="w-4 h-4" />}
                />
                <MetricCard
                  label="Cost per Registration"
                  value={displayMetrics.cost_per_registration || 0}
                  format="currency"
                  formatOptions={{ currency }}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </>
            )}
          </div>
        </>
      )}

      {/* Demographics */}
      {data.demographics && data.demographics.length > 0 && (
        <DimensionalDataSection
          title="Demographics"
          icon={<Users className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={data.demographics.map((row: any) => ({
              icon: <Users className="w-4 h-4" />,
              label: `${row.age} • ${row.gender}`,
              value: formatNumber(row.impressions || 0),
              progressBar: {
                value: row.impressions || 0,
                max: Math.max(...data.demographics.map((d: any) => d.impressions)) || 1,
                color: '#6CA3A2',
              },
              secondaryValue: row.clicks ? `${row.clicks} clicks` : undefined,
            }))}
            compact
            emptyMessage="No demographic data available"
          />
        </DimensionalDataSection>
      )}

      {/* Geography */}
      {data.geography && data.geography.length > 0 && (
        <DimensionalDataSection
          title="Geography"
          icon={<MapPin className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={data.geography.map((row: any) => ({
              icon: <MapPin className="w-4 h-4" />,
              label: `${row.region}, ${row.country}`,
              value: formatNumber(row.impressions || 0),
              progressBar: {
                value: row.impressions || 0,
                max: Math.max(...data.geography.map((d: any) => d.impressions)) || 1,
                color: '#6CA3A2',
              },
            }))}
            compact
            emptyMessage="No geographic data available"
          />
        </DimensionalDataSection>
      )}

      {/* Publisher Platforms */}
      {data.publisher_platforms && data.publisher_platforms.length > 0 && (
        <DimensionalDataSection
          title="Platforms"
          icon={<Share2 className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={data.publisher_platforms.map((row: any) => ({
              icon: <Monitor className="w-4 h-4" />,
              label: row.publisher_platform,
              value: formatNumber(row.spend || 0),
              progressBar: {
                value: row.spend || 0,
                max: Math.max(...data.publisher_platforms.map((d: any) => d.spend)) || 1,
                color: '#6CA3A2',
              },
              secondaryValue: `$${row.spend?.toFixed(2)}`,
            }))}
            compact
            emptyMessage="No platform data available"
          />
        </DimensionalDataSection>
      )}

      {/* Devices */}
      {data.devices && data.devices.length > 0 && (
        <DimensionalDataSection
          title="Devices"
          icon={<Smartphone className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <DataTable
            rows={data.devices.map((row: any) => ({
              icon: <Smartphone className="w-4 h-4" />,
              label: row.device_platform,
              value: formatNumber(row.impressions || 0),
              progressBar: {
                value: row.impressions || 0,
                max: Math.max(...data.devices.map((d: any) => d.impressions)) || 1,
                color: '#6CA3A2',
              },
            }))}
            compact
            emptyMessage="No device data available"
          />
        </DimensionalDataSection>
      )}
    </div>
  );
}

/**
 * LinkedIn Ads metrics grid
 */
function LinkedInAdsMetrics({
  data,
  selectedCampaignId,
  selectedCampaignGroupId
}: {
  data: any;
  selectedCampaignId?: string | null;
  selectedCampaignGroupId?: string | null;
}) {
  if (!data || !data.metrics) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
          <span className="text-2xl">📊</span>
        </div>
        <h3
          className="text-base font-medium text-[#c0c0c0] mb-2"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          No LinkedIn Ads data available
        </h3>
        <p
          className="text-sm text-[#808080] max-w-xs"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Unable to fetch metrics. This may be due to expired authentication or API access issues. Try refreshing your connection.
        </p>
      </div>
    );
  }

  const campaigns = data.campaigns || [];

  // If a specific campaign or group is selected, use those metrics
  let metrics = data.metrics;
  const activeSelectionId = selectedCampaignId || selectedCampaignGroupId;

  if (activeSelectionId) {
    // Robust search: ensure same type (string) for comparison
    const selectedItem = campaigns.find((c: any) => String(c.id) === String(activeSelectionId));

    if (selectedItem && selectedItem.metrics) {
      // NOTE: LinkedIn items can be individual campaigns or campaign groups.
      // We overwrite core stats and reset others to 0 to avoid showing misleading cumulative data.
      metrics = {
        ...metrics,
        impressions: selectedItem.metrics.impressions || 0,
        clicks: selectedItem.metrics.clicks || 0,
        spend: selectedItem.metrics.spend || 0,
        // Calculate CTR/CPC
        ctr: selectedItem.metrics.impressions > 0
          ? (selectedItem.metrics.clicks / selectedItem.metrics.impressions) * 100
          : 0,
        cpc: selectedItem.metrics.clicks > 0
          ? selectedItem.metrics.spend / selectedItem.metrics.clicks
          : 0,
        // Reset sub-metrics for specific selection view
        engagement: {
          ...metrics.engagement,
          likes: 0, comments: 0, shares: 0, totalEngagements: 0, engagementRate: 0
        },
        conversions: {
          ...metrics.conversions,
          total: 0, postClick: 0, postView: 0, landingPageClicks: 0
        },
        leads: {
          ...metrics.leads,
          total: 0, qualified: 0, formOpens: 0
        }
      };
    }
  }

  const currency = metrics?.currency || 'USD';

  return (
    <div className="space-y-4">
      {/* Key Performance Metrics */}
      <h3
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Key Performance Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard
          label="Ad Spend"
          value={metrics.spend || 0}
          format="currency"
          formatOptions={{ currency }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Impressions"
          value={metrics.impressions || 0}
          format="number"
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Clicks"
          value={metrics.clicks || 0}
          format="number"
          icon={<MousePointerClick className="w-4 h-4" />}
        />
        <MetricCard
          label="CTR"
          value={metrics.ctr || 0}
          format="percentage"
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          label="CPC"
          value={metrics.cpc || 0}
          format="currency"
          formatOptions={{ currency }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Conversions"
          value={metrics.conversions?.total || 0}
          format="number"
          icon={<Target className="w-4 h-4" />}
        />
      </div>

      {/* Engagement Metrics */}
      {metrics.engagement && (
        <DimensionalDataSection
          title="Engagement Metrics"
          icon={<Share2 className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard
              label="Total Engagements"
              value={metrics.engagement.totalEngagements || 0}
              format="number"
              icon={<Activity className="w-4 h-4" />}
            />
            <MetricCard
              label="Engagement Rate"
              value={metrics.engagement.engagementRate || 0}
              format="percentage"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <MetricCard
              label="Likes"
              value={metrics.engagement.likes || 0}
              format="number"
              icon={<Activity className="w-4 h-4" />}
            />
            <MetricCard
              label="Comments"
              value={metrics.engagement.comments || 0}
              format="number"
              icon={<Activity className="w-4 h-4" />}
            />
            <MetricCard
              label="Shares"
              value={metrics.engagement.shares || 0}
              format="number"
              icon={<Share2 className="w-4 h-4" />}
            />
            <MetricCard
              label="Follows"
              value={metrics.engagement.follows || 0}
              format="number"
              icon={<Users className="w-4 h-4" />}
            />
            {metrics.engagement.costPerEngagement > 0 && (
              <MetricCard
                label="Cost Per Engagement"
                value={metrics.engagement.costPerEngagement}
                format="currency"
                formatOptions={{ currency }}
                icon={<TrendingUp className="w-4 h-4" />}
              />
            )}
          </div>
        </DimensionalDataSection>
      )}

      {/* Conversion Metrics */}
      {metrics.conversions && (
        <DimensionalDataSection
          title="Conversion Metrics"
          icon={<Target className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard
              label="Total Conversions"
              value={metrics.conversions.total || 0}
              format="number"
              icon={<Target className="w-4 h-4" />}
            />
            <MetricCard
              label="Post-Click Conversions"
              value={metrics.conversions.postClick || 0}
              format="number"
              icon={<MousePointerClick className="w-4 h-4" />}
            />
            <MetricCard
              label="Post-View Conversions"
              value={metrics.conversions.postView || 0}
              format="number"
              icon={<Eye className="w-4 h-4" />}
            />
            <MetricCard
              label="Landing Page Clicks"
              value={metrics.conversions.landingPageClicks || 0}
              format="number"
              icon={<ExternalLink className="w-4 h-4" />}
            />
            {metrics.conversions.costPerConversion > 0 && (
              <MetricCard
                label="Cost Per Conversion"
                value={metrics.conversions.costPerConversion}
                format="currency"
                formatOptions={{ currency }}
                icon={<TrendingUp className="w-4 h-4" />}
              />
            )}
          </div>
        </DimensionalDataSection>
      )}

      {/* Lead Generation Metrics */}
      {metrics.leads && (
        <DimensionalDataSection
          title="Lead Generation"
          icon={<Users className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard
              label="Total Leads"
              value={metrics.leads.total || 0}
              format="number"
              icon={<Users className="w-4 h-4" />}
            />
            <MetricCard
              label="Qualified Leads"
              value={metrics.leads.qualified || 0}
              format="number"
              icon={<Users className="w-4 h-4" />}
            />
            <MetricCard
              label="Form Opens"
              value={metrics.leads.formOpens || 0}
              format="number"
              icon={<FileText className="w-4 h-4" />}
            />
            {metrics.leads.qualityRate > 0 && (
              <MetricCard
                label="Lead Quality Rate"
                value={metrics.leads.qualityRate}
                format="percentage"
                icon={<TrendingUp className="w-4 h-4" />}
              />
            )}
            {metrics.leads.costPerLead > 0 && (
              <MetricCard
                label="Cost Per Lead"
                value={metrics.leads.costPerLead}
                format="currency"
                formatOptions={{ currency }}
                icon={<TrendingUp className="w-4 h-4" />}
              />
            )}
          </div>
        </DimensionalDataSection>
      )}

      {/* Video Performance */}
      {metrics.video && (metrics.video.starts > 0 || metrics.video.views > 0) && (
        <DimensionalDataSection
          title="Video Performance"
          icon={<Activity className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard
              label="Video Starts"
              value={metrics.video.starts || 0}
              format="number"
              icon={<Activity className="w-4 h-4" />}
            />
            <MetricCard
              label="Video Views"
              value={metrics.video.views || 0}
              format="number"
              icon={<Eye className="w-4 h-4" />}
            />
            <MetricCard
              label="Video Completions"
              value={metrics.video.completions || 0}
              format="number"
              icon={<Activity className="w-4 h-4" />}
            />
            <MetricCard
              label="Completion Rate"
              value={metrics.video.completionRate || 0}
              format="percentage"
              icon={<TrendingUp className="w-4 h-4" />}
            />
          </div>
        </DimensionalDataSection>
      )}

      {/* Reach & Awareness */}
      {metrics.reach && (metrics.reach.uniqueMembers > 0 || metrics.reach.averageDwellTime > 0) && (
        <DimensionalDataSection
          title="Reach & Awareness"
          icon={<Globe className="w-4 h-4" />}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard
              label="Unique Members Reached"
              value={metrics.reach.uniqueMembers || 0}
              format="number"
              icon={<Users className="w-4 h-4" />}
            />
            <MetricCard
              label="Avg. Dwell Time"
              value={metrics.reach.averageDwellTime || 0}
              format="decimal"
              formatOptions={{ decimals: 1 }}
              icon={<Clock className="w-4 h-4" />}
            />
          </div>
        </DimensionalDataSection>
      )}
    </div>
  );
}
