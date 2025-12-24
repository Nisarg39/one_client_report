/**
 * System Prompt Builder - Data Mentor Edition
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
 * @param accountType - User's account type (business, education, or instructor)
 * @returns System prompt string
 */
export function buildSystemPrompt(
  client?: ClientClient | null,
  platformData?: any,
  accountType?: 'business' | 'education' | 'instructor',
  selectedPropertyId?: string | null,
  selectedMetaCampaignId?: string | null,
  selectedGoogleAdsCampaignId?: string | null,
  selectedLinkedInCampaignGroupId?: string | null,
  selectedLinkedInCampaignId?: string | null
): string {
  // Detect if using mock data
  const isMockData = platformData?._source === 'mock';
  const scenarioName = platformData?.scenarioName;

  // Choose persona based on account type
  if (accountType === 'education' || accountType === 'instructor') {
    return buildEducationPrompt(
      client,
      platformData,
      isMockData,
      scenarioName,
      selectedPropertyId,
      selectedMetaCampaignId,
      selectedGoogleAdsCampaignId,
      selectedLinkedInCampaignGroupId,
      selectedLinkedInCampaignId
    );
  } else {
    return buildBusinessPrompt(
      client,
      platformData,
      selectedPropertyId,
      selectedMetaCampaignId,
      selectedGoogleAdsCampaignId,
      selectedLinkedInCampaignGroupId,
      selectedLinkedInCampaignId
    );
  }
}

/**
 * Build education mode prompt (Data Mentor persona)
 */
