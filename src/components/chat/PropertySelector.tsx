/**
 * Property Selector Component
 *
 * Allows users to select which Google Analytics property to view
 * Only appears when multiple properties are available
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Property {
  propertyId: string;
  propertyName: string;
}

interface PropertySelectorProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelect: (propertyId: string) => void;
}

export function PropertySelector({
  properties,
  selectedPropertyId,
  onSelect,
}: PropertySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Don't show selector if 0 or 1 property
  if (!properties || properties.length <= 1) {
    return null;
  }

  // Find selected property, fallback to first if invalid
  const selectedProperty =
    properties.find((p) => p.propertyId === selectedPropertyId) || properties[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (propertyId: string) => {
    onSelect(propertyId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <h3
        className="text-xs font-medium text-[#999] uppercase tracking-wider px-1 mb-2"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        Property
      </h3>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isOpen
            ? 'bg-[#1a1a1a] text-[#e0e0e0] shadow-[inset_-3px_-3px_8px_rgba(60,60,60,0.4),inset_3px_3px_8px_rgba(0,0,0,0.8)] border-b-2 border-[#6CA3A2]'
            : 'bg-[#1a1a1a] text-[#e0e0e0] shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)]'
        }`}
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        aria-label="Select property"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selectedProperty.propertyName}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#999] transition-transform flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
          {properties.map((property) => {
            const isSelected = selectedPropertyId === property.propertyId;
            return (
              <button
                key={property.propertyId}
                onClick={() => handleSelect(property.propertyId)}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  isSelected
                    ? 'bg-[#252525] text-[#6CA3A2]'
                    : 'text-[#c0c0c0] hover:bg-[#252525] hover:text-[#e0e0e0]'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                role="option"
                aria-selected={isSelected}
              >
                {property.propertyName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

