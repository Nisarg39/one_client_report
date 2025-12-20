/**
 * Platform Tabs Component
 *
 * Phase 6.7: Tabs to switch between different connected platforms
 */

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
  useEffect(() => {
    if (!metricsDashboard.selectedPlatform && platforms.length > 0) {
      const firstPlatform = platforms[0] as PlatformType;
      setMetricsDashboardPlatform(firstPlatform);
    }
  }, [metricsDashboard.selectedPlatform, platforms, setMetricsDashboardPlatform]);

  const selectedPlatform = metricsDashboard.selectedPlatform;

  const handlePlatformSelect = (platform: string) => {
    setMetricsDashboardPlatform(platform as PlatformType);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3
          className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic"
        >
          Select Platform
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] animate-pulse" />
          <span className="text-[8px] font-black text-[#6CA3A2] uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="bg-[#1c1c1c] p-1.5 rounded-2xl border border-white/10 shadow-neu-inset grid grid-cols-2 gap-2">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          if (!config) return null;

          const Icon = config.icon;
          const isSelected = selectedPlatform === platform;

          return (
            <button
              key={platform}
              onClick={() => handlePlatformSelect(platform)}
              className={`relative group flex items-center gap-2.5 px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all duration-300 ${isSelected
                ? 'bg-[#0f0f0f] text-white shadow-neu-inset border border-white/5 italic'
                : 'bg-transparent text-[#444] hover:text-[#777]'
                }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-xl opacity-20 blur-md pointer-events-none"
                  style={{ backgroundColor: config.color }}
                />
              )}

              <div
                className={`transition-colors duration-300 ${isSelected ? '' : 'grayscale opacity-40'}`}
                style={{ color: isSelected ? config.color : '#444' }}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="truncate relative z-10">{config.label}</span>

              {isSelected && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
