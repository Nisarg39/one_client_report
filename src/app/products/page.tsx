"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sprout,
  Rocket,
  Building2,
  Crown,
  Check,
  CreditCard,
  Zap,
  MessageSquare,
  Mail,
  PhoneCall,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  BarChart3
} from "lucide-react";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] overflow-x-hidden">
      {/* Hero Section - The Genesis */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Atmospheric Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-radial from-[#6CA3A2]/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#6CA3A2] hover:text-[#7db3b2] transition-all group mb-12"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Nexus
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase italic">
                The <span className="text-gradient-teal">Journey</span> <br />
                To <span className="text-[#FF8C42]">Mastery.</span>
              </h1>
              <p className="text-lg md:text-2xl text-[#a0a0a0] max-w-2xl font-medium leading-relaxed opacity-80">
                Every empire begins as a single data point. Choose your stage in the evolution of marketing intelligence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Path - The Evolutionary Stages */}
      <section className="relative max-w-7xl mx-auto px-6 pb-40">
        {/* Connecting Vertical Spine */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-40 w-px bg-gradient-to-b from-[#6CA3A2] via-[#FF8C42] to-[#9333ea] opacity-10" />

        <div className="space-y-40">
          {/* Stage 1: The Seedling (Student) */}
          <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 lg:text-right flex flex-col items-center lg:items-end"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-[#6CA3A2]/20">
                <Sprout className="w-8 h-8 text-[#6CA3A2]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#6CA3A2] mb-2">Stage 01 — Genesis</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Plant the <span className="text-[#6CA3A2]">Seed</span></h2>
              <p className="text-[#a0a0a0] text-sm md:text-lg leading-relaxed max-w-md lg:ml-auto">
                Begin your mastery with zero risk. Harness AI-driven simulations and practice scenarios to build your analytical foundation.
              </p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#f5f5f5]">₹0</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6CA3A2]">Forever Free</span>
              </div>
            </motion.div>

            {/* Central Node */}
            <div className="hidden lg:flex w-12 h-12 rounded-full bg-[#1a1a1a] shadow-neu-inset border-2 border-[#6CA3A2] z-10 shrink-0 items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border border-white/5 relative overflow-hidden group hover:border-[#6CA3A2]/30 transition-colors">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#f5f5f5]">Student Plan</h3>
                  <div className="w-10 h-10 rounded-xl bg-[#151515] shadow-neu-inset flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#6CA3A2]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    "5 Workspaces",
                    "50 AI Signals/Day",
                    "Mock Data Packs",
                    "AI Tutors",
                    "Guided Quizzes",
                    "30D History"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[#999999] uppercase tracking-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/40" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/signin"
                  className="block w-full text-center py-4 bg-[#1a1a1a] text-[#f5f5f5] rounded-2xl shadow-neu-raised font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-neu-inset transition-all"
                >
                  Establish Connection
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stage 2: The Rocket (Professional) */}
          <div className="relative flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col items-center lg:items-start"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-[#FF8C42]/20">
                <Rocket className="w-8 h-8 text-[#FF8C42]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FF8C42] mb-2">Stage 02 — Ignition</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Take <span className="text-[#FF8C42]">Flight</span></h2>
              <p className="text-[#a0a0a0] text-sm md:text-lg leading-relaxed max-w-md">
                Transition to real-world impact. Connect live channels, synthesize professional reports, and accelerate your client results.
              </p>
              <div className="mt-8 flex flex-col items-center lg:items-start gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#444] line-through decoration-[#FF8C42]/50 uppercase tracking-tighter">₹1,299</span>
                  <span className="text-4xl font-black text-[#f5f5f5]">₹299</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF8C42]">/ Month</span>
                </div>
                <div className="text-[9px] font-black text-[#FF8C42] uppercase tracking-[0.2em] italic">
                  * Founder's Price: First 100 Users
                </div>
              </div>
            </motion.div>

            {/* Central Node */}
            <div className="hidden lg:flex w-12 h-12 rounded-full bg-[#1a1a1a] shadow-neu-inset border-2 border-[#FF8C42] z-10 shrink-0 items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#FF8C42] animate-pulse" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border border-[#FF8C42]/30 relative overflow-hidden group">
                {/* Popular Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF8C42]/5 blur-[60px] rounded-full" />

                <div className="mb-4">
                  <span className="px-3 py-1 bg-[#FF8C42] text-white text-[8px] font-black uppercase rounded-full tracking-widest">Recommended Stage</span>
                </div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#f5f5f5]">Professional</h3>
                  <div className="w-10 h-10 rounded-xl bg-[#151515] shadow-neu-inset flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-[#FF8C42]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    "10 Client Nodes",
                    "150 Signals/Day",
                    "Live Integrations",
                    "White-Labeling",
                    "Unlimited History",
                    "Priority Nexus"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[#999999] uppercase tracking-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C42]/40" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/signin"
                  className="block w-full text-center py-4 bg-[#FF8C42] text-white rounded-2xl shadow-lg border-b-4 border-black/20 font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all"
                >
                  Initiate Launch
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stage 3: The Building (Agency) */}
          <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 lg:text-right flex flex-col items-center lg:items-end"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-[#6CA3A2]/20">
                <Building2 className="w-8 h-8 text-[#6CA3A2]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#6CA3A2] mb-2">Stage 03 — expansion</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Scale The <span className="text-[#6CA3A2]">Empire</span></h2>
              <p className="text-[#a0a0a0] text-sm md:text-lg leading-relaxed max-w-md lg:ml-auto">
                Orchestrate your entire team. Command advanced AI models and handle complex multi-client workflows with seamless surgical precision.
              </p>
              <div className="mt-8 flex flex-col items-center lg:items-end gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#444] line-through decoration-[#6CA3A2]/50 uppercase tracking-tighter">₹4,499</span>
                  <span className="text-4xl font-black text-[#f5f5f5]">₹999</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#6CA3A2]">/ Month</span>
                </div>
                <div className="text-[9px] font-black text-[#6CA3A2] uppercase tracking-[0.2em] italic">
                  * Early Adopter: First 100 Users
                </div>
              </div>
            </motion.div>

            {/* Central Node */}
            <div className="hidden lg:flex w-12 h-12 rounded-full bg-[#1a1a1a] shadow-neu-inset border-2 border-[#6CA3A2] z-10 shrink-0 items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border border-white/5 relative overflow-hidden group hover:border-[#6CA3A2]/30 transition-colors">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#f5f5f5]">Agency Elite</h3>
                  <div className="w-10 h-10 rounded-xl bg-[#151515] shadow-neu-inset flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#6CA3A2]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    "25 Private Nodes",
                    "300 Signals/Day",
                    "5 Team Co-Pilots",
                    "Elite AI Models",
                    "Custom Dashboards",
                    "24/7 Strategic Support"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[#999999] uppercase tracking-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/40" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/signin"
                  className="block w-full text-center py-4 bg-[#1a1a1a] text-[#f5f5f5] rounded-2xl shadow-neu-raised font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-neu-inset transition-all"
                >
                  Deploy Command
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stage 4: The Summit (Enterprise) */}
          <div className="relative flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col items-center lg:items-start"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-[#9333ea]/20">
                <Crown className="w-8 h-8 text-[#9333ea]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#9333ea] mb-2">Stage 04 — supremacy</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">The <span className="text-[#9333ea]">Summit</span></h2>
              <p className="text-[#a0a0a0] text-sm md:text-lg leading-relaxed max-w-md">
                For organizations that command the market. Bespoke architecture, absolute scalability, and a dedicated tactical team.
              </p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#f5f5f5]">Custom</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9333ea]">Enterprise Protocol</span>
              </div>
            </motion.div>

            {/* Central Node */}
            <div className="hidden lg:flex w-12 h-12 rounded-full bg-[#1a1a1a] shadow-neu-inset border-2 border-[#9333ea] z-10 shrink-0 items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#9333ea] animate-pulse" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border border-[#9333ea]/30 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#f5f5f5]">Enterprise</h3>
                  <div className="w-10 h-10 rounded-xl bg-[#151515] shadow-neu-inset flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#9333ea]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    "Unlimited Everything",
                    "Custom AI Training",
                    "SLA Performance",
                    "Enterprise Security",
                    "Dedicated Architect",
                    "Bespoke Development"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[#999999] uppercase tracking-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9333ea]/40" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="block w-full text-center py-4 bg-gradient-to-br from-[#9333ea] to-[#7e22ce] text-white rounded-2xl shadow-lg font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all"
                >
                  Contact Architect
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment & FAQ Section - The Infrastructure */}
      <section className="py-40 bg-[#1a1a1a] relative">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic">Transparent <span className="text-[#6CA3A2]">Fuel.</span></h2>
            <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto font-medium opacity-70">
              Straightforward value, no hidden protocols. Built for reliability and absolute clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Accepted Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border border-white/5 col-span-1 lg:col-span-2"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#151515] shadow-neu-inset flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#6CA3A2]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Unified Billing</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 flex-grow content-start">
                  {[
                    { label: "Card Networks", desc: "Visa, MC, Amex, RuPay" },
                    { label: "UPI Gateway", desc: "GPay, PhonePe, Paytm" },
                    { label: "Net Banking", desc: "50+ Major Indian Banks" },
                    { label: "EMI Options", desc: "Credit & Debit EMI" },
                    { label: "Digital Wallets", desc: "Amazon Pay, Mobikwik" },
                    { label: "Pay Later", desc: "LazyPay, Simpl, BNPL" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 border-l border-[#6CA3A2]/10 pl-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#6CA3A2]">{item.label}</span>
                      <span className="text-sm font-bold text-[#999] leading-tight">{item.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-4 rounded-xl bg-[#151515]/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#6CA3A2]" />
                    <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest leading-relaxed">Secure Node Active. TLS 1.2 Encrypted. All prices in INR. GST documented.</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1a1a1a] px-3 py-1.5 rounded-lg shadow-neu-inset border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#444]">Payment Ops:</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6CA3A2]">PayU Secure</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Direct Channel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 md:p-10 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border border-white/5"
            >
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-[#151515] shadow-neu-inset flex items-center justify-center mb-8">
                  <MessageSquare className="w-6 h-6 text-[#FF8C42]" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Questions?</h3>
                <p className="text-sm text-[#999] font-medium leading-relaxed mb-10 flex-grow">
                  Not sure which stage fits your current momentum? Our architects are ready to guide you.
                </p>
                <div className="space-y-4">
                  <a href="mailto:hello@onereport.in" className="flex items-center gap-4 p-4 rounded-2xl bg-[#151515] shadow-neu-inset text-xs font-black uppercase tracking-widest text-[#6CA3A2] hover:shadow-neu-raised transition-all">
                    <Mail className="w-4 h-4" />
                    Mail Support
                  </a>
                  <a href="tel:+918888215802" className="flex items-center gap-4 p-4 rounded-2xl bg-[#151515] shadow-neu-inset text-xs font-black uppercase tracking-widest text-[#FF8C42] hover:shadow-neu-raised transition-all">
                    <PhoneCall className="w-4 h-4" />
                    +91 Direct
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

