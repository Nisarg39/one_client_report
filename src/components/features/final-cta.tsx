"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Lock, Shield, CreditCard } from "lucide-react";
import { BackgroundLines } from "@/components/aceternity/background-lines";
import { useRouter } from "next/navigation";

export function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const stats = [
    { value: "2,000+", label: "Hours saved this month" },
    { value: "500+", label: "Happy customers" },
    { value: "4.9/5", label: "Average rating" },
  ];

  const trustSignals = [
    "No credit card required",
    "7-day free trial",
    "Cancel anytime",
    "30-day money-back guarantee",
  ];

  return (
    <BackgroundLines className="relative bg-[#1a1a1a] pt-0 overflow-hidden w-full h-auto" svgOptions={{ duration: 8 }}>
      <motion.section
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full py-12 sm:py-16 md:py-20"
        aria-labelledby="cta-heading"
      >
        {/* Gradient fade overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-transparent via-[#1e1e1e] to-[#1a1a1a] pointer-events-none z-[5]" />

        <div className="max-w-5xl mx-auto px-4 pt-8 sm:pt-12 md:pt-16 relative z-10">

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12"
          >
            <h2
              id="cta-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tighter"
            >
              Join 500+ Marketers <br className="hidden sm:block" /> Getting <span className="text-[#6CA3A2] italic">Instant AI Insights</span>
            </h2>
            <p
              className="text-xs sm:text-sm md:text-base text-[#555] max-w-xl mx-auto px-2 font-black uppercase tracking-[0.2em] leading-relaxed"
            >
              Start your 7-day free trial today. Chat with your data in minutes, or your money back.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-12 sm:gap-4 mb-20 relative px-4"
          >
            {/* Connecting Baseline Decoration */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent hidden sm:block -translate-y-1/2" />

            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative flex flex-col items-center group"
              >
                <div className="relative">
                  {/* Background Glow Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#6CA3A2]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div
                    className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-none relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-glow-teal"
                  >
                    {stat.value}
                  </div>

                  {/* Technical Crosshairs */}
                  <div className="absolute -top-4 -left-4 w-3 h-3 border-t border-l border-white/10 group-hover:border-[#6CA3A2]/40 transition-colors" />
                  <div className="absolute -bottom-4 -right-4 w-3 h-3 border-b border-r border-white/10 group-hover:border-[#6CA3A2]/40 transition-colors" />
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <div className="w-8 h-[1px] bg-[#6CA3A2]/20 group-hover:w-16 transition-all duration-500 mb-3" />
                  <div className="text-[10px] sm:text-[11px] font-black text-[#555] uppercase tracking-[0.3em] group-hover:text-[#6CA3A2] transition-colors text-center whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
            className="flex justify-center items-center mb-8 sm:mb-10"
          >
            {/* Primary Button */}
            <button
              onClick={() => router.push('/signin')}
              className="w-full sm:w-auto relative overflow-hidden text-[10px] sm:text-[11px] px-8 h-12 rounded-xl font-black uppercase tracking-[0.2em] group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised transition-all duration-300 hover:shadow-neu-raised-sm active:scale-95 flex items-center justify-center gap-2.5"
              aria-label="Start your free trial now"
            >
              Start Free Trial
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-3xl mx-auto py-4 border-y border-white/[0.03] relative" role="list" aria-label="Trust signals">
              {/* Decorative side markers */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/20" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/20" />

              {trustSignals.map((signal, index) => (
                <div
                  key={index}
                  role="listitem"
                  className="flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-[#6CA3A2] opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#555] group-hover:text-[#888] transition-colors">{signal}</span>
                </div>
              ))}

              {/* Security Badge Support */}
              <div className="hidden lg:flex items-center gap-4 ml-4 pl-8 border-l border-white/5 group">
                <div className="w-1 h-1 rounded-full bg-[#6CA3A2] opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all" />
                <span className="text-[10px] sm:text-[11px] font-black uppercase italic tracking-widest text-[#6CA3A2]/70 group-hover:text-[#6CA3A2] transition-colors">Security Verified</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-10 sm:pt-12 border-t border-[#222] relative"
            role="list"
            aria-label="Security and compliance features"
          >
            {/* SSL Secure */}
            <div className="flex items-center gap-3" role="listitem">
              <div
                className="w-10 h-10 rounded-xl bg-[#1c1c1c] flex items-center justify-center shadow-neu-raised border border-white/5"
                aria-hidden="true"
              >
                <Lock className="w-4 h-4 text-[#6CA3A2]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">SSL Secure</div>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em]">256-bit encryption</div>
              </div>
            </div>

            {/* GDPR Compliant */}
            <div className="flex items-center gap-3" role="listitem">
              <div
                className="w-10 h-10 rounded-xl bg-[#1c1c1c] flex items-center justify-center shadow-neu-raised border border-white/5"
                aria-hidden="true"
              >
                <Shield className="w-4 h-4 text-[#6CA3A2]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">GDPR Compliant</div>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em]">Your data is safe</div>
              </div>
            </div>

            {/* PayU Payment */}
            <div className="flex items-center gap-3" role="listitem">
              <div
                className="w-10 h-10 rounded-xl bg-[#1c1c1c] flex items-center justify-center shadow-neu-raised border border-white/5"
                aria-hidden="true"
              >
                <CreditCard className="w-4 h-4 text-[#6CA3A2]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">Secure Payments</div>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em]">Secured by PayU</div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>
    </BackgroundLines>
  );
}
