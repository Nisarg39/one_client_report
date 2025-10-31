"use client";

import { motion } from "framer-motion";
import { Plug, FileText, Sparkles, Send } from "lucide-react";

export function SolutionOverview() {
  const steps = [
    {
      number: 1,
      icon: Plug,
      title: "Connect Your Accounts",
      description: "One-click OAuth for Google Analytics, Meta Ads, Instagram, LinkedIn, and Google Ads. No API keys, no technical setup.",
      time: "30 seconds",
      delay: 0.1,
    },
    {
      number: 2,
      icon: FileText,
      title: "Choose Your Template",
      description: "Beautiful, professional templates designed by actual marketers. Your brand colors and logo automatically applied.",
      time: "1 minute",
      delay: 0.2,
    },
    {
      number: 3,
      icon: Sparkles,
      title: "AI Generates Insights",
      description: "Our AI analyzes your data and writes human-readable insights explaining what happened and why it matters.",
      time: "2 minutes (automated)",
      delay: 0.3,
    },
    {
      number: 4,
      icon: Send,
      title: "Send or Schedule",
      description: "Download as PDF, share via link, or schedule automated monthly delivery. Your clients see beautiful, branded reports.",
      time: "1 minute",
      delay: 0.4,
    },
  ];

  return (
    <section className="relative bg-[#242424] py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">

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
            Professional Reports in{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              5 Minutes
            </span>
            , Not 5 Hours
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            From connection to beautiful branded report in less time than it takes to make coffee.
          </p>
        </motion.div>

        {/* Four Steps - Desktop: Horizontal, Mobile: Vertical */}
        <div className="relative">

          {/* Connecting Line (Desktop only) - Animated Progressive Reveal */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6CA3A2] to-transparent opacity-30 origin-left"
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Icon Button */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: step.delay + 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  className="relative z-10 mb-6 w-20 h-20 md:w-16 md:h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(70,70,70,0.4),8px_8px_16px_rgba(0,0,0,0.7)] group-hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.7),0_0_20px_rgba(108,163,162,0.4)] transition-shadow duration-300"
                >
                  <step.icon
                    className="w-10 h-10 md:w-8 md:h-8 text-[#6CA3A2]"
                    aria-hidden="true"
                  />
                </motion.div>

                {/* Content */}
                <h3
                  className="text-lg sm:text-xl font-bold text-[#f5f5f5] mb-3"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm text-[#c0c0c0] mb-4 leading-relaxed"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {step.description}
                </p>

                {/* Time Badge with Scale Animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: step.delay + 0.4,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-4 py-2 rounded-full bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3)] group-hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3),0_0_10px_rgba(255,140,66,0.3)] transition-shadow duration-300"
                >
                  <span className="text-xs font-semibold text-[#FF8C42]">
                    {step.time}
                  </span>
                </motion.div>

                {/* Arrow for Mobile (between steps) with Bouncing Animation */}
                {step.number < 4 && (
                  <motion.div
                    animate={{
                      y: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="md:hidden mt-6 text-[#6CA3A2]"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto"
                    >
                      <path
                        d="M12 5L12 19M12 19L19 12M12 19L5 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