function buildEducationPrompt(
  client?: ClientClient | null,
  platformData?: any,
  isMockData?: boolean,
  scenarioName?: string,
  selectedPropertyId?: string | null,
  selectedMetaCampaignId?: string | null,
  selectedGoogleAdsCampaignId?: string | null,
  selectedLinkedInCampaignGroupId?: string | null,
  selectedLinkedInCampaignId?: string | null
): string {
  const basePrompt = `You are **OneAssist**, an expert **Data Mentor** built into the OneReport educational platform.

## Your Core Philosophy
**"Give a man a fish, and you feed him for a day. Teach a man to fish, and you feed him for a lifetime."**

Your goal is NOT to give answers. Your goal is to **teach the user how to find the answers themselves**. You are training the next generation of elite marketing analysts.

## Your Educational Methodology (Socratic Method)
When a user asks a question, NEVER just dump data or give a direct recommendation. Instead:
1.  **Acknowledge & Validate**: Confirm you understand what they are looking for.
2.  **Guide, Don't Tell**: Point them to the specific metrics or data points they should look at.
3.  **Ask Probing Questions**: Ask "Why?" or "What if?" to trigger critical thinking.
4.  **Reveal Patterns**: Help them see the relationship between different metrics (e.g., "Notice how CPM went up but CTR went down? What does that imply about ad fatigue?").

## Your Personality
- **Encouraging but Rigorous**: Like a favorite professor who pushes you to be better.
- **Curious**: You are always fascinated by the data and want the user to be too.
- **Patient**: You understand that data analysis is a skill that takes time to master.
- **Structured**: You break down complex problems into manageable analytical steps.

## Interaction Style
- **Bad Response**: "Your CPA on Facebook is $15, which is good. Increase budget." (Too direct, no learning)
- **Good Response**: "Let's look at your Facebook CPA. It's currently sitting at $15. How does that compare to your target? And more importantly, look at the trend over the last 7 days—do you see the efficiency improving or declining?"

## Output Format
1.  **The Setup**: Set the stage for the analysis.
2.  **The Clues**: Present the relevant data points as "evidence" for the user to examine.
3.  **The Challenge**: Ask a specific question that requires the user to interpret the evidence.
4.  **The Lesson**: (Optional) Briefly explain a concept if the user seems stuck (e.g., "Remember, high frequency often leads to lower CTR...").

## Capabilities`;

  // Add platform-specific information
  let platformInfo = '';

  if (client) {
    const connectedPlatforms = Object.keys(client.platforms).filter(
      (key) => client.platforms[key as keyof typeof client.platforms]?.connected
    );

    if (connectedPlatforms.length > 0) {
      platformInfo += `\n\n## Connected Learning Scenarios for ${client.name}`;
      platformInfo += `\nThe user is analyzing data from:\n`;

      connectedPlatforms.forEach((platform) => {
        const platformNames: Record<string, string> = {
          googleAnalytics: '📊 Google Analytics - Traffic Analysis Module',
          googleAds: '🎯 Google Ads - SEM Optimization Module',
          metaAds: '📱 Meta Ads - Social Creative Analysis Module',
          linkedInAds: '💼 LinkedIn Ads - B2B Strategy Module',
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
            platformInfo += `\n## Available Case Data\nYou have access to ${gaMulti.properties.length} Google Analytics properties. ${propertiesWithTraffic.length} properties have active data for analysis exercises.`;
          } else {
            platformInfo += `\n## Data Status\nGoogle Analytics is connected, but currently showing no traffic. This might be a "Cold Start" scenario or a tracking issue. Ask the user to investigate why.`;
          }
        } else {
          // Fallback to old single-property check
          const gaData = platformData.googleAnalytics;
          const hasTraffic = gaData && (gaData.metrics?.sessions > 0 || gaData.metrics?.users > 0 || gaData.metrics?.pageviews > 0);

          if (hasTraffic) {
            platformInfo += `\n## Available Case Data\nYou have access to live data. Use this as the "Case Study" for your teaching.`;
          } else if (gaData) {
            platformInfo += `\n## Data Status\nGoogle Analytics is connected but shows 0 traffic. Use this as a troubleshooting exercise for the user.`;
          }
        }
      } else {
        platformInfo += `\n## Data Status\nNote: Data is syncing. Tell the user: "I'm gathering the case files now. We can start the analysis in a moment."`;
      }
    } else {
      platformInfo += `\n\n## No Data Sources Connected\nThe user hasn't connected any platforms. Guide them to:\n1. Go to Settings → Platforms\n2. Connect a data source to begin their training.`;
    }
  } else {
    platformInfo += `\n\n## Getting Started\nTo begin the session, the user needs to:\n1. Select a client workspace\n2. Connect data sources\n3. Ask to start a lesson`;
  }

  const limitations = `\n\n## Important Notes
- You can only analyze data that is present.
- If data is missing, treat it as part of the lesson (e.g., "We're missing conversion data. Why is that a problem for calculating ROAS?").`;

  const examples = `\n\n## Example Student Questions
- "How are my ads doing?" (Reply: "Let's break that down. Which platform are you most concerned about, and what metric defines 'success' for you?")
- "Why is traffic down?" (Reply: "Good question. Look at the 'Top Sources' section. Do you see a drop in a specific channel, or is it an overall decline?")
- "What should I do next?" (Reply: "Based on the high CPC we see in Google Ads, what are three ways you could lower costs without killing volume?")`;

  // Add mock data context if applicable
  let mockDataContext = '';
  if (isMockData && scenarioName) {
    mockDataContext = `\n\n## Educational Case Study Context
You are working with the **${scenarioName}** scenario. This is simulated data designed for learning purposes. Guide students through analyzing this case study as if it were a real client.`;
  }

  // Add platform data context if available
  const dataContext = buildPlatformDataContext(
    platformData,
    selectedPropertyId,
    selectedMetaCampaignId,
    selectedGoogleAdsCampaignId,
    selectedLinkedInCampaignGroupId,
    selectedLinkedInCampaignId
  );

  return basePrompt + platformInfo + dataContext + mockDataContext + limitations + examples;
}

/**
 * Build business mode prompt (Growth Strategist persona)
 */
