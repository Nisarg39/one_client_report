/**
 * Agent System Type Definitions
 * 
 * Core types for the multi-agent marketing analytics system
 */

import type { Message, ClientClient } from '@/types/chat';

/**
 * Agent Context - All information available to an agent
 */
export interface AgentContext {
  client: ClientClient | null;
  platformData: any;
  conversationHistory: Message[];
  query: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  accountType?: 'business' | 'education' | 'instructor';
  selectedPropertyId?: string | null;
  selectedMetaCampaignId?: string | null;
  userRestrictions?: {
    allowedAgents?: string[];
    aiModel?: string;
  };
}

/**
 * Agent Definition
 */
export interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  capabilities: string[];
  keywords: string[]; // Keywords that trigger this agent
  systemPrompt: (context: AgentContext) => string;
}

/**
 * Agent Response
 */
export interface AgentResponse {
  agentId: string;
  agentName: string;
  content: string;
  confidence: number; // 0-1 score of how confident the agent is
  dataUsed: string[]; // List of data sources used
  recommendations?: string[];
}

/**
 * Route Decision - Which agent(s) to use
 */
export interface RouteDecision {
  primaryAgent: Agent;
  supportingAgents: Agent[];
  reasoning: string;
  confidence: number;
}

/**
 * Agent Capability Categories
 */
export enum AgentCapability {
  TRAFFIC_ANALYSIS = 'traffic-analysis',
  AD_OPTIMIZATION = 'ad-optimization',
  BUDGET_MANAGEMENT = 'budget-management',
  CONVERSION_OPTIMIZATION = 'conversion-optimization',
  ANOMALY_DETECTION = 'anomaly-detection',
  FORECASTING = 'forecasting',
  COMPETITIVE_ANALYSIS = 'competitive-analysis',
  CONTENT_ANALYSIS = 'content-analysis',
  AUDIENCE_INSIGHTS = 'audience-insights',
  REPORTING = 'reporting',
}

/**
 * Agent Execution Result
 */
export interface AgentExecutionResult {
  success: boolean;
  response?: AgentResponse;
  error?: string;
}
