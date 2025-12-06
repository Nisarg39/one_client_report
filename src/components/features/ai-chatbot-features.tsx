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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 sm:p-8 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_16px_rgba(70,70,70,0.3),8px_8px_16px_rgba(0,0,0,0.7)] hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.7),0_0_20px_rgba(108,163,162,0.2)] transition-all duration-300 group"
            >
              {/* Highlight Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#242424] text-[#6CA3A2] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(50,50,50,0.3)]">
                  {feature.highlight}
                </span>
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#242424] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] group-hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(108,163,162,0.3)] transition-shadow duration-300"
                >
                  <feature.icon
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#6CA3A2]"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Content */}
              <h3
                className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-3"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                {feature.title}
              </h3>
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
    </section>
  );
}

