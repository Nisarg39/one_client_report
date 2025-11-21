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
        platformInfo += `\n## Available Data\nYou have access to recent data from these platforms. When answering questions, use this real data to provide accurate insights.`;
      } else {
        platformInfo += `\n## Data Status\nNote: Platform data is currently being synced. For now, let the user know you'll be able to provide insights once the data sync is complete. You can still explain what kind of insights you'll be able to provide.`;
      }
    } else {
      platformInfo += `\n\n## No Platforms Connected\nThe user hasn't connected any marketing platforms yet. Guide them to:\n1. Go to Settings → Integrations\n2. Connect their Google Analytics, Ads, Meta, or LinkedIn accounts\n3. Return here to start getting insights`;
    }
  } else {
    platformInfo += `\n\n## Getting Started\nTo provide insights, the user needs to:\n1. Select or create a client\n2. Connect marketing platforms (Settings → Integrations)\n3. Ask questions about their data`;
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

  // Google Analytics Data
  if (platformData.googleAnalytics) {
    const ga = platformData.googleAnalytics;
    context += '\n### Google Analytics\n';
    if (ga.metrics) {
      context += `- Sessions: ${ga.metrics.sessions?.toLocaleString() || 'N/A'}\n`;
      context += `- Users: ${ga.metrics.users?.toLocaleString() || 'N/A'}\n`;
      context += `- Pageviews: ${ga.metrics.pageviews?.toLocaleString() || 'N/A'}\n`;
      context += `- Bounce Rate: ${ga.metrics.bounceRate ? (ga.metrics.bounceRate * 100).toFixed(1) + '%' : 'N/A'}\n`;
      context += `- Avg Session Duration: ${ga.metrics.avgSessionDuration ? Math.round(ga.metrics.avgSessionDuration) + 's' : 'N/A'}\n`;
    }
    if (ga.dimensions?.topSources && ga.dimensions.topSources.length > 0) {
      context += '\nTop Traffic Sources:\n';
      ga.dimensions.topSources.slice(0, 3).forEach((source: any) => {
        context += `- ${source.source}: ${source.sessions.toLocaleString()} sessions\n`;
      });
    }
  }

  // Google Ads Data
  if (platformData.googleAds && platformData.googleAds.length > 0) {
    context += '\n### Google Ads Campaigns\n';
    platformData.googleAds.slice(0, 3).forEach((campaign: any) => {
      context += `\n**${campaign.name}**\n`;
      context += `- Spend: $${campaign.spend.toLocaleString()}\n`;
      context += `- Clicks: ${campaign.clicks.toLocaleString()}\n`;
      context += `- Impressions: ${campaign.impressions.toLocaleString()}\n`;
      if (campaign.ctr) context += `- CTR: ${(campaign.ctr * 100).toFixed(2)}%\n`;
      if (campaign.conversions) context += `- Conversions: ${campaign.conversions}\n`;
    });
  }

  // Meta Ads Data
  if (platformData.metaAds && platformData.metaAds.length > 0) {
    context += '\n### Meta Ads Campaigns\n';
    platformData.metaAds.slice(0, 3).forEach((campaign: any) => {
      context += `\n**${campaign.name}**\n`;
      context += `- Spend: $${campaign.spend.toLocaleString()}\n`;
      context += `- Impressions: ${campaign.impressions.toLocaleString()}\n`;
      context += `- Clicks: ${campaign.clicks.toLocaleString()}\n`;
      if (campaign.cpm) context += `- CPM: $${campaign.cpm.toFixed(2)}\n`;
      if (campaign.roas) context += `- ROAS: ${campaign.roas.toFixed(2)}x\n`;
    });
  }

  // LinkedIn Ads Data
  if (platformData.linkedInAds && platformData.linkedInAds.length > 0) {
    context += '\n### LinkedIn Ads Campaigns\n';
    platformData.linkedInAds.slice(0, 3).forEach((campaign: any) => {
      context += `\n**${campaign.name}**\n`;
      context += `- Spend: $${campaign.spend.toLocaleString()}\n`;
      context += `- Impressions: ${campaign.impressions.toLocaleString()}\n`;
      context += `- Clicks: ${campaign.clicks.toLocaleString()}\n`;
      if (campaign.leads) context += `- Leads: ${campaign.leads}\n`;
    });
  }

  context += '\n\nUse this data to answer user questions accurately. Cite specific numbers when relevant.';

  return context;
}
