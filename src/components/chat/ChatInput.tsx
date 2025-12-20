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
    <div className="p-6 bg-[#1a1a1a] relative z-20">
      {/* Input container with floating effect */}
      <div className="max-w-4xl mx-auto flex items-end gap-4 p-2 bg-[#1a1a1a] rounded-[2rem] shadow-neu-raised border border-white/5">
        {/* Textarea */}
        <div className="flex-1 relative pl-2">
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
            className="w-full px-5 py-2.5 bg-[#1a1a1a] text-[#f5f5f5] placeholder-[#666666] rounded-2xl resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-neu-inset transition-shadow border border-white/5"
            style={{
              minHeight: '48px',
              maxHeight: '160px',
            }}
          />

          {/* Character count */}
          {message.length > 1900 && (
            <div
              className="absolute bottom-4 right-4 text-[10px] font-bold text-[#6CA3A2] uppercase tracking-widest"
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
          whileHover={canSend ? { scale: 1.02, translateY: -2 } : {}}
          whileTap={canSend ? { scale: 0.98 } : {}}
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${canSend
            ? 'bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised cursor-pointer border-t border-white/20'
            : 'bg-[#1a1a1a] shadow-neu-inset text-[#444444] cursor-not-allowed opacity-50 border border-white/5'
            }`}
          aria-label="Send message"
        >
          <Send className={`w-5 h-5 ${canSend ? 'text-white' : 'text-[#444444]'}`} />
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
