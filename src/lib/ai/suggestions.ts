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
 * Each suggestion now includes an emoji indicating which agent will handle it
 */
const SUGGESTION_POOL = {
  // High-value audits (Growth Strategist focus)
  general: [
    { id: 'audit-cpa', text: '💰 Audit my cross-channel CPA', category: 'general' as const },
    { id: 'wasted-spend', text: '📊 Find wasted ad spend', category: 'general' as const },
    { id: 'growth-plan', text: '🚦 Generate a 30-day growth plan', category: 'general' as const },
  ],

  // Deep-dive metrics
  metrics: [
    { id: 'conversion-drop', text: '🎯 Analyze conversion drop-offs', category: 'metrics' as const },
    { id: 'roas-compare', text: '💰 Compare ROAS by platform', category: 'metrics' as const },
    { id: 'revenue-drivers', text: '📊 Identify top 3 revenue drivers', category: 'metrics' as const },
    { id: 'traffic-quality', text: '🚦 Audit traffic quality', category: 'metrics' as const },
    { id: 'engagement-audit', text: '🚦 Analyze engagement depth', category: 'metrics' as const },
  ],

  // Campaign Optimization
  campaigns: [
    { id: 'bid-adjust', text: '💰 Suggest bid adjustments', category: 'campaigns' as const },
    { id: 'creative-fatigue', text: '💰 Find creative fatigue', category: 'campaigns' as const },
    { id: 'budget-optimize', text: '📊 Optimize budget allocation', category: 'campaigns' as const },
    { id: 'campaign-scale', text: '💰 Which campaigns should I scale?', category: 'campaigns' as const },
  ],

  // Platform-specific Audits
  platforms: {
    googleAnalytics: [
      { id: 'ga-leaks', text: '🚦 Where am I losing visitors?', category: 'platforms' as const },
      { id: 'ga-high-value', text: '🚦 Who are my best users?', category: 'platforms' as const },
      { id: 'ga-landing', text: '🎯 Audit landing page performance', category: 'platforms' as const },
    ],
    googleAds: [
      { id: 'ads-waste', text: '💰 Find negative keyword opportunities', category: 'platforms' as const },
      { id: 'ads-quality', text: '💰 Check Quality Score issues', category: 'platforms' as const },
      { id: 'ads-cpa', text: '💰 Reduce Google Ads CPA', category: 'platforms' as const },
    ],
    metaAds: [
      { id: 'meta-creative', text: '💰 Audit creative performance', category: 'platforms' as const },
      { id: 'meta-audience', text: '💰 Find audience saturation', category: 'platforms' as const },
      { id: 'meta-scale', text: '💰 Scale winning ad sets', category: 'platforms' as const },
    ],
    linkedInAds: [
      { id: 'li-quality', text: '💰 Audit lead quality', category: 'platforms' as const },
      { id: 'li-targeting', text: '💰 Refine B2B targeting', category: 'platforms' as const },
      { id: 'li-cpl', text: '💰 Reduce Cost Per Lead', category: 'platforms' as const },
    ],
  },

  // Strategic Insights
  insights: [
    { id: 'opportunity', text: '📊 What is my biggest opportunity?', category: 'insights' as const },
    { id: 'execution-plan', text: '📊 Generate execution plan', category: 'insights' as const },
    { id: 'prediction', text: '⚠️ Predict next month\'s trend', category: 'insights' as const },
    { id: 'competitor', text: '📊 How do I beat the competition?', category: 'insights' as const },
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
