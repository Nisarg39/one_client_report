/**
 * Conversation Search Bar Component
 * Search input with debounce for finding conversations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export interface ConversationSearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  placeholder?: string;
}

export function ConversationSearchBar({
  onSearch,
  onClear,
  isSearching = false,
  placeholder = 'Search conversations...',
}: ConversationSearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      onSearch(debouncedQuery.trim());
    } else if (debouncedQuery === '' && query === '') {
      onClear();
    }
  }, [debouncedQuery, onSearch, onClear, query]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    onClear();
  }, [onClear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 pointer-events-none">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-[#808080] animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-[#808080]" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 text-sm text-[#f5f5f5] placeholder-[#808080] bg-[#1a1a1a] rounded-2xl border-2 border-transparent outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.2)] focus:border-[#6CA3A2] focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.2)] transition-all duration-200"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 p-1 rounded-md hover:bg-[#252525] transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4 text-[#808080] hover:text-[#c0c0c0]" />
          </button>
        )}
      </div>

      {/* Search hint */}
      {query.length > 0 && query.length < 2 && (
        <p
          className="absolute top-full left-0 mt-1 text-[10px] text-[#808080]"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}
