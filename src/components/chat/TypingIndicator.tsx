/**
 * Typing Indicator Component
 *
 * Animated "OneAssist is typing..." indicator
 * Shows when AI is generating a response
 */

'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] rounded-2xl w-fit">
      {/* Bot name */}
      <span className="text-sm text-gray-400">OneAssist is typing</span>

      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-[#6CA3A2] rounded-full"
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
