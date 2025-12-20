"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FAQSchema } from "@/components/schema/faq-schema";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs: FAQItem[] = [
    {
      question: "How is OneReport different from Google Looker Studio?",
      answer: "Google Looker Studio is powerful but requires technical knowledge to set up dashboards and visualizations. OneReport is designed for everyone—simply ask questions about your data in plain English and get instant, analysed insights. No dashboards to build, no steep learning curve, no manual work.",
    },
    {
      question: "Can I white-label the reports with my own branding?",
      answer: "Yes! Professional and Agency plans allow you to add your agency logo, brand colors, and professional typography. Your clients see a premium, branded experience that looks like it was custom-built by your team, enhancing your perceived value as a high-end service provider.",
    },
    {
      question: "What platforms do you integrate with?",
      answer: "We focus on the four essential platforms that drive the most ROI: Google Analytics (GA4), Google Ads, Meta Ads (Facebook & Instagram), and LinkedIn Ads. We prioritize deep, high-quality AI analysis for these core channels rather than building 80+ integrations you'll never use.",
    },
    {
      question: "Is there a free version for students?",
      answer: "Absolutely. Our Student Plan is FREE forever. It includes all AI agents and features but works with pre-defined mock data scenarios. It's the perfect environment for learning marketing analytics and practicing client reporting without needing a live advertising budget.",
    },
    {
      question: "What are the limits on the Professional and Agency plans?",
      answer: "Both plans allow for unlimited campaigns across all supported platforms. Instead of charging per client, we differentiate by AI usage: Professional includes 150 AI messages/day (ideal for individuals), while Agency includes 300 messages/day and dedicated support for larger teams.",
    },
    {
      question: "Do I need technical skills or coding knowledge?",
      answer: "Not at all. If you can use a chat interface, you can use OneReport. Connect your accounts with one-click OAuth authorization, and our AI handles all the data Interpretation and insight generation. It's designed specifically for marketers who want to focus on strategy, not spreadsheet formulas.",
    },
  ];

  return (
    <section id="faq" className="relative bg-[#1a1a1a] py-16 sm:py-20 overflow-hidden">
      <FAQSchema faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a1a] shadow-neu-inset border border-white/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Intelligence Nexus V1.0</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#f5f5f5] mb-6 uppercase tracking-tighter">
            Common <span className="text-[#6CA3A2] italic">Questions</span> & <br />
            System <span className="text-[#FF8C42] italic">Protocols</span>
          </h2>
          <p className="text-[#c0c0c0] text-lg max-w-2xl font-medium opacity-70">
            Everything you need to know about the OneReport infrastructure and AI deployment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Knowledge Registry */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444] mb-6 px-4">Registry_Entries</div>
            {faqs.map((faq, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeIndex === index
                  ? 'bg-[#1a1a1a] shadow-neu-inset border border-[#6CA3A2]/20'
                  : 'hover:bg-[#1f1f1f] border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <span className={`text-[10px] font-black font-mono transition-colors ${activeIndex === index ? 'text-[#6CA3A2]' : 'text-[#444]'
                    }`}>
                    0{index + 1}
                  </span>
                  <span className={`text-sm font-black uppercase tracking-tight transition-colors ${activeIndex === index ? 'text-[#f5f5f5]' : 'text-[#666] group-hover:text-[#999]'
                    }`}>
                    {faq.question}
                  </span>
                </div>
                {activeIndex === index && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#6CA3A2]/5 to-transparent pointer-events-none"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right: Diagnostic Readout screen */}
          <div className="lg:col-span-7 sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative p-8 md:p-12 bg-[#1a1a1a] rounded-[2.5rem] shadow-neu-raised border border-white/5 overflow-hidden"
              >
                {/* Visual accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6CA3A2]/5 blur-3xl rounded-full" />
                <div className="absolute top-8 left-8 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#6CA3A2]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#444]">Query_Result // Active</span>
                </div>

                <div className="relative z-10 pt-4">
                  <h3 className="text-2xl md:text-3xl font-black text-[#f5f5f5] mb-8 uppercase tracking-tighter leading-tight italic">
                    {faqs[activeIndex].question}
                  </h3>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-[#151515] shadow-neu-inset border border-white/5 relative group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#6CA3A2]/40 rounded-full" />
                      <p className="text-base md:text-lg text-[#999999] leading-relaxed font-medium">
                        {faqs[activeIndex].answer}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                      <div className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] shadow-neu-raised border border-white/5 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#666]">Protocol Verified</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] shadow-neu-raised border border-white/5 flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#666]">ID: PX-{(activeIndex + 1024).toString(16).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Support CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-8"
            >
              <div className="text-[10px] font-bold text-[#444] uppercase tracking-widest text-center sm:text-left">
                Still have questions? <br /> Our architects are online.
              </div>
              <button
                className="px-6 py-3 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#6CA3A2] hover:shadow-neu-inset transition-all"
              >
                Open Support Channel
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Transitional Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#1a1a1a] pointer-events-none z-20" />
    </section>
  );
}
