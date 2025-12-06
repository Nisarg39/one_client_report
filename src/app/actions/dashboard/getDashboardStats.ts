/**
 * Get Dashboard Stats Server Action
 *
 * Aggregates all dashboard statistics for the Overview section:
 * - Google Analytics Summary (last 7 days)
 * - Platform Health Status
 * - AI Usage Stats (messages, tokens, cost)
 * - Recent Activity Feed
 */

'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import ClientModel from '@/models/Client';
import ConversationModel from '@/models/Conversation';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { fetchAllGoogleAnalyticsProperties } from '@/lib/platforms/googleAnalytics/fetchData';
import { checkTrialLimits } from '@/lib/utils/trialLimits';

/**
 * Google Analytics Summary
 */
export interface GAMetricsSummary {
  totalSessions: number;
  totalPageViews: number;
  topTrafficSource: string;
  dateRange: string;
  error?: string;
}

/**
 * Platform Health Status
 */
export interface PlatformHealth {
  platformId: string;
  platformName: string;
  status: 'healthy' | 'warning' | 'expired' | 'error';
  daysUntilExpiry?: number;
  expiresAt?: Date;
  clientName: string;
  message: string;
}

/**
 * AI Usage Stats
 */
export interface AIUsageStats {
  messagesThisMonth: number;
  messagesToday: number;
  dailyLimit: number;
  period: string;
}

/**
 * Recent Activity Item
 */
