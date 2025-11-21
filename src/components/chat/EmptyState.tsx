/**
 * Empty State Component
 *
 * Welcome screen shown when there are no messages
 * Includes quick reply buttons for suggested prompts
 */

'use client';

import { MessageCircle, TrendingUp, DollarSign, Users, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onQuickReply: (message: string) => void;
}

const QUICK_REPLIES = [
  {
    id: 'visitors',
    icon: Users,
    label: 'Website Visitors',
    prompt: 'How many visitors did I get last week?',
  },
  {
    id: 'ads',
    icon: DollarSign,
    label: 'Ad Performance',
    prompt: 'What is my Google Ads spend this month?',
  },
  {
    id: 'trends',
    icon: TrendingUp,
    label: 'Trends & Insights',
    prompt: 'Show me my top performing campaigns',
  },
  {
    id: 'help',
    icon: MessageCircle,
    label: 'How to Use',
    prompt: 'What can you help me with?',
  },
];

export function EmptyState({ onQuickReply }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-[#6CA3A2] rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to OneAssist
        </h2>
        <p className="text-gray-400 max-w-md">
          Your AI-powered marketing analytics assistant. Ask me anything about
          your Google Analytics, Ads, Meta, or LinkedIn data.
        </p>
      </motion.div>

      {/* Quick Reply Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {QUICK_REPLIES.map((reply, index) => {
          const Icon = reply.icon;
          return (
            <motion.button
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onQuickReply(reply.prompt)}
              className="flex items-center gap-3 p-4 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-[#6CA3A2] rounded-lg flex items-center justify-center group-hover:bg-[#5a9291] transition-colors">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {reply.label}
                </div>
                <div className="text-xs text-gray-500 line-clamp-1">
                  {reply.prompt}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-xs text-gray-500 mt-8 text-center max-w-md flex items-start gap-2 justify-center"
      >
        <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          Tip: Connect your marketing platforms in Settings → Integrations to
          get real insights about your data.
        </span>
      </motion.p>
    </div>
  );
}
