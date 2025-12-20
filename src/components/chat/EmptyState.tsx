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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 relative"
      >
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#6CA3A2]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="w-20 h-20 bg-[#1a1a1a] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-neu-raised border border-white/5 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6CA3A2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {isEducationMode ? (
            <GraduationCap className="w-10 h-10 text-[#6CA3A2] relative z-10" />
          ) : (
            <MessageCircle className="w-10 h-10 text-[#6CA3A2] relative z-10" />
          )}
        </div>
        <h2 className="text-4xl font-black text-[#f5f5f5] mb-4 uppercase tracking-tighter italic">
          {isEducationMode ? (
            <>OneAssist <span className="text-[#6CA3A2]">Learning</span></>
          ) : (
            <>OneAssist <span className="text-[#6CA3A2]">Nexus</span></>
          )}
        </h2>
        <p className="text-[#999999] max-w-lg mx-auto text-lg font-medium leading-relaxed opacity-80">
          {isEducationMode
            ? 'Your Data Mentor is active. Initiate interactive simulations to master the architecture of marketing intelligence.'
            : 'Your neural bridge to marketing data is online. Ask anything about your analytics ecosystems.'}
        </p>
      </motion.div>

      {/* Quick Reply Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {quickReplies.map((reply, index) => {
          const Icon = reply.icon;
          return (
            <motion.button
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              onClick={() => onQuickReply(reply.prompt)}
              className="flex items-center gap-4 p-5 bg-[#1a1a1a] rounded-3xl transition-all text-left group shadow-neu-raised border border-white/5 hover:border-[#6CA3A2]/30 active:shadow-neu-inset"
            >
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-2xl flex items-center justify-center group-hover:shadow-neu-inset transition-all shadow-neu-inset border border-white/5 shrink-0">
                <Icon className="w-6 h-6 text-[#6CA3A2]" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black uppercase tracking-widest text-[#f5f5f5] mb-1">
                  {reply.label}
                </div>
                <div className="text-[11px] font-bold text-[#666666] line-clamp-1 group-hover:text-[#999999] transition-colors">
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
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444444] mt-12 text-center max-w-md flex items-center gap-3 justify-center"
      >
        <Lightbulb className="w-4 h-4 text-[#6CA3A2]" />
        <span>
          {isEducationMode
            ? 'System Tip: Master the frameworks through hands-on practice.'
            : 'System Tip: Bridge your data channels in Settings → Platforms.'}
        </span>
      </motion.p>

    </div>
  );
}
