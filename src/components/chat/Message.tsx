/**
 * Message Component
 *
 * Individual message bubble for user or AI messages
 * Supports markdown rendering for AI responses
 */

'use client';

import { motion } from 'framer-motion';
import { User, Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Message as MessageType, MessageFeedback, QuickReplySuggestion } from '@/types/chat';
import { MarkdownContent } from './MarkdownContent';
import { QuickReplySuggestions } from './QuickReplySuggestions';
import { saveFeedback } from '@/app/actions/feedback/saveFeedback';
import { useChatStore } from '@/stores/useChatStore';

interface MessageProps {
  message: MessageType;
  index: number;
  onQuickReply?: (text: string) => void;
  isTyping?: boolean;
}

export function Message({ message, index, onQuickReply, isTyping = false }: MessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const currentConversationId = useChatStore((state: { currentConversationId: string | null }) => state.currentConversationId);

  // Local feedback state (initialized from message.feedback)
  const [feedback, setFeedback] = useState<MessageFeedback>(message.feedback || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync feedback state when message prop changes (e.g., when loading from database)
  useEffect(() => {
    setFeedback(message.feedback || null);
  }, [message.feedback]);

  /**
   * Handle feedback button click
   */
  const handleFeedback = async (feedbackType: 'positive' | 'negative') => {
    if (!currentConversationId) {
      console.error('No conversation ID available');
      return;
    }

    setIsSubmitting(true);

    try {
      // If clicking the same feedback, remove it (set to null)
      const newFeedback = feedback === feedbackType ? 'null' : feedbackType;

      const result = await saveFeedback({
        conversationId: currentConversationId,
        messageIndex: index,
        feedback: newFeedback,
      });

      if (result.success) {
        // Update local state
        setFeedback(newFeedback === 'null' ? null : newFeedback);
      } else {
        console.error('Failed to save feedback:', result.error);
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-[#6CA3A2]'
            : 'bg-[#2a2a2a] border border-gray-700'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-[#6CA3A2]" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`flex-1 max-w-[80%] ${
          isUser ? 'flex justify-end' : ''
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-[#6CA3A2] text-white'
              : 'bg-[#2a2a2a] text-gray-100'
          }`}
        >
          {/* Render markdown for AI messages, plain text for user */}
          {isAssistant ? (
            <MarkdownContent content={message.content} />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Timestamp and Feedback Buttons */}
        <div
          className={`flex items-center gap-2 mt-1 px-1 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Timestamp */}
          <div className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>

          {/* Feedback Buttons (only for assistant messages) */}
          {isAssistant && currentConversationId && (
            <div className="flex items-center gap-1">
              {/* Thumbs Up */}
              <button
                onClick={() => handleFeedback('positive')}
                disabled={isSubmitting}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  feedback === 'positive'
                    ? 'bg-[#6CA3A2] bg-opacity-20 text-[#6CA3A2]'
                    : 'text-gray-500 hover:text-[#6CA3A2] hover:bg-[#2a2a2a]'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label="Thumbs up"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>

              {/* Thumbs Down */}
              <button
                onClick={() => handleFeedback('negative')}
                disabled={isSubmitting}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  feedback === 'negative'
                    ? 'bg-red-500 bg-opacity-20 text-red-400'
                    : 'text-gray-500 hover:text-red-400 hover:bg-[#2a2a2a]'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label="Thumbs down"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Reply Suggestions (only for assistant messages) */}
        {isAssistant && message.suggestions && message.suggestions.length > 0 && onQuickReply && (
          <QuickReplySuggestions
            suggestions={message.suggestions}
            onSuggestionClick={(suggestion) => onQuickReply(suggestion.text)}
            disabled={isTyping}
          />
        )}
      </div>
    </motion.div>
  );
}
