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
    <section id="faq" className="relative bg-[#1a1a1a] overflow-hidden py-24">
      <FAQSchema faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6 relative z-20 mb-8 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a1a] shadow-neu-inset border border-white/5 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Help & Support Center</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#f5f5f5] mb-6 uppercase tracking-tighter leading-tight">
            Common <span className="text-[#6CA3A2] italic">Questions</span> & <br />
            System <span className="text-[#FF8C42] italic">Protocols</span>
          </h2>
          <p className="text-[#c0c0c0] text-lg max-w-2xl font-medium opacity-70">
            Everything you need to know about the OneReport infrastructure and AI deployment.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          {/* Left: Knowledge Registry */}
          <div className="lg:col-span-5 pt-12 lg:pr-12 relative z-20">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444] mb-12 flex items-center gap-4">
              <span className="w-8 h-px bg-[#444]" />
              Browse Questions
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeIndex === index
                    ? 'bg-gradient-to-r from-[#1f1f1f] to-[#1a1a1a] border border-[#6CA3A2]/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                    : 'hover:bg-[#1f1f1f]/50 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <span className={`text-xs font-black font-mono transition-colors ${activeIndex === index ? 'text-[#6CA3A2]' : 'text-[#333]'
                      }`}>
                      0{index + 1}
                    </span>
                    <span className={`text-sm font-bold uppercase tracking-tight transition-colors ${activeIndex === index ? 'text-[#f5f5f5]' : 'text-[#666] group-hover:text-[#888]'
                      }`}>
                      {faq.question}
                    </span>
                  </div>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#6CA3A2]/10 via-transparent to-transparent pointer-events-none"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Integrated Answer Readout - Clean & Aligned */}
          <div className="lg:col-span-7 relative pt-12 flex flex-col z-10">
            <div className="w-full max-w-2xl relative flex-grow flex flex-col">
              {/* Top Section: Answer Content */}
              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="relative px-4 lg:px-0"
                  >
                    {/* Visual Status Markers */}
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px w-10 bg-[#6CA3A2]/40" />
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] shadow-[0_0_10px_#6CA3A2]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#6CA3A2]">Detailed Answer</span>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <h3 className="text-3xl md:text-5xl font-black text-[#f5f5f5] uppercase tracking-tighter leading-[1.1] italic">
                        {faqs[activeIndex].question}
                      </h3>

                      <div className="relative pl-10 py-1">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#6CA3A2] via-[#6CA3A2]/20 to-transparent rounded-full shadow-[0_0_20px_rgba(108,163,162,0.4)]" />
                        <p className="text-xl md:text-2xl text-[#c0c0c0] leading-relaxed font-medium">
                          {faqs[activeIndex].answer}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Section: Support CTA - Pushed to Absolute Bottom of Row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-10 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-8 px-4 lg:px-0"
              >
                <p className="text-[11px] font-bold text-[#444] uppercase tracking-[0.2em] text-center sm:text-left leading-relaxed">
                  Still have questions? <br />
                  <span className="text-[#6CA3A2]">Our experts are here to help you get started.</span>
                </p>
                <button
                  className="group relative px-8 py-4 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-[#6CA3A2] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#6CA3A2]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 transition-colors group-hover:text-white">Contact Support</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Transitional Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#1a1a1a] pointer-events-none z-20" />
    </section>
  );
}
