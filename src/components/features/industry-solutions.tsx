"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Building2, Rocket, Briefcase, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";

const sectors = [
    {
        id: "01",
        slug: "ecommerce",
        label: "ECOMMERCE",
        title: "E-commerce & D2C",
        description: "Scale your store with precision. Our AI identifies which campaigns drive true profit, moving beyond basic ROAS to uncover real growth opportunities.",
        points: ["Revenue Attribution", "Profitable Scale", "Customer Acquisition"],
        icon: ShoppingCart,
        color: "#6CA3A2",
        angle: 0
    },
    {
        id: "02",
        slug: "saas",
        label: "SAAS",
        title: "SaaS & Tech",
        description: "Analyze the full lifecycle of your users. From LinkedIn awareness to trial conversion, understand exactly where your most valuable customers come from.",
        points: ["Subscription Health", "LTV : CAC Analysis", "User Retention"],
        icon: Rocket,
        color: "#FF8C42",
        angle: 72
    },
    {
        id: "03",
        slug: "realestate",
        label: "PROP_TECH",
        title: "Real Estate",
        description: "Focus on results, not just numbers. Track high-intent lead quality and booking trends to ensure your marketing spend turns into property viewings.",
        points: ["High-Intent Leads", "Location Reach", "Booking Trends"],
        icon: Building2,
        color: "#E74C3C",
        angle: 144
    },
    {
        id: "04",
        slug: "local",
        label: "LOCAL_SVC",
        title: "Local Business",
        description: "Connect digital ads to physical visits. We help you track call volume and map rankings to show the direct impact of marketing on your local footprint.",
        points: ["Call Tracking", "Map Rankings", "Physical Visits"],
        icon: Briefcase,
        color: "#6CA3A2",
        angle: 216
    },
    {
        id: "05",
        slug: "edtech",
        label: "EDTECH",
        title: "EdTech & Education",
        description: "Maximize enrollment efficiency. Use AI to audit admission funnels in real-time, preventing budget waste during critical student recruitment cycles.",
        points: ["Enrollment Tracking", "Lead Cost Audit", "Funnel Efficiency"],
        icon: GraduationCap,
        color: "#FF8C42",
        angle: 288
    }
];

