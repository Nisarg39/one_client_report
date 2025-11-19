/**
 * Chat Store (Zustand)
 *
 * Global state management for the AI chatbot UI
 * Handles chat open/closed state, messages, typing indicators, etc.
 */

import { create } from 'zustand';
import type { Message } from '@/types/chat';

/**
 * Chat store state and actions
 */
interface ChatStore {
  // UI State
  isOpen: boolean;              // Is chat modal open?
  isTyping: boolean;            // Is AI typing a response?

  // Message State
  messages: Message[];          // Current conversation messages
  currentConversationId: string | null; // Active conversation ID

  // UI Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Message Actions
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;

  // Typing Indicator
  setTyping: (isTyping: boolean) => void;

  // Conversation Management
  setCurrentConversation: (conversationId: string | null) => void;
}

/**
 * Zustand store for chat state
 *
 * Usage in components:
 * ```typescript
 * const { isOpen, openChat, messages, addMessage } = useChatStore();
 * ```
 */
export const useChatStore = create<ChatStore>((set) => ({
  // Initial State
  isOpen: false,
  isTyping: false,
  messages: [],
  currentConversationId: null,

  // UI Actions
  openChat: () => set({ isOpen: true }),

  closeChat: () => set({ isOpen: false }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

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
}));
