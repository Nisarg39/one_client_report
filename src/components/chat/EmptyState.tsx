/**
 * Empty State Component
 *
 * Welcome screen shown when there are no messages
 * Includes quick reply buttons for suggested prompts
 */

'use client';

import { MessageCircle, TrendingUp, DollarSign, Users, Lightbulb, GraduationCap, BookOpen, BarChart3, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onQuickReply: (message: string) => void;
  accountType?: 'business' | 'education' | 'instructor';
}

const BUSINESS_QUICK_REPLIES = [
  {
    id: 'traffic-agent',
    icon: Users,
    label: '🚦 Traffic Intelligence',
    prompt: 'Analyze my website traffic quality',
  },
  {
    id: 'ad-agent',
    icon: DollarSign,
    label: '💰 Ad Performance',
    prompt: 'Audit my cross-channel ad performance',
  },
  {
    id: 'budget-agent',
    icon: TrendingUp,
    label: '📊 Budget Optimization',
    prompt: 'Find wasted ad spend',
  },
  {
    id: 'conversion-agent',
    icon: MessageCircle,
    label: '🎯 Conversion Funnel',
    prompt: 'Where am I losing conversions?',
  },
];

const EDUCATION_QUICK_REPLIES = [
  {
    id: 'traffic-analysis',
    icon: BarChart3,
    label: '📊 Traffic Analysis',
    prompt: 'Help me understand what metrics I should look at to analyze website traffic',
  },
  {
    id: 'ad-performance',
    icon: Target,
    label: '🎯 Ad Performance',
    prompt: 'Guide me through analyzing ad performance across different channels',
  },
  {
    id: 'conversion-funnel',
    icon: TrendingUp,
    label: '📈 Conversion Funnel',
    prompt: 'Teach me how to identify where conversions are being lost',
  },
  {
    id: 'data-interpretation',
    icon: BookOpen,
    label: '📚 Data Interpretation',
    prompt: 'How do I interpret the relationship between different marketing metrics?',
  },
];

export function EmptyState({ onQuickReply, accountType = 'business' }: EmptyStateProps) {
  const isEducationMode = accountType === 'education' || accountType === 'instructor';
  const quickReplies = isEducationMode ? EDUCATION_QUICK_REPLIES : BUSINESS_QUICK_REPLIES;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-[#6CA3A2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)]">
          {isEducationMode ? (
            <GraduationCap className="w-8 h-8 text-white" />
          ) : (
            <MessageCircle className="w-8 h-8 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {isEducationMode ? 'Welcome to OneAssist Learning' : 'Welcome to OneAssist'}
        </h2>
        <p className="text-gray-400 max-w-md">
          {isEducationMode
            ? 'Your Data Mentor is here to guide you. Ask questions and learn how to analyze marketing data through hands-on practice with simulated case studies.'
            : 'Your AI-powered marketing analytics assistant. Ask me anything about your Google Analytics, Ads, Meta, or LinkedIn data.'}
        </p>
      </motion.div>

      {/* Quick Reply Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {quickReplies.map((reply, index) => {
          const Icon = reply.icon;
          return (
            <motion.button
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onQuickReply(reply.prompt)}
              className="flex items-center gap-3 p-4 bg-[#1a1a1a] hover:bg-[#252525] rounded-2xl transition-all text-left group shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]"
            >
              <div className="w-10 h-10 bg-[#6CA3A2] rounded-lg flex items-center justify-center group-hover:opacity-90 transition-all shadow-[-2px_-2px_6px_rgba(60,60,60,0.3),2px_2px_6px_rgba(0,0,0,0.6)]">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
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
          {isEducationMode
            ? 'Tip: Practice with different case study scenarios to master marketing data analysis. Your Data Mentor will guide you through each step.'
            : 'Tip: Connect your marketing platforms in Settings → Platforms to get real insights about your data.'}
        </span>
      </motion.p>
    </div>
  );
}
