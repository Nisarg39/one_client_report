"use client";

import { Calendar, Sparkles } from "lucide-react";
import { MOCK_CLIENTS } from "@/data/mockDemoData";

interface ClientSelectorProps {
  selectedClientId: string;
  onClientChange: (clientId: string) => void;
  isGenerating: boolean;
  onGenerateReport: () => void;
}

export function ClientSelector({
  selectedClientId,
  onClientChange,
  isGenerating,
  onGenerateReport,
}: ClientSelectorProps) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
      <h2
        className="text-lg font-bold text-[#f5f5f5] mb-4 flex items-center gap-2"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
      >
        <Sparkles className="w-5 h-5 text-[#6CA3A2]" />
        Demo Controls
      </h2>

      <div className="mb-5">
        <label
          htmlFor="client-selector"
          className="block text-sm font-medium text-[#c0c0c0] mb-2"
        >
          Select Client
        </label>
        <select
          id="client-selector"
          value={selectedClientId}
          onChange={(e) => onClientChange(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-none shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all outline-none cursor-pointer"
        >
          {MOCK_CLIENTS.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.industry})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-[#c0c0c0] mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Date Range
        </label>
        <div className="px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-none shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)]">
          Oct 1-31, 2024
        </div>
      </div>

      <button
        onClick={onGenerateReport}
        disabled={isGenerating}
        className="w-full relative overflow-hidden px-6 py-3 rounded-2xl font-semibold group bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(108,163,162,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] active:shadow-[inset_8px_8px_16px_rgba(90,148,147,0.7),inset_-8px_-8px_16px_rgba(108,163,162,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      >
        <span className="relative flex items-center justify-center">
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </span>
      </button>
    </div>
  );
}
