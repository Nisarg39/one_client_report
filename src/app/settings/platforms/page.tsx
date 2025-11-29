/**
 * Platform Connections Page
 *
 * Manage platform integrations for clients
 * Uses neumorphic design system matching onboarding flow
 */

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BarChart3,
  Target,
  Share2,
  Briefcase,
  Check,
  AlertCircle,
  Loader2,
  Settings,
  ChevronDown,
  RefreshCw,
  Unlink,
  Link2,
  Calendar,
} from 'lucide-react';
import { connectPlatform } from '@/app/actions/platforms/connectPlatform';
import { disconnectPlatform } from '@/app/actions/platforms/disconnectPlatform';
import { refreshPlatformConnection } from '@/app/actions/platforms/refreshPlatformConnection';
import { getConnectedPlatforms } from '@/app/actions/platforms/getConnectedPlatforms';
import { getClients, ClientData } from '@/app/actions/clients/getClients';
import { getGAProperties } from '@/app/actions/platforms/getGAProperties';
import { updateGAProperty } from '@/app/actions/platforms/updateGAProperty';

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
  expiresAt?: string;
  metadata?: {
    accountId?: string;
    accountName?: string;
    propertyId?: string;
    propertyName?: string;
  };
}

interface GAProperty {
  id: string;
  name: string;
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

function PlatformsContent() {
  const searchParams = useSearchParams();
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // GA Properties state
  const [gaProperties, setGaProperties] = useState<GAProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);

