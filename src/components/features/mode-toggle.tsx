"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";

type Mode = "education" | "professional";

interface ModeToggleProps {
  activeMode?: Mode;
  onModeChange?: (mode: Mode) => void;
}

export function ModeToggle({ activeMode = "education", onModeChange }: ModeToggleProps) {
  const handleModeChange = (mode: Mode) => {
    onModeChange?.(mode);
  };

  return (
    <div className="flex items-center justify-center mb-12 sm:mb-16">
      <div className="relative inline-flex p-1.5 rounded-2xl bg-[#151515] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(40,40,40,0.3)]">
        {/* Animated background */}
        <motion.div
          layout
          className="absolute inset-1 rounded-xl"
          style={{
            background: activeMode === "education" 
              ? "linear-gradient(to right, #FF8C42, #E67A33)"
              : "linear-gradient(to right, #6CA3A2, #5a9493)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {/* Buttons */}
        <button
          onClick={() => handleModeChange("education")}
          className={`relative z-10 flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 ${
            activeMode === "education"
              ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              : "text-[#e5e5e5] hover:text-white"
          }`}
          style={{
            textShadow: activeMode === "education" 
              ? '0 2px 4px rgba(0,0,0,0.3)' 
              : '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          <GraduationCap 
            className={`w-5 h-5 transition-all duration-300 ${
              activeMode === "education" ? "opacity-100" : "opacity-80"
            }`}
            aria-hidden="true" 
          />
          <span className="text-sm sm:text-base">Education Mode</span>
        </button>
        
        <button
          onClick={() => handleModeChange("professional")}
          className={`relative z-10 flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 ${
            activeMode === "professional"
              ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              : "text-[#e5e5e5] hover:text-white"
          }`}
          style={{
            textShadow: activeMode === "professional" 
              ? '0 2px 4px rgba(0,0,0,0.3)' 
              : '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          <Briefcase 
            className={`w-5 h-5 transition-all duration-300 ${
              activeMode === "professional" ? "opacity-100" : "opacity-80"
            }`}
            aria-hidden="true" 
          />
          <span className="text-sm sm:text-base">Professional Mode</span>
        </button>
      </div>
    </div>
  );
}
