/**
 * Conversation Filters Component
 * Tab filters for All | Active | Archived conversations
 */

'use client';

import type { ConversationFilter } from '@/types/chat';

export interface ConversationFiltersProps {
  currentFilter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
  counts?: {
    all?: number;
    active?: number;
    archived?: number;
  };
}

const filters: { value: ConversationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export function ConversationFilters({
  currentFilter,
  onFilterChange,
  counts,
}: ConversationFiltersProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#1a1a1a] rounded-lg shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(60,60,60,0.2)]">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.value;
        const count = counts?.[filter.value];

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-[#6CA3A2] text-white shadow-[-2px_-2px_6px_rgba(60,60,60,0.3),2px_2px_6px_rgba(0,0,0,0.6)]'
                : 'text-[#c0c0c0] hover:text-[#f5f5f5] hover:bg-[#252525]'
            }`}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            <span>{filter.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#252525] text-[#808080]'
                }`}
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
