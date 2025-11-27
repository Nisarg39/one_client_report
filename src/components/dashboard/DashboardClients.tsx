/**
 * Dashboard Clients Section
 *
 * Phase 6.5: Client management interface
 * Phase 6.6: Added search, filter, sort, and edit functionality
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Settings,
  BarChart3,
  Target,
  Share2,
  Briefcase,
  Check,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
} from 'lucide-react';
import type { ClientClient } from '@/types/chat';

export interface DashboardClientsProps {
  clients: ClientClient[];
  currentClient: ClientClient | null;
  onClientCreate: () => void;
  onClientSelect: (clientId: string) => void;
  onClientDelete: (clientId: string) => void;
  onConfigurePlatforms: (client: ClientClient) => void;
  onClientEdit?: (client: ClientClient) => void;
}

export function DashboardClients({
  clients,
  currentClient,
  onClientCreate,
  onClientSelect,
  onClientDelete,
  onConfigurePlatforms,
  onClientEdit,
}: DashboardClientsProps) {
  // Phase 6.6: Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'platforms'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  // Get platform info
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'googleAnalytics':
        return BarChart3;
      case 'googleAds':
        return Target;
      case 'metaAds':
        return Share2;
      case 'linkedInAds':
        return Briefcase;
      default:
        return Building2;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'googleAnalytics':
        return 'bg-orange-500';
      case 'googleAds':
        return 'bg-blue-500';
      case 'metaAds':
        return 'bg-blue-600';
      case 'linkedInAds':
        return 'bg-blue-700';
      default:
        return 'bg-[#6CA3A2]';
    }
  };

  const getConnectedPlatforms = (client: ClientClient): string[] => {
    return Object.entries(client.platforms)
      .filter(([_, platform]) => platform?.connected)
      .map(([key]) => key);
  };

  // Phase 6.6: Filter, search, and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...clients];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query)
      );
    }

    // Apply platform filter
    if (filterPlatform !== 'all') {
      filtered = filtered.filter((client) => {
        const platforms = getConnectedPlatforms(client);
        return platforms.includes(filterPlatform);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'created') {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'platforms') {
        const aPlatforms = getConnectedPlatforms(a).length;
        const bPlatforms = getConnectedPlatforms(b).length;
        comparison = aPlatforms - bPlatforms;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clients, searchQuery, filterPlatform, sortBy, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#f5f5f5] mb-1"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Manage Clients
          </h1>
          <p
            className="text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {clients.length} client{clients.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={onClientCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6CA3A2] text-white rounded-xl font-medium shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Phase 6.6: Search, Filter, and Sort Controls */}
      {clients.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] placeholder-[#666] transition-all outline-none"
              />
            </div>

            {/* Filter by Platform */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] appearance-none cursor-pointer transition-all outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="googleAnalytics">Google Analytics</option>
                <option value="googleAds">Google Ads</option>
                <option value="metaAds">Meta Ads</option>
                <option value="linkedInAds">LinkedIn Ads</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'platforms')}
                  className="w-full px-4 py-3 pl-12 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-2 border-transparent shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:border-[#6CA3A2] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] appearance-none cursor-pointer transition-all outline-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="created">Sort by Date</option>
                  <option value="platforms">Sort by Platforms</option>
                </select>
              </div>
              <button
                onClick={toggleSort}
                className="px-3 py-3 bg-[#1a1a1a] text-[#c0c0c0] rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] hover:text-[#6CA3A2] hover:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(70,70,70,0.4)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7)] transition-all"
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results count */}
          {(searchQuery.trim() || filterPlatform !== 'all') && (
            <div className="mt-3 pt-3 border-t border-gray-800/50">
              <p className="text-sm text-[#c0c0c0]">
                Showing {filteredAndSortedClients.length} of {clients.length} client{clients.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Client List */}
      {clients.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6CA3A2]/20 mb-4">
            <Building2 className="w-8 h-8 text-[#6CA3A2]" />
          </div>
          <h3
            className="text-lg font-semibold text-[#f5f5f5] mb-2"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            No Clients Yet
          </h3>
          <p
            className="text-[#c0c0c0] mb-6 max-w-md mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Create your first client to start tracking marketing analytics and get AI-powered insights.
          </p>
          <button
            onClick={onClientCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6CA3A2] text-white rounded-xl font-medium shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create Your First Client
          </button>
        </div>
      ) : filteredAndSortedClients.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6CA3A2]/20 mb-4">
            <AlertTriangle className="w-8 h-8 text-[#6CA3A2]" />
          </div>
          <h3
            className="text-lg font-semibold text-[#f5f5f5] mb-2"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            No Clients Found
          </h3>
          <p
            className="text-[#c0c0c0] mb-6"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            No clients match your current filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterPlatform('all');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6CA3A2] text-white rounded-xl font-medium shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedClients.map((client) => {
            const connectedPlatforms = getConnectedPlatforms(client);
            const isSelected = currentClient?.id === client.id;

            return (
              <div
                key={client.id}
                className={`bg-[#1a1a1a] rounded-2xl p-5 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)] ${
                  isSelected ? 'ring-2 ring-[#6CA3A2]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Client Logo/Icon */}
                  <div className="flex-shrink-0">
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[#6CA3A2] rounded-xl flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-lg font-semibold text-[#f5f5f5] truncate"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        {client.name}
                      </h3>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#6CA3A2]/20 text-[#6CA3A2] text-xs rounded-full">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    {client.email && (
                      <p
                        className="text-sm text-[#c0c0c0] mb-2"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {client.email}
                      </p>
                    )}

                    {/* Connected Platforms */}
                    <div className="flex items-center gap-2 mt-3">
                      {connectedPlatforms.length > 0 ? (
                        <>
                          <span
                            className="text-xs text-[#808080]"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            Platforms:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {connectedPlatforms.map((platformKey) => {
                              const Icon = getPlatformIcon(platformKey);
                              const colorClass = getPlatformColor(platformKey);
                              return (
                                <div
                                  key={platformKey}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center ${colorClass}`}
                                  title={platformKey}
                                >
                                  <Icon className="w-3.5 h-3.5 text-white" />
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <span
                          className="text-xs text-[#808080] italic"
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                        >
                          No platforms connected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isSelected && (
                      <button
                        onClick={() => onClientSelect(client.id)}
                        className="px-3 py-2 text-sm font-medium text-[#6CA3A2] bg-[#1a1a1a] rounded-lg shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7)] transition-all duration-200"
                      >
                        Select
                      </button>
                    )}
                    {/* Phase 6.6: Edit Button */}
                    {onClientEdit && (
                      <button
                        onClick={() => onClientEdit(client)}
                        className="p-2 text-[#c0c0c0] bg-[#1a1a1a] rounded-lg shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7)] transition-all duration-200 hover:text-blue-400"
                        title="Edit client"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onConfigurePlatforms(client)}
                      className="p-2 text-[#c0c0c0] bg-[#1a1a1a] rounded-lg shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7)] transition-all duration-200 hover:text-[#6CA3A2]"
                      title="Configure platforms"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    {deleteConfirm === client.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onClientDelete(client.id);
                            setDeleteConfirm(null);
                          }}
                          className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-xs font-medium text-[#c0c0c0] bg-[#252525] rounded-lg hover:bg-[#333] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(client.id)}
                        className="p-2 text-[#c0c0c0] bg-[#1a1a1a] rounded-lg shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7)] transition-all duration-200 hover:text-red-400"
                        title="Delete client"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Client Meta */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800/50">
                  <span
                    className="text-xs text-[#808080]"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    Created: {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className="text-xs text-[#808080]"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? 's' : ''} connected
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
