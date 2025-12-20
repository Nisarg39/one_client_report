/**
 * Message List Component
 *
 * Scrollable container for messages
 * Auto-scrolls to bottom when new messages arrive
 */

'use client';

import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import type { Message as MessageType } from '@/types/chat';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  onQuickReply: (message: string) => void;
  accountType?: 'business' | 'education' | 'instructor';
}

export function MessageList({ messages, isTyping, onQuickReply, accountType }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Use setTimeout to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: messages.length <= 2 ? 'auto' : 'smooth'
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, isTyping]);

  // Show empty state if no messages
  if (messages.length === 0 && !isTyping) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState onQuickReply={onQuickReply} accountType={accountType} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="log"
      aria-label="Chat messages"
      className="h-full overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#6CA3A2 transparent',
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Messages */}
        {messages.map((message, index) => (
          <Message
            key={`${message.timestamp}-${index}`}
            message={message}
            index={index}
            onQuickReply={onQuickReply}
            isTyping={isTyping}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex pt-2">
            <TypingIndicator />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-4 w-full" />
      </div>
    </div>
  );
}
