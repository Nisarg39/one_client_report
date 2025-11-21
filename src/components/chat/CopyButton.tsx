/**
 * Copy Button Component
 *
 * Button to copy code block content to clipboard
 * Displays success feedback when copied
 */

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyButtonProps {
  content: string;
}

export function CopyButton({ content }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 hover:border-gray-600 rounded-md transition-all duration-200"
      aria-label={isCopied ? 'Copied!' : 'Copy code'}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-[#6CA3A2]" />
            <span className="text-[#6CA3A2]">Copied!</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
