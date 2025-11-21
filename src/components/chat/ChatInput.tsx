/**
 * Chat Input Component
 *
 * Textarea with send button for user messages
 * Supports Enter to send, Shift+Enter for new line
 */

'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Ask me about your marketing data...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle send
  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Enter key (send message, Shift+Enter for new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-800/50 bg-[#1a1a1a] p-4">
      <div className="flex items-end gap-3">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            name="message"
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label="Chat message"
            aria-describedby="chat-input-helper"
            className="w-full px-4 py-3 pr-12 bg-[#1a1a1a] text-[#f5f5f5] placeholder-[#c0c0c0] rounded-2xl resize-none focus:outline-none focus:shadow-[0_0_0_2px_rgba(108,163,162,0.5)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_4px_4px_12px_rgba(0,0,0,0.7),inset_-4px_-4px_12px_rgba(60,60,60,0.2)] transition-shadow"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          />

          {/* Character count (optional, shows when > 1900 chars) */}
          {message.length > 1900 && (
            <div
              className="absolute bottom-2 right-2 text-xs text-[#c0c0c0]"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              aria-live="polite"
              aria-atomic="true"
            >
              {message.length}/2000
            </div>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.05 } : {}}
          whileTap={canSend ? { scale: 0.95 } : {}}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            canSend
              ? 'bg-gradient-to-br from-[#FF8C42] to-[#E67A33] shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.2),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(179,87,28,0.6),inset_-6px_-6px_12px_rgba(255,140,66,0.2)] cursor-pointer'
              : 'bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.2)] cursor-not-allowed opacity-50'
          }`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Helper text */}
      <p
        id="chat-input-helper"
        className="text-xs text-[#c0c0c0] mt-2 px-1"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Press <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded text-[#c0c0c0] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(60,60,60,0.2)]">Enter</kbd> to send,{' '}
        <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded text-[#c0c0c0] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(60,60,60,0.2)]">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
