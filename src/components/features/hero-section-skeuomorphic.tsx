"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingIcons } from "@/components/aceternity/floating-icons";
import { useRouter } from "next/navigation";

export function HeroSectionSkeuomorphic() {
  const router = useRouter();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 bg-[#1a1a1a] overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-radial from-[#6CA3A2]/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Floating Service Provider Icons */}
      <FloatingIcons />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6CA3A2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-4 h-4 text-[#6CA3A2] relative z-10" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999] relative z-10">AI-Powered Reporting Platform</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#f5f5f5] leading-[1.1] sm:leading-[1] uppercase">
              Professionally <br />
              Analysed Client <br />
              Reports in <span className="text-gradient-teal italic">Minutes</span>
            </h1>
          </motion.div>

          {/* Description text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-base sm:text-lg md:text-xl text-[#c0c0c0] leading-relaxed font-medium opacity-70">
              Save 90% of your reporting time with AI-powered insights.
              Built for freelance marketers, agencies and learning students who need
              professional reports without the enterprise price tag.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button
              onClick={() => router.push('/signin')}
              className="group relative px-8 sm:px-10 h-14 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised hover:shadow-neu-raised-lg active:shadow-neu-inset transition-all duration-300 font-black uppercase tracking-[0.2em] text-[10px] sm:text-[12px] border-t border-white/20"
            >
              <span className="flex items-center gap-3">
                Start Free Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="w-8 h-14 rounded-full bg-[#1a1a1a] shadow-neu-inset border border-white/5 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-[#6CA3A2] rounded-full shadow-neu-raised"
          />
        </div>
      </motion.div>
    </section>
  );
}
