/**
 * System Prompt Builder
 *
 * Builds system prompts for the AI based on:
 * - User's connected platforms
 * - Available platform data
 * - Client context
 */

import type { ClientClient } from '@/types/chat';

/**
 * Format duration in seconds to human readable string
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format YYYYMMDD date string to readable format
 */
function formatDateString(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${month}/${day}/${year}`;
}

/**
 * Build system prompt for the AI assistant
 *
 * @param client - Current client (optional)
 * @param platformData - User's platform data (optional)
 * @returns System prompt string
 */
export function buildSystemPrompt(
  client?: ClientClient | null,
  platformData?: any
): string {
  const basePrompt = `You are **OneAssist**, an AI-powered marketing analytics assistant built into the OneReport dashboard.

## Your Role
You help users understand their marketing data from Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads. You provide insights, answer questions, and guide users through their analytics data.

## Communication Style
- Be friendly, professional, and concise
- Use markdown formatting for better readability
- Use emojis sparingly (only for section headers or emphasis)
- Break down complex data into bullet points
- Provide actionable insights, not just raw numbers


## Capabilities`;

  // Add platform-specific information
  let platformInfo = '';

  if (client) {
    const connectedPlatforms = Object.keys(client.platforms).filter(
      (key) => client.platforms[key as keyof typeof client.platforms]?.connected
    );

    if (connectedPlatforms.length > 0) {
      platformInfo += `\n\n## Connected Platforms for ${client.name}`;
      platformInfo += `\nThe user has connected the following platforms:\n`;

      connectedPlatforms.forEach((platform) => {
        const platformNames: Record<string, string> = {
          googleAnalytics: '📊 Google Analytics - Website traffic and user behavior',
          googleAds: '🎯 Google Ads - Search and display advertising',
          metaAds: '📱 Meta Ads - Facebook and Instagram advertising',
          linkedInAds: '💼 LinkedIn Ads - B2B advertising',
        };

        platformInfo += `- ${platformNames[platform] || platform}\n`;
      });

      // Add data availability note
      if (platformData && Object.keys(platformData).length > 0) {
        // Check for multi-property GA data
        const gaMulti = platformData.googleAnalyticsMulti;
        if (gaMulti && gaMulti.properties) {
          const propertiesWithTraffic = gaMulti.properties.filter(
            (p: any) => p.metrics.sessions > 0 || p.metrics.users > 0 || p.metrics.pageviews > 0
          );

          if (propertiesWithTraffic.length > 0) {
            platformInfo += `\n## Available Data\nYou have access to ${gaMulti.properties.length} Google Analytics properties. ${propertiesWithTraffic.length} properties have traffic data. Use this data to answer questions.`;
          } else {
            platformInfo += `\n## Data Status\nGoogle Analytics is connected with ${gaMulti.properties.length} properties accessible. Currently, none show traffic in the last 30 days. The integration is working correctly - properties will show data once websites receive visitors.`;
          }
        } else {
          // Fallback to old single-property check
          const gaData = platformData.googleAnalytics;
          const hasTraffic = gaData && (gaData.metrics?.sessions > 0 || gaData.metrics?.users > 0 || gaData.metrics?.pageviews > 0);

          if (hasTraffic) {
            platformInfo += `\n## Available Data\nYou have access to recent data from these platforms. When answering questions, use this real data to provide accurate insights.`;
          } else if (gaData) {
            platformInfo += `\n## Data Status\nGoogle Analytics is connected and working, but the property "${gaData.propertyName || 'selected property'}" shows 0 traffic in the last 30 days. The integration is functional - there's just no visitor data yet. Let the user know their GA is set up correctly and will show data once their website receives traffic.`;
          }
        }
      } else {
        platformInfo += `\n## Data Status\nNote: Platform data is currently being synced. For now, let the user know you'll be able to provide insights once the data sync is complete. You can still explain what kind of insights you'll be able to provide.`;
      }
    } else {
      platformInfo += `\n\n## No Platforms Connected\nThe user hasn't connected any marketing platforms yet. Guide them to:\n1. Go to Settings → Platforms\n2. Connect their Google Analytics, Ads, Meta, or LinkedIn accounts\n3. Return here to start getting insights`;
    }
  } else {
    platformInfo += `\n\n## Getting Started\nTo provide insights, the user needs to:\n1. Select or create a client\n2. Connect marketing platforms (Settings → Platforms)\n3. Ask questions about their data`;
  }

  const limitations = `\n\n## Important Notes
- You can only access data from connected platforms
- Data is updated periodically (not real-time)
- For detailed reports, suggest using the Reports section of the dashboard
- If asked about unconnected platforms, guide the user to connect them first`;

  const examples = `\n\n## Example Questions You Can Answer
- "How many visitors did I get last week?"
- "What's my Google Ads spend this month?"
- "Show me my top performing campaigns"
- "Compare my Meta Ads performance to last month"
- "What's my conversion rate from Google Analytics?"`;

  // Add platform data context if available
  const dataContext = buildPlatformDataContext(platformData);

  return basePrompt + platformInfo + dataContext + limitations + examples;
}

