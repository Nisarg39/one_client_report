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
              className="text-xs sm:text-sm md:text-base text-[#555] max-w-xl mx-auto px-2 font-black uppercase italic tracking-[0.2em] leading-relaxed"
            >
              Start your 7-day free trial today. Chat with your data in minutes, or your money back.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12"
            role="list"
            aria-label="Platform statistics"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                role="listitem"
                className="text-center p-4 sm:p-6 rounded-2xl bg-[#1c1c1c] shadow-neu-raised border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6CA3A2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-1 relative z-10"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-[10px] font-black text-[#666] uppercase tracking-[0.2em] italic relative z-10 group-hover:text-[#6CA3A2] transition-colors">
                  {stat.label}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#6CA3A2]/10 group-hover:bg-[#6CA3A2]/40 transition-colors" />
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
              className="w-full sm:w-auto relative overflow-hidden text-[10px] sm:text-[11px] px-8 h-12 rounded-xl font-black uppercase italic tracking-[0.2em] group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised transition-all duration-300 hover:shadow-neu-raised-sm active:scale-95 flex items-center justify-center gap-2.5"
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
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.4 }}
            className="mb-10 sm:mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto" role="list" aria-label="Trust signals">
              {trustSignals.map((signal, index) => (
                <div
                  key={index}
                  role="listitem"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1c1c1c]/50 border border-white/5 shadow-neu-inset"
                >
                  <Check className="w-3 h-3 text-[#6CA3A2] flex-shrink-0" aria-hidden="true" />
                  <span className="text-[9px] font-black uppercase italic tracking-tighter text-[#666]">{signal}</span>
                </div>
              ))}
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
                <div className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none mb-1">SSL Secure</div>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] italic">256-bit encryption</div>
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
                <div className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none mb-1">GDPR Compliant</div>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] italic">Your data is safe</div>
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
                <div className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none mb-1">Secure Payments</div>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] italic">Secured by PayU</div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>
    </BackgroundLines>
  );
}
