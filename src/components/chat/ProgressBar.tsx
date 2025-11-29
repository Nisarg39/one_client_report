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
      <div className="flex-1 h-2 bg-[#0f0f0f] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]">
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>

      {/* Percentage Label */}
      {showPercentage && (
        <span
          className="text-xs font-medium text-[#999] min-w-[3rem] text-right"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {percentage}%
        </span>
      )}
    </div>
  );
}