function buildBusinessPrompt(
  client?: ClientClient | null,
  platformData?: any,
  selectedPropertyId?: string | null,
  selectedMetaCampaignId?: string | null,
  selectedGoogleAdsCampaignId?: string | null,
  selectedLinkedInCampaignGroupId?: string | null,
  selectedLinkedInCampaignId?: string | null
): string {
  const basePrompt = `You are **OneAssist**, an expert **Growth Strategist** built into the OneReport dashboard.

## Multi-Agent Architecture
OneAssist uses specialized AI agents to provide focused expertise:
- 🚦 **Traffic Intelligence Agent**: Website traffic, user behavior, engagement analysis
- 💰 **Ad Performance Agent**: Cross-platform ad optimization, ROAS, CPA analysis
- 📊 **Budget Optimization Agent**: Spend efficiency, budget allocation, ROI maximization
- 🎯 **Conversion Funnel Agent**: User journey optimization, conversion bottlenecks
- ⚠️ **Anomaly Detection Agent**: Real-time monitoring, alerts, issue detection

Your queries are automatically routed to the most relevant agent based on keywords. Each agent has deep domain expertise and provides specialized insights.

## Your Mission
Your goal is NOT just to report numbers. Your goal is to **find money the user is leaving on the table**.
You analyze marketing data to detect inefficiencies, spot high-value patterns, and generate step-by-step execution plans to improve ROAS and drive growth.

## Your Personality
- **Proactive**: Don't wait for the user to ask the right question. Tell them what they *should* be asking.
- **Strategic**: Focus on the "Why" and "What Next", not just the "What".
- **Direct**: Be professional but cut to the chase. Use bullet points.
- **No Fluff**: **Never give generic advice** (e.g., "improve SEO"). Always tie it to a specific metric or data point. If data is missing, demand it.

## Output Format
When providing insights, follow this structure:
1.  **The Insight**: A clear statement of the opportunity or problem (e.g., "Meta Ads are generating leads 30% cheaper than Google Ads").
2.  **The Evidence**: The specific data points that back this up.
3.  **The Execution Plan**: A numbered list of 2-3 concrete steps the user should take immediately. Tag each step with **[Quick Win]** or **[High Impact]** to help prioritization.

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
            platformInfo += `\n## Available Data\nYou have access to ${gaMulti.properties.length} Google Analytics properties. ${propertiesWithTraffic.length} properties have traffic data. Use this data to audit performance.`;
          } else {
            platformInfo += `\n## Data Status\nGoogle Analytics is connected with ${gaMulti.properties.length} properties accessible. Currently, none show traffic in the last 30 days. The integration is working correctly.`;
          }
        } else {
          // Fallback to old single-property check
          const gaData = platformData.googleAnalytics;
          const hasTraffic = gaData && (gaData.metrics?.sessions > 0 || gaData.metrics?.users > 0 || gaData.metrics?.pageviews > 0);

          if (hasTraffic) {
            platformInfo += `\n## Available Data\nYou have access to recent data from these platforms. Use this real data to provide strategic insights.`;
          } else if (gaData) {
            platformInfo += `\n## Data Status\nGoogle Analytics is connected but the property "${gaData.propertyName || 'selected property'}" shows 0 traffic.`;
          }
        }
      } else {
        platformInfo += `\n## Data Status\nNote: Platform data is currently being synced. Inform the user you will provide a full audit once the sync is complete.`;
      }
    } else {
      platformInfo += `\n\n## No Platforms Connected\nThe user hasn't connected any marketing platforms yet. Guide them to:\n1. Go to Settings → Platforms\n2. Connect their Google Analytics, Ads, Meta, or LinkedIn accounts\n3. Return here for a growth audit`;
    }
  } else {
    platformInfo += `\n\n## Getting Started\nTo provide a growth strategy, the user needs to:\n1. Select or create a client\n2. Connect marketing platforms (Settings → Platforms)\n3. Ask for an audit`;
  }

  const limitations = `\n\n## Important Notes
- You can only access data from connected platforms
- Data is updated periodically (not real-time)
- If asked about unconnected platforms, explain that connecting them allows for cross-channel strategy`;

  const examples = `\n\n## Example Questions You Can Answer
- "Audit my cross-channel CPA"
- "Find wasted ad spend"
- "Generate a 30-day growth plan"
- "Why did my conversion rate drop?"
- "Where should I reallocate my budget?"`;

  // Add platform data context if available
  const dataContext = buildPlatformDataContext(
    platformData,
    selectedPropertyId,
    selectedMetaCampaignId,
    selectedGoogleAdsCampaignId,
    selectedLinkedInCampaignGroupId,
    selectedLinkedInCampaignId
  );

  return basePrompt + platformInfo + dataContext + limitations + examples;
}

/**
 * Build context from platform data for AI
 * Formats platform metrics into a readable context string
 *
 * @param platformData - Client's platform data
 * @param selectedPropertyId - Currently selected GA property ID
 * @param selectedMetaCampaignId - Currently selected Meta campaign ID
 * @returns Context string to add to system prompt
 */
