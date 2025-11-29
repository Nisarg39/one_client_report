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
}

export function MetricsGrid({
  platformType,
  platformData,
  isLoading = false,
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
      return <GoogleAnalyticsMetrics data={platformData} />;
    case 'googleAds':
      return <GoogleAdsMetrics data={platformData} />;
    case 'metaAds':
      return <MetaAdsMetrics data={platformData} />;
    case 'linkedInAds':
      return <LinkedInAdsMetrics data={platformData} />;
    default:
      return null;
  }
}

/**
 * Google Analytics metrics grid
 */
function GoogleAnalyticsMetrics({ data }: { data: any }) {
  // Data structure: { properties: [...], dateRange: string, selectedPropertyId: string }
  const properties = data?.properties || [];

  // Find the selected property by ID, or use the first one as fallback
  const selectedProperty = data?.selectedPropertyId
    ? properties.find((p: any) => p.propertyId === data.selectedPropertyId)
    : properties[0];

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
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
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
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Top Countries
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
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Top Cities
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
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Top Regions
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
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Most Viewed Pages
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
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Device Breakdown
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
                  className="text-xs font-medium text-[#808080] mb-2 px-1"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Browser Breakdown
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
function GoogleAdsMetrics({ data }: { data: any }) {
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
          No Google Ads data available
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

  const metrics = data.metrics;

  return (
    <div className="space-y-4">
      <h3
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Campaign Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard
          label="Ad Spend"
          value={metrics.spend || 0}
          format="currency"
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
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Conversions"
          value={metrics.conversions || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

/**
 * Meta Ads metrics grid
 */
function MetaAdsMetrics({ data }: { data: any }) {
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

  const metrics = data.metrics;

  return (
    <div className="space-y-4">
      <h3
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Campaign Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard
          label="Ad Spend"
          value={metrics.spend || 0}
          format="currency"
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
          label="Reach"
          value={metrics.reach || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="ROAS"
          value={metrics.roas || 0}
          format="decimal"
          formatOptions={{ decimals: 2 }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

/**
 * LinkedIn Ads metrics grid
 */
function LinkedInAdsMetrics({ data }: { data: any }) {
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

  const metrics = data.metrics;

  return (
    <div className="space-y-4">
      <h3
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Campaign Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard
          label="Ad Spend"
          value={metrics.spend || 0}
          format="currency"
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
          label="Leads"
          value={metrics.leads || 0}
          format="number"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          label="CPC"
          value={metrics.cpc || 0}
          format="currency"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}
