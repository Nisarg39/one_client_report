"use client";

import { motion } from "framer-motion";
import { Clock, Users, Star, Shield } from "lucide-react";

export function SocialProofBar() {
  return (
    <section className="relative bg-[#1a1a1a] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop: 4 columns, Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

          {/* Time Saved Metric */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3 shadow-[-6px_-6px_12px_rgba(60,60,60,0.5),6px_6px_12px_rgba(0,0,0,0.8)]"
            >
              <Clock
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#6CA3A2]"
                aria-hidden="true"
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              2,000+
            </div>
            <div
              className="text-xs sm:text-sm text-[#c0c0c0] mt-1"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Hours saved this month
            </div>
          </motion.div>

          {/* User Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3 shadow-[-6px_-6px_12px_rgba(60,60,60,0.5),6px_6px_12px_rgba(0,0,0,0.8)]"
            >
              <Users
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#6CA3A2]"
                aria-hidden="true"
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              500+
            </div>
            <div
              className="text-xs sm:text-sm text-[#c0c0c0] mt-1"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Freelancers & agencies
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3 shadow-[-6px_-6px_12px_rgba(60,60,60,0.5),6px_6px_12px_rgba(0,0,0,0.8)]"
            >
              <Star
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#6CA3A2] fill-[#6CA3A2]"
                aria-hidden="true"
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              4.9/5
            </div>
            <div
              className="text-xs sm:text-sm text-[#c0c0c0] mt-1"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Average rating
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3 shadow-[-6px_-6px_12px_rgba(60,60,60,0.5),6px_6px_12px_rgba(0,0,0,0.8)]"
            >
              <Shield
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#6CA3A2]"
                aria-hidden="true"
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              7-Day
            </div>
            <div
              className="text-xs sm:text-sm text-[#c0c0c0] mt-1"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Free trial, no card
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
