"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PlatformIcon } from "./PlatformIcon";
import { AVAILABLE_PLATFORMS } from "@/data/mockDemoData";
import type { PlatformType, Client } from "@/types/demo";

interface PlatformSelectorProps {
  currentClient: Client;
  selectedPlatforms: Set<PlatformType>;
  onTogglePlatform: (platformId: PlatformType) => void;
}

export function PlatformSelector({
  currentClient,
  selectedPlatforms,
  onTogglePlatform,
}: PlatformSelectorProps) {
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);

  // Get available platforms for this client
  const clientPlatformIds = new Set(currentClient.platforms.map((p) => p.id));

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
      <h3
        className="text-base font-bold text-[#f5f5f5] mb-4"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
      >
        Connected Platforms
      </h3>

      {/* Connected Platform Icons */}
      <div className="flex items-center gap-3 mb-4">
        {currentClient.platforms
          .filter((p) => selectedPlatforms.has(p.id))
          .map((platform) => (
            <div
              key={platform.id}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)] hover:shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
              title={platform.name}
            >
              <PlatformIcon platformType={platform.iconType} className="w-5 h-5" />
            </div>
          ))}
      </div>

      {/* Platform Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] font-medium shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all"
        >
          <span className="text-sm">
            {selectedPlatforms.size === 1
              ? "Select more platforms"
              : `${selectedPlatforms.size} platforms selected`}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isPlatformDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isPlatformDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#1a1a1a] shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] border border-[#2a2a2a] z-10 space-y-1">
            {AVAILABLE_PLATFORMS.filter((p) => clientPlatformIds.has(p.id)).map(
              (platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    onTogglePlatform(platform.id);
                  }}
                  disabled={selectedPlatforms.has(platform.id) && selectedPlatforms.size === 1}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    selectedPlatforms.has(platform.id)
                      ? "bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#6CA3A2]"
                      : "bg-[#1a1a1a] shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] hover:shadow-[-3px_-3px_6px_rgba(70,70,70,0.3),3px_3px_6px_rgba(0,0,0,0.6)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]"
                  } ${selectedPlatforms.has(platform.id) && selectedPlatforms.size === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <PlatformIcon platformType={platform.id} className="w-5 h-5" />
                    <span className="text-sm text-[#f5f5f5] font-medium">
                      {platform.name}
                    </span>
                  </div>
                  {selectedPlatforms.has(platform.id) && (
                    <Check className="w-4 h-4 text-[#6CA3A2]" />
                  )}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
        <p className="text-xs text-[#999] leading-relaxed">
          <span className="font-semibold text-[#6CA3A2]">
            {selectedPlatforms.size}
          </span>{" "}
          platform{selectedPlatforms.size !== 1 ? "s" : ""} connected • Data aggregated
          automatically
        </p>
      </div>
    </div>
  );
}
