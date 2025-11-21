/**
 * Quick Reply Suggestions Generator
 *
 * Generates contextual quick reply suggestions based on:
 * - Connected platforms
 * - Conversation context
 * - User's marketing analytics needs
 */

import type { QuickReplySuggestion, ClientClient } from '@/types/chat';

/**
 * Suggestion pool organized by category
 */
const SUGGESTION_POOL = {
  // General marketing insights
  general: [
    { id: 'overview', text: 'Show me an overview', category: 'general' as const },
    { id: 'summary', text: 'Summarize my performance', category: 'general' as const },
    { id: 'help', text: 'What can you help me with?', category: 'general' as const },
  ],

  // Metrics and analytics
  metrics: [
    { id: 'top-campaigns', text: 'Show top performing campaigns', category: 'metrics' as const },
    { id: 'conversion-trends', text: 'Analyze conversion trends', category: 'metrics' as const },
    { id: 'roi-analysis', text: 'Calculate ROI by platform', category: 'metrics' as const },
    { id: 'traffic-sources', text: 'Compare traffic sources', category: 'metrics' as const },
    { id: 'engagement', text: 'Show engagement metrics', category: 'metrics' as const },
  ],

  // Campaign management
  campaigns: [
    { id: 'campaign-performance', text: 'Compare campaign performance', category: 'campaigns' as const },
    { id: 'underperforming', text: 'Identify underperforming campaigns', category: 'campaigns' as const },
    { id: 'budget-allocation', text: 'Suggest budget allocation', category: 'campaigns' as const },
    { id: 'campaign-insights', text: 'Get campaign insights', category: 'campaigns' as const },
  ],

  // Platform-specific
  platforms: {
    googleAnalytics: [
      { id: 'ga-traffic', text: 'Show Google Analytics traffic', category: 'platforms' as const },
      { id: 'ga-bounce', text: 'Analyze bounce rate trends', category: 'platforms' as const },
      { id: 'ga-pages', text: 'Top performing pages', category: 'platforms' as const },
    ],
    googleAds: [
      { id: 'ads-performance', text: 'Google Ads performance', category: 'platforms' as const },
      { id: 'ads-keywords', text: 'Top performing keywords', category: 'platforms' as const },
      { id: 'ads-ctr', text: 'Analyze click-through rates', category: 'platforms' as const },
    ],
    metaAds: [
      { id: 'meta-performance', text: 'Facebook Ads performance', category: 'platforms' as const },
      { id: 'meta-audience', text: 'Audience demographics', category: 'platforms' as const },
      { id: 'meta-creative', text: 'Top creative performance', category: 'platforms' as const },
    ],
    linkedInAds: [
      { id: 'li-performance', text: 'LinkedIn Ads performance', category: 'platforms' as const },
      { id: 'li-leads', text: 'Lead generation metrics', category: 'platforms' as const },
      { id: 'li-targeting', text: 'Targeting effectiveness', category: 'platforms' as const },
    ],
  },

  // Insights and recommendations
  insights: [
    { id: 'opportunities', text: 'Identify opportunities', category: 'insights' as const },
    { id: 'recommendations', text: 'Get recommendations', category: 'insights' as const },
    { id: 'trends', text: 'What are the trends?', category: 'insights' as const },
    { id: 'optimization', text: 'How can I optimize?', category: 'insights' as const },
  ],
};

/**
 * Generate contextual suggestions based on client and conversation state
 */
