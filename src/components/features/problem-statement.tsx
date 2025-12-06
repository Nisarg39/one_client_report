"use client";

import { motion } from "framer-motion";
import { Hourglass, DollarSign, Layers } from "lucide-react";

export function ProblemStatement() {
  return (
    <section className="relative bg-[#1a1a1a] py-16 sm:py-20 md:py-24">
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#1a1a1a] via-[#1e1e1e] to-[#242424] pointer-events-none" />

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
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            <span className="text-[#E74C3C]">Stop Wasting 8 Hours</span>{" "}
            <span className="text-[#f5f5f5]">Every Month on Reports</span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            You didn&apos;t become a marketer to spend your time copying data into spreadsheets.
            Your clients pay for results, not reporting.
          </p>
        </motion.div>

        {/* Three Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Pain Point 1: Time Waste */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-6 sm:p-8 rounded-2xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)]"
          >
            {/* Icon */}
            <div className="mb-6">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]"
              >
                <Hourglass
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#E74C3C]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Content */}
            <h3
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              Manual Reporting Steals Your Time
            </h3>
            <p
              className="text-sm sm:text-base text-[#c0c0c0] mb-6 leading-relaxed"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Freelancers spend 6-10 hours monthly logging into platforms, exporting data,
              creating charts, and compiling reports. That&apos;s $300-500 of lost billable time
              every month.
            </p>

            {/* Stat */}
            <div className="pt-4 border-t border-[#2a2a2a]">
              <div
                className="text-2xl sm:text-3xl font-bold text-[#E74C3C]"
              >
                8 hours wasted
              </div>
              <div className="text-xs sm:text-sm text-[#999] mt-1">
                per client, per month
              </div>
            </div>
          </motion.div>

          {/* Pain Point 2: Expensive Tools */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-6 sm:p-8 rounded-2xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)]"
          >
            {/* Icon */}
            <div className="mb-6">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]"
              >
                <DollarSign
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#E74C3C]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Content */}
            <h3
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              Enterprise Tools Kill Your Margins
            </h3>
            <p
              className="text-sm sm:text-base text-[#c0c0c0] mb-6 leading-relaxed"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Traditional platforms charge ₹1,000-1,650 per client per month.
              For freelancers managing 10 clients, that&apos;s ₹10,000-16,500/month (₹1.2-2 lakhs/year) just for reporting.
            </p>

            {/* Stat */}
            <div className="pt-4 border-t border-[#2a2a2a]">
              <div
                className="text-2xl sm:text-3xl font-bold text-[#E74C3C]"
              >
                ₹10,000-16,500/mo
              </div>
              <div className="text-xs sm:text-sm text-[#999] mt-1">
                for 10 clients on traditional tools
              </div>
            </div>
          </motion.div>

          {/* Pain Point 3: Complex Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative p-6 sm:p-8 rounded-2xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)]"
          >
            {/* Icon */}
            <div className="mb-6">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)]"
              >
                <Layers
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#E74C3C]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Content */}
            <h3
              className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              Steep Learning Curves Waste More Time
            </h3>
            <p
              className="text-sm sm:text-base text-[#c0c0c0] mb-6 leading-relaxed"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Current tools take 1-2 hours just to set up your first report.
              You need to watch tutorials, understand data connections, and customize generic templates.
            </p>

            {/* Stat */}
            <div className="pt-4 border-t border-[#2a2a2a]">
              <div
                className="text-2xl sm:text-3xl font-bold text-[#E74C3C]"
              >
                60 minutes
              </div>
              <div className="text-xs sm:text-sm text-[#999] mt-1">
                to create your first report
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
