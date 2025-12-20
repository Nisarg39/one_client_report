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
      answer: "Google Looker Studio is powerful but requires technical knowledge to set up dashboards, connect data sources, and create visualizations. OneReport is an AI-powered chatbot - simply ask questions about your data in plain English and get instant, professionally analysed insights. No dashboards to build, no learning curve, no manual work.",
    },
    {
      question: "Can I export the insights and data?",
      answer: "Yes! You can export your AI-generated insights and data analysis as JSON. This allows you to integrate the insights into your own reports, presentations, or share them with your team and clients in any format you prefer.",
    },
    {
      question: "What platforms do you integrate with?",
      answer: "Currently, we integrate with the 4 most-used marketing platforms: Google Analytics, Google Ads, Meta Ads (Facebook & Instagram), and LinkedIn Ads. We're adding Twitter (X), TikTok, Pinterest, and YouTube in Q1 2026. Unlike competitors with 80+ integrations you'll never use, we focus on what freelancers and small agencies actually need.",
    },
    {
      question: "Do I need technical skills or coding knowledge?",
      answer: "Not at all. If you can use WhatsApp, you can use OneReport. Connect your accounts with one-click OAuth authorization (no API keys), create a client workspace, and start chatting. Just ask questions in plain English and our AI handles all the data analysis and insight generation instantly.",
    },
    {
      question: "What if I have more than 10 clients?",
      answer: "Choose a plan that matches your needs. Our Student plan is FREE forever with 5 clients (perfect for learning). Professional includes 10 clients with real APIs (₹299/mo). Agency includes 25 clients (₹999/mo). Enterprise offers unlimited clients and messages (custom pricing). Upgrade or downgrade anytime.",
    },
    {
      question: "How is this so much cheaper than other reporting tools?",
      answer: "We focus on what freelancers and small agencies actually need (4 key platforms, AI-powered chatbot interface, real-time analytics) instead of building 80+ integrations that create feature bloat. Traditional platforms charge ₹1,000-1,650 per client, while our plans are just ₹299/month for 10 clients or ₹999/month for 25 clients. This allows us to offer premium quality at 96-98% lower cost.",
    },
  ];

  return (
    <section className="relative bg-[#1a1a1a] py-16 sm:py-20 overflow-hidden">
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
