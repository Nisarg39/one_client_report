/**
 * Dashboard Overview Section
 *
 * Phase 6.5: Shows summary stats, quick actions, and recent activity
 * Phase 6.6: Added GA analytics, platform health, AI usage, and activity feed
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  Link2,
  Plus,
  ArrowRight,
  Zap,
  BarChart3,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import type { DashboardSection, ClientClient } from '@/types/chat';
import { getDashboardStats, type DashboardStats } from '@/app/actions/dashboard/getDashboardStats';

export interface DashboardOverviewProps {
  clients: ClientClient[];
  totalConversations: number;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onNavigate: (section: DashboardSection) => void;
  onClientCreate: () => void;
}

export function DashboardOverview({
  clients,
  totalConversations,
  user,
  onNavigate,
  onClientCreate,
}: DashboardOverviewProps) {
  // Calculate stats
  const totalClients = clients.length;
  const connectedPlatforms = clients.reduce((total, client) => {
    let count = 0;
    if (client.platforms.googleAnalytics?.connected) count++;
    if (client.platforms.googleAds?.connected) count++;
    if (client.platforms.metaAds?.connected) count++;
    if (client.platforms.linkedInAds?.connected) count++;
    return total + count;
  }, 0);

  // Phase 6.6: Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch dashboard stats on mount with 5-second timeout
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoadingStats(true);

        // Race between fetch and 5-second timeout
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const stats = await Promise.race([
          getDashboardStats(),
          timeoutPromise
        ]);

        setDashboardStats(stats);
      } catch (error) {
        // Show dashboard without stats if timeout or error - graceful degradation
        setDashboardStats(null);
      } finally {
        setIsLoadingStats(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-[#f5f5f5] mb-2"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p
          className="text-[#c0c0c0]"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Here&apos;s an overview of your marketing analytics dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Clients Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#6CA3A2]/20 rounded-xl">
              <Users className="w-6 h-6 text-[#6CA3A2]" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-[#f5f5f5] mb-1"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {totalClients}
          </p>
          <p
            className="text-sm text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Active Clients
          </p>
        </div>

        {/* Conversations Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-[#f5f5f5] mb-1"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {totalConversations}
          </p>
          <p
            className="text-sm text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Total Conversations
          </p>
        </div>

        {/* Platforms Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Link2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-[#f5f5f5] mb-1"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {connectedPlatforms}
          </p>
          <p
            className="text-sm text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Connected Platforms
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className="text-lg font-semibold text-[#f5f5f5] mb-4"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Add Client */}
          <button
            onClick={onClientCreate}
            className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)] transition-all duration-200 text-left"
          >
            <div className="p-2 bg-[#6CA3A2]/20 rounded-lg">
              <Plus className="w-5 h-5 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Add New Client
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Create a new client profile
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#808080]" />
          </button>

          {/* Manage Clients */}
          <button
            onClick={() => onNavigate('clients')}
            className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)] transition-all duration-200 text-left"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Manage Clients
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                View and edit all clients
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#808080]" />
          </button>

          {/* View Profile */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)] transition-all duration-200 text-left"
          >
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Your Profile
              </p>
              <p
                className="text-xs text-[#808080]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                View account details
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#808080]" />
          </button>
        </div>
      </div>

      {/* Phase 6.6: New Dashboard Widgets */}
      {!isLoadingStats && dashboardStats && (
        <>
          {/* Google Analytics Summary */}
          {dashboardStats.gaMetrics && !dashboardStats.gaMetrics.error && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Analytics Summary
                  </h3>
                  <p className="text-xs text-[#808080]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.gaMetrics.dateRange}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.gaMetrics.totalSessions.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Total Sessions
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.gaMetrics.totalPageViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Page Views
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f5f5] capitalize" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.gaMetrics.topTrafficSource}
                  </p>
                  <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Top Source
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Platform Health Status */}
          {dashboardStats.platformHealth.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Platform Health
                </h3>
              </div>
              <div className="space-y-3">
                {dashboardStats.platformHealth.map((platform) => (
                  <div
                    key={`${platform.platformId}-${platform.clientName}`}
                    className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {platform.status === 'healthy' && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {platform.status === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                      {platform.status === 'expired' && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#f5f5f5]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          {platform.platformName}
                        </p>
                        <p className="text-xs text-[#808080]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          {platform.clientName}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {platform.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Usage Stats */}
          {dashboardStats.aiUsage.messagesThisMonth > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    AI Usage Stats
                  </h3>
                  <p className="text-xs text-[#808080]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.aiUsage.period}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Messages Sent This Month */}
                <div>
                  <p className="text-2xl font-bold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.aiUsage.messagesThisMonth}
                  </p>
                  <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Messages Sent
                  </p>
                </div>

                {/* Today's Message Usage */}
                <div>
                  <p className="text-2xl font-bold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {dashboardStats.aiUsage.messagesToday} / {dashboardStats.aiUsage.dailyLimit}
                  </p>
                  <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Today&apos;s Message Usage
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-[#2a2a2a] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (() => {
                          const usagePercent = (dashboardStats.aiUsage.messagesToday / dashboardStats.aiUsage.dailyLimit) * 100;
                          if (usagePercent >= 90) return 'bg-red-500';
                          if (usagePercent >= 70) return 'bg-yellow-500';
                          return 'bg-green-500';
                        })()
                      }`}
                      style={{
                        width: `${Math.min((dashboardStats.aiUsage.messagesToday / dashboardStats.aiUsage.dailyLimit) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Feed */}
          {dashboardStats.recentActivity.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#6CA3A2]/20 rounded-lg">
                  <Clock className="w-5 h-5 text-[#6CA3A2]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                {dashboardStats.recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-[#0f0f0f] rounded-xl"
                  >
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#f5f5f5]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {activity.title}
                      </p>
                      <p className="text-xs text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {activity.description}
                      </p>
                    </div>
                    <p className="text-xs text-[#808080]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {isLoadingStats && (
        <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-[#6CA3A2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#c0c0c0]">Loading dashboard stats...</p>
          </div>
        </div>
      )}

      {/* Getting Started (show if no clients) */}
      {totalClients === 0 && (
        <div className="bg-gradient-to-br from-[#6CA3A2]/10 to-[#6CA3A2]/5 rounded-2xl p-8 border border-[#6CA3A2]/20">
          <h3
            className="text-lg font-semibold text-[#f5f5f5] mb-2"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Get Started with OneAssist
          </h3>
          <p
            className="text-[#c0c0c0] mb-4"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Create your first client to start tracking marketing analytics and get AI-powered insights.
          </p>
          <button
            onClick={onClientCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6CA3A2] text-white rounded-xl font-medium shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4)] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Create Your First Client
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to format timestamp as relative time
 */
function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(timestamp).toLocaleDateString();
}
