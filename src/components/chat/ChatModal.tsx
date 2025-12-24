/**
 * Chat Modal Component
 *
 * Main chat interface (modal overlay)
 * Contains MessageList, ChatInput, and header
 */

'use client';

import { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/useChatStore';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useStreamingChat } from '@/lib/ai/useStreamingChat';
import type { Message } from '@/types/chat';

export function ChatModal() {
  const {
    isOpen,
    closeChat,
    messages,
    addMessage,
    isTyping,
    setTyping,
    currentClientId,
    currentConversationId,
    dateRangeFilter,
    metricsDashboard,
  } = useChatStore();

  const { streamMessage } = useStreamingChat();

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Start typing indicator
    setTyping(true);

    // Get updated messages array including the user message
    const updatedMessages = [...messages, userMessage];

    // Stream AI response
    let assistantContent = '';

    await streamMessage(
      currentConversationId,
      updatedMessages,
      currentClientId,
      {
        onToken: (token) => {
          assistantContent += token;
        },
        onComplete: (fullResponse) => {
          // Add complete assistant message
          const assistantMessage: Message = {
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
          };
          addMessage(assistantMessage);
          setTyping(false);
        },
        onError: (error) => {
          console.error('AI Error:', error);
          setTyping(false);

          // Add error message
          const errorMessage: Message = {
            role: 'assistant',
            content: error.includes('OPENAI_API_KEY')
              ? "⚠️ OpenAI API key is not configured. Please add your API key to `.env.local` to enable AI responses.\n\nGet your key from: https://platform.openai.com/api-keys"
              : "I'm sorry, I encountered an error. Please try again in a moment.",
            timestamp: new Date(),
          };
          addMessage(errorMessage);
        },
      },
      dateRangeFilter || undefined,
      metricsDashboard.selectedPropertyId,
      metricsDashboard.selectedMetaCampaignId,
      metricsDashboard.selectedGoogleAdsCampaignId,
      metricsDashboard.selectedLinkedInCampaignId
    );
  };

  // Handle quick reply
  const handleQuickReply = (message: string) => {
    handleSendMessage(message);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeChat]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-[420px] h-[600px] bg-[#1a1a1a] rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-800 overflow-hidden
              max-md:bottom-0 max-md:right-0 max-md:w-full max-md:h-full max-md:rounded-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6CA3A2] rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 id="chat-modal-title" className="text-white font-semibold">OneAssist</h3>
                  <p className="text-xs text-gray-400">
                    Marketing Analytics AI
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeChat}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <MessageList
              messages={messages}
              isTyping={isTyping}
              onQuickReply={handleQuickReply}
            />

            {/* Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
