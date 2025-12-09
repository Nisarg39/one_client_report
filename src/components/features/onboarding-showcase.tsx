"use client";

import { motion } from "framer-motion";
import { FileText, Plug, Sparkles, GraduationCap, ArrowRight } from "lucide-react";

export function OnboardingShowcase() {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Create Your First Client",
      description: "Add your client details and workspace. Set up your first client in under a minute with our simple form.",
      time: "1 minute",
      delay: 0.1,
    },
    {
      number: 2,
      icon: Plug,
      title: "Connect Platforms",
      description: "Connect your marketing platforms with one-click OAuth. No API keys, no technical setup required. Just authorize and you're ready.",
      time: "30 seconds",
      delay: 0.2,
    },
    {
      number: 3,
      icon: Sparkles,
      title: "Start Chatting",
      description: "Begin asking questions about your data. Our AI assistant is ready to help you understand your marketing performance.",
      time: "Instant",
      delay: 0.3,
    },
  ];

  const studentFeatures = [
    {
      icon: GraduationCap,
      title: "Student Mode",
      description: "Practice with mock data scenarios. Perfect for learning marketing analytics without real client data.",
      highlight: "Free forever",
    },
    {
      icon: FileText,
      title: "Educational Mode",
      description: "Specialized tutoring agent helps you understand marketing metrics and data analysis concepts.",
      highlight: "Learn as you go",
    },
  ];

  return (
    <section className="relative bg-[#242424] py-16 sm:py-20 md:py-24">
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#242424] via-[#1e1e1e] to-[#1a1a1a] pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Quick{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Onboarding
            </span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-2xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Get started in minutes, not hours. Our guided onboarding flow makes setup simple and intuitive.
          </p>
        </motion.div>

        {/* Single Column Flow - Vertical narrative */}
        <div className="relative mb-20">
          {/* Vertical connecting line */}
          <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6CA3A2] via-[#6CA3A2] to-transparent opacity-20" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="relative mb-12 last:mb-0 pl-20 sm:pl-24"
            >
              {/* Step number badge */}
              <div className="absolute left-0 top-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] border-2 border-[#6CA3A2] group-hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(108,163,162,0.4)] transition-shadow duration-300">
                <div className="relative">
                  <step.icon
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#6CA3A2]"
                    aria-hidden="true"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF8C42] flex items-center justify-center shadow-[0_2px_8px_rgba(255,140,66,0.4)]">
                    <span className="text-xs font-bold text-white">{step.number}</span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                  >
                    {step.title}
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#242424] text-[#FF8C42] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3)] whitespace-nowrap flex-shrink-0">
                    {step.time}
                  </span>
                </div>
                <p
                  className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {step.description}
                </p>
              </div>
              
              {/* Arrow connector (mobile) */}
              {index < steps.length - 1 && (
                <motion.div
                  animate={{
                    y: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="sm:hidden absolute left-8 top-20 text-[#6CA3A2]"
                >
                  <ArrowRight className="w-6 h-6 rotate-90" aria-hidden="true" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Student Features - Side-by-side panel layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Divider */}
          <div className="mb-12 pt-12 border-t border-[#2a2a2a]">
            <div className="text-center mb-10">
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-3"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                Perfect for{" "}
                <span
                  className="bg-gradient-to-r from-[#FF8C42] to-[#E67A33] bg-clip-text text-transparent"
                  style={{ textShadow: 'none' }}
                >
                  Students
                </span>
              </h3>
              <p
                className="text-base text-[#c0c0c0] max-w-xl mx-auto"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                Learn marketing analytics with mock data. Practice without real clients.
              </p>
            </div>

            {/* Side-by-side panels (not cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative p-8 rounded-2xl bg-[#1a1a1a] border-l-4 border-[#FF8C42] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)]"
                >
                  {/* Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#242424] text-[#FF8C42] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3)]">
                      {feature.highlight}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#242424] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]"
                    >
                      <feature.icon
                        className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF8C42]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h4
                    className="text-lg sm:text-xl font-bold text-[#f5f5f5] mb-3 pr-20"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
