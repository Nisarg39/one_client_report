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
    "14-day free trial",
    "Cancel anytime",
    "30-day money-back guarantee",
  ];

  return (
    <BackgroundLines className="relative bg-[#242424] pt-0overflow-hidden w-full h-auto" svgOptions={{ duration: 8 }}>
      <motion.section
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full"
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
          className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12"
        >
          <h2
            id="cta-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f5f5f5] leading-tight"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Join 500+ Marketers Saving Time on Reports
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c0c0c0] max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Start your free trial today. Beautiful reports in 5 minutes, or your money back.
          </p>
        </motion.div>

        {/* Stats Display */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12"
          role="list"
          aria-label="Platform statistics"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              role="listitem"
              className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)]"
            >
              <div
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] bg-clip-text text-transparent mb-2"
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-[#c0c0c0]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-10"
        >
          {/* Primary Button */}
          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto relative overflow-hidden text-sm sm:text-base px-6 sm:px-8 md:px-10 h-11 sm:h-14 rounded-3xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.4)] active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)] transition-all duration-300 focus:ring-2 focus:ring-[#FF8C42] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:outline-none"
            aria-label="Start your free trial now"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            <span className="relative flex items-center justify-center">
              Start Free Trial
              <ArrowRight
                className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => router.push('/demo')}
            className="w-full sm:w-auto relative overflow-hidden text-sm sm:text-base px-6 sm:px-8 md:px-10 h-11 sm:h-14 rounded-3xl font-semibold group bg-[#1a1a1a] text-[#6CA3A2] shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] transition-all duration-300 focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:outline-none"
            aria-label="Schedule a product demo"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            <span className="relative">
              Book a Demo
            </span>
          </button>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.4 }}
          className="mb-8 sm:mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto" role="list" aria-label="Trust signals">
            {trustSignals.map((signal, index) => (
              <div
                key={index}
                role="listitem"
                className="flex items-center justify-center gap-2 text-sm text-[#c0c0c0] px-2"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6CA3A2] flex-shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{signal}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-8 sm:pt-8 border-t border-[#2a2a2a]"
          role="list"
          aria-label="Security and compliance features"
        >
          {/* SSL Secure */}
          <div className="flex items-center gap-2" role="listitem">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)]"
              aria-hidden="true"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CA3A2]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#f5f5f5]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>SSL Secure</div>
              <div className="text-xs text-[#999]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>256-bit encryption</div>
            </div>
          </div>

          {/* GDPR Compliant */}
          <div className="flex items-center gap-2" role="listitem">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)]"
              aria-hidden="true"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CA3A2]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#f5f5f5]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>GDPR Compliant</div>
              <div className="text-xs text-[#999]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Your data is safe</div>
            </div>
          </div>

          {/* Stripe Payment */}
          <div className="flex items-center gap-2" role="listitem">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)]"
              aria-hidden="true"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CA3A2]" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#f5f5f5]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Secure Payments</div>
              <div className="text-xs text-[#999]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Powered by Stripe</div>
            </div>
          </div>
        </motion.div>

      </div>
      </motion.section>
    </BackgroundLines>
  );
}
