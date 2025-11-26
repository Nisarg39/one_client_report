/**
 * Connect Platforms Step Component
 * Step 3: Platform connections during onboarding
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart3, Target, Share2, Briefcase, Check, AlertCircle, Loader2 } from 'lucide-react';
import { connectPlatform } from '@/app/actions/platforms/connectPlatform';
import { getConnectedPlatforms } from '@/app/actions/platforms/getConnectedPlatforms';

interface Platform {
  id: 'google-analytics' | 'google-ads' | 'meta-ads' | 'linkedin-ads';
  name: string;
  icon: React.ReactNode;
  description: string;
  statusNote?: string;
}

interface ConnectedPlatform {
  id: string;
  platformId: string;
  status: string;
}

interface ConnectPlatformsStepProps {
  clientId?: string;
  onConnectionsChange?: (count: number) => void;
}

const platforms: Platform[] = [
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    icon: <BarChart3 className="w-6 h-6 text-[#6CA3A2]" />,
    description: 'Website traffic, user behavior, and conversions',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    icon: <Target className="w-6 h-6 text-[#6CA3A2]" />,
    description: 'Search & display advertising performance',
    statusNote: 'Pending developer token approval',
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    icon: <Share2 className="w-6 h-6 text-[#6CA3A2]" />,
    description: 'Facebook & Instagram advertising metrics',
  },
  {
    id: 'linkedin-ads',
    name: 'LinkedIn Ads',
    icon: <Briefcase className="w-6 h-6 text-[#6CA3A2]" />,
    description: 'B2B advertising & lead generation',
    statusNote: 'Requires active ad account',
  },
];

export function ConnectPlatformsStep({ clientId, onConnectionsChange }: ConnectPlatformsStepProps) {
  const searchParams = useSearchParams();
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get success/error params
  const successParam = searchParams.get('success');
  const errorParam = searchParams.get('error');

  // Check for success/error in URL params (from OAuth callback)
  useEffect(() => {
    if (successParam) {
      const platformName = platforms.find((p) => p.id === successParam)?.name;
      setSuccessMessage(`${platformName || 'Platform'} connected successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    }

    if (errorParam) {
      setError(`Connection failed: ${decodeURIComponent(errorParam)}`);
      setTimeout(() => setError(null), 5000);
    }
  }, [successParam, errorParam]);

  // When clientId becomes available after OAuth redirect, trigger refresh
  useEffect(() => {
    if (clientId && successParam) {
      // clientId is now available after returning from OAuth - refresh connections
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [clientId, successParam]);

  // Load connected platforms
  useEffect(() => {
    async function loadConnections() {
      if (!clientId) {
        setIsLoadingConnections(false);
        return;
      }

      setIsLoadingConnections(true);
      try {
        const result = await getConnectedPlatforms({ clientId });
        if (result.success && result.platforms) {
          setConnectedPlatforms(result.platforms);
        }
      } catch (err) {
        console.error('Failed to load connected platforms:', err);
      } finally {
        setIsLoadingConnections(false);
      }
    }

    loadConnections();
  }, [clientId, refreshTrigger]); // Re-fetch when clientId changes or refresh triggered

  // Notify parent when connections change
  useEffect(() => {
    const count = connectedPlatforms.filter(
      (p) => p.status === 'active' || p.status === 'connected'
    ).length;
    onConnectionsChange?.(count);
  }, [connectedPlatforms, onConnectionsChange]);

  // Check if a platform is connected (status can be 'active' or 'connected')
  const isPlatformConnected = (platformId: string) => {
    return connectedPlatforms.some(
      (p) => p.platformId === platformId && (p.status === 'active' || p.status === 'connected')
    );
  };

  // Handle connect button click
  const handleConnect = async (platformId: 'google-analytics' | 'google-ads' | 'meta-ads' | 'linkedin-ads') => {
    if (!clientId) {
      setError('Please create a client first (go back to Step 2)');
      return;
    }

    setLoadingPlatform(platformId);
    setError(null);

    try {
      const result = await connectPlatform({
        platformId,
        clientId,
        returnPath: '/onboarding', // Redirect back to onboarding after OAuth
      });

      if (!result.success || !result.authUrl) {
        setError(result.error || 'Failed to initiate connection');
        setLoadingPlatform(null);
        return;
      }

      // Redirect to OAuth URL
      window.location.href = result.authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to connect platform');
      setLoadingPlatform(null);
    }
  };

  const connectedCount = connectedPlatforms.filter((p) => p.status === 'active' || p.status === 'connected').length;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2
          className="text-3xl font-bold text-[#f5f5f5] mb-3"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
        >
          Connect Your Marketing Platforms
        </h2>
        <p className="text-[#c0c0c0] max-w-2xl mx-auto">
          Connect platforms to get AI insights about your marketing performance.
          <br />
          You can also connect these later in Settings.
        </p>
        {connectedCount > 0 && (
          <p className="text-[#6CA3A2] mt-2 font-medium">
            {connectedCount} platform{connectedCount > 1 ? 's' : ''} connected
          </p>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Platform Cards */}
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {platforms.map((platform) => {
          const isConnected = isPlatformConnected(platform.id);
          const isLoading = loadingPlatform === platform.id;

          return (
            <div
              key={platform.id}
              className={`relative p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border transition-all ${
                isConnected ? 'border-green-500/50' : 'border-[#2a2a2a]'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
                  {platform.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#f5f5f5] mb-1 flex items-center gap-2">
                    {platform.name}
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 text-xs font-normal text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[#999] leading-relaxed mb-3">
                    {platform.description}
                  </p>

                  {/* Status Note */}
                  {platform.statusNote && !isConnected && (
                    <p className="text-xs text-[#777] mb-3 italic">
                      Note: {platform.statusNote}
                    </p>
                  )}

                  {/* Connect Button */}
                  {!isConnected && (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isLoading || isLoadingConnections || !clientId}
                      className="px-4 py-2 rounded-xl bg-[#6CA3A2] text-white font-medium text-sm hover:bg-[#5a9493] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_rgba(108,163,162,0.3)]"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice */}
      {!clientId && (
        <div className="max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#c0c0c0] leading-relaxed">
                  <span className="font-semibold text-yellow-400">Client required:</span> Please go back to Step 2 and create a client first before connecting platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skip Message */}
      <div className="text-center">
        <p className="text-sm text-[#999]">
          You can skip this step and connect platforms later from Settings
        </p>
      </div>
    </div>
  );
}
