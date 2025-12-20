"use client";

import { motion } from "framer-motion";
import { Plug, FileText, Sparkles, Send } from "lucide-react";

export function SolutionOverview() {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Create Your First Client",
      description: "Add your client details and workspace. Students get practice clients with mock data. Professionals can connect real platforms.",
      time: "60s",
      id: "PN_01",
      color: "#6CA3A2"
    },
    {
      number: 2,
      icon: Plug,
      title: "Connect Your Platforms",
      description: "One-click OAuth for Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads. No API keys, no technical setup required.",
      time: "30s",
      id: "PN_02",
      color: "#6CA3A2"
    },
    {
      number: 3,
      icon: Sparkles,
      title: "Chat With Your AI Assistant",
      description: "Ask questions about your data in plain English. Our AI analyzes metrics and provides actionable insights instantly.",
      time: "0.1s",
      id: "PN_03",
      color: "#FF8C42"
    },
    {
      number: 4,
      icon: Send,
      title: "Export & Share Insights",
      description: "Download analysis as JSON, share insights with your team, or present data directly from the chat interface.",
      time: "2s",
      id: "PN_04",
      color: "#6CA3A2"
    },
  ];

  return (
    <section className="relative bg-[#1a1a1a] py-20 sm:py-24 overflow-hidden">
      {/* Structural Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-white" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-white" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Technical Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-[1px] bg-[#6CA3A2]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666]">Throughput_Optimization_v4</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#f5f5f5] uppercase tracking-tighter leading-[0.8] mb-2">
              5 Minutes <span className="text-[#6CA3A2] italic">Total</span> <br />
              <span className="text-[#444] text-[0.65em] tracking-normal not-italic block mt-2">vs 5 Hours Manual Compilation</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-right hidden lg:block pb-2"
          >
            <div className="inline-block px-4 py-6 rounded-[2rem] bg-[#151515] border border-white/5 shadow-neu-inset">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#FF8C42] mb-1">Efficiency Delta</div>
              <div className="text-6xl font-black text-[#f5f5f5] italic tracking-tighter leading-none">98.3%</div>
              <div className="text-[9px] font-bold text-[#444] uppercase tracking-widest mt-2">Protocol Improvement</div>
            </div>
          </motion.div>
        </div>

        {/* The Sequence Protocol - Intentional UI */}
        <div className="relative">
          {/* Central Data Stream */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative lg:px-8 group"
              >
                {/* Node Anchor */}
                <div className="hidden lg:block absolute top-[56px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1a1a1a] border border-white/20 z-20 group-hover:scale-150 group-hover:bg-[#6CA3A2] group-hover:border-[#6CA3A2] transition-all duration-300" />

                {/* Step Metadata Card (Non-Generic) */}
                <div className="relative pt-16 lg:pt-20">
                  {/* Vertical Connection Line (Mobile & Desktop) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 lg:h-20 bg-gradient-to-b from-transparent to-white/10" />

                  {/* The Info Panel */}
                  <div className="relative">
                    {/* Status Label */}
                    <div className="absolute -top-12 left-0 w-full flex justify-center lg:justify-start">
                      <div className="px-3 py-1 rounded bg-[#151515] border border-white/5 shadow-neu-inset">
                        <span className="text-[9px] font-black font-mono text-[#444] tracking-widest uppercase">
                          {step.id} // SEC_{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 flex items-center justify-center group-hover:shadow-neu-inset transition-all duration-300">
                          <step.icon className="w-5 h-5 text-[#6CA3A2]" />
                        </div>
                        <h3 className="text-lg font-black text-[#f5f5f5] uppercase tracking-tighter leading-none italic">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-xs text-[#999] leading-relaxed font-medium mb-8 max-w-xs mx-auto lg:mx-0 opacity-60 group-hover:opacity-100 transition-opacity">
                        {step.description}
                      </p>

                      {/* Diagnostic Time Readout */}
                      <div className="flex items-end gap-3 justify-center lg:justify-start">
                        <div className="text-3xl font-black text-[#f5f5f5] italic tracking-tighter leading-none">
                          {step.time}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#FF8C42] mb-1">
                          Latency
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Visual Accent */}
                <div className="absolute inset-0 bg-gradient-radial from-[#6CA3A2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global System Status Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32 p-1 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#444]">
                  {i}x
                </div>
              ))}
            </div>
            <div className="text-[9px] font-bold text-[#444] uppercase tracking-[0.2em]">
              Cross-Platform Synchronization Active
            </div>
          </div>

          <div className="px-6 py-2 rounded-lg bg-[#151515] border border-white/5 shadow-neu-inset">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#6CA3A2]">Protocol verified // v2.5.0-STABLE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
