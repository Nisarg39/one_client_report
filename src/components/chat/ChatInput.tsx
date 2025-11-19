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
    <div className="border-t border-gray-800 bg-[#1a1a1a] p-4">
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-[#2a2a2a] text-white placeholder-gray-500 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
          />

          {/* Character count (optional, shows when > 1900 chars) */}
          {message.length > 1900 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
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
              ? 'bg-[#FF8C42] hover:bg-[#ff9d5c] cursor-pointer'
              : 'bg-gray-700 cursor-not-allowed opacity-50'
          }`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-2 px-1">
        Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd> to send,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