export interface RecentActivity {
  id: string;
  type: 'client_created' | 'platform_connected' | 'conversation_started';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

/**
 * Complete Dashboard Stats
 */
export interface DashboardStats {
  gaMetrics: GAMetricsSummary | null;
  platformHealth: PlatformHealth[];
  aiUsage: AIUsageStats;
  recentActivity: RecentActivity[];
}

/**
 * Platform ID to Name mapping
 */
const platformNames: Record<string, string> = {
  'google-analytics': 'Google Analytics',
  'google-ads': 'Google Ads',
  'meta-ads': 'Meta Ads',
  'linkedin-ads': 'LinkedIn Ads',
};

/**
 * Get Dashboard Stats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const user = await requireAuth();
    await connectDB();

    // Run all data fetches in parallel for performance
    const [gaMetrics, platformHealth, aiUsage, recentActivity] = await Promise.all([
      getGAMetrics(user.id),
      getPlatformHealth(user.id),
      getAIUsageStats(user.id),
      getRecentActivity(user.id),
    ]);

    return {
      gaMetrics,
      platformHealth,
      aiUsage,
      recentActivity,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

/**
 * Get Google Analytics Summary (last 7 days)
 */
async function getGAMetrics(userId: string): Promise<GAMetricsSummary | null> {
  try {
    // Find all active GA connections for the user
    const gaConnections = await PlatformConnectionModel.find({
      userId,
      platformId: 'google-analytics',
      status: 'active',
    });

    if (gaConnections.length === 0) {
      return null;
    }

    let totalSessions = 0;
    let totalPageViews = 0;
    const trafficSources: Record<string, number> = {};

    // Aggregate metrics from all GA connections
    for (const connection of gaConnections) {
      try {
        const gaData = await fetchAllGoogleAnalyticsProperties(connection);

        if (gaData && gaData.properties) {
          for (const property of gaData.properties) {
            if (property.metrics) {
              totalSessions += property.metrics.sessions || 0;
              totalPageViews += property.metrics.pageviews || 0;

              // Aggregate traffic sources from dimensions
              if (property.dimensions?.topSources && property.dimensions.topSources.length > 0) {
                const topSource = property.dimensions.topSources[0];
                const source = topSource.source;
                trafficSources[source] = (trafficSources[source] || 0) + topSource.sessions;
              }
            }
          }
        }
      } catch (error) {
        // Silently continue with other connections (expected failures for expired tokens)
      }
    }

    // Find top traffic source
    const topSource = Object.entries(trafficSources)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'organic';

    return {
      totalSessions,
      totalPageViews,
      topTrafficSource: topSource,
      dateRange: 'Last 7 days',
    };
  } catch (error) {
    // Return empty metrics on error (don't log - expected for users without GA)
    return {
      totalSessions: 0,
      totalPageViews: 0,
      topTrafficSource: 'N/A',
      dateRange: 'Last 7 days',
      error: 'Failed to fetch analytics data',
    };
  }
}

/**
 * Get Platform Health Status
 */
async function getPlatformHealth(userId: string): Promise<PlatformHealth[]> {
  try {
    // Get all active platform connections
    const connections = await PlatformConnectionModel.find({
      userId,
      status: { $in: ['active', 'connected'] },
    }).populate('clientId', 'name');

    const healthStatus: PlatformHealth[] = [];

    for (const connection of connections) {
      const now = new Date();
      const expiresAt = connection.expiresAt;

      if (!expiresAt) {
        // No expiry date - assume healthy
        healthStatus.push({
          platformId: connection.platformId,
          platformName: platformNames[connection.platformId] || connection.platformId,
          status: 'healthy',
          clientName: (connection as any).clientId?.name || 'Unknown',
          message: 'Connection active',
        });
        continue;
      }

      const msUntilExpiry = expiresAt.getTime() - now.getTime();
      const daysUntilExpiry = Math.floor(msUntilExpiry / (1000 * 60 * 60 * 24));

      let status: 'healthy' | 'warning' | 'expired' | 'error';
      let message: string;

      if (daysUntilExpiry < 0) {
        status = 'expired';
        message = 'Token expired - reconnection needed';
      } else if (daysUntilExpiry <= 7) {
        status = 'warning';
        message = `Token expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`;
      } else {
        status = 'healthy';
        message = `Active (expires in ${daysUntilExpiry} days)`;
      }

      healthStatus.push({
        platformId: connection.platformId,
        platformName: platformNames[connection.platformId] || connection.platformId,
        status,
        daysUntilExpiry,
        expiresAt,
        clientName: (connection as any).clientId?.name || 'Unknown',
        message,
      });
    }

    return healthStatus;
  } catch (error) {
    // Return empty array on error (don't log - graceful degradation)
    return [];
  }
}

/**
 * Get AI Usage Stats (this month and today)
 */
async function getAIUsageStats(userId: string): Promise<AIUsageStats> {
  try {
    // Get start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all conversations for this user created this month
    const conversations = await ConversationModel.find({
      userId,
      createdAt: { $gte: startOfMonth },
      status: { $ne: 'deleted' },
    });

    // Aggregate monthly message count
    let messagesThisMonth = 0;
    for (const conv of conversations) {
      messagesThisMonth += conv.messageCount || 0;
    }

    // Get daily message usage using existing trial limits logic
    const trialCheck = await checkTrialLimits(userId);

    return {
      messagesThisMonth,
      messagesToday: trialCheck.messagesUsed || 0,
      dailyLimit: trialCheck.messagesLimit || 50,
      period: `${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    };
  } catch (error) {
    // Return zero stats on error (don't log - graceful degradation)
    return {
      messagesThisMonth: 0,
      messagesToday: 0,
      dailyLimit: 50,
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  }
}

/**
 * Get Recent Activity (last 10 activities)
 */
async function getRecentActivity(userId: string): Promise<RecentActivity[]> {
  try {
    const activities: RecentActivity[] = [];

    // Get recent clients (last 5)
    const recentClients = await ClientModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    for (const client of recentClients) {
      activities.push({
        id: `client-${client._id}`,
        type: 'client_created',
        title: 'Client Created',
        description: `Added ${client.name}`,
        timestamp: (client as any).createdAt || new Date(),
        icon: '🏢',
      });
    }

    // Get recent platform connections (last 5)
    const recentConnections = await PlatformConnectionModel.find({ userId })
      .populate('clientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    for (const connection of recentConnections) {
      const clientName = (connection as any).clientId?.name || 'Unknown';
      const platformName = platformNames[connection.platformId] || connection.platformId;

      activities.push({
        id: `platform-${connection._id}`,
        type: 'platform_connected',
        title: 'Platform Connected',
        description: `Connected ${platformName} for ${clientName}`,
        timestamp: connection.createdAt,
        icon: '🔗',
      });
    }

    // Get recent conversations (last 5)
    const recentConversations = await ConversationModel.find({
      userId,
      status: { $ne: 'deleted' },
    })
      .populate('clientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    for (const conversation of recentConversations) {
      const clientName = (conversation as any).clientId?.name || 'Unknown';
      const title = conversation.title || 'New Conversation';

      activities.push({
        id: `conversation-${conversation._id}`,
        type: 'conversation_started',
        title: 'Conversation Started',
        description: `${title} with ${clientName}`,
        timestamp: conversation.createdAt,
        icon: '💬',
      });
    }

    // Sort all activities by timestamp (most recent first) and take top 10
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  } catch (error) {
    // Return empty array on error (don't log - graceful degradation)
    return [];
  }
}
