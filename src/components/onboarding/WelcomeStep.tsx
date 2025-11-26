/**
 * Welcome Step Component
 * Step 1: Welcome screen explaining OneAssist capabilities
 */

'use client';

import { Sparkles, MessageSquare, BarChart3, Zap, TrendingUp } from 'lucide-react';

interface WelcomeStepProps {
  userName?: string;
}

export function WelcomeStep({ userName }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-8">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-4"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
        >
          Welcome to OneAssist{userName ? `, ${userName}` : ''}! 🎉
        </h2>
        <p className="text-lg text-[#c0c0c0] max-w-2xl mx-auto leading-relaxed">
          Your AI-powered marketing analytics assistant
        </p>
      </div>

      {/* Value Propositions */}
      <div className="space-y-4 text-left max-w-2xl mx-auto pt-6">
        <h3 className="text-xl font-semibold text-[#f5f5f5] mb-6 text-center">
          What can OneAssist do?
        </h3>

        <div className="space-y-4">
          {/* Feature 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[#f5f5f5] mb-1">
                Answer questions in plain English
              </h4>
              <p className="text-sm text-[#999] leading-relaxed">
                Just ask naturally, like "How many visitors did I get last week?" or "What's my Google Ads spend this month?"
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[#f5f5f5] mb-1">
                Track performance across multiple platforms
              </h4>
              <p className="text-sm text-[#999] leading-relaxed">
                Connect Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads all in one place
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[#f5f5f5] mb-1">
                Get AI-powered insights and recommendations
              </h4>
              <p className="text-sm text-[#999] leading-relaxed">
                Receive actionable insights based on your marketing data and industry best practices
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[#f5f5f5] mb-1">
                Generate reports instantly
              </h4>
              <p className="text-sm text-[#999] leading-relaxed">
                Create comprehensive marketing reports and summaries in seconds
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6">
        <p className="text-base text-[#c0c0c0]">
          Ready to get started? Let's set up your first client!
        </p>
      </div>
    </div>
  );
}
