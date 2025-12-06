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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Show empty state if no messages
  if (messages.length === 0 && !isTyping) {
    return <EmptyState onQuickReply={onQuickReply} accountType={accountType} />;
  }

  return (
    <div
      ref={containerRef}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-atomic="false"
      className="h-full overflow-y-auto px-4 py-6 space-y-4"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#6CA3A2 #1a1a1a',
      }}
    >
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
        <div className="flex">
          <TypingIndicator />
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
