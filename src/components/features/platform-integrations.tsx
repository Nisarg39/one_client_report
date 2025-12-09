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
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#1a1a1a] via-[#1e1e1e] to-[#242424] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
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

        {/* Timeline Layout - Platforms alternate left/right */}
        <div className="relative max-w-5xl mx-auto mb-20">
          {/* Vertical timeline line (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6CA3A2] via-[#6CA3A2] to-transparent opacity-20 transform -translate-x-1/2" />
          
          {platforms.map((platform, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative mb-12 lg:mb-16 ${
                  isEven ? 'lg:pr-[55%]' : 'lg:pl-[55%]'
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden lg:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-[#6CA3A2] shadow-[0_0_12px_rgba(108,163,162,0.4)] transform -translate-x-1/2 z-10" />
                
                {/* Platform content */}
                <div className="relative">
                  <div className="flex flex-col sm:flex-row gap-6 items-start group">
                    {/* Icon - larger and more prominent */}
                    <div className={`flex-shrink-0 ${isEven ? 'sm:order-1' : 'sm:order-2'}`}>
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#242424] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] group-hover:shadow-[-8px_-8px_16px_rgba(60,60,60,0.5),8px_8px_16px_rgba(0,0,0,0.9),0_0_30px_rgba(108,163,162,0.3)] transition-shadow duration-300"
                        style={{ 
                          border: `2px solid ${platform.color}20`,
                        }}
                      >
                        <platform.icon
                          className="w-10 h-10 sm:w-12 sm:h-12"
                          style={{ color: platform.color }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? 'sm:order-2' : 'sm:order-1'}`}>
                      <h3
                        className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-3"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                      >
                        {platform.name}
                      </h3>
                      <p
                        className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {platform.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section - Horizontal strip layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="max-w-6xl mx-auto">
            <h3
              className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] text-center mb-12"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              Why Choose Our{" "}
              <span
                className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
                style={{ textShadow: 'none' }}
              >
                Integrations?
              </span>
            </h3>
            
            {/* Horizontal strip layout - not cards */}
            <div className="relative">
              {/* Background panel */}
              <div className="absolute inset-0 rounded-3xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)]" />
              
              {/* Content */}
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a] p-8 md:p-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center px-6 md:px-8 py-6 md:py-0"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] mb-4 shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]">
                      <benefit.icon
                        className="w-8 h-8 text-[#6CA3A2]"
                        aria-hidden="true"
                      />
                    </div>
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
