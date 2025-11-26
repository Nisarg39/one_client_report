/**
 * Platform Card Component
 *
 * Displays platform connection status and provides connect/disconnect actions
 */

'use client';

import { useState, useEffect } from 'react';
import { connectPlatform } from '@/app/actions/platforms/connectPlatform';
import { disconnectPlatform } from '@/app/actions/platforms/disconnectPlatform';
import { refreshPlatformConnection } from '@/app/actions/platforms/refreshPlatformConnection';
import { getGAProperties } from '@/app/actions/platforms/getGAProperties';
import { updateGAProperty } from '@/app/actions/platforms/updateGAProperty';

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Connection {
  id: string;
  platformId: string;
  status: string;
  expiresAt: string;
  lastSyncedAt?: string;
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

interface PlatformCardProps {
  platform: Platform;
  connection?: Connection;
  clientId: string;
  onConnectionChange: () => void;
}

export function PlatformCard({
  platform,
  connection,
  clientId,
  onConnectionChange,
}: PlatformCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GA Properties state
  const [gaProperties, setGaProperties] = useState<GAProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);

  const isConnected = !!connection;
  const isExpired = connection?.status === 'expired';
  const isGoogleAnalytics = platform.id === 'google-analytics';

  // Load GA properties when connected
  useEffect(() => {
    if (isConnected && isGoogleAnalytics && connection) {
      loadGAProperties();
    }
  }, [isConnected, isGoogleAnalytics, connection?.id]);

  /**
   * Load Google Analytics properties
   */
  const loadGAProperties = async () => {
    if (!connection) return;

    setLoadingProperties(true);
    try {
      const result = await getGAProperties({ connectionId: connection.id });
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

  /**
   * Handle GA property change
   */
  const handlePropertyChange = async (propertyId: string) => {
    if (!connection) return;

    const property = gaProperties.find(p => p.id === propertyId);
    if (!property) return;

    setSavingProperty(true);
    setError(null);

    try {
      const result = await updateGAProperty({
        connectionId: connection.id,
        propertyId: property.id,
        propertyName: property.name,
      });

      if (result.success) {
        setSelectedPropertyId(propertyId);
        onConnectionChange(); // Refresh the connection data
      } else {
        setError(result.error || 'Failed to update property');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update property');
    } finally {
      setSavingProperty(false);
    }
  };

  /**
   * Handle platform connection
   */
  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await connectPlatform({
        clientId,
        platformId: platform.id as 'google-analytics' | 'meta-ads' | 'google-ads' | 'linkedin-ads',
      });

      if (!result.success || !result.authUrl) {
        setError(result.error || 'Failed to initiate connection');
        return;
      }

      // Redirect to OAuth URL
      window.location.href = result.authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to connect platform');
      setLoading(false);
    }
  };

  /**
   * Handle platform disconnection
   */
  const handleDisconnect = async () => {
    if (!connection) return;

    const confirmed = confirm(
      `Are you sure you want to disconnect ${platform.name}? This will remove all saved credentials.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);

      const result = await disconnectPlatform({
        connectionId: connection.id,
      });

      if (!result.success) {
        setError(result.error || 'Failed to disconnect platform');
        return;
      }

      onConnectionChange();
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect platform');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle token refresh
   */
  const handleRefresh = async () => {
    if (!connection) return;

    try {
      setLoading(true);
      setError(null);

      const result = await refreshPlatformConnection({
        connectionId: connection.id,
      });

      if (!result.success) {
        setError(result.error || 'Failed to refresh connection');
        return;
      }

      onConnectionChange();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh connection');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Get status badge color
   */
  const getStatusColor = () => {
    if (!isConnected) return 'bg-gray-100 text-gray-800';
    if (isExpired) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  /**
   * Get status text
   */
  const getStatusText = () => {
    if (!isConnected) return 'Not Connected';
    if (isExpired) return 'Expired';
    return 'Connected';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Header with platform color */}
      <div
        className="h-2"
        style={{ backgroundColor: platform.color }}
      />

      <div className="p-6">
        {/* Platform Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">{platform.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {platform.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {platform.description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Connection Details */}
        {isConnected && connection && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-sm">
              {connection.metadata?.accountName && (
                <div>
                  <span className="font-medium text-gray-700">Account: </span>
                  <span className="text-gray-600">
                    {connection.metadata.accountName}
                  </span>
                </div>
              )}
              {connection.expiresAt && (
                <div>
                  <span className="font-medium text-gray-700">Expires: </span>
                  <span className="text-gray-600">
                    {formatDate(connection.expiresAt)}
                  </span>
                </div>
              )}
              {connection.lastSyncedAt && (
                <div>
                  <span className="font-medium text-gray-700">Last Synced: </span>
                  <span className="text-gray-600">
                    {formatDate(connection.lastSyncedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GA Property Selector */}
        {isConnected && isGoogleAnalytics && !isExpired && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <label
              htmlFor="ga-property"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Property
            </label>
            {loadingProperties ? (
              <div className="text-sm text-gray-500">Loading properties...</div>
            ) : (
              <select
                id="ga-property"
                value={selectedPropertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                disabled={savingProperty || gaProperties.length === 0}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
            )}
            {savingProperty && (
              <div className="mt-2 text-xs text-blue-600">Saving...</div>
            )}
            {selectedPropertyId && (
              <div className="mt-2 text-xs text-gray-500">
                Currently using: {gaProperties.find(p => p.id === selectedPropertyId)?.name || selectedPropertyId}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isConnected && (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          )}

          {isConnected && !isExpired && (
            <>
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Disconnecting...' : 'Disconnect'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </>
          )}

          {isExpired && (
            <>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Connection'}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
