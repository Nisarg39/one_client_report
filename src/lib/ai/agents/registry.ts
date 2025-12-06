/**
 * Agent Registry
 * 
 * Central registry of all available agents
 */

import { trafficIntelligenceAgent } from './trafficIntelligence';
import { adPerformanceAgent } from './adPerformance';
import { budgetOptimizationAgent } from './budgetOptimization';
import { conversionFunnelAgent } from './conversionFunnel';
import { anomalyDetectionAgent } from './anomalyDetection';
import type { Agent } from './types';

/**
 * All registered agents
 */
export const AGENT_REGISTRY: Record<string, Agent> = {
  [trafficIntelligenceAgent.id]: trafficIntelligenceAgent,
  [adPerformanceAgent.id]: adPerformanceAgent,
  [budgetOptimizationAgent.id]: budgetOptimizationAgent,
  [conversionFunnelAgent.id]: conversionFunnelAgent,
  [anomalyDetectionAgent.id]: anomalyDetectionAgent,
};

/**
 * Get agent by ID
 */
export function getAgent(id: string): Agent | null {
  return AGENT_REGISTRY[id] || null;
}

/**
 * Get all agents
 */
export function getAllAgents(): Agent[] {
  return Object.values(AGENT_REGISTRY);
}

/**
 * Get agents by capability
 */
export function getAgentsByCapability(capability: string): Agent[] {
  return getAllAgents().filter((agent) =>
    agent.capabilities.includes(capability)
  );
}

/**
 * Get agent by keyword match
 */
export function getAgentByKeyword(query: string): Agent | null {
  const lowerQuery = query.toLowerCase();
  
  // Find agent with matching keywords
  for (const agent of getAllAgents()) {
    for (const keyword of agent.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return agent;
      }
    }
  }
  
  return null;
}
