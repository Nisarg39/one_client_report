"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function FeaturesHero() {
  return (
    <section className="relative bg-[#1a1a1a] pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block">
              <div
                className="text-xs sm:text-sm font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-[#1a1a1a] text-[#e5e5e5] shadow-[-8px_-8px_20px_rgba(60,60,60,0.6),8px_8px_20px_rgba(0,0,0,0.9),inset_2px_2px_4px_rgba(0,0,0,0.3)]"
                style={{
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                }}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 inline-block" aria-hidden="true" />
                Comprehensive Platform Features
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2 sm:space-y-4"
          >
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black sm:font-extrabold tracking-normal text-[#f5f5f5] leading-tight"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              Everything You Need{" "}
              <span className="block mt-1 sm:mt-2">
                to{" "}
                <span
                  className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
                  style={{ textShadow: 'none' }}
                >
                  Succeed
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto px-2 sm:px-0"
          >
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c0c0c0] leading-relaxed"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              Discover powerful features designed to help agencies and freelancers
              create professional reports in minutes, not hours. Built for simplicity,
              powered by AI.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