export function generateSuggestions(
  client: ClientClient | null,
  messageCount: number,
  lastMessage?: string
): QuickReplySuggestion[] {
  const suggestions: QuickReplySuggestion[] = [];

  // First message - show general overview options
  if (messageCount <= 1) {
    suggestions.push(
      SUGGESTION_POOL.general[0], // Overview
      SUGGESTION_POOL.metrics[0],  // Top campaigns
      SUGGESTION_POOL.insights[0]  // Opportunities
    );
    return suggestions;
  }

  // No client selected - show general help
  if (!client) {
    suggestions.push(
      SUGGESTION_POOL.general[2], // What can you help me with?
      SUGGESTION_POOL.general[0], // Show overview
    );
    return suggestions.slice(0, 3);
  }

  // Get connected platforms
  const connectedPlatforms = getConnectedPlatforms(client);

  // Generate contextual suggestions based on last message
  if (lastMessage) {
    const lowerMessage = lastMessage.toLowerCase();

    // If talking about campaigns
    if (lowerMessage.includes('campaign')) {
      suggestions.push(
        SUGGESTION_POOL.campaigns[0], // Compare campaign performance
        SUGGESTION_POOL.campaigns[1], // Underperforming campaigns
        SUGGESTION_POOL.metrics[2]     // ROI analysis
      );
    }
    // If talking about traffic or analytics
    else if (lowerMessage.includes('traffic') || lowerMessage.includes('visitor')) {
      suggestions.push(
        SUGGESTION_POOL.metrics[3],    // Traffic sources
        SUGGESTION_POOL.metrics[4],    // Engagement metrics
        SUGGESTION_POOL.insights[2]    // Trends
      );
    }
    // If talking about conversions or ROI
    else if (lowerMessage.includes('conversion') || lowerMessage.includes('roi')) {
      suggestions.push(
        SUGGESTION_POOL.metrics[1],    // Conversion trends
        SUGGESTION_POOL.metrics[2],    // ROI analysis
        SUGGESTION_POOL.campaigns[2]   // Budget allocation
      );
    }
    // If asking for help or overview
    else if (lowerMessage.includes('help') || lowerMessage.includes('can you')) {
      suggestions.push(
        SUGGESTION_POOL.general[1],    // Summarize performance
        SUGGESTION_POOL.metrics[0],    // Top campaigns
        SUGGESTION_POOL.insights[1]    // Recommendations
      );
    }
    // Default: platform-specific + general insights
    else {
      addPlatformSpecificSuggestions(suggestions, connectedPlatforms);
      suggestions.push(SUGGESTION_POOL.insights[3]); // Optimization
    }
  }
  // No context - show platform-specific + general
  else {
    addPlatformSpecificSuggestions(suggestions, connectedPlatforms);
    suggestions.push(
      SUGGESTION_POOL.general[1],    // Summarize performance
      SUGGESTION_POOL.insights[0]    // Opportunities
    );
  }

  // Return max 3 suggestions
  return suggestions.slice(0, 3);
}

/**
 * Get list of connected platforms for a client
 */
function getConnectedPlatforms(client: ClientClient): string[] {
  const platforms: string[] = [];

  if (client.platforms?.googleAnalytics?.connected) {
    platforms.push('googleAnalytics');
  }
  if (client.platforms?.googleAds?.connected) {
    platforms.push('googleAds');
  }
  if (client.platforms?.metaAds?.connected) {
    platforms.push('metaAds');
  }
  if (client.platforms?.linkedInAds?.connected) {
    platforms.push('linkedInAds');
  }

  return platforms;
}

/**
 * Add platform-specific suggestions based on what's connected
 */
function addPlatformSpecificSuggestions(
  suggestions: QuickReplySuggestion[],
  connectedPlatforms: string[]
): void {
  // Add one suggestion per connected platform (up to 2)
  let added = 0;
  for (const platform of connectedPlatforms) {
    if (added >= 2) break;

    const platformSuggestions = SUGGESTION_POOL.platforms[platform as keyof typeof SUGGESTION_POOL.platforms];
    if (platformSuggestions && platformSuggestions.length > 0) {
      suggestions.push(platformSuggestions[0]);
      added++;
    }
  }

  // If no platforms connected or only one, add general metrics
  if (added < 2) {
    suggestions.push(SUGGESTION_POOL.metrics[0]); // Top campaigns
  }
}

/**
 * Get random suggestions from a category
 */
export function getRandomSuggestions(
  category: keyof typeof SUGGESTION_POOL,
  count: number = 3
): QuickReplySuggestion[] {
  const pool = SUGGESTION_POOL[category];

  if (Array.isArray(pool)) {
    // Shuffle and take first N
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  }

  return [];
}
