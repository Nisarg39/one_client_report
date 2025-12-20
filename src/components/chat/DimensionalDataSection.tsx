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
    <div className="rounded-2xl bg-[#151515] shadow-neu-inset border border-white/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#151515] transition-all group"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-[#6CA3A2] opacity-40 group-hover:opacity-100 transition-opacity">
              {icon}
            </div>
          )}
          <h3
            className="text-[11px] font-black text-[#888] group-hover:text-white uppercase tracking-[0.2em] italic transition-colors"
          >
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'anticipate' }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isExpanded ? 'text-[#6CA3A2]' : 'text-[#444]'}`} />
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