/**
 * Build context from platform data for AI
 * Formats platform metrics into a readable context string
 *
 * @param platformData - Client's platform data
 * @returns Context string to add to system prompt
 */
export function buildPlatformDataContext(platformData: any): string {
  if (!platformData || Object.keys(platformData).length === 0) {
    return '';
  }

  let context = '\n\n## Current Platform Data\n';

  // Multi-property Google Analytics Data (Enhanced)
  if (platformData.googleAnalyticsMulti && platformData.googleAnalyticsMulti.properties) {
    const gaMulti = platformData.googleAnalyticsMulti;
    context += '\n### Google Analytics - All Properties\n';
    context += `Historical Data Range: ${gaMulti.dateRange || 'Last 30 days'}\n\n`;

    // Show summary of all properties
    gaMulti.properties.forEach((prop: any) => {
      const hasTraffic = prop.metrics.sessions > 0 || prop.metrics.users > 0 || prop.metrics.pageviews > 0;

      context += `**${prop.propertyName}** (ID: ${prop.propertyId})\n`;

      // Real-time active users (if available)
      if (prop.realtime) {
        context += `🟢 **LIVE NOW:** ${prop.realtime.activeUsers} active user${prop.realtime.activeUsers !== 1 ? 's' : ''} on site\n`;
        if (prop.realtime.byDevice && prop.realtime.byDevice.length > 0) {
          const deviceBreakdown = prop.realtime.byDevice.map((d: any) => `${d.device}: ${d.users}`).join(', ');
          context += `   Live by device: ${deviceBreakdown}\n`;
        }
      }

      if (hasTraffic) {
        // Core metrics
        context += `\n**Last 30 Days Summary:**\n`;
        context += `- Sessions: ${prop.metrics.sessions?.toLocaleString() || '0'}\n`;
        context += `- Users: ${prop.metrics.users?.toLocaleString() || '0'} (${prop.metrics.newUsers?.toLocaleString() || '0'} new)\n`;
        context += `- Pageviews: ${prop.metrics.pageviews?.toLocaleString() || '0'}\n`;
        context += `- Events: ${prop.metrics.eventCount?.toLocaleString() || '0'}\n`;

        // Engagement metrics
        context += `\n**Engagement:**\n`;
        context += `- Engagement Rate: ${prop.metrics.engagementRate ? (prop.metrics.engagementRate * 100).toFixed(1) + '%' : '0%'}\n`;
        context += `- Bounce Rate: ${prop.metrics.bounceRate ? (prop.metrics.bounceRate * 100).toFixed(1) + '%' : '0%'}\n`;
        context += `- Avg Session Duration: ${prop.metrics.avgSessionDuration ? formatDuration(prop.metrics.avgSessionDuration) : '0s'}\n`;
        context += `- Sessions per User: ${prop.metrics.sessionsPerUser?.toFixed(2) || '0'}\n`;

        // Traffic sources
        if (prop.dimensions?.topSources && prop.dimensions.topSources.length > 0) {
          context += `\n**Top Traffic Sources:**\n`;
          prop.dimensions.topSources.forEach((s: any) => {
            context += `- ${s.source}: ${s.sessions?.toLocaleString()} sessions, ${s.users?.toLocaleString()} users\n`;
          });
        }

        // Device breakdown
        if (prop.dimensions?.devices && prop.dimensions.devices.length > 0) {
          context += `\n**Device Breakdown:**\n`;
          prop.dimensions.devices.forEach((d: any) => {
            context += `- ${d.device}: ${d.percentage}% (${d.sessions?.toLocaleString()} sessions)\n`;
          });
        }

        // Top pages
        if (prop.dimensions?.topPages && prop.dimensions.topPages.length > 0) {
          context += `\n**Top Pages:**\n`;
          prop.dimensions.topPages.forEach((p: any) => {
            context += `- ${p.page}: ${p.views?.toLocaleString()} views\n`;
          });
        }

        // Geographic data
        if (prop.dimensions?.countries && prop.dimensions.countries.length > 0) {
          context += `\n**Top Countries:**\n`;
          prop.dimensions.countries.forEach((c: any) => {
            context += `- ${c.country}: ${c.users?.toLocaleString()} users\n`;
          });
        }

        // Enhanced Phase 2 Metrics: Campaigns (UTM tracking)
        if (prop.topCampaigns && prop.topCampaigns.length > 0) {
          context += `\n**Top Campaigns (UTM Tracking):**\n`;
          prop.topCampaigns.forEach((c: any) => {
            context += `- Source: ${c.source} | Medium: ${c.medium} | Campaign: ${c.campaign}\n`;
            context += `  ${c.sessions?.toLocaleString()} sessions, ${c.users?.toLocaleString()} users\n`;
          });
        }

        // Enhanced Phase 2 Metrics: Events
        if (prop.topEvents && prop.topEvents.length > 0) {
          context += `\n**Top Events Tracked:**\n`;
          prop.topEvents.forEach((e: any) => {
            context += `- ${e.eventName}: ${e.eventCount?.toLocaleString()} times\n`;
          });
        }

        // Enhanced Phase 2 Metrics: Landing Pages
        if (prop.topLandingPages && prop.topLandingPages.length > 0) {
          context += `\n**Best Performing Landing Pages:**\n`;
          prop.topLandingPages.forEach((p: any) => {
            const bounceRateStr = p.bounceRate ? (p.bounceRate * 100).toFixed(1) + '%' : 'N/A';
            context += `- ${p.page}: ${p.sessions?.toLocaleString()} sessions (Bounce Rate: ${bounceRateStr})\n`;
          });
        }

        // Enhanced Phase 2 Metrics: Cities
        if (prop.topCities && prop.topCities.length > 0) {
          context += `\n**Top Cities:**\n`;
          prop.topCities.forEach((c: any) => {
            context += `- ${c.city}, ${c.country}: ${c.sessions?.toLocaleString()} sessions\n`;
          });
        }

        // Enhanced Phase 2 Metrics: Regions
        if (prop.topRegions && prop.topRegions.length > 0) {
          context += `\n**Top Regions/States:**\n`;
          prop.topRegions.forEach((r: any) => {
            context += `- ${r.region}, ${r.country}: ${r.sessions?.toLocaleString()} sessions\n`;
          });
        }

        // Daily trends (last 7 days)
        if (prop.dimensions?.daily && prop.dimensions.daily.length > 0) {
          context += `\n**Last 7 Days Trend:**\n`;
          prop.dimensions.daily.forEach((d: any) => {
            const dateStr = formatDateString(d.date);
            context += `- ${dateStr}: ${d.sessions} sessions, ${d.users} users, ${d.pageviews} pageviews\n`;
          });
        }
      } else {
        context += `- Status: No traffic in the last 30 days\n`;
        if (prop.realtime?.activeUsers === 0) {
          context += `- No active users right now either\n`;
        }
      }
      context += '\n---\n\n';
    });
  }
  // Fallback to single-property format
  else if (platformData.googleAnalytics) {
    const ga = platformData.googleAnalytics;
    context += '\n### Google Analytics\n';
    context += `Property: ${ga.propertyName || 'Unknown'}\n`;
    context += `Date Range: ${ga.dateRange || 'Last 30 days'}\n\n`;

    if (ga.metrics) {
      const hasTraffic = ga.metrics.sessions > 0 || ga.metrics.users > 0 || ga.metrics.pageviews > 0;

      if (hasTraffic) {
        context += `- Sessions: ${ga.metrics.sessions?.toLocaleString() || '0'}\n`;
        context += `- Users: ${ga.metrics.users?.toLocaleString() || '0'}\n`;
        context += `- Pageviews: ${ga.metrics.pageviews?.toLocaleString() || '0'}\n`;
        context += `- Bounce Rate: ${ga.metrics.bounceRate ? (ga.metrics.bounceRate * 100).toFixed(1) + '%' : '0%'}\n`;
        context += `- Avg Session Duration: ${ga.metrics.avgSessionDuration ? Math.round(ga.metrics.avgSessionDuration) + 's' : '0s'}\n`;
      } else {
        context += `**Note:** This property has 0 sessions, users, and pageviews in the selected date range.\n`;
        context += `The Google Analytics integration is working correctly, but the website has not received any tracked traffic yet.\n`;
      }
    }
    if (ga.dimensions?.topSources && ga.dimensions.topSources.length > 0) {
      context += '\nTop Traffic Sources:\n';
      ga.dimensions.topSources.slice(0, 3).forEach((source: any) => {
        context += `- ${source.source}: ${source.sessions.toLocaleString()} sessions\n`;
      });
    }
  }

  // Google Ads Data
  if (platformData.googleAds) {
    const gAds = platformData.googleAds;
    context += '\n### Google Ads Performance\n';
    context += `Date Range: ${gAds.dateRange || 'Last 30 days'}\n`;

    // Handle developer token status
    if (gAds.developerTokenStatus === 'missing') {
      context += 'Status: Developer token not configured - limited data available\n';
    } else if (gAds.developerTokenStatus === 'pending') {
      context += 'Status: Developer token pending approval - limited data available\n';
    } else if (gAds.metrics) {
      context += '\n**Account Summary:**\n';
      context += `- Total Impressions: ${gAds.metrics.impressions.toLocaleString()}\n`;
      context += `- Total Clicks: ${gAds.metrics.clicks.toLocaleString()}\n`;
      context += `- Total Spend: $${gAds.metrics.cost.toLocaleString()}\n`;
      context += `- CTR: ${gAds.metrics.ctr.toFixed(2)}%\n`;
      context += `- Avg CPC: $${gAds.metrics.avgCpc.toFixed(2)}\n`;
      if (gAds.metrics.conversions > 0) {
        context += `- Conversions: ${gAds.metrics.conversions.toLocaleString()}\n`;
      }

      // Campaigns
      if (gAds.campaigns && gAds.campaigns.length > 0) {
        context += '\n**Top Campaigns:**\n';
        gAds.campaigns.slice(0, 5).forEach((campaign: any) => {
          context += `- ${campaign.name} (${campaign.status}): ${campaign.impressions.toLocaleString()} impressions, ${campaign.clicks.toLocaleString()} clicks, $${campaign.cost.toFixed(2)} spend\n`;
        });
      }
    }
  }

  // Meta Ads Data
  if (platformData.metaAds) {
    const meta = platformData.metaAds;
    context += '\n### Meta Ads Performance (Facebook/Instagram)\n';
    context += `Date Range: ${meta.dateRange || 'Last 30 days'}\n`;

    if (meta.metrics) {
      context += '\n**Account Summary:**\n';
      context += `- Total Impressions: ${meta.metrics.impressions.toLocaleString()}\n`;
      context += `- Total Reach: ${meta.metrics.reach.toLocaleString()}\n`;
      context += `- Total Clicks: ${meta.metrics.clicks.toLocaleString()}\n`;
      context += `- Total Spend: $${meta.metrics.spend.toLocaleString()}\n`;
      context += `- CTR: ${meta.metrics.ctr.toFixed(2)}%\n`;
      context += `- CPC: $${meta.metrics.cpc.toFixed(2)}\n`;
      context += `- CPM: $${meta.metrics.cpm.toFixed(2)}\n`;
      if (meta.metrics.frequency > 0) {
        context += `- Frequency: ${meta.metrics.frequency.toFixed(2)}\n`;
      }

      // Campaigns
      if (meta.campaigns && meta.campaigns.length > 0) {
        context += '\n**Top Campaigns:**\n';
        meta.campaigns.slice(0, 5).forEach((campaign: any) => {
          context += `- ${campaign.name} (${campaign.status}, ${campaign.objective}): ${campaign.impressions.toLocaleString()} impressions, ${campaign.clicks.toLocaleString()} clicks, $${campaign.spend.toFixed(2)} spend\n`;
        });
      }
    }
  }

  // LinkedIn Ads Data
  if (platformData.linkedInAds) {
    const linkedIn = platformData.linkedInAds;
    context += '\n### LinkedIn Ads Performance\n';
    context += `Date Range: ${linkedIn.dateRange || 'Last 30 days'}\n`;

    if (linkedIn.metrics) {
      context += '\n**Account Summary:**\n';
      context += `- Total Impressions: ${linkedIn.metrics.impressions.toLocaleString()}\n`;
      context += `- Total Clicks: ${linkedIn.metrics.clicks.toLocaleString()}\n`;
      context += `- Total Spend: $${linkedIn.metrics.spend.toLocaleString()}\n`;
      context += `- CTR: ${linkedIn.metrics.ctr.toFixed(2)}%\n`;
      context += `- CPC: $${linkedIn.metrics.cpc.toFixed(2)}\n`;
      if (linkedIn.metrics.conversions > 0) {
        context += `- Conversions: ${linkedIn.metrics.conversions.toLocaleString()}\n`;
      }
      if (linkedIn.metrics.likes > 0 || linkedIn.metrics.comments > 0 || linkedIn.metrics.shares > 0) {
        context += `- Engagement: ${linkedIn.metrics.likes} likes, ${linkedIn.metrics.comments} comments, ${linkedIn.metrics.shares} shares\n`;
      }

      // Campaigns
      if (linkedIn.campaigns && linkedIn.campaigns.length > 0) {
        context += '\n**Top Campaigns:**\n';
        linkedIn.campaigns.slice(0, 5).forEach((campaign: any) => {
          context += `- ${campaign.name} (${campaign.status}): ${campaign.impressions.toLocaleString()} impressions, ${campaign.clicks.toLocaleString()} clicks, $${campaign.spend.toFixed(2)} spend\n`;
        });
      }
    }
  }

  context += '\n\nUse this data to answer user questions accurately. Cite specific numbers when relevant.';

  return context;
}
