"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { FAQSchema } from "@/components/schema/faq-schema";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      question: "How long does it take to get insights?",
      answer: "Instant! Create a client workspace (1 minute), connect your platforms (30 seconds), and start asking questions. Our AI responds in real-time with professionally analysed insights. No waiting for reports to generate - chat with your data like you chat with a colleague.",
    },
    {
      question: "Can I share insights with my clients and team?",
      answer: "Yes! Export your AI-generated insights as JSON and share them however you like. You can also screenshot chat conversations, copy insights to paste into emails or presentations, or walk clients through the data in real-time during calls.",
    },
    {
      question: "What makes your AI chatbot different?",
      answer: "Unlike traditional reporting tools that just show charts and numbers, our AI chatbot lets you have a conversation with your data. Ask questions in plain English, get instant insights, drill down into specifics, and explore trends interactively. It's like having a data analyst available 24/7 who knows all your clients' metrics.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a FREE Student plan forever (5 practice clients, 50 messages/day with mock data - perfect for learning). For business users, Professional and Agency plans include a 7-day free trial with 50 messages/day. After trial, Professional gets 150 messages/day and Agency gets 300 messages/day. No credit card required to start.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. Cancel anytime from your account settings. No cancellation fees, no questions asked. We also offer a 30-day money-back guarantee if you're not satisfied.",
    },
    {
      question: "How is this so much cheaper than other reporting tools?",
      answer: "We focus on what freelancers and small agencies actually need (4 key platforms, AI-powered chatbot interface, real-time analytics) instead of building 80+ integrations that create feature bloat. We use a hybrid pricing model (client workspaces + daily AI messages), not per-client fees. Traditional reporting platforms charge ₹1,000-1,650 per client (₹10,000-16,500/mo for 10 clients or ₹25,000-41,250/mo for 25 clients), while our plans are just ₹299/month for 10 clients (150 messages/day) or ₹999/month for 25 clients (300 messages/day). We also offer a FREE Student tier. This allows us to offer premium quality at 96-98% lower cost than traditional reporting platforms.",
    },
    {
      question: "Do you store historical data?",
      answer: "Yes! We store 12 months of historical data so you can create comparison reports and track trends over time. Enterprise plan includes unlimited historical data storage.",
    },
    {
      question: "What if I need unlimited clients and messages?",
      answer: "Our Enterprise plan is designed for large agencies and teams managing 100+ clients. With unlimited client workspaces, unlimited AI messages, priority platform integrations, 24/7 phone support, custom onboarding, and SLA guarantees (99.9% uptime), we tailor the plan to your specific needs. Contact our sales team for a personalized quote - we're still 60-80% cheaper than traditional reporting platforms at enterprise scale.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-[#1a1a1a] pt-16 sm:pt-20 md:pt-24 pb-0">
      {/* FAQ Schema for SEO */}
      <FAQSchema faqs={faqs} />

      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#1a1a1a] via-[#1e1e1e] to-[#242424] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Common Questions About Automated Client Reporting
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Everything you need to know about OneReport.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div
                className="rounded-2xl bg-[#151515] shadow-[-8px_-8px_16px_rgba(40,40,40,0.3),8px_8px_16px_rgba(0,0,0,0.6)] overflow-hidden"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between text-left hover:bg-[#1a1a1a] transition-colors duration-200"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span
                    className="text-base sm:text-lg font-semibold text-[#f5f5f5] pr-4"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {faq.question}
                  </span>
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-4px_-4px_8px_rgba(50,50,50,0.4),4px_4px_8px_rgba(0,0,0,0.7)]"
                  >
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-[#6CA3A2]" aria-hidden="true" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#6CA3A2]" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                        <div
                          className="p-4 sm:p-6 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(40,40,40,0.2)]"
                        >
                          <p
                            className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16 pb-16 sm:pb-24"
        >
          <p className="text-base text-[#c0c0c0] mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Still have questions?
          </p>
          <button
            className="px-8 py-3 rounded-full bg-[#1a1a1a] text-[#6CA3A2] font-semibold shadow-[-8px_-8px_16px_rgba(50,50,50,0.4),8px_8px_16px_rgba(0,0,0,0.7)] hover:shadow-[-6px_-6px_12px_rgba(50,50,50,0.4),6px_6px_12px_rgba(0,0,0,0.7)] transition-all duration-300"
            aria-label="Contact support"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Contact Support
          </button>
        </motion.div>

      </div>
    </section>
  );
}
