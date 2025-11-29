/**
 * Chat Store (Zustand)
 *
 * Global state management for the AI chatbot UI
 * Handles chat open/closed state, messages, typing indicators, etc.
 *
 * Multi-Client Architecture:
 * - Users can manage multiple clients
 * - Each client has independent conversations
 * - Client switching clears and reloads conversations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, ClientClient, ConversationFilter } from '@/types/chat';
import type { DatePreset, DateRange } from '@/lib/utils/datePresets';

/**
 * Platform type identifier
 */
export type PlatformType = 'googleAnalytics' | 'googleAds' | 'metaAds' | 'linkedInAds';

/**
 * Platform data payload from SSE stream
 * Contains metrics data for all connected platforms
 */
export interface PlatformDataPayload {
  timestamp: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  platforms: {
    googleAnalytics?: any; // GA4 property data array
    googleAds?: any;
    metaAds?: any;
    linkedInAds?: any;
  };
}

/**
 * Chat store state and actions
 */
interface ChatStore {
  // UI State
  isOpen: boolean;              // Is chat modal open?
  isTyping: boolean;            // Is AI typing a response?

  // Multi-Client State
  currentClientId: string | null;  // Currently selected client
  clients: ClientClient[];         // List of user's clients

  // Message State
  messages: Message[];          // Current conversation messages
  currentConversationId: string | null; // Active conversation ID

  // Phase 6: Search & Filter State
  searchQuery: string;          // Current search query
  conversationFilter: ConversationFilter; // Current filter (all, active, archived)
  isSearching: boolean;         // Is search in progress?

  // Phase 6.5: Date Range Filter State
  dateRangeFilter: DateRange | null;    // Current date range filter (null = use default)
  selectedDatePreset: DatePreset;       // Currently selected preset

  // Phase 6.7: Metrics Dashboard State
  metricsDashboard: {
    isVisible: boolean;                 // Is metrics panel visible?
    selectedPlatform: PlatformType | null; // Currently selected platform tab
    width: number;                      // Panel width in pixels (desktop)
    mode: 'split' | 'collapsed' | 'overlay'; // Layout mode
  };

  // Phase 6.7: Platform Data Cache
  platformData: PlatformDataPayload | null;  // Cached platform metrics data
  platformDataTimestamp: number | null;       // When data was last fetched

  // UI Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Client Actions
  setCurrentClient: (clientId: string | null) => void;
  setClients: (clients: ClientClient[]) => void;
  loadClientConversations: (clientId: string) => Promise<void>;

  // Message Actions
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;

  // Typing Indicator
  setTyping: (isTyping: boolean) => void;

  // Conversation Management
  setCurrentConversation: (conversationId: string | null) => void;

  // Phase 6: Search & Filter Actions
  setSearchQuery: (query: string) => void;
  setConversationFilter: (filter: ConversationFilter) => void;
  setIsSearching: (isSearching: boolean) => void;
  clearSearch: () => void;

  // Phase 6.5: Date Range Filter Actions
  setDateRangeFilter: (dateRange: DateRange | null) => void;
  setSelectedDatePreset: (preset: DatePreset) => void;
  clearDateRangeFilter: () => void;

  // Phase 6.7: Metrics Dashboard Actions
  toggleMetricsDashboard: () => void;
  setMetricsDashboardVisible: (visible: boolean) => void;
  setMetricsDashboardPlatform: (platform: PlatformType) => void;
  setMetricsDashboardWidth: (width: number) => void;
  setPlatformData: (data: PlatformDataPayload) => void;
}

/**
 * Zustand store for chat state
 *
 * Usage in components:
 * ```typescript
 * const { isOpen, openChat, messages, addMessage } = useChatStore();
 * ```
 */
export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
  // Initial State
  isOpen: false,
  isTyping: false,
  currentClientId: null,
  clients: [],
  messages: [],
  currentConversationId: null,
  // Phase 6: Search & Filter Initial State
  searchQuery: '',
  conversationFilter: 'active' as ConversationFilter,
  isSearching: false,
  // Phase 6.5: Date Range Filter Initial State
  dateRangeFilter: null, // null = use default (last 30 days in backend)
  selectedDatePreset: 'last_30d' as DatePreset,

  // Phase 6.7: Metrics Dashboard Initial State
  metricsDashboard: {
    isVisible: false,
    selectedPlatform: null,
    width: 400, // Default panel width (px)
    mode: 'collapsed' as const,
  },

  // Phase 6.7: Platform Data Initial State
  platformData: null,
  platformDataTimestamp: null,

  // UI Actions
  openChat: () => set({ isOpen: true }),

  closeChat: () => set({ isOpen: false }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  // Client Actions
  setCurrentClient: (clientId) =>
    set({
      currentClientId: clientId,
      messages: [], // Clear messages when switching clients
      currentConversationId: null,
    }),

  setClients: (clients) => set({ clients }),

  loadClientConversations: async (clientId) => {
    // TODO: Implement conversation loading for specific client
    // This will fetch conversations from server action in Phase 3
    set({
      currentClientId: clientId,
      messages: [],
      currentConversationId: null,
    });
  },

  // Message Actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [], currentConversationId: null }),

  // Typing Indicator
  setTyping: (isTyping) => set({ isTyping }),

  // Conversation Management
  setCurrentConversation: (conversationId) =>
    set({ currentConversationId: conversationId }),

  // Phase 6: Search & Filter Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setConversationFilter: (filter) => set({ conversationFilter: filter }),

  setIsSearching: (isSearching) => set({ isSearching }),

  clearSearch: () =>
    set({
      searchQuery: '',
      isSearching: false,
    }),

  // Phase 6.5: Date Range Filter Actions
  setDateRangeFilter: (dateRange) => set({ dateRangeFilter: dateRange }),

  setSelectedDatePreset: (preset) => set({ selectedDatePreset: preset }),

  clearDateRangeFilter: () =>
    set({
      dateRangeFilter: null,
      selectedDatePreset: 'last_30d' as DatePreset,
    }),

  // Phase 6.7: Metrics Dashboard Actions
  toggleMetricsDashboard: () =>
    set((state) => ({
      metricsDashboard: {
        ...state.metricsDashboard,
        isVisible: !state.metricsDashboard.isVisible,
        mode: !state.metricsDashboard.isVisible ? 'split' : 'collapsed',
      },
    })),

  setMetricsDashboardVisible: (visible) =>
    set((state) => ({
      metricsDashboard: {
        ...state.metricsDashboard,
        isVisible: visible,
        mode: visible ? 'split' : 'collapsed',
      },
    })),

  setMetricsDashboardPlatform: (platform) =>
    set((state) => ({
      metricsDashboard: {
        ...state.metricsDashboard,
        selectedPlatform: platform,
      },
    })),

  setMetricsDashboardWidth: (width) =>
    set((state) => ({
      metricsDashboard: {
        ...state.metricsDashboard,
        width: Math.max(300, Math.min(800, width)), // Constrain between 300-800px
      },
    })),

  setPlatformData: (data) =>
    set({
      platformData: data,
      platformDataTimestamp: Date.now(),
    }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        // Persist only UI preferences, not transient data
        metricsDashboard: state.metricsDashboard,
        // Don't persist platformData (always fetch fresh)
      }),
    }
  )
);
