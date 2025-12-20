"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Target,
    Share2,
    Activity,
    Briefcase,
    ArrowRight,
    TrendingUp,
    Users,
    MousePointer2,
    DollarSign,
    Layers,
    Zap,
    ShieldCheck,
    Cpu
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { useRef } from "react";

export default function IntegrationsPage() {
    const containerRef = useRef(null);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] overflow-x-hidden">
            {/* 
            CONTINUOUS FLOW: HERO + GOOGLE ANALYTICS
            Merging these sections for a seamless vertical journey.
            Starts at top-0 to bleed behind the transparent navbar.
        */}
            <section className="relative overflow-hidden pt-24 sm:pt-32">
                {/* SHARED BACKGROUND ELEMENTS */}
                <div className="absolute inset-0 z-0">
                    {/* GA Wavy Background - Extended to the very top */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                            <motion.path
                                d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                                fill="url(#ga-shared-gradient)"
                                animate={{
                                    d: [
                                        "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z",
                                        "M0,500 C200,600 300,400 500,500 C700,600 800,400 1000,500 L1000,1000 L0,1000 Z",
                                        "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                                    ]
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                            <defs>
                                <linearGradient id="ga-shared-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6CA3A2" />
                                    <stop offset="100%" stopColor="#FF8C42" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* HERO CONTENT */}
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 pt-16 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] shadow-neu-inset-sm mb-6 border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] animate-pulse" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#6CA3A2]">Unified Intelligence</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-tight">
                            THE DATA <br />
                            <span className="text-gradient-teal">ECOSYSTEM</span>
                        </h1>

                        <p className="text-base md:text-lg text-[#c0c0c0] max-w-xl mx-auto mb-10 font-medium leading-relaxed opacity-80">
                            OneReport harmonizes your entire marketing stack into a single lens of absolute clarity.
                        </p>

                        <div className="flex justify-center">
                            <Link
                                href="/chat"
                                className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full shadow-neu-raised hover-lift active-press transition-all duration-300 font-bold text-sm flex items-center gap-3 border border-white/5"
                            >
                                Initialize Connection
                                <ArrowRight className="w-4 h-4 text-[#6CA3A2]" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* GOOGLE ANALYTICS CONTENT */}
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 pb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-orange-500/20">
                            <BarChart3 className="w-6 h-6 text-orange-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Google <span className="text-orange-500">Analytics</span></h2>
                        <p className="text-[#c0c0c0] text-sm md:text-base leading-relaxed mb-8 opacity-90">
                            The pulse of your digital presence. We transform raw traffic into narrative-driven insights.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Behavior Modeling", icon: Users },
                                { label: "Journey Mapping", icon: TrendingUp },
                                { label: "Event Synthesis", icon: Zap },
                                { label: "Funnel Velocity", icon: Layers }
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-[#1a1a1a] shadow-neu-inset-sm flex items-center gap-2 border border-white/5">
                                    <item.icon className="w-3.5 h-3.5 text-orange-500/60" />
                                    <span className="font-bold text-[10px] uppercase tracking-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative flex justify-center">
                        <div className="w-56 h-56 md:w-64 md:h-64 relative rounded-full shadow-neu-raised-lg bg-[#151515]/50 backdrop-blur-3xl overflow-hidden border border-white/5">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3/4 h-3/4 rounded-full border border-dashed border-orange-500/20 animate-spin-slow" />
                                <div className="z-10 flex flex-col items-center">
                                    <BarChart3 className="w-20 h-20 text-orange-500 mb-3 animate-pulse" />
                                    <div className="flex flex-col items-center transform -translate-y-2">
                                        <span className="text-4xl font-black text-[#f5f5f5] leading-none tracking-tighter">98.4%</span>
                                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-orange-500/80 mt-2">Data Integrity</span>
                                    </div>
                                    {/* Advanced floating particle system */}
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, i % 2 === 0 ? -20 : 20, 0],
                                                x: [0, i > 1 ? 15 : -15, 0],
                                                opacity: [0.3, 0.7, 0.3],
                                                scale: [1, 1.2, 1]
                                            }}
                                            transition={{
                                                duration: 4 + i,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: i * 0.5
                                            }}
                                            className={`absolute w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]`}
                                            style={{
                                                top: `${20 + i * 15}%`,
                                                left: `${20 + (3 - i) * 20}%`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. GOOGLE ADS */}
            <section className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <motion.path
                            d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                            fill="url(#blue-shared-gradient)"
                            animate={{
                                d: [
                                    "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z",
                                    "M0,500 C200,600 300,400 500,500 C700,600 800,400 1000,500 L1000,1000 L0,1000 Z",
                                    "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                                ]
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="blue-shared-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:order-2"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-blue-500/20">
                            <Target className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Google <span className="text-blue-500">Ads</span></h2>
                        <p className="text-[#c0c0c0] text-sm md:text-base leading-relaxed mb-8 opacity-90">
                            Capture intent at the moment of discovery. Our AI surgically optimizes bids for peak ROI.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Intent Mapping", icon: MousePointer2, color: "text-blue-500" },
                                { label: "ROAS Velocity", icon: DollarSign, color: "text-cyan-500" }
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-[#1a1a1a] shadow-neu-inset-sm flex items-center gap-2 border border-white/5">
                                    <item.icon className={`w-3.5 h-3.5 ${item.color}/60`} />
                                    <span className="font-bold text-[10px] uppercase tracking-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative md:order-1 flex justify-center">
                        <div className="w-56 h-56 md:w-64 md:h-64 relative">
                            <div className="absolute inset-0 rounded-full bg-[#151515] shadow-neu-raised p-3">
                                <div className="w-full h-full rounded-full border border-blue-500/20 relative overflow-hidden bg-grid-white/[0.01]">
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-conic from-blue-500/20 via-transparent to-transparent origin-top-left"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Content inside Radar */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                        <Target className="w-12 h-12 text-blue-500 mb-2 animate-pulse" />
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-[#f5f5f5]">₹142.5</div>
                                            <div className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-400">Avg. CPA</div>
                                        </div>
                                    </div>
                                    {/* Acquisition blips */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1.2, 0.5]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: i * 1.5
                                            }}
                                            className="absolute w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                            style={{
                                                top: `${25 + i * 20}%`,
                                                left: `${30 + i * 25}%`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. META ADS */}
            <section className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <motion.path
                            d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                            fill="url(#meta-gradient)"
                            animate={{
                                d: [
                                    "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z",
                                    "M0,500 C200,600 300,400 500,500 C700,600 800,400 1000,500 L1000,1000 L0,1000 Z",
                                    "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                                ]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="meta-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="100%" stopColor="#db2777" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center mb-6 border border-pink-600/20">
                            <Share2 className="w-6 h-6 text-pink-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Meta <span className="text-pink-600">Network</span></h2>
                        <p className="text-[#c0c0c0] text-sm md:text-base leading-relaxed mb-8 opacity-90">
                            Commerce meets conversation. Analyze social campaigns through sentiment engagement.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Creative Fatigue", "Cross-Platform", "Intent Analysis"].map((text, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-full bg-[#1a1a1a] shadow-neu-raised-sm border border-white/5 text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                                    {text}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative flex justify-center items-center h-[300px] md:h-[400px]">
                        {/* The Constellation Base */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-blue-500/10 flex items-center justify-center relative">
                                {/* Orbiting Nodes */}
                                {[0, 120, 240].map((angle, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center border border-indigo-500/20"
                                        animate={{
                                            rotate: [0, 360],
                                            x: Math.cos(angle * Math.PI / 180) * 120,
                                            y: Math.sin(angle * Math.PI / 180) * 120,
                                        }}
                                        style={{ rotate: angle }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <div style={{ transform: `rotate(-${angle}deg)` }}>
                                            {i === 0 ? <Users className="w-5 h-5 text-indigo-500" /> :
                                                i === 1 ? <Share2 className="w-5 h-5 text-pink-500" /> :
                                                    <Activity className="w-5 h-5 text-violet-400" />}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Connecting Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                    <motion.circle
                                        cx="50%" cy="50%" r="120"
                                        fill="none"
                                        stroke="url(#constellation-grad)"
                                        strokeWidth="1"
                                        strokeDasharray="5,5"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                    />
                                    <defs>
                                        <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Central Sentiment Hub */}
                                <div className="z-10 w-24 h-24 rounded-full bg-[#1a1a1a] shadow-neu-inset flex flex-col items-center justify-center border border-pink-500/30">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-xl font-black text-[#f5f5f5]"
                                    >
                                        +14%
                                    </motion.div>
                                    <div className="text-[7px] font-bold tracking-widest uppercase text-pink-500">Sentiment</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating "Impression" Particles */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [-10, 10, -10],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 3 + i, repeat: Infinity }}
                                className="absolute w-1 h-1 rounded-full bg-pink-400/50"
                                style={{
                                    top: `${20 + (i * 15)}%`,
                                    left: `${15 + (i * 12)}%`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. LINKEDIN ADS */}
            <section className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <motion.path
                            d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                            fill="url(#li-gradient)"
                            animate={{
                                d: [
                                    "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z",
                                    "M0,500 C200,600 300,400 500,500 C700,600 800,400 1000,500 L1000,1000 L0,1000 Z",
                                    "M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
                                ]
                            }}
                            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="li-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0f172a" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="md:order-2"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#151515] shadow-neu-raised flex items-center justify-center mb-6 border border-slate-700/20">
                            <Briefcase className="w-6 h-6 text-slate-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">LinkedIn <span className="text-slate-400">Insights</span></h2>
                        <p className="text-[#c0c0c0] text-sm md:text-base leading-relaxed mb-8 opacity-90">
                            B2B engagement translated into actionable leads.
                        </p>
                        <div className="space-y-3">
                            {["Decision Maker Targeting", "Pipeline Attribution"].map((text, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a] shadow-neu-raised-sm border border-white/5">
                                    <span className="text-[10px] text-[#777] font-bold uppercase tracking-tight">{text}</span>
                                    <span className="text-[10px] text-slate-500 font-black">AI ENABLED</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="md:order-1 relative flex items-end justify-center gap-4 h-64">
                        {[
                            { h: 160, label: "IT / Ops", color: "from-slate-900/60 to-slate-800/40" },
                            { h: 200, label: "Directors", color: "from-slate-800/80 to-slate-700/60" },
                            { h: 240, label: "C-Suite", color: "from-slate-700 to-slate-500 shadow-[0_0_20px_rgba(100,116,139,0.3)]" },
                            { h: 180, label: "VPs", color: "from-slate-800/80 to-slate-700/60" },
                            { h: 140, label: "Managers", color: "from-slate-900/60 to-slate-800/40" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    whileInView={{ height: item.h, opacity: 1 }}
                                    transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                                    className={`w-8 md:w-10 rounded-t-xl bg-gradient-to-t ${item.color} shadow-neu-raised flex items-start justify-center pt-2`}
                                >
                                    {i === 2 && (
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        />
                                    )}
                                </motion.div>
                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-slate-600">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE CAPABILITIES - COMPACT GRID */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-20 text-center tracking-tighter uppercase">Core <span className="text-[#6CA3A2]">Synthesis</span></h2>

                    <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#6CA3A2]/20 to-transparent" />

                        {[
                            { icon: Cpu, title: "Neural Sync", desc: "Cross-platform anomaly detection via neural correlation.", gradient: "from-teal-500/20" },
                            { icon: ShieldCheck, title: "Enterprise Sec", desc: "AES-256 standard with multi-layered OAuth 2.0.", gradient: "from-blue-500/20" },
                            { icon: TrendingUp, title: "Data Velocity", desc: "Predictive modeling based on historical momentum.", gradient: "from-indigo-500/20" }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 group">
                                <div className={`w-24 h-24 rounded-3xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center mb-8 border border-white/5 relative overflow-hidden group-hover:border-[#6CA3A2]/30 transition-colors`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <item.icon className="w-10 h-10 text-[#6CA3A2] relative z-10" />
                                </div>
                                <h3 className="text-xl font-black mb-3 tracking-tight uppercase">{item.title}</h3>
                                <p className="text-[#999999] text-xs leading-relaxed max-w-[240px] mx-auto">{item.desc}</p>

                                {/* Pulse Indicator */}
                                <div className="absolute top-12 -right-2 hidden md:block">
                                    {i < 2 && (
                                        <motion.div
                                            animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-1 h-1 rounded-full bg-[#6CA3A2]"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMPACT CTA */}
            <section className="py-40 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none tracking-tighter uppercase italic">
                            System <span className="text-[#6CA3A2]">Ready.</span>
                        </h2>
                        <p className="text-[#999999] text-base md:text-xl mb-12 max-w-2xl mx-auto font-medium tracking-tight opacity-70">
                            Experience the convergence of data and intelligence. Your ecosystem is waiting for its brain.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                            <Link
                                href="/chat"
                                className="group relative px-12 py-4 bg-[#6CA3A2] text-white rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6CA3A2]/10"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 font-black uppercase tracking-widest text-xs">Initialize Chat</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="px-12 py-4 bg-[#1a1a1a] text-[#f5f5f5] rounded-2xl shadow-neu-raised border border-white/5 transition-all hover:shadow-neu-inset font-black uppercase tracking-widest text-xs"
                            >
                                Custom Protocol
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .bg-gradient-conic {
          background: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
        </main>
    );
}
