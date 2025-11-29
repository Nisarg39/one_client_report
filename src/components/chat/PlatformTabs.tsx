/**
 * Platform Tabs Component
 *
 * Phase 6.7: Tabs to switch between different connected platforms
 */

'use client';

import { useChatStore, type PlatformType } from '@/stores/useChatStore';
import { BarChart3, TrendingUp, Share2, Briefcase } from 'lucide-react';

interface PlatformTabsProps {
  platforms: string[];
}

// Platform display configuration
const PLATFORM_CONFIG: Record<string, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  googleAnalytics: {
    label: 'Google Analytics',
    icon: BarChart3,
    color: '#FF9800',
  },
  googleAds: {
    label: 'Google Ads',
    icon: TrendingUp,
    color: '#4285F4',
  },
  metaAds: {
    label: 'Meta Ads',
    icon: Share2,
    color: '#0866FF',
  },
  linkedInAds: {
    label: 'LinkedIn Ads',
    icon: Briefcase,
    color: '#0A66C2',
  },
};

export function PlatformTabs({ platforms }: PlatformTabsProps) {
  const { metricsDashboard, setMetricsDashboardPlatform } = useChatStore();

  // Set default platform if none selected
  if (!metricsDashboard.selectedPlatform && platforms.length > 0) {
    const firstPlatform = platforms[0] as PlatformType;
    setMetricsDashboardPlatform(firstPlatform);
  }

  const selectedPlatform = metricsDashboard.selectedPlatform;

  const handlePlatformSelect = (platform: string) => {
    setMetricsDashboardPlatform(platform as PlatformType);
  };

  return (
    <div className="space-y-2">
      <h3
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Platforms
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          if (!config) return null;

          const Icon = config.icon;
          const isSelected = selectedPlatform === platform;

          return (
            <button
              key={platform}
              onClick={() => handlePlatformSelect(platform)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-[#1a1a1a] text-[#e0e0e0] shadow-[inset_-3px_-3px_8px_rgba(60,60,60,0.4),inset_3px_3px_8px_rgba(0,0,0,0.8)] border-b-2'
                  : 'bg-[#1a1a1a] text-[#c0c0c0] shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)]'
              }`}
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                ...(isSelected && {
                  borderBottomColor: config.color,
                }),
              }}
            >
              <div style={{ color: isSelected ? config.color : '#999' }}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
