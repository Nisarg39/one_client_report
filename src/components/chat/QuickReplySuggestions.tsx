/**
 * Quick Reply Suggestions Component
 *
 * Displays clickable suggestion chips below AI messages
 * to help users discover what they can ask
 */

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { QuickReplySuggestion } from '@/types/chat';

interface QuickReplySuggestionsProps {
  suggestions: QuickReplySuggestion[];
  onSuggestionClick: (suggestion: QuickReplySuggestion) => void;
  disabled?: boolean;
}

export function QuickReplySuggestions({
  suggestions,
  onSuggestionClick,
  disabled = false,
}: QuickReplySuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {/* Label */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 w-full">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Quick replies</span>
      </div>

      {/* Suggestion Chips */}
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 * index }}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          onClick={() => !disabled && onSuggestionClick(suggestion)}
          disabled={disabled}
          className={`
            px-4 py-2.5
            text-xs font-medium
            rounded-xl
            bg-[#1a1a1a]
            text-left
            transition-all duration-200
            ${
              disabled
                ? 'opacity-50 cursor-not-allowed text-gray-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.2)]'
                : 'text-[#c0c0c0] cursor-pointer shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:shadow-[-2px_-2px_8px_rgba(60,60,60,0.4),2px_2px_8px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]'
            }
          `}
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          aria-label={`Quick reply: ${suggestion.text}`}
        >
          {suggestion.text}
        </motion.button>
      ))}
    </motion.div>
  );
}
