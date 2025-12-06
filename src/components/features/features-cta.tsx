"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function FeaturesCTA() {
  const router = useRouter();

  return (
    <section className="relative bg-[#1a1a1a] py-16 sm:py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <div className="inline-block">
            <div
              className="text-xs sm:text-sm font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-[#242424] text-[#e5e5e5] shadow-[-8px_-8px_20px_rgba(60,60,60,0.6),8px_8px_20px_rgba(0,0,0,0.9),inset_2px_2px_4px_rgba(0,0,0,0.3)]"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 inline-block" aria-hidden="true" />
              Ready to Get Started?
            </div>
          </div>

          {/* Headline */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f5f5] leading-tight"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Experience the{" "}
            <span
              className="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Power
            </span>{" "}
            Yourself
          </h2>

          {/* Description */}
          <p
            className="text-base sm:text-lg md:text-xl text-[#c0c0c0] max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Start your free trial today. No credit card required. Set up your first client and connect your platforms in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
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
              className="w-full sm:w-auto relative overflow-hidden text-sm sm:text-base px-6 sm:px-8 md:px-10 h-11 sm:h-14 rounded-3xl font-semibold group bg-[#242424] text-[#e5e5e5] shadow-[-8px_-8px_16px_rgba(70,70,70,0.3),8px_8px_16px_rgba(0,0,0,0.7)] hover:shadow-[-8px_-8px_16px_rgba(108,163,162,0.3),8px_8px_16px_rgba(0,0,0,0.7),0_0_20px_rgba(108,163,162,0.2)] transition-all duration-300 focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:outline-none"
              aria-label="View demo"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              <span className="relative flex items-center justify-center">
                See Demo
                <ArrowRight
                  className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

