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
    <div className="flex items-center gap-4 px-6 py-3.5 bg-[#1a1a1a] rounded-2xl shadow-neu-raised border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6CA3A2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Bot name */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#999999]">OneAssist is analyzing</span>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5 relative z-10">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-1.5 h-1.5 bg-[#6CA3A2] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
