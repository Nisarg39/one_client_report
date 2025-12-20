"use client";

import { motion } from "framer-motion";
import { Plug, FileText, Sparkles, Send } from "lucide-react";

export function SolutionOverview() {
  const steps = [
    {
      icon: FileText,
      title: "Create Your First Client",
      description: "Add your client details and workspace. Students get practice clients with mock data. Professionals can connect real platforms.",
      time: "60s"
    },
    {
      icon: Plug,
      title: "Connect Your Platforms",
      description: "One-click OAuth for Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads. No API keys, no technical setup required.",
      time: "30s"
    },
    {
      icon: Sparkles,
      title: "Chat With Your AI Assistant",
      description: "Ask questions about your data in plain English. Our AI analyzes metrics and provides actionable insights instantly.",
      time: "0.1s"
    },
    {
      icon: Send,
      title: "Export & Share Insights",
      description: "Download analysis as JSON, share insights with your team, or present data directly from the chat interface.",
      time: "2s"
    },
  ];

  return (
    <section id="integrations" className="relative bg-[#1a1a1a] py-20 sm:py-32 overflow-hidden">
      {/* Structural Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-white" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-white" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Simplified Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#f5f5f5] uppercase tracking-tighter leading-[0.9] mb-4">
              5 Minutes <span className="text-[#6CA3A2] italic">Total</span> <br />
              <span className="text-[#444] text-[0.6em] tracking-normal not-italic block mt-4">vs 5 Hours Manual Compilation</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-right hidden lg:block"
          >
            <div className="inline-block px-8 py-6 rounded-3xl bg-[#1a1a1a] border border-white/5 shadow-neu-raised">
              <div className="text-6xl font-black text-[#6CA3A2] italic tracking-tighter leading-none">98.3%</div>
              <div className="text-[11px] font-bold text-[#666] uppercase tracking-[0.2em] mt-2">Efficiency Gain</div>
            </div>
          </motion.div>
        </div>

        {/* The Sequence Protocol */}
        <div className="relative">
          {/* Central Data Stream Line */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative lg:px-8 group"
              >
                {/* Visual Anchor */}
                <div className="hidden lg:block absolute top-[56px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1a1a1a] border border-white/20 z-20 group-hover:scale-150 group-hover:bg-[#6CA3A2] group-hover:border-[#6CA3A2] transition-all duration-300" />

                <div className="relative pt-12 lg:pt-20">
                  {/* Vertical Connection Line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 lg:h-20 bg-gradient-to-b from-transparent to-white/10" />

                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 flex items-center justify-center group-hover:shadow-neu-inset transition-all duration-300">
                        <step.icon className="w-5 h-5 text-[#6CA3A2]" />
                      </div>
                      <h3 className="text-lg font-black text-[#f5f5f5] uppercase tracking-tighter italic">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-sm text-[#888] leading-relaxed font-medium mb-8 max-w-[200px] mx-auto lg:mx-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      {step.description}
                    </p>

                    <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                      <span className="text-3xl font-black text-[#f5f5f5] italic tracking-tighter">
                        {step.time}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6CA3A2]/60">
                        Process
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtle Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#6CA3A2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
