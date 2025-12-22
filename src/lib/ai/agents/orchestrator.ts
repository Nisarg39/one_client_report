/**
 * Agent Orchestrator
 *
 * Routes queries to appropriate agents and synthesizes responses
 */

import { getAgentByKeyword, getAllAgents, getAgent } from './registry';
import { trafficIntelligenceAgent } from './trafficIntelligence';
import type { Agent, AgentContext, RouteDecision } from './types';
import { buildSystemPrompt } from '../systemPrompt';

/**
 * Route a query to the appropriate agent(s)
 *
 * Uses keyword matching and query analysis to determine which agent should handle the request
 */
export async function routeQuery(
  query: string,
  context: AgentContext
): Promise<RouteDecision> {
  const accountType = context.accountType || 'business';

  // Route based on account type
  if (accountType === 'education' || accountType === 'instructor') {
    return routeEducationQuery(query, context);
  } else {
    return routeBusinessQuery(query, context);
  }
}

/**
 * Route query for education mode users
 * Returns Data Mentor agent for educational guidance
 */
function routeEducationQuery(
  query: string,
  context: AgentContext
): RouteDecision {
  // For education mode, always use Data Mentor persona
  const dataMentorAgent: Agent = {
    id: 'data-mentor',
    name: 'Data Mentor',
    emoji: '👨‍🏫',
    description: 'Your personal marketing data tutor',
    capabilities: ['education', 'socratic-method', 'pattern-recognition'],
    keywords: [],
    systemPrompt: (ctx: AgentContext) => buildSystemPrompt(
      ctx.client,
      ctx.platformData,
      ctx.accountType,
      ctx.selectedPropertyId,
      ctx.selectedMetaCampaignId
    )
  };

  return {
    primaryAgent: dataMentorAgent,
    supportingAgents: [],
    reasoning: 'Education mode: Using Data Mentor for guided learning',
    confidence: 1.0,
  };
}

/**
 * Route query for business mode users
 * Uses keyword matching to select specialized agent
 */
function routeBusinessQuery(
  query: string,
  context: AgentContext
): RouteDecision {
  const lowerQuery = query.toLowerCase();

  // Calculate confidence score for each agent based on keyword matches
  const agentScores = getAllAgents().map(agent => {
    const confidence = calculateConfidence(lowerQuery, agent.keywords);
    return { agent, confidence };
  });

  // Sort by confidence (highest first)
  agentScores.sort((a, b) => b.confidence - a.confidence);

  // Get the best matching agent
  const bestMatch = agentScores[0];

  // If confidence is too low, use default Growth Strategist
  if (bestMatch.confidence < 0.1) {
    return {
      primaryAgent: getDefaultBusinessAgent(),
      supportingAgents: [],
      reasoning: 'No specific keyword match - using general Growth Strategist',
      confidence: 0.5,
    };
  }

  return {
    primaryAgent: bestMatch.agent,
    supportingAgents: [],
    reasoning: `Keyword match: ${bestMatch.confidence.toFixed(2)} confidence for ${bestMatch.agent.name}`,
    confidence: bestMatch.confidence,
  };
}

/**
 * Calculate confidence score based on keyword matches
 */
function calculateConfidence(query: string, keywords: string[]): number {
  if (keywords.length === 0) return 0;

  let matchCount = 0;
  let matchWeight = 0;

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (query.includes(lowerKeyword)) {
      matchCount++;
      // Weight matches based on keyword length (more specific = higher weight)
      matchWeight += lowerKeyword.length / 10;
    }
  }

  // Calculate score: matches / total keywords, boosted by weight
  const baseScore = matchCount / keywords.length;
  const weightedScore = Math.min(1.0, baseScore + (matchWeight / keywords.length));

  return weightedScore;
}

/**
 * Get default agent for business mode when no specific match
 */
function getDefaultBusinessAgent(): Agent {
  return {
    id: 'growth-strategist',
    name: 'Growth Strategist',
    emoji: '📈',
    description: 'General marketing growth and optimization expert',
    capabilities: ['growth-strategy', 'cross-channel-analysis', 'general-consulting'],
    keywords: [],
    systemPrompt: (ctx: AgentContext) => buildSystemPrompt(
      ctx.client,
      ctx.platformData,
      ctx.accountType,
      ctx.selectedPropertyId,
      ctx.selectedMetaCampaignId
    )
  };
}

/**
 * Execute an agent with the given context
 * 
 * This generates the agent's system prompt and returns it
 * (The actual AI call happens in the sendMessage action)
 */
export function executeAgent(
  agent: Agent,
  context: AgentContext
): string {
  return agent.systemPrompt(context);
}

/**
 * Get agent metadata for a given agent ID
 */
export function getAgentMetadata(agentId: string): {
  id: string;
  name: string;
  emoji: string;
} | null {
  const agent = getAgent(agentId);

  if (!agent) {
    return null;
  }

  return {
    id: agent.id,
    name: agent.name,
    emoji: agent.emoji,
  };
}
