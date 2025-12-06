"use client";

import { motion } from "framer-motion";
import { BarChart3, Target, Share2, Briefcase, Lock, Zap, Globe } from "lucide-react";

export function PlatformIntegrations() {
  const platforms = [
    {
      icon: BarChart3,
      name: "Google Analytics",
      description: "Connect your Google Analytics accounts with one-click OAuth. Query website traffic, user behavior, and conversion data conversationally.",
      color: "#F9AB00",
    },
    {
      icon: Target,
      name: "Google Ads",
      description: "Access your Google Ads campaign performance, impressions, clicks, and conversions. Get insights on ad spend and ROI through natural language queries.",
      color: "#4285F4",
    },
    {
      icon: Share2,
      name: "Meta/Facebook Ads",
      description: "Connect Meta Ads (including Instagram) to analyze ad performance, reach, frequency, and engagement metrics across Facebook and Instagram campaigns.",
      color: "#0081FB",
    },
    {
      icon: Briefcase,
      name: "LinkedIn Ads",
      description: "Perfect for B2B marketers. Connect LinkedIn Ads to access campaign insights, audience engagement, and professional network advertising metrics.",
      color: "#0A66C2",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "One-Click OAuth",
      description: "Connect platforms securely with just one click. No API keys, no technical setup required.",
    },
    {
      icon: Lock,
      title: "Secure & Encrypted",
      description: "All tokens are encrypted and stored securely. Your data is protected with industry-standard security.",
    },
    {
      icon: Globe,
      title: "Multi-Platform Aggregation",
      description: "Query data across all connected platforms in a single conversation. Get unified insights from multiple sources.",
    },
  ];

  return (
    <section className="relative bg-[#1a1a1a] py-16 sm:py-20 md:py-24">
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
            Platform{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Integrations
            </span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Connect all your marketing platforms in one place. Access data from multiple sources through simple conversations.
          </p>
        </motion.div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 sm:p-8 rounded-2xl bg-[#242424] shadow-[-8px_-8px_16px_rgba(70,70,70,0.3),8px_8px_16px_rgba(0,0,0,0.7)] hover:shadow-[-8px_-8px_16px_rgba(70,70,70,0.4),8px_8px_16px_rgba(0,0,0,0.8),0_0_30px_rgba(108,163,162,0.2)] transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="mb-6">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] group-hover:shadow-[-8px_-8px_16px_rgba(60,60,60,0.5),8px_8px_16px_rgba(0,0,0,0.9),0_0_20px_rgba(108,163,162,0.3)] transition-shadow duration-300"
                >
                  <platform.icon
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    style={{ color: platform.color }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Content */}
              <h3
                className="text-lg sm:text-xl font-bold text-[#f5f5f5] mb-3"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                {platform.name}
              </h3>
              <p
                className="text-sm text-[#c0c0c0] leading-relaxed"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {platform.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h3
            className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] text-center mb-8 sm:mb-12"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Why Choose Our Integrations?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)]"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]"
                  >
                    <benefit.icon
                      className="w-7 h-7 sm:w-8 sm:h-8 text-[#6CA3A2]"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <h4
                  className="text-lg sm:text-xl font-bold text-[#f5f5f5] mb-3"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                  {benefit.title}
                </h4>
                <p
                  className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

