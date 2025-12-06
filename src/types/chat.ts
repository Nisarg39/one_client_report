/**
 * Chat Types
 * Type definitions for the AI chatbot feature
 */

import { ObjectId } from 'mongoose';

/**
 * Message role types
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Conversation status
 */
export type ConversationStatus = 'active' | 'archived' | 'deleted';

/**
 * Client status (multi-client architecture)
 */
export type ClientStatus = 'active' | 'inactive' | 'archived';

/**
 * Message feedback type
 */
export type MessageFeedback = 'positive' | 'negative' | null;

/**
 * Quick reply suggestion
 */
export interface QuickReplySuggestion {
  id: string;
  text: string;
  category?: 'metrics' | 'campaigns' | 'platforms' | 'insights' | 'general';
}

/**
 * Individual message in a conversation
 */
export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  feedback?: MessageFeedback; // Optional feedback for AI messages
  messageId?: string; // Unique ID for tracking feedback
  suggestions?: QuickReplySuggestion[]; // Optional quick reply suggestions for AI messages
  // Multi-agent system fields
  agentId?: string; // ID of the agent that generated this response
  agentName?: string; // Name of the agent that generated this response
}

/**
 * Token usage tracking for AI cost monitoring (Phase 6.6)
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Complete conversation with messages
 */
export interface Conversation {
  _id?: ObjectId;
  conversationId: string; // UUID
  userId: ObjectId;
  clientId: ObjectId; // Multi-client architecture
  messages: Message[];
  status: ConversationStatus;
  messageCount: number;
  createdAt: Date;
  lastMessageAt: Date;
  // Phase 6: New fields
  title?: string; // User-editable title (empty = use first message)
  isPinned?: boolean; // Pin to top of list
  tags?: string[]; // Optional tags for filtering
  archivedAt?: Date; // When conversation was archived
  // Phase 6.6: Token usage tracking
  tokenUsage?: TokenUsage; // AI token usage for cost tracking
}

/**
 * Client-side conversation (without ObjectId)
 */
export interface ClientConversation {
  conversationId: string;
  userId: string;
  clientId: string; // Multi-client architecture
  messages: Message[];
  status: ConversationStatus;
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
  // Phase 6: New fields
  title?: string;
  isPinned?: boolean;
  tags?: string[];
  archivedAt?: string;
  // Phase 6.6: Token usage tracking
  tokenUsage?: TokenUsage;
}

/**
 * Conversation filter type
 */
export type ConversationFilter = 'all' | 'active' | 'archived';

/**
 * Export format type
 */
export type ExportFormat = 'json' | 'csv' | 'markdown';

/**
 * View mode for chat page (Phase 6.5)
 * - 'chat': Show chat interface (messages, input)
 * - 'dashboard': Show integrated dashboard
 */
export type ViewMode = 'chat' | 'dashboard';

/**
 * Dashboard section navigation (Phase 6.5)
 * - 'overview': Stats and quick actions
 * - 'clients': Client management
 * - 'profile': User profile settings
 * - 'settings': App settings
 */
export type DashboardSection = 'overview' | 'clients' | 'profile' | 'settings';

/**
 * New message payload
 */
export interface SendMessagePayload {
  conversationId: string;
  message: string;
}

/**
 * Server Action response
 */
export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  conversationId?: string;
}

/**
 * Streaming response chunk
 */
export interface StreamChunk {
  type: 'token' | 'done' | 'error';
  content?: string;
  error?: string;
}

/**
 * Chat store state (Zustand)
 */
export interface ChatStore {
  // UI State
  isOpen: boolean;
  isTyping: boolean;

  // Multi-Client State
  currentClientId: string | null;
  clients: ClientClient[];

  // Conversation State
  currentConversationId: string | null;
  conversations: ClientConversation[];
  messages: Message[];

  // Client Actions
  setCurrentClient: (clientId: string | null) => void;
  setClients: (clients: ClientClient[]) => void;
  loadClientConversations: (clientId: string) => Promise<void>;

  // Chat Actions
  openChat: () => void;
  closeChat: () => void;
  setTyping: (isTyping: boolean) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentConversation: (conversationId: string | null) => void;
  setConversations: (conversations: ClientConversation[]) => void;
  clearMessages: () => void;
}

/**
 * Quick reply button
 */
export interface QuickReply {
  id: string;
  text: string;
  prompt: string;
}

/**
 * AI Provider interface (for abstraction layer)
 */
export interface AIProvider {
  chat(
    messages: Message[],
    stream: boolean
  ): Promise<ReadableStream | string>;
}

/**
 * Rate limit info
 */
export interface RateLimit {
  hourly: number;
  daily: number;
  lastReset: Date;
}

/**
 * User platform connection status
 */
export type PlatformStatus = 'active' | 'expired' | 'error' | 'disconnected';

/**
 * Platform metrics cache
 */
export interface PlatformMetrics {
  // Google Analytics
  sessions?: number;
  users?: number;
  bounceRate?: number;
  pageViews?: number;

  // Google Ads / Meta Ads / LinkedIn Ads
  clicks?: number;
  impressions?: number;
  spend?: number;
  conversions?: number;
  ctr?: number;
  cpc?: number;

  // Meta specific
  reach?: number;
  engagement?: number;

  // LinkedIn specific
  leads?: number;

  // Common
  lastSync?: Date;
}

/**
 * Platform connection info
 */
export interface PlatformConnection {
  connected: boolean;
  status: PlatformStatus;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastSync?: Date;
  metrics?: PlatformMetrics;
}

/**
 * User platforms (stored in User model)
 */
export interface UserPlatforms {
  googleAnalytics?: PlatformConnection;
  googleAds?: PlatformConnection;
  metaAds?: PlatformConnection;
  linkedInAds?: PlatformConnection;
}

/**
 * Client platforms (stored per client in multi-client architecture)
 */
export interface ClientPlatforms {
  googleAnalytics?: PlatformConnection;
  googleAds?: PlatformConnection;
  metaAds?: PlatformConnection;
  linkedInAds?: PlatformConnection;
}

/**
 * Platform health issue for chat notifications
 * Tracks platform connection problems detected during data fetching
 */
export interface PlatformHealthIssue {
  connectionId: string;       // ID of the PlatformConnection document
  platformId: string;         // 'google-analytics', 'google-ads', etc.
  platformName: string;       // 'Google Analytics', 'Google Ads', etc.
  status: 'expired' | 'error';
  error?: string;
  errorType?: 'expired_token' | 'invalid_grant' | 'network' | 'api_error';
  expiresAt?: Date;
  hasRefreshToken: boolean;   // Can we auto-refresh or needs reconnection?
}

/**
 * Client (multi-client architecture)
 */
export interface Client {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  email?: string;
  logo?: string;
  platforms: ClientPlatforms;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods (from Mongoose)
  getConnectedPlatforms?: () => string[];
  hasConnectedPlatforms?: () => boolean;
  archive?: () => Promise<Client>;
  activate?: () => Promise<Client>;
  deactivate?: () => Promise<Client>;
}

/**
 * Client-side Client (without ObjectId)
 */
export interface ClientClient {
  id: string;
  userId: string;
  name: string;
  email?: string;
  logo?: string;
  platforms: ClientPlatforms;
  status: ClientStatus;
  dataSource?: 'real' | 'mock';
  createdAt: string;
  updatedAt: string;
}
