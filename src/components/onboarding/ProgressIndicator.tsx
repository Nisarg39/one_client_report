/**
 * Progress Indicator Component
 * Shows step progress with dots and labels
 */

'use client';

import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels = ['Welcome', 'Account Type', 'Create Client', 'Connect Platforms', 'Tour'],
}: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step info */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[#c0c0c0]">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm text-[#999]">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </p>
      </div>

      {/* Step dots with connecting line */}
      <div className="relative flex items-start justify-between">
        {/* Line container - positioned at circle center (16px from top for w-8 h-8 circle) */}
        <div className="absolute top-[14px] left-4 right-4 h-1">
          {/* Background line */}
          <div className="absolute inset-0 rounded-full bg-[#1a1a1a] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.3)]" />

          {/* Progress fill line - aligned with dots */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
            }}
          />
        </div>

        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const label = stepLabels[index];

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              {/* Dot */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-xs transition-all ${
                  isCompleted
                    ? 'bg-[#6CA3A2] text-white shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)]'
                    : isCurrent
                    ? 'bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] text-white shadow-[-6px_-6px_12px_rgba(70,70,70,0.4),6px_6px_12px_rgba(0,0,0,0.7)]'
                    : 'bg-[#1a1a1a] text-[#666] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>

              {/* Label - hidden on mobile */}
              <span
                className={`hidden sm:block text-xs text-center max-w-[80px] ${
                  isCurrent
                    ? 'text-[#6CA3A2] font-medium'
                    : 'text-[#666]'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
