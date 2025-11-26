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
  stepLabels = ['Welcome', 'Create Client', 'Connect Platforms', 'Tour'],
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

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const label = stepLabels[index];

          return (
            <div key={step} className="flex flex-col items-center gap-2">
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