export function IndustrySolutions() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(2);
    const containerRef = useRef<HTMLDivElement>(null);

    // Interactive Mouse Tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth Springs for fluid motion
    const springX = useSpring(mouseX, { stiffness: 40, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 40, damping: 30 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };

        const handleHashSync = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#solutions-')) {
                const slug = hash.replace('#solutions-', '');
                const index = sectors.findIndex(s => s.slug === slug);
                if (index !== -1) setActiveIndex(index);
            }
        };

        handleHashSync();
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("hashchange", handleHashSync);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("hashchange", handleHashSync);
        };
    }, [mouseX, mouseY]);

    // Parallax transforms for elements
    const orbX = useTransform(springX, [-0.5, 0.5], ["-15%", "15%"]);
    const orbY = useTransform(springY, [-0.5, 0.5], ["-15%", "15%"]);
    const meshSkew = useTransform(springX, [-0.5, 0.5], [-5, 5]);

    const getPos = (angle: number, radius: number) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: Math.cos(rad) * radius,
            y: Math.sin(rad) * radius
        };
    };

    return (
        <section
            ref={containerRef}
            id="solutions"
            className="bg-[#1a1a1a] py-12 sm:py-20 relative overflow-hidden flex flex-col items-center"
        >

            {/* AGENTIC BLACKHOLE BACKGROUND - Artistic Depth Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* SVG Filter for Gravitational Lensing Distortion */}
                <svg className="absolute w-0 h-0">
                    <defs>
                        <filter id="blackholeDistortion">
                            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>
                </svg>

                {/* Content-Anchored Container (Matches Hub Position) */}
                <div className="max-w-7xl mx-auto px-6 h-full relative">
                    <div className="absolute top-1/2 right-0 w-full lg:w-[450px] aspect-square -translate-y-1/2 flex items-center justify-center">

                        {/* 1. Deep Event Horizon - The Central Void */}
                        <motion.div
                            style={{
                                x: useTransform(springX, [-0.5, 0.5], ["-6px", "6px"]),
                                y: useTransform(springY, [-0.5, 0.5], ["-6px", "6px"]),
                            }}
                            className="absolute w-[120px] h-[120px] bg-black rounded-full z-40 shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_40px_rgba(0,0,0,1)]"
                        />

                        {/* 2. Photon Sphere - Extreme Energy Vibration */}
                        <motion.div
                            animate={{
                                scale: [1, 1.03, 0.98, 1.01, 1],
                                opacity: [0.7, 1, 0.8, 1, 0.7],
                            }}
                            transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[126px] h-[126px] rounded-full border-[2px] border-white/60 z-30 blur-[1px] shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        />

                        {/* 3. Einstein Ring - Relativistic Light Lensing */}
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="absolute w-[160px] h-[160px] rounded-full border border-white/10 z-20 blur-[3px]"
                        />

                        {/* 4. The Accretion Disk - Relativistic Doppler Effect */}
                        <div className="absolute w-[480px] h-[480px] z-10 opacity-70 mix-blend-screen" style={{ filter: 'url(#blackholeDistortion)' }}>
                            {/* Primary Rotating Disk with Shifting Intensity */}
                            <motion.div
                                animate={{ rotate: 360, opacity: [0.5, 0.8, 0.5] }}
                                transition={{
                                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,#6CA3A2_30deg,#f5f5f5_90deg,transparent_150deg,#FF8C42_240deg,#f5f5f5_270deg,transparent_360deg)] blur-[50px]"
                            />

                            {/* Inner High-Velocity Stream */}
                            <motion.div
                                animate={{ rotate: 720 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[15%] rounded-full bg-[conic-gradient(from_180deg,transparent_0deg,#6CA3A2_120deg,transparent_240deg,#FF8C42_300deg,transparent_360deg)] blur-[30px] opacity-40"
                            />
                        </div>

                        {/* 5. Gaseous Envelope & Gravitational Bloom */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(108,163,162,0.08)_0%,transparent_70%)] mix-blend-screen z-0"
                        />
                    </div>
                </div>

                {/* Grain Overlay for Texture Consistency */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-24">

                {/* Left: Interactive Radial Hub */}
                <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center lg:flex-shrink-0">

                    {/* Event Horizon Spicules - Dynamic energy filaments */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                        {sectors.map((sector, i) => {
                            const isActive = i === activeIndex;
                            const isHovered = i === hoveredIndex;

                            return (
                                <motion.g key={`spicule-${i}`}>
                                    <defs>
                                        <linearGradient id={`pulse-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="transparent" />
                                            <stop offset="50%" stopColor={sector.color} stopOpacity={isActive ? "0.6" : "0.1"} />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                    <motion.path
                                        d="M 225 225 L 225 35"
                                        stroke={`url(#pulse-grad-${i})`}
                                        strokeWidth={isActive ? "2" : "1"}
                                        strokeDasharray="4 12"
                                        animate={{
                                            rotate: [sector.angle, sector.angle + 360],
                                            strokeDashoffset: [0, -40],
                                            opacity: isActive ? 1 : (isHovered ? 0.4 : 0)
                                        }}
                                        transition={{
                                            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                            strokeDashoffset: { duration: 0.5, repeat: Infinity, ease: "linear" },
                                            opacity: { duration: 0.3 }
                                        }}
                                        style={{ transformOrigin: "225px 225px" }}
                                    />
                                </motion.g>
                            );
                        })}
                    </svg>

                    {/* Kinetic Orbital Ring - Synchronized with Blackhole Rotation */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        {sectors.map((sector, i) => {
                            const isActive = i === activeIndex;
                            const isHovered = i === hoveredIndex;

                            return (
                                <div
                                    key={sector.id}
                                    className="absolute"
                                    style={{
                                        transform: `rotate(${sector.angle}deg) translateX(190px)`
                                    }}
                                >
                                    <motion.button
                                        id={`solutions-${sector.slug}`}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onClick={() => setActiveIndex(i)}
                                        aria-label={`View ${sector.title} solution`}
                                        aria-pressed={isActive}
                                        // Counter-rotate to stay upright & scale on hover/active
                                        animate={{
                                            rotate: -360,
                                            scale: isActive ? 1.25 : isHovered ? 1.15 : 1,
                                            filter: isActive ? 'drop-shadow(0 0 15px rgba(255,255,255,0.2))' : 'none'
                                        }}
                                        transition={{
                                            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                            scale: { type: "spring", stiffness: 300, damping: 20 }
                                        }}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-30 group pointer-events-auto overflow-hidden ${isActive
                                            ? "bg-black border-white/20 shadow-[0_0_40px_rgba(0,0,0,1)]"
                                            : "bg-[#0f0f0f]/80 backdrop-blur-sm border-white/[0.05] shadow-lg hover:border-white/20"
                                            } border relative`}
                                    >
                                        {/* Relativistic Rim Light - Glow facing the center */}
                                        <div className={`absolute -left-1 -top-1 w-full h-full bg-[radial-gradient(circle_at_0%_50%,${sector.color}44_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        <sector.icon className={`w-5 h-5 transition-all duration-500 z-10 ${isActive ? "text-[#f5f5f5] scale-110" : "text-[#666] group-hover:text-white"
                                            }`} style={{ color: isActive ? '#f5f5f5' : (isHovered ? sector.color : undefined) }} />
                                    </motion.button>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Right: Immersive Sector Display */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-start">

                    <div className="w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="w-1 h-px bg-[#6CA3A2] w-6" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#444]">Sector Matrix</span>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-5xl md:text-7xl font-black text-[#f5f5f5] uppercase tracking-tighter leading-[0.85] italic">
                                        {sectors[activeIndex].title.split(" & ")[0]} <br />
                                        <span className="text-gradient-teal">{sectors[activeIndex].title.split(" & ")[1] || sectors[activeIndex].label}</span>
                                    </h2>
                                </div>

                                <p className="text-lg md:text-xl text-[#888] leading-relaxed font-medium max-w-xl border-l border-white/5 pl-6">
                                    {sectors[activeIndex].description}
                                </p>

                                {/* Marketer-Friendly Points */}
                                <div className="grid grid-cols-1 gap-4 pt-4">
                                    {sectors[activeIndex].points.map((point, i) => (
                                        <motion.div
                                            key={point}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 + 0.2 }}
                                            className="flex items-center gap-4 group"
                                        >
                                            <div className="w-5 h-5 rounded-md bg-[#0f0f0f] border border-white/[0.05] flex items-center justify-center group-hover:border-[#6CA3A2]/20 transition-colors">
                                                <CheckCircle2 className="w-3 h-3 text-[#6CA3A2] opacity-40 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-base sm:text-lg font-bold text-[#e5e5e5] tracking-tight group-hover:text-[#6CA3A2] transition-colors">
                                                {point}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="mt-16 flex items-center gap-2">
                        {sectors.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "bg-[#6CA3A2] w-10" : "bg-white/[0.05] w-4 hover:bg-white/[0.1]"
                                    }`}
                                aria-label={`Switch to ${s.title}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
}
