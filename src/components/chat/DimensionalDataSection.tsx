/**
 * Dimensional Data Section Component
 *
 * Collapsible section wrapper for dimensional analytics data
 * Features: Framer Motion animations, neumorphic design, icon support
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DimensionalDataSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function DimensionalDataSection({
  title,
  icon,
  defaultExpanded = false,
  children,
}: DimensionalDataSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-xl bg-[#1a1a1a] shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)]">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#202020] transition-colors rounded-xl"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-[#6CA3A2]">{icon}</div>}
          <h3
            className="text-sm font-medium text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[#808080]" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
