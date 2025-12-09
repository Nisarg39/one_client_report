"use client";

import { motion } from "framer-motion";
import { Briefcase, Zap, BarChart3, Target, Share2, Lock, Globe, Download, MessageSquare, Users } from "lucide-react";

export function ProfessionalModeFeatures() {
  const coreFeatures = [
    {
      icon: MessageSquare,
      title: "AI Growth Strategist",
      description: "Get actionable insights from a specialized AI agent designed for business growth. Real-time analysis of your marketing performance.",
      highlight: "Business-focused AI",
      color: "#6CA3A2",
    },
    {
      icon: Zap,
      title: "Real Platform Connections",
      description: "Connect Google Analytics, Google Ads, Meta Ads, and LinkedIn Ads with one-click OAuth. No API keys needed.",
      highlight: "One-click OAuth",
      color: "#6CA3A2",
    },
    {
      icon: Users,
      title: "Multi-Client Workspace",
      description: "Manage unlimited clients with isolated workspaces. Perfect for agencies and freelancers serving multiple clients.",
      highlight: "Unlimited clients",
      color: "#6CA3A2",
    },
    {
      icon: Download,
      title: "Export & Reports",
      description: "Download insights as JSON, CSV, or Markdown. Generate professional reports for your clients instantly.",
      highlight: "Multiple formats",
      color: "#6CA3A2",
    },
  ];

  const platforms = [
    {
      icon: BarChart3,
      name: "Google Analytics",
      description: "Website traffic, user behavior, and conversion data",
      color: "#F9AB00",
    },
    {
      icon: Target,
      name: "Google Ads",
      description: "Campaign performance, impressions, clicks, and ROI",
      color: "#4285F4",
    },
    {
      icon: Share2,
      name: "Meta/Facebook Ads",
      description: "Ad performance across Facebook and Instagram campaigns",
      color: "#0081FB",
    },
    {
      icon: Briefcase,
      name: "LinkedIn Ads",
      description: "B2B campaign insights and professional network metrics",
      color: "#0A66C2",
    },
  ];

  const benefits = [
    {
      icon: Lock,
      title: "Secure & Encrypted",
      description: "Industry-standard security for all platform connections",
    },
    {
      icon: Globe,
      title: "Multi-Platform Aggregation",
      description: "Query data across all platforms in a single conversation",
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
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] text-white shadow-[-4px_-4px_8px_rgba(108,163,162,0.2),4px_4px_8px_rgba(0,0,0,0.6)]">
              Professional Mode
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Professional Analytics{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              For Business
            </span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Built for freelancers, agencies, and marketing teams. Connect real platforms, analyze real data, and deliver professional insights to your clients.
          </p>
        </motion.div>

        {/* Core Features - Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex gap-6 items-start">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[#242424] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] group-hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(108,163,162,0.3)] transition-shadow duration-300">
                    <feature.icon
                      className="w-8 h-8 text-[#6CA3A2]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                    >
                      {feature.title}
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#242424] text-[#6CA3A2] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3)] ml-4 flex-shrink-0">
                      {feature.highlight}
                    </span>
                  </div>
                  <p
                    className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platform Integrations - Timeline Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3
            className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] text-center mb-12"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Platform{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Integrations
            </span>
          </h3>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6CA3A2] via-[#6CA3A2] to-transparent opacity-20 transform -translate-x-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platforms.map((platform, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative ${isEven ? 'md:pr-[55%]' : 'md:pl-[55%]'}`}
                  >
                    {/* Timeline dot */}
                    <div className="hidden lg:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-[#6CA3A2] shadow-[0_0_12px_rgba(108,163,162,0.4)] transform -translate-x-1/2 z-10" />
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-[#242424] flex items-center justify-center shadow-[-6px_-6px_12px_rgba(60,60,60,0.4),6px_6px_12px_rgba(0,0,0,0.8)]"
                        style={{ border: `2px solid ${platform.color}20` }}
                      >
                        <platform.icon
                          className="w-6 h-6"
                          style={{ color: platform.color }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-[#f5f5f5] mb-1">{platform.name}</h4>
                        <p className="text-sm text-[#c0c0c0]">{platform.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Benefits Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative rounded-3xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)] p-8 md:p-12 border-t-2 border-[#6CA3A2]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a]">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center px-6 md:px-8 py-6 md:py-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] mb-4 shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]">
                    <benefit.icon
                      className="w-8 h-8 text-[#6CA3A2]"
                      aria-hidden="true"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-[#f5f5f5] mb-2">{benefit.title}</h4>
                  <p className="text-sm text-[#c0c0c0]">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

