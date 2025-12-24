/**
 * Campaign Selector Component
 *
 * Allows users to select an individual Meta Ads campaign to view specific metrics
 * Reuses the styling from PropertySelector.tsx
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, BarChart2 } from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
}

interface CampaignSelectorProps {
    campaigns: Campaign[];
    selectedCampaignId: string | null;
    onSelect: (campaignId: string | null) => void;
    color?: string;
    label?: string;
}

export function CampaignSelector({
    campaigns,
    selectedCampaignId,
    onSelect,
    color = '#ff3b30', // Default to red
    label,
}: CampaignSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Don't show selector if 0 campaigns
    if (!campaigns || campaigns.length === 0) {
        return null;
    }

    // Find selected campaign, default to "All Campaigns"
    const selectedCampaignName = selectedCampaignId
        ? campaigns.find((c) => c.id === selectedCampaignId)?.name || 'Unknown Campaign'
        : 'All Campaigns (Cumulative)';

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

    const handleSelect = (campaignId: string | null) => {
        onSelect(campaignId);
        setIsOpen(false);
    };

    return (
        <div className="relative mt-4" ref={dropdownRef}>
            <h3
                className="text-[10px] font-black text-[#555] uppercase tracking-[0.3em] italic px-1 mb-2"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
                {label || 'Campaign Filter'}
            </h3>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isOpen
                    ? 'bg-[#1a1a1a] text-[#e0e0e0] shadow-[inset_-3px_-3px_8px_rgba(60,60,60,0.4),inset_3px_3px_8px_rgba(0,0,0,0.8)] border-b-2'
                    : 'bg-[#1a1a1a] text-[#e0e0e0] shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)]'
                    }`}
                style={isOpen ? { borderBottomColor: color } : {}}
                aria-label="Select campaign"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2 truncate">
                    <BarChart2 className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    <span className="truncate">{selectedCampaignName}</span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-[#999] transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar">
                    <button
                        onClick={() => handleSelect(null)}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors first:rounded-t-xl ${!selectedCampaignId
                            ? 'bg-[#252525]'
                            : 'text-[#c0c0c0] hover:bg-[#252525] hover:text-[#e0e0e0]'
                            }`}
                        style={!selectedCampaignId ? { color } : {}}
                    >
                        All Campaigns (Cumulative)
                    </button>
                    {campaigns.map((campaign) => {
                        const isSelected = selectedCampaignId === campaign.id;
                        return (
                            <button
                                key={campaign.id}
                                onClick={() => handleSelect(campaign.id)}
                                className={`w-full text-left px-3 py-2.5 text-sm transition-colors last:rounded-b-xl ${isSelected
                                    ? 'bg-[#252525]'
                                    : 'text-[#c0c0c0] hover:bg-[#252525] hover:text-[#e0e0e0]'
                                    }`}
                                style={isSelected ? { color } : {}}
                            >
                                {campaign.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
