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
 * Individual message in a conversation
 */
export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

/**
 * Complete conversation with messages
 */
export interface Conversation {
  _id?: ObjectId;
  conversationId: string; // UUID
  userId: ObjectId;
  messages: Message[];
  status: ConversationStatus;
  messageCount: number;
  createdAt: Date;
  lastMessageAt: Date;
}

/**
 * Client-side conversation (without ObjectId)
 */
export interface ClientConversation {
  conversationId: string;
  userId: string;
  messages: Message[];
  status: ConversationStatus;
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
}

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

  // Conversation State
  currentConversationId: string | null;
  conversations: ClientConversation[];
  messages: Message[];

  // Actions
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
