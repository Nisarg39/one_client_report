"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingIcons } from "@/components/aceternity/floating-icons";
import { useRouter } from "next/navigation";

export function HeroSectionSkeuomorphic() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24 bg-[#1a1a1a] overflow-hidden">
      {/* Floating Service Provider Icons */}
      <FloatingIcons />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">
          {/* Badge with soft 3D effect */}
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
                AI-Powered Reporting Platform
              </div>
            </div>
          </motion.div>

          {/* Main Heading with embossed text */}
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
              Professionally Analysed{" "}
              <span className="block mt-1 sm:mt-2">
                Client Reports in{" "}
                <span
                  className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
                  style={{ textShadow: 'none' }}
                >
                  Minutes
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Description text */}
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
              Save 90% of your reporting time with AI-powered insights.
              Built for freelance marketers and small agencies who need
              professional reports without the enterprise price tag.
            </p>
          </motion.div>

          {/* CTA Buttons with glossy effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-row gap-2 sm:gap-4 justify-center items-center pt-4"
          >
            {/* Primary Button - Soft raised */}
            <button
              onClick={() => router.push('/signup')}
              className="relative overflow-hidden text-sm sm:text-base px-4 sm:px-8 h-11 sm:h-14 rounded-3xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.4)] active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)] transition-all duration-300 focus:outline-none"
              aria-label="Start free trial"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <span className="relative flex items-center justify-center">
                Start Free Trial
                <ArrowRight
                  className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </button>

            {/* Secondary Button - Soft flat */}
            <button
              onClick={() => router.push('/demo')}
              className="relative overflow-hidden text-sm sm:text-base px-4 sm:px-8 h-11 sm:h-14 rounded-3xl font-semibold group bg-[#1a1a1a] text-[#6CA3A2] shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] transition-all duration-300 focus:outline-none"
              aria-label="View live demo"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              <span className="relative">
                View Live Demo
              </span>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator with soft depth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-11 bg-[#151515] rounded-full shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.35)] flex items-start justify-center p-2"
          aria-hidden="true"
        >
          <div className="w-1.5 h-1.5 bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] rounded-full shadow-[-2px_-2px_4px_rgba(108,163,162,0.5),2px_2px_4px_rgba(0,0,0,0.6)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
