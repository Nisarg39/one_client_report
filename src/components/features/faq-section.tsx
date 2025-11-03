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
      answer: "Google Looker Studio is powerful but requires technical knowledge to set up dashboards, connect data sources, and create visualizations. OneReport is designed for non-technical users - connect your accounts in one click, and we automatically generate beautiful reports with AI-written insights. No learning curve, no manual work.",
    },
    {
      question: "Can I white-label the reports with my own branding?",
      answer: "Yes! Every report includes your logo, brand colors, and custom domain (coming soon). Your clients will never see the OneReport brand - reports look like they came directly from your agency.",
    },
    {
      question: "What platforms do you integrate with?",
      answer: "Currently, we integrate with the 5 most-used marketing platforms: Google Analytics, Google Ads, Meta Ads (Facebook), Instagram, and LinkedIn. We're adding Twitter (X), TikTok, Pinterest, and YouTube in Q1 2026. Unlike competitors with 80+ integrations you'll never use, we focus on what freelancers and small agencies actually need.",
    },
    {
      question: "Do I need technical skills or coding knowledge?",
      answer: "Not at all. If you can use Gmail, you can use OneReport. Connect your accounts with one-click authorization (no API keys), choose a template, and you're done. Our AI handles all the data analysis and insight generation.",
    },
    {
      question: "What if I have more than 25 clients or need more reports?",
      answer: "Choose a plan that matches your needs. Our Starter plan includes 25 reports/month (perfect for 5-10 clients), Professional includes 75 reports/month (great for 10-25 clients), and Agency includes 200 reports/month (ideal for 25-50+ clients). All plans include unlimited clients - you only pay for the number of reports you generate. Upgrade or downgrade anytime.",
    },
    {
      question: "How long does it take to create a report?",
      answer: "About 5 minutes. Connect your accounts (30 seconds), choose a template (1 minute), let AI analyze your data (2 minutes automatically), then download or send (1 minute). Compare that to 6-10 hours with manual reporting.",
    },
    {
      question: "Can I schedule reports to send automatically?",
      answer: "Yes! Set up automated monthly reports that generate and email to your clients automatically. You can also create custom schedules (weekly, quarterly) for specific clients.",
    },
    {
      question: "What makes your AI insights different?",
      answer: "Unlike other tools that just show charts and numbers, our AI explains what the data means in plain English. It identifies trends, suggests actions, and writes insights your clients can actually understand - no marketing jargon needed.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! 14-day free trial with full access to all features. No credit card required to start. If you love it, upgrade to a paid plan. If not, no harm done.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. Cancel anytime from your account settings. No cancellation fees, no questions asked. We also offer a 30-day money-back guarantee if you're not satisfied.",
    },
    {
      question: "How is this so much cheaper than other reporting tools?",
      answer: "We focus on what freelancers and small agencies actually need (5 key platforms, beautiful templates, AI insights) instead of building 80+ integrations that create feature bloat. We charge based on report volume, not per-client fees. For example, AgencyAnalytics charges $12-20 per client ($120-400/mo for 20 clients), while our Professional plan is just $99/month with 75 reports. This allows us to offer premium quality at 50-80% lower cost.",
    },
    {
      question: "Do you store historical data?",
      answer: "Yes! We store 12 months of historical data so you can create comparison reports and track trends over time. Enterprise plan includes unlimited historical data storage.",
    },
    {
      question: "What if I need more than 200 reports per month?",
      answer: "Our Enterprise plan is designed for high-volume agencies and large teams managing 100+ clients. With custom report volumes (500-2,000+ reports/month), priority platform integrations, 24/7 support, and SLA guarantees, we tailor the plan to your specific needs. Contact our sales team for a personalized quote - we're still 50-70% cheaper than competitors at enterprise scale.",
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