  // Load connected platforms
  const loadPlatforms = async () => {
    if (!selectedClientId) return;

    setLoading(true);
    try {
      const result = await getConnectedPlatforms({ clientId: selectedClientId });
      if (result.success && result.platforms) {
        setConnectedPlatforms(result.platforms);
      }
    } catch (err) {
      console.error('Failed to load platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load GA properties when connected
  const loadGAProperties = async (connectionId: string) => {
    setLoadingProperties(true);
    try {
      const result = await getGAProperties({ connectionId });
      if (result.success && result.properties) {
        setGaProperties(result.properties);
        setSelectedPropertyId(result.selectedPropertyId || '');
      }
    } catch (err) {
      console.error('Failed to load GA properties:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Check for success/error in URL
  useEffect(() => {
    const success = searchParams.get('success');
    const errorParam = searchParams.get('error');

    if (success) {
      const platformName = platforms.find((p) => p.id === success)?.name;
      setSuccessMessage(`${platformName || 'Platform'} connected successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadPlatforms();
    }

    if (errorParam) {
      setError(`Connection failed: ${decodeURIComponent(errorParam)}`);
      setTimeout(() => setError(null), 5000);
    }
  }, [searchParams]);

  // Load clients on mount
  useEffect(() => {
    const loadClients = async () => {
      setClientsLoading(true);
      try {
        const result = await getClients();
        if (result.success && result.clients) {
          setClients(result.clients);
          if (result.clients.length === 1) {
            setSelectedClientId(result.clients[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load clients:', err);
      } finally {
        setClientsLoading(false);
      }
    };
    loadClients();
  }, []);

  // Load platforms when client changes
  useEffect(() => {
    if (selectedClientId) {
      loadPlatforms();
    }
  }, [selectedClientId]);

  // Load GA properties when GA is connected
  useEffect(() => {
    const gaConnection = connectedPlatforms.find(
      (p) => p.platformId === 'google-analytics' && (p.status === 'active' || p.status === 'connected')
    );
    if (gaConnection) {
      loadGAProperties(gaConnection.id);
    }
  }, [connectedPlatforms]);

  // Check if a platform is connected
  const isPlatformConnected = (platformId: string) => {
    return connectedPlatforms.some(
      (p) => p.platformId === platformId && (p.status === 'active' || p.status === 'connected')
    );
  };

  // Get platform connection
  const getConnection = (platformId: string) => {
    return connectedPlatforms.find((p) => p.platformId === platformId);
  };

  // Handle connect
  const handleConnect = async (platformId: Platform['id']) => {
    if (!selectedClientId) {
      setError('Please select a client first');
      return;
    }

    setLoadingPlatform(platformId);
    setError(null);

    try {
      const result = await connectPlatform({
        platformId,
        clientId: selectedClientId,
        returnPath: '/settings/platforms',
      });

      if (!result.success || !result.authUrl) {
        setError(result.error || 'Failed to initiate connection');
        setLoadingPlatform(null);
        return;
      }

      window.location.href = result.authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to connect platform');
      setLoadingPlatform(null);
    }
  };

  // Handle disconnect
  const handleDisconnect = async (connectionId: string, platformName: string) => {
    const confirmed = confirm(
      `Are you sure you want to disconnect ${platformName}? This will remove all saved credentials.`
    );

    if (!confirmed) return;

    setLoadingPlatform(connectionId);
    setError(null);

    try {
      const result = await disconnectPlatform({ connectionId });

      if (!result.success) {
        setError(result.error || 'Failed to disconnect platform');
        return;
      }

      setSuccessMessage(`${platformName} disconnected successfully`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadPlatforms();
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect platform');
    } finally {
      setLoadingPlatform(null);
    }
  };

  // Handle refresh
  const handleRefresh = async (connectionId: string, platformName: string) => {
    setLoadingPlatform(connectionId);
    setError(null);

    try {
      const result = await refreshPlatformConnection({ connectionId });

      if (!result.success) {
        setError(result.error || 'Failed to refresh connection');
        return;
      }

      setSuccessMessage(`${platformName} refreshed successfully`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadPlatforms();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh connection');
    } finally {
      setLoadingPlatform(null);
    }
  };

  // Handle GA property change
  const handlePropertyChange = async (propertyId: string) => {
    const gaConnection = connectedPlatforms.find((p) => p.platformId === 'google-analytics');
    if (!gaConnection) return;

    const property = gaProperties.find((p) => p.id === propertyId);
    if (!property) return;

    setSavingProperty(true);
    setError(null);

    try {
      const result = await updateGAProperty({
        connectionId: gaConnection.id,
        propertyId: property.id,
        propertyName: property.name,
      });

      if (result.success) {
        setSelectedPropertyId(propertyId);
        setSuccessMessage('Property updated successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
        loadPlatforms();
      } else {
        setError(result.error || 'Failed to update property');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update property');
    } finally {
      setSavingProperty(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const connectedCount = connectedPlatforms.filter(
    (p) => p.status === 'active' || p.status === 'connected'
  ).length;

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl font-bold text-[#f5f5f5] mb-3"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Platform Connections
          </h1>
          <p className="text-[#c0c0c0] max-w-2xl mx-auto">
            Manage your connected marketing platforms to enable AI-powered insights and analytics.
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

        {/* Back to Chat Link */}
        <div className="max-w-3xl mx-auto">
          <a
            href="/chat"
            className="inline-flex items-center gap-2 text-base font-medium text-[#6CA3A2] hover:text-[#5a9493] transition-colors"
          >
            ← Back to Chat
          </a>
        </div>

        {/* Client Selector */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            <label
              htmlFor="client"
              className="block text-sm font-semibold text-[#f5f5f5] mb-3"
            >
              Select Client
            </label>
            {clientsLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#151515] text-[#999] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading clients...
              </div>
            ) : clients.length === 0 ? (
              <div className="px-4 py-3 rounded-xl bg-[#151515] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]">
                <p className="text-[#999]">
                  No clients found.{' '}
                  <a
                    href="/onboarding"
                    className="text-[#6CA3A2] hover:text-[#5a9493] underline transition-colors"
                  >
                    Create a client first
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="relative">
                <select
                  id="client"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#151515] text-[#f5f5f5] appearance-none cursor-pointer shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)] focus:outline-none focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3),0_0_0_2px_rgba(108,163,162,0.5)] transition-shadow duration-200"
                >
                  <option value="">-- Select a client --</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}{' '}
                      {client.connectedPlatforms.length > 0 &&
                        `(${client.connectedPlatforms.length} platforms)`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999] pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Platform Cards */}
        {selectedClientId ? (
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {platforms.map((platform) => {
              const isConnected = isPlatformConnected(platform.id);
              const connection = getConnection(platform.id);
              const isLoading = loadingPlatform === platform.id || loadingPlatform === connection?.id;
              const isExpired = connection?.status === 'expired';
              const isGoogleAnalytics = platform.id === 'google-analytics';

              return (
                <div
                  key={platform.id}
                  className="relative p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
                      {platform.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#f5f5f5] mb-1 flex items-center gap-2 flex-wrap">
                        {platform.name}
                        {isConnected && !isExpired && (
                          <span className="inline-flex items-center gap-1 text-xs font-normal text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            Connected
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1 text-xs font-normal text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Expired
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

                      {/* Expiry Info */}
                      {isConnected && connection?.expiresAt && (
                        <div className="flex items-center gap-2 text-xs text-[#999] mb-3">
                          <Calendar className="w-3 h-3" />
                          Expires: {formatDate(connection.expiresAt)}
                        </div>
                      )}

                      {/* GA Property Selector */}
                      {isConnected && isGoogleAnalytics && !isExpired && (
                        <div className="mb-3 p-3 rounded-xl bg-[#151515] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
                          <label className="block text-xs font-medium text-[#c0c0c0] mb-2">
                            Select Property
                          </label>
                          {loadingProperties ? (
                            <div className="flex items-center gap-2 text-xs text-[#999]">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Loading properties...
                            </div>
                          ) : (
                            <div className="relative">
                              <select
                                value={selectedPropertyId}
                                onChange={(e) => handlePropertyChange(e.target.value)}
                                disabled={savingProperty || gaProperties.length === 0}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-[#1a1a1a] text-[#f5f5f5] appearance-none cursor-pointer border border-[#2a2a2a] focus:outline-none focus:border-[#6CA3A2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {gaProperties.length === 0 ? (
                                  <option value="">No properties found</option>
                                ) : (
                                  <>
                                    <option value="">-- Select a property --</option>
                                    {gaProperties.map((property) => (
                                      <option key={property.id} value={property.id}>
                                        {property.name} ({property.id})
                                      </option>
                                    ))}
                                  </>
                                )}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999] pointer-events-none" />
                            </div>
                          )}
                          {savingProperty && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-[#6CA3A2]">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Saving...
                            </div>
                          )}
                          {selectedPropertyId && !savingProperty && (
                            <div className="mt-2 text-xs text-[#777]">
                              Currently using:{' '}
                              {gaProperties.find((p) => p.id === selectedPropertyId)?.name ||
                                selectedPropertyId}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {!isConnected && (
                          <button
                            onClick={() => handleConnect(platform.id)}
                            disabled={isLoading || loading}
                            className="px-4 py-2 rounded-xl bg-[#6CA3A2] text-white font-medium text-sm hover:bg-[#5a9493] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_rgba(108,163,162,0.3)]"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Connecting...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Link2 className="w-4 h-4" />
                                Connect
                              </span>
                            )}
                          </button>
                        )}

                        {isConnected && !isExpired && connection && (
                          <>
                            <button
                              onClick={() => handleRefresh(connection.id, platform.name)}
                              disabled={isLoading}
                              className="px-3 py-2 rounded-xl bg-[#1a1a1a] text-[#6CA3A2] font-medium text-sm border border-[#2a2a2a] hover:border-[#6CA3A2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[-4px_-4px_10px_rgba(70,70,70,0.3),4px_4px_10px_rgba(0,0,0,0.7)]"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <span className="flex items-center gap-2">
                                  <RefreshCw className="w-4 h-4" />
                                  Refresh
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => handleDisconnect(connection.id, platform.name)}
                              disabled={isLoading}
                              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 font-medium text-sm border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Unlink className="w-4 h-4" />
                                  Disconnect
                                </span>
                              )}
                            </button>
                          </>
                        )}

                        {isExpired && connection && (
                          <>
                            <button
                              onClick={() => handleRefresh(connection.id, platform.name)}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 font-medium text-sm border border-yellow-500/30 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isLoading ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Refreshing...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <RefreshCw className="w-4 h-4" />
                                  Reconnect
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => handleDisconnect(connection.id, platform.name)}
                              disabled={isLoading}
                              className="px-3 py-2 rounded-xl bg-[#1a1a1a] text-[#999] font-medium text-sm border border-[#2a2a2a] hover:text-red-400 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Unlink className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-3xl mx-auto">
            <div className="p-12 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a] text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.5),inset_-6px_-6px_12px_rgba(60,60,60,0.3)] mb-4">
                <Link2 className="w-8 h-8 text-[#6CA3A2]" />
              </div>
              <h3 className="text-xl font-semibold text-[#f5f5f5] mb-2">
                Select a Client
              </h3>
              <p className="text-[#999]">
                Choose a client above to manage their platform connections
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlatformsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h1
                className="text-3xl font-bold text-[#f5f5f5] mb-3"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                Platform Connections
              </h1>
              <div className="flex items-center justify-center gap-2 text-[#999]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PlatformsContent />
    </Suspense>
  );
}
