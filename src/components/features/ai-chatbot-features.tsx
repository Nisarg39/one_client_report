"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Search, Download, Sparkles, Clock } from "lucide-react";

export function AIChatbotFeatures() {
  const features = [
    {
      icon: MessageSquare,
      title: "Conversational AI Assistant",
      description: "Chat with OneAssist, your AI-powered assistant. Get real-time streaming responses powered by OpenAI GPT-4o-mini. Ask questions about your marketing data in plain English.",
      highlight: "Real-time streaming",
    },
    {
      icon: Users,
      title: "Multi-Client Workspace",
      description: "Manage multiple clients with isolated conversation histories. Switch between workspaces seamlessly. Perfect for agencies and freelancers serving multiple clients.",
      highlight: "Unlimited clients",
    },
    {
      icon: Search,
      title: "Conversation Management",
      description: "Search through all your conversations with full-text search. Filter by status (All/Active/Archived), pin important conversations, and organize your chat history efficiently.",
      highlight: "Smart organization",
    },
    {
      icon: Download,
      title: "Export Capabilities",
      description: "Download your conversations in multiple formats: JSON for data processing, CSV for spreadsheets, or Markdown for documentation. Keep your insights organized.",
      highlight: "Multiple formats",
    },
    {
      icon: Sparkles,
      title: "Natural Language Queries",
      description: "Ask questions about your marketing data in plain English. No need to learn complex query languages. The AI understands context and provides actionable insights.",
      highlight: "Plain English queries",
    },
    {
      icon: Clock,
      title: "Persistent History",
      description: "All your conversations are saved automatically. Never lose your insights. Access your chat history anytime, from any device, with full synchronization.",
      highlight: "Always available",
    },
  ];

  // Split features into two groups for asymmetric layout
  const leftColumn = features.slice(0, 3);
  const rightColumn = features.slice(3, 6);

  return (
    <section className="relative bg-[#242424] py-16 sm:py-20 md:py-24">
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#242424] via-[#1e1e1e] to-[#1a1a1a] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
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
            AI Chatbot{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Features
            </span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Powerful AI capabilities to help you understand and analyze your marketing data conversationally.
          </p>
        </motion.div>

        {/* Asymmetric Split Layout - Left column offset, right column aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Offset with larger spacing */}
          <div className="space-y-8 lg:pt-16">
            {leftColumn.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connecting line on desktop */}
                {index < leftColumn.length - 1 && (
                  <div className="hidden lg:block absolute left-8 top-20 w-0.5 h-8 bg-gradient-to-b from-[#6CA3A2] to-transparent opacity-30" />
                )}
                
                <div className="flex gap-6 items-start">
                  {/* Icon with connecting line */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] group-hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(108,163,162,0.3)] transition-shadow duration-300">
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

          {/* Right Column - Aligned normally */}
          <div className="space-y-8">
            {rightColumn.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connecting line on desktop */}
                {index < rightColumn.length - 1 && (
                  <div className="hidden lg:block absolute left-8 top-20 w-0.5 h-8 bg-gradient-to-b from-[#6CA3A2] to-transparent opacity-30" />
                )}
                
                <div className="flex gap-6 items-start">
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] group-hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(108,163,162,0.3)] transition-shadow duration-300">
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
        </div>
      </div>
    </section>
  );
}
