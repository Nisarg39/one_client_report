/**
 * Onboarding Layout Component
 * Centered layout wrapper for onboarding steps
 */

'use client';

import { ProgressIndicator } from './ProgressIndicator';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  isLoading?: boolean;
}

export function OnboardingLayout({
  currentStep,
  totalSteps,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
  nextDisabled = false,
  showBack = true,
  isLoading = false,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-2xl font-bold text-[#f5f5f5]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            <span className="text-[#6CA3A2]">One</span>Report
          </h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a1a] p-8 md:p-12 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-[#2a2a2a] bg-[#1a1a1a] px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          {showBack && currentStep > 1 ? (
            <button
              onClick={onBack}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl font-medium text-[#c0c0c0] bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div /> // Empty div for flex spacing
          )}

          {/* Next Button */}
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled || isLoading}
              className="relative overflow-hidden px-8 py-3 rounded-2xl font-semibold group bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(108,163,162,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] active:shadow-[inset_8px_8px_16px_rgba(90,148,147,0.7),inset_-8px_-8px_16px_rgba(108,163,162,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              <span className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {nextLabel}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
