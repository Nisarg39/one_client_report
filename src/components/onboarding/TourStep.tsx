/**
 * Tour Step Component
 * Step 4: Quick feature tour with tips
 */

'use client';

import { MessageSquare, RefreshCw, History, Check } from 'lucide-react';

export function TourStep() {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2
          className="text-3xl font-bold text-[#f5f5f5] mb-3"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
        >
          Quick Tour 🚀
        </h2>
        <p className="text-[#c0c0c0]">
          Here's how to get the most out of OneAssist
        </p>
      </div>

      {/* Tips */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Tip 1 */}
        <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#f5f5f5] mb-3">
                💬 Tip 1: Ask Natural Questions
              </h3>
              <p className="text-sm text-[#c0c0c0] mb-4 leading-relaxed">
                Just type your questions in plain English. OneAssist understands natural language!
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#2a2a2a]">
                  <p className="text-sm text-[#999] italic">
                    "How many visitors did I get last week?"
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#2a2a2a]">
                  <p className="text-sm text-[#999] italic">
                    "What's my Google Ads spend this month?"
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#2a2a2a]">
                  <p className="text-sm text-[#999] italic">
                    "Compare last month to this month"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#f5f5f5] mb-3">
                🔄 Tip 2: Switch Between Clients
              </h3>
              <p className="text-sm text-[#c0c0c0] leading-relaxed">
                Use the dropdown in the sidebar to switch between different clients and see their specific data.
                You can add more clients anytime from the sidebar.
              </p>
            </div>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center">
              <History className="w-6 h-6 text-[#6CA3A2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#f5f5f5] mb-3">
                📜 Tip 3: Review Conversation History
              </h3>
              <p className="text-sm text-[#c0c0c0] leading-relaxed">
                Access past conversations in the sidebar to review previous insights and recommendations.
                All your conversations are automatically saved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="max-w-3xl mx-auto">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#1a1a1a] shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] border border-[#2a2a2a] text-center">
          <h3 className="text-xl font-bold text-[#f5f5f5] mb-2">
            🎉 You're All Set!
          </h3>
          <p className="text-[#c0c0c0] leading-relaxed">
            Your OneAssist account is ready. You can start chatting, add more clients,
            and connect platforms anytime from Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
