/**
 * Progress Bar Component
 *
 * Inline metric visualization with animation
 * Features: Animated fill, configurable colors, optional percentage label
 */

'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = '#6CA3A2',
  showPercentage = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Bar Container */}
      <div className="flex-1 h-1.5 bg-[#0d0d0d] rounded-full overflow-hidden border border-white/5 shadow-neu-inset">
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, #fff2)`,
            boxShadow: `0 0 10px ${color}30`,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
        </motion.div>
      </div>

      {/* Percentage Label */}
      {showPercentage && (
        <span
          className="text-[10px] font-black text-[#555] italic min-w-[2rem] text-right tracking-tighter"
        >
          {percentage}%
        </span>
      )}
    </div>
  );
}
