/**
 * Platform Configuration Modal
 *
 * Modal for configuring platform connections for a specific client
 * Shows available platforms and allows users to connect/disconnect them
 */

'use client';

import { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Settings,
  BarChart3,
  Target,
  Share2,
  Briefcase,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClientClient } from '@/types/chat';

export interface PlatformConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientClient | null;
  onUpdatePlatforms: (clientId: string, platforms: any) => Promise<void>;
}

type PlatformKey = 'googleAnalytics' | 'googleAds' | 'metaAds' | 'linkedInAds';

interface PlatformInfo {
  key: PlatformKey;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const AVAILABLE_PLATFORMS: PlatformInfo[] = [
  {
    key: 'googleAnalytics',
    name: 'Google Analytics',
    description: 'Website traffic, user behavior, conversions',
    icon: BarChart3,
    color: 'bg-orange-500',
  },
  {
    key: 'googleAds',
    name: 'Google Ads',
    description: 'Campaign performance, spend, conversions',
    icon: Target,
    color: 'bg-blue-500',
  },
  {
    key: 'metaAds',
    name: 'Meta Ads',
    description: 'Facebook & Instagram ad performance',
    icon: Share2,
    color: 'bg-blue-600',
  },
  {
    key: 'linkedInAds',
    name: 'LinkedIn Ads',
    description: 'B2B ad campaigns, lead generation',
    icon: Briefcase,
    color: 'bg-blue-700',
  },
];

export function PlatformConfigModal({
  isOpen,
  onClose,
  client,
  onUpdatePlatforms,
}: PlatformConfigModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformKey>>(
    new Set(
      client
        ? (Object.keys(client.platforms) as PlatformKey[]).filter(
            (key) => client.platforms[key]?.connected
          )
        : []
    )
  );

  const togglePlatform = (platform: PlatformKey) => {
    setSelectedPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!client) return;

    setIsSubmitting(true);

    try {
      // Build platforms object
      const platforms: any = {};
      AVAILABLE_PLATFORMS.forEach((platform) => {
        if (selectedPlatforms.has(platform.key)) {
          platforms[platform.key] = {
            connected: true,
            status: 'active',
          };
        }
      });

      await onUpdatePlatforms(client.id, platforms);
      onClose();
    } catch (error) {
      console.error('Failed to update platforms:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!client) return null;

  // Filter to show only connected platforms for this client
  const connectedPlatforms = AVAILABLE_PLATFORMS.filter(
    (platform) => client.platforms[platform.key]?.connected
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a1a] rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] w-full max-w-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2)]">
                    <Settings className="w-5 h-5 text-[#6CA3A2]" />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-semibold text-[#f5f5f5]"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    >
                      Configure Platforms
                    </h2>
                    <p
                      className="text-xs text-[#c0c0c0]"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {client.name} - Connected platforms
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-lg bg-[#1a1a1a] shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all duration-200 disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-[#c0c0c0]" />
                </button>
              </div>

              {/* Platform List */}
              <div className="p-6 max-h-[500px] overflow-y-auto">
                {connectedPlatforms.length > 0 ? (
                  <>
                    <p
                      className="text-sm text-[#c0c0c0] mb-4"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      These are the platforms currently connected for this client.
                      You can enable or disable them below.
                    </p>

                    <div className="space-y-3">
                      {connectedPlatforms.map((platform) => {
                    const isConnected = selectedPlatforms.has(platform.key);
                    const Icon = platform.icon;

                    return (
                      <button
                        key={platform.key}
                        onClick={() => togglePlatform(platform.key)}
                        disabled={isSubmitting}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all disabled:opacity-50 ${
                          isConnected
                            ? 'bg-[#1a1a1a] shadow-[inset_2px_2px_8px_rgba(0,0,0,0.7),inset_-2px_-2px_8px_rgba(60,60,60,0.2),0_0_0_2px_rgba(108,163,162,0.3)]'
                            : 'bg-[#1a1a1a] shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]'
                        }`}
                      >
                        {/* Platform Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${platform.color}`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Platform Info */}
                        <div className="flex-1 text-left">
                          <h3
                            className="text-base font-semibold text-[#f5f5f5]"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            {platform.name}
                          </h3>
                          <p
                            className="text-xs text-[#c0c0c0]"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            {platform.description}
                          </p>
                        </div>

                        {/* Connected Indicator */}
                        <div>
                          {isConnected ? (
                            <CheckCircle2 className="w-6 h-6 text-[#6CA3A2] drop-shadow-[0_2px_4px_rgba(108,163,162,0.5)]" />
                          ) : (
                            <Circle className="w-6 h-6 text-[#c0c0c0] opacity-30" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2),0_0_0_1px_rgba(108,163,162,0.2)]">
                      <p className="text-sm text-[#c0c0c0] flex items-start gap-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#6CA3A2]" />
                        <span>
                          <strong className="text-[#f5f5f5]">Note:</strong> This is a simplified setup for
                          development. In production, you'll authenticate with OAuth
                          for each platform.
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p
                      className="text-sm text-[#c0c0c0] mb-2"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      No platforms are currently connected for this client.
                    </p>
                    <p
                      className="text-xs text-[#808080]"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      Connect platforms to start tracking marketing data.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800/50 bg-[#0a0a0a]">
                <div
                  className="text-sm text-[#c0c0c0]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {connectedPlatforms.length} connected platform
                  {connectedPlatforms.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#1a1a1a] text-[#c0c0c0] rounded-xl shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] transition-all duration-200 disabled:opacity-50 font-medium"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-gradient-to-br from-[#6CA3A2] to-[#5a9291] text-white rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(108,163,162,0.3)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4),inset_-6px_-6px_12px_rgba(108,163,162,0.2)] transition-all duration-200 disabled:opacity-50 font-semibold"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