export function buildPlatformDataContext(
  platformData: any,
  selectedPropertyId?: string | null,
  selectedMetaCampaignId?: string | null,
  selectedGoogleAdsCampaignId?: string | null,
  selectedLinkedInCampaignGroupId?: string | null,
  selectedLinkedInCampaignId?: string | null
): string {
  if (!platformData || Object.keys(platformData).length === 0) {
    return '';
  }

  let context = '\n\n## Current Case Study Data\n';

  // Multi-property Google Analytics Data (Enhanced)
  if (platformData.googleAnalyticsMulti && platformData.googleAnalyticsMulti.properties) {
    const gaMulti = platformData.googleAnalyticsMulti;
    context += '\n### Google Analytics - All Properties\n';
    context += `Historical Data Range: ${gaMulti.dateRange || 'Last 30 days'}\n`;

    const activePropertyId = selectedPropertyId || gaMulti.selectedPropertyId;

    if (activePropertyId) {
      if (activePropertyId === 'all') {
        context += `⚠️ **USER FOCUS:** The user has selected **"All Properties"** (Cumulative View). Provide a high-level cross-property analysis and identify which properties are driving the most value.\n`;
      } else {
        const selectedProp = gaMulti.properties.find((p: any) => p.propertyId === activePropertyId);
        if (selectedProp) {
          context += `⚠️ **USER FOCUS:** The user has specifically selected the property **"${selectedProp.propertyName}"** in their dashboard. Prioritize analysis for this property.\n`;
        }
      }
    }
    context += '\n';

    // Show summary of all properties
    gaMulti.properties.forEach((prop: any) => {
      const hasTraffic = prop.metrics.sessions > 0 || prop.metrics.users > 0 || prop.metrics.pageviews > 0;

      const isCumulative = prop.propertyId === 'all';
      context += `**${prop.propertyName}**${isCumulative ? ' [CUMULATIVE]' : ''} (ID: ${prop.propertyId})\n`;

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

        // Integrated Google Ads metrics from GA4
        if (prop.metrics.adsSpend && prop.metrics.adsSpend > 0) {
          context += `  - **Linked Google Ads Data:** $${Number(prop.metrics.adsSpend).toLocaleString()} spend, ${Number(prop.metrics.adsImpressions).toLocaleString()} impressions, ${Number(prop.metrics.adsClicks).toLocaleString()} clicks\n`;
        }

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

        // Ecommerce Data (Enhanced)
        if (prop.ecommerce && (prop.ecommerce.totalRevenue > 0 || prop.ecommerce.transactions > 0)) {
          context += `\n**Ecommerce Performance:**\n`;
          context += `- Total Revenue: $${prop.ecommerce.totalRevenue?.toLocaleString()}\n`;
          context += `- Purchase Revenue: $${prop.ecommerce.purchaseRevenue?.toLocaleString()}\n`;
          context += `- Transactions: ${prop.ecommerce.transactions?.toLocaleString()}\n`;
          context += `- Conversion Rate: ${prop.ecommerce.conversionRate ? (prop.ecommerce.conversionRate * 100).toFixed(2) + '%' : '0%'}\n`;
          context += `- Cart Activity: ${prop.ecommerce.add_to_carts?.toLocaleString()} adds, ${prop.ecommerce.checkouts?.toLocaleString()} checkouts\n`;

          if (prop.ecommerce.items && prop.ecommerce.items.length > 0) {
            context += `\n**Top Products Sold:**\n`;
            prop.ecommerce.items.slice(0, 5).forEach((item: any) => {
              context += `- ${item.name} (${item.category}): ${item.quantity} sold, $${item.revenue?.toLocaleString()} revenue\n`;
            });
          }
        }

        // Conversion Detailed Data
        if (prop.conversions && prop.conversions.totalConversions > 0) {
          context += `\n**Conversion Insights:**\n`;
          context += `- Total Conversions: ${prop.conversions.totalConversions?.toLocaleString()}\n`;
          context += `- Session Conv. Rate: ${prop.conversions.sessionConversionRate ? (prop.conversions.sessionConversionRate * 100).toFixed(2) + '%' : '0%'}\n`;
          context += `- User Conv. Rate: ${prop.conversions.userConversionRate ? (prop.conversions.userConversionRate * 100).toFixed(2) + '%' : '0%'}\n`;
        }

        // Advanced Technology Breakdown
        if (prop.techBreakdown) {
          context += `\n**Technology Breakdown:**\n`;
          if (prop.techBreakdown.operatingSystem?.length > 0) {
            context += `- Top OS: ${prop.techBreakdown.operatingSystem.slice(0, 3).map((os: any) => `${os.name} (${os.sessions})`).join(', ')}\n`;
          }
          if (prop.techBreakdown.language?.length > 0) {
            context += `- Top Languages: ${prop.techBreakdown.language.slice(0, 3).map((l: any) => `${l.name} (${l.sessions})`).join(', ')}\n`;
          }
        }

        // Retention & LTV
        if (prop.retention && prop.retention.userLtvTotalRevenue > 0) {
          context += `\n**Retention & Lifetime Value (LTV):**\n`;
          context += `- Total LTV Revenue: $${prop.retention.userLtvTotalRevenue?.toLocaleString()}\n`;
          if (prop.retention.userLtvAverageRevenue) {
            context += `- Avg LTV per User: $${prop.retention.userLtvAverageRevenue?.toLocaleString()}\n`;
          }
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

        // Integrated Google Ads metrics from GA4
        if (ga.metrics.adsSpend && ga.metrics.adsSpend > 0) {
          context += `\n**Google Ads Performance (Integrated in GA4):**\n`;
          context += `- Ad Spend: $${Number(ga.metrics.adsSpend).toLocaleString()}\n`;
          context += `- Ad Impressions: ${Number(ga.metrics.adsImpressions).toLocaleString()}\n`;
          context += `- Ad Clicks: ${Number(ga.metrics.adsClicks).toLocaleString()}\n`;
        }
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

    if (gAds.metrics && !gAds.apiError) {
      if (selectedGoogleAdsCampaignId) {
        const selectedCampaign = gAds.campaigns?.find((c: any) => c.id === selectedGoogleAdsCampaignId);
        if (selectedCampaign) {
          context += `⚠️ **USER FOCUS:** The user has specifically selected the campaign **"${selectedCampaign.name}"** in their dashboard. Prioritize analysis and reporting for this individual campaign.\n`;
        }
      }
    }
    if (gAds.developerTokenStatus === 'missing') {
      context += 'Status: Developer token not configured - limited data available\n';
    } else if (gAds.developerTokenStatus === 'pending') {
      context += 'Status: Developer token pending approval - limited data available\n';
    }

    // Handle specific API errors
    if (gAds.apiError) {
      context += `⚠️ **API ERROR:** The Google Ads API returned an error: "${gAds.apiError}". Inform the user about this specific error as the reason why no metrics are available. Do not report $0 metrics if this error is present.\n`;
    }

    if (gAds.metrics && !gAds.apiError) {
      const currency = gAds.metrics.currency || 'USD';
      // Determine symbol - expand map as needed
      const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      context += '\n**Account Summary:**\n';
      context += `- Total Impressions: ${gAds.metrics.impressions.toLocaleString()}\n`;
      context += `- Total Clicks: ${gAds.metrics.clicks.toLocaleString()}\n`;
      context += `- Total Spend: ${symbol}${gAds.metrics.spend.toLocaleString()} ${currency}\n`;
      context += `- CTR: ${Number(gAds.metrics.ctr).toFixed(2)}%\n`;
      context += `- Avg CPC: ${symbol}${Number(gAds.metrics.cpc).toFixed(2)}\n`;
      context += `- Interactions: ${gAds.metrics.interactions?.toLocaleString()}\n`;
      context += `- Interaction Rate: ${Number(gAds.metrics.interactionRate).toFixed(2)}%\n`;

      if (gAds.metrics.conversions > 0) {
        context += `- Conversions: ${gAds.metrics.conversions.toLocaleString()}\n`;
        context += `- Conv. Value: ${symbol}${gAds.metrics.conversionsValue.toLocaleString()}\n`;
        context += `- Conv. Rate: ${Number(gAds.metrics.conversionRate).toFixed(2)}%\n`;
        context += `- Cost per Conv: ${symbol}${Number(gAds.metrics.costPerConversion).toFixed(2)}\n`;
      }

      if (gAds.metrics.searchImpressionShare > 0) {
        context += `\n**Competitive Data:**\n`;
        context += `- Search Impr. Share: ${Number(gAds.metrics.searchImpressionShare).toFixed(2)}%\n`;
        context += `- Abs. Top IS: ${Number(gAds.metrics.searchAbsTopImpressionShare).toFixed(2)}%\n`;
        context += `- Lost IS (Budget): ${Number(gAds.metrics.searchBudgetLostImpressionShare).toFixed(2)}%\n`;
        context += `- Lost IS (Rank): ${Number(gAds.metrics.searchRankLostImpressionShare).toFixed(2)}%\n`;
      }

      // Campaigns
      if (gAds.campaigns && gAds.campaigns.length > 0) {
        context += '\n**Top Campaigns:**\n';
        gAds.campaigns.slice(0, 5).forEach((campaign: any) => {
          context += `- ${campaign.name} (${campaign.status}, ${campaign.type}): ${Number(campaign.impressions).toLocaleString()} impressions, ${Number(campaign.clicks).toLocaleString()} clicks, ${symbol}${Number(campaign.spend).toFixed(2)} spend\n`;
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
      if (selectedMetaCampaignId) {
        const selectedCampaign = meta.campaigns?.find((c: any) => c.id === selectedMetaCampaignId);
        if (selectedCampaign) {
          context += `⚠️ **USER FOCUS:** The user has specifically selected the campaign **"${selectedCampaign.name}"** in their dashboard. Prioritize analysis and reporting for this individual campaign.\n`;
        }
      }

      const currency = meta.metrics.currency || 'USD';
      // Determine symbol
      const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      const activeMetaCamp = selectedMetaCampaignId ? meta.campaigns?.find((c: any) => String(c.id) === String(selectedMetaCampaignId)) : null;

      context += `\n**${activeMetaCamp ? `Campaign Summary (${activeMetaCamp.name})` : 'Account Summary'}:**\n`;
      context += `- Total Impressions: ${meta.metrics.impressions.toLocaleString()}\n`;
      context += `- Total Reach: ${meta.metrics.reach.toLocaleString()}\n`;
      context += `- Total Clicks: ${meta.metrics.clicks.toLocaleString()}\n`;
      context += `- Total Spend: ${symbol}${meta.metrics.spend.toLocaleString()} ${currency}\n`;
      context += `- CTR: ${Number(meta.metrics.ctr).toFixed(2)}%\n`;
      context += `- CPC: ${symbol}${Number(meta.metrics.cpc).toFixed(2)}\n`;
      context += `- CPM: ${symbol}${Number(meta.metrics.cpm).toFixed(2)}\n`;
      if (meta.metrics.frequency > 0) {
        context += `- Frequency: ${Number(meta.metrics.frequency).toFixed(2)}\n`;
      }

      // Campaigns
      if (meta.campaigns && meta.campaigns.length > 0) {
        context += '\n**Top Campaigns:**\n';
        meta.campaigns.slice(0, 5).forEach((campaign: any) => {
          context += `- ${campaign.name} (${campaign.status}, ${campaign.objective}): ${Number(campaign.metrics.impressions).toLocaleString()} impressions, ${Number(campaign.metrics.clicks).toLocaleString()} clicks, ${symbol}${Number(campaign.metrics.spend).toFixed(2)} spend\n`;
        });
      }

      // Enhanced Conversions
      if (meta.metrics.registrations > 0 || meta.metrics.add_to_carts > 0 || meta.metrics.checkouts > 0 || meta.metrics.content_views > 0) {
        context += '\n**Conversion Funnel:**\n';
        if (meta.metrics.content_views > 0) {
          context += `- Content Views: ${meta.metrics.content_views.toLocaleString()}\n`;
        }
        if (meta.metrics.add_to_carts > 0) {
          context += `- Add to Carts: ${meta.metrics.add_to_carts.toLocaleString()} (Cost: ${symbol}${Number(meta.metrics.cost_per_add_to_cart).toFixed(2)})\n`;
        }
        if (meta.metrics.checkouts > 0) {
          context += `- Initiated Checkouts: ${meta.metrics.checkouts.toLocaleString()}\n`;
        }
        if (meta.metrics.registrations > 0) {
          context += `- Registrations: ${meta.metrics.registrations.toLocaleString()} (Cost: ${symbol}${Number(meta.metrics.cost_per_registration).toFixed(2)})\n`;
        }
        if (meta.metrics.purchases > 0) {
          context += `- Purchases: ${meta.metrics.purchases.toLocaleString()} (Cost: ${symbol}${Number(meta.metrics.cost_per_purchase).toFixed(2)})\n`;
        }
      }
    }

    // Demographics breakdown
    if (meta.demographics && meta.demographics.length > 0) {
      context += '\n**Audience Demographics:**\n';
      const topDemographics = meta.demographics
        .sort((a: any, b: any) => b.spend - a.spend)
        .slice(0, 5);

      const currency = meta.metrics.currency || 'USD';
      const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      topDemographics.forEach((demo: any) => {
        const ctr = demo.impressions > 0 ? ((demo.clicks / demo.impressions) * 100).toFixed(2) : '0.00';
        context += `- Age ${demo.age}, ${demo.gender}: ${demo.impressions.toLocaleString()} impressions, ${demo.clicks.toLocaleString()} clicks, ${symbol}${demo.spend.toFixed(2)} spend, ${ctr}% CTR\n`;
      });
    }

    // Geographic breakdown
    if (meta.geography && meta.geography.length > 0) {
      context += '\n**Top Geographic Markets:**\n';
      const topGeos = meta.geography
        .sort((a: any, b: any) => b.spend - a.spend)
        .slice(0, 5);

      const currency = meta.metrics.currency || 'USD';
      const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      topGeos.forEach((geo: any) => {
        context += `- ${geo.country}${geo.region && geo.region !== 'Unknown' ? ` (${geo.region})` : ''}: ${geo.impressions.toLocaleString()} impressions, ${symbol}${geo.spend.toFixed(2)} spend\n`;
      });
    }

    // Device breakdown
    if (meta.devices && meta.devices.length > 0) {
      context += '\n**Device Performance:**\n';
      const currency = meta.metrics.currency || 'USD';
      const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      meta.devices.forEach((device: any) => {
        context += `- ${device.device_platform}: ${device.impressions.toLocaleString()} impressions, ${device.clicks.toLocaleString()} clicks, ${symbol}${device.spend.toFixed(2)} spend\n`;
      });
    }

    // Publisher platform breakdown
    if (meta.publisher_platforms && meta.publisher_platforms.length > 0) {
      context += '\n**Publisher Platform Performance:**\n';
      const currency = meta.metrics.currency || 'USD';
      const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      meta.publisher_platforms.forEach((platform: any) => {
        context += `- ${platform.publisher_platform}: ${platform.impressions.toLocaleString()} impressions, ${symbol}${platform.spend.toFixed(2)} spend\n`;
      });
    }
  }

  // LinkedIn Ads Data
  if (platformData.linkedInAds) {
    const linkedIn = platformData.linkedInAds;
    context += '\n### LinkedIn Ads Performance\n';
    context += `Date Range: ${linkedIn.dateRange || 'Last 30 days'}\n`;

    if (linkedIn.metrics) {
      if (selectedLinkedInCampaignId) {
        const selectedCampaign = linkedIn.campaigns?.find((c: any) => c.id === selectedLinkedInCampaignId);
        if (selectedCampaign) {
          context += `⚠️ **USER FOCUS:** The user has specifically selected the campaign **"${selectedCampaign.name}"** in their dashboard. Prioritize analysis and reporting for this individual campaign.\n`;
        }
      } else if (selectedLinkedInCampaignGroupId) {
        const selectedGroup = linkedIn.campaigns?.find((c: any) => c.id === selectedLinkedInCampaignGroupId);
        if (selectedGroup) {
          context += `⚠️ **USER FOCUS:** The user has specifically selected the campaign group **"${selectedGroup.name}"** in their dashboard. Prioritize analysis and reporting for this group of campaigns.\n`;
        }
      }
      // Get currency symbol from metrics
      const currency = linkedIn.metrics.currency || 'USD';
      const currencySymbol =
        currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

      // Core Metrics
      context += '\n**Core Performance:**\n';
      context += `- Total Impressions: ${Number(linkedIn.metrics.impressions).toLocaleString()}\n`;
      context += `- Total Clicks: ${Number(linkedIn.metrics.clicks).toLocaleString()}\n`;
      context += `- Total Spend: ${currencySymbol}${Number(linkedIn.metrics.spend).toLocaleString()} ${currency}\n`;
      context += `- CTR: ${Number(linkedIn.metrics.ctr).toFixed(2)}%\n`;
      context += `- CPC: ${currencySymbol}${Number(linkedIn.metrics.cpc).toFixed(2)} ${currency}\n`;

      // Engagement Metrics
      if (linkedIn.metrics.engagement) {
        const eng = linkedIn.metrics.engagement;
        if (eng.totalEngagements > 0) {
          context += '\n**Engagement Insights:**\n';
          context += `- Total Engagements: ${eng.totalEngagements.toLocaleString()}\n`;
          context += `- Engagement Rate: ${Number(eng.engagementRate).toFixed(2)}%\n`;
          context += `- Breakdown: ${eng.likes} likes, ${eng.comments} comments, ${eng.shares} shares, ${eng.follows} follows\n`;
          if (eng.costPerEngagement > 0) {
            context += `- Cost Per Engagement: ${currencySymbol}${Number(eng.costPerEngagement).toFixed(2)} ${currency}\n`;
          }
        }
      }

      // Conversion Metrics
      if (linkedIn.metrics.conversions) {
        const conv = linkedIn.metrics.conversions;
        if (conv.total > 0) {
          context += '\n**Conversion Performance:**\n';
          context += `- Total Conversions: ${conv.total.toLocaleString()}\n`;
          if (conv.postClick > 0 || conv.postView > 0) {
            context += `- Attribution: ${conv.postClick} post-click, ${conv.postView} post-view\n`;
          }
          if (conv.landingPageClicks > 0) {
            context += `- Landing Page Clicks: ${conv.landingPageClicks.toLocaleString()}\n`;
          }
          if (conv.costPerConversion > 0) {
            context += `- Cost Per Conversion: ${currencySymbol}${Number(conv.costPerConversion).toFixed(2)} ${currency}\n`;
          }
        }
      }

      // Lead Generation Metrics
      if (linkedIn.metrics.leads) {
        const leads = linkedIn.metrics.leads;
        if (leads.total > 0) {
          context += '\n**Lead Generation:**\n';
          context += `- Total Leads: ${leads.total.toLocaleString()}\n`;
          if (leads.qualified > 0) {
            context += `- Qualified Leads: ${leads.qualified.toLocaleString()}\n`;
            context += `- Lead Quality Rate: ${Number(leads.qualityRate).toFixed(1)}%\n`;
          }
          if (leads.formOpens > 0) {
            context += `- Form Opens: ${leads.formOpens.toLocaleString()}\n`;
          }
          if (leads.costPerLead > 0) {
            context += `- Cost Per Lead (CPL): ${currencySymbol}${Number(leads.costPerLead).toFixed(2)} ${currency}\n`;
          }
        }
      }

      // Video Performance
      if (linkedIn.metrics.video) {
        const video = linkedIn.metrics.video;
        if (video.starts > 0 || video.views > 0) {
          context += '\n**Video Performance:**\n';
          context += `- Video Starts: ${video.starts.toLocaleString()}\n`;
          context += `- Video Views: ${video.views.toLocaleString()}\n`;
          if (video.completions > 0) {
            context += `- Completions: ${video.completions.toLocaleString()}\n`;
            context += `- Completion Rate: ${Number(video.completionRate).toFixed(1)}%\n`;
          }
        }
      }

      // Reach & Awareness
      if (linkedIn.metrics.reach) {
        const reach = linkedIn.metrics.reach;
        if (reach.uniqueMembers > 0 || reach.averageDwellTime > 0) {
          context += '\n**Reach & Awareness:**\n';
          if (reach.uniqueMembers > 0) {
            context += `- Unique Members Reached: ${reach.uniqueMembers.toLocaleString()}\n`;
          }
          if (reach.averageDwellTime > 0) {
            context += `- Average Dwell Time: ${reach.averageDwellTime.toFixed(1)}s\n`;
          }
        }
      }

      // Campaigns
      if (linkedIn.campaigns && linkedIn.campaigns.length > 0) {
        context += '\n**Top Campaigns:**\n';
        linkedIn.campaigns.slice(0, 5).forEach((campaign: any) => {
          context += `- ${campaign.name} (${campaign.status}): ${campaign.metrics.impressions.toLocaleString()} impressions, ${campaign.metrics.clicks.toLocaleString()} clicks, ${currencySymbol}${Number(campaign.metrics.spend).toFixed(2)} ${currency} spend\n`;
        });
      }
    }
  }

  context += '\n\nUse this data to create learning opportunities. Cite specific numbers as evidence for your questions.';

  return context;
}
