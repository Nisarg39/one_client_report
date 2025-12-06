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
            Quick{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Onboarding
            </span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Get started in minutes, not hours. Our guided onboarding flow makes setup simple and intuitive.
          </p>
        </motion.div>

        {/* Onboarding Steps */}
        <div className="relative mb-16">
          {/* Connecting Line (Desktop only) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6CA3A2] to-transparent opacity-30 origin-left"
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative flex flex-col items-center text-center group"
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
                  whileHover={{ scale: 1.1 }}
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

                {/* Time Badge */}
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
                  className="inline-block px-4 py-2 rounded-full bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3)]"
                >
                  <span className="text-xs font-semibold text-[#FF8C42]">
                    {step.time}
                  </span>
                </motion.div>

                {/* Arrow for Mobile */}
                {step.number < 3 && (
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
                    <ArrowRight className="w-6 h-6 rotate-90 mx-auto" aria-hidden="true" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Student Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-16 border-t border-[#2a2a2a]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3
              className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-4"
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
              className="text-base text-[#c0c0c0] max-w-2xl mx-auto"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Learn marketing analytics with mock data. Practice without real clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {studentFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_16px_rgba(70,70,70,0.3),8px_8px_16px_rgba(0,0,0,0.7)]"
              >
                {/* Highlight Badge */}
                <div className="absolute top-4 right-4">
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
                  className="text-lg sm:text-xl font-bold text-[#f5f5f5] mb-3"
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
        </motion.div>
      </div>
    </section>
  );
}

