"use client";

import { motion } from "framer-motion";
import { Activity, Database, Network, Cpu, Sparkles, Zap, MessageSquare, Target, Lightbulb, TrendingUp } from "lucide-react";

export function AIProductivityVision() {
    const dataNodes = [
        {
            id: "SIG_01",
            icon: Lightbulb,
            title: "Unseen Insights",
            tagline: "Things You Never Thought Of",
            description: "Our agent uncovers deep-tier marketing anomalies and correlations that standard dashboards fail to surface.",
            color: "#6CA3A2"
        },
        {
            id: "SIG_02",
            icon: Network,
            title: "Data Learning",
            tagline: "Interrogate Your Own Data",
            description: "Don't just read reports; learn from them. Deep analysis reveals the actual causes behind your performance shifts.",
            color: "#FF8C42"
        },
        {
            id: "SIG_03",
            icon: Cpu,
            title: "Goal-Driven Logic",
            tagline: "Agentic Recommendation Engine",
            description: "Receive strategic actions that evolve based on your specific business goals and real-time interaction.",
            color: "#6CA3A2"
        }
    ];

    return (
        <section id="mission" className="relative bg-[#1a1a1a] pt-20 pb-40 sm:pt-28 sm:pb-56 overflow-hidden border-t border-white/5">
            {/* Unique Synaptic Pulse Mesh Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Deep Atmospheric Base */}
                <div className="absolute inset-0 bg-radial-gradient from-[#6CA3A2]/5 via-transparent to-transparent opacity-30" />

                {/* Synaptic Pathway 01 */}
                <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <motion.path
                        d="M -100 100 Q 300 500 700 100 T 1500 300"
                        fill="none"
                        stroke="#6CA3A2"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle r="2" fill="#6CA3A2">
                        <animateMotion dur="8s" repeatCount="indefinite" path="M -100 100 Q 300 500 700 100 T 1500 300" />
                    </motion.circle>
                </svg>

                {/* Synaptic Pathway 02 */}
                <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
                    <motion.path
                        d="M 1500 800 Q 1000 400 600 900 T -100 700"
                        fill="none"
                        stroke="#FF8C42"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle r="1.5" fill="#FF8C42">
                        <animateMotion dur="12s" repeatCount="indefinite" path="M 1500 800 Q 1000 400 600 900 T -100 700" />
                    </motion.circle>
                </svg>

                {/* Floating Data Nodes - Non-linear drift */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [0, ((i * 37) % 100 - 50), 0],
                            y: [0, ((i * 41) % 100 - 50), 0],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 10 + ((i * 13) % 10),
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1 h-1 bg-[#6CA3A2] rounded-full blur-[1px]"
                        style={{
                            left: `${((i * 17) % 95 + 2).toFixed(2)}%`,
                            top: `${((i * 23) % 95 + 2).toFixed(2)}%`
                        }}
                    />
                ))}

                {/* Subtle Ambient Scan - Diagonal Wash */}
                <motion.div
                    animate={{
                        rotate: [45, 45],
                        x: ["-100%", "200%"]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 w-full h-[500px] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"
                    style={{ transform: "rotate(45deg)" }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-20 sm:gap-24">

                    {/* 01. The Mission Thesis - Productivity First */}
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-10"
                        >
                            <div className="w-12 h-[1px] bg-[#6CA3A2]" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-12"
                        >
                            <span className="text-[#FF8C42]">Productivity</span> is <br />
                            our <span className="text-[#6CA3A2] italic text-glow-teal">First Priority</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-[#888] font-medium leading-tight max-w-2xl"
                        >
                            In this AI world, traditional reporting is a bottleneck. We’ve changed the approach to a
                            <span className="text-white"> productive chat-based workflow </span> designed to boost performance for everyone.
                        </motion.p>
                    </div>

                    {/* 02. The Data Synthesis Stage - Deep Analysis & Hidden Insights */}
                    <div className="relative">
                        {/* Horizontal Flow Line */}
                        <div className="absolute top-[60px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 relative">
                            {dataNodes.map((node, index) => (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group"
                                >
                                    {/* Phase Marker */}
                                    <div className="flex items-center gap-4 mb-12 relative">
                                        <div className="w-10 h-10 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center relative z-20 group-hover:scale-125 group-hover:bg-[#6CA3A2]/20 group-hover:border-[#6CA3A2]/50 transition-all duration-500 shadow-neu-inset">
                                            <node.icon className="w-4 h-4" style={{ color: node.color }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-[#6CA3A2] uppercase tracking-widest">{node.tagline}</span>
                                        </div>
                                    </div>

                                    {/* Content - Intentional Typography */}
                                    <div className="pl-4 border-l-2 border-white/5 group-hover:border-[#6CA3A2]/30 transition-colors duration-500">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                                            {node.title}
                                        </h3>
                                        <p className="text-sm text-[#888] font-medium leading-relaxed max-w-xs group-hover:text-[#c0c0c0] transition-colors">
                                            {node.description}
                                        </p>

                                        {/* Diagnostic Bit Pattern */}
                                        <div className="mt-8 flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-4 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        animate={{ x: [-4, 4] }}
                                                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
                                                        className="w-full h-full bg-[#6CA3A2]/40"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 03. Approach Transformation - Everyone Type of User */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 pt-24 mt-24 border-t border-white/5 relative">
                        {/* Dynamic Background Atmospheric Layer - Deep Black Void */}
                        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black blur-[120px] rounded-full pointer-events-none opacity-80" />

                        <div className="lg:w-[45%] flex justify-center items-center relative min-h-[500px]">
                            {/* Scaling Agent Avatar - Purely visual scaling indicator */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative flex items-center justify-center"
                            >
                                {/* Cute Friendly Agentic Robot - Visibility Enhanced */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-30 flex flex-col items-center"
                                >
                                    {/* Robot Head with Glass Faceplate & Sensors - Darker 3D Chassis */}
                                    <motion.div
                                        animate={{ rotate: [-2, 2, -2] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative w-24 h-20 sm:w-28 sm:h-24 bg-[#0f0f0f] border-2 border-[#6CA3A2]/60 rounded-[2.5rem] shadow-[0_0_25px_rgba(108,163,162,0.15),inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden"
                                    >
                                        {/* Physical Rim Light Highlight */}
                                        <div className="absolute inset-0 border-[3px] border-t-white/10 border-l-white/5 border-r-transparent border-b-transparent rounded-[2.5rem] z-20 pointer-events-none" />

                                        {/* Glass Faceplate Reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#6CA3A2]/15 via-transparent to-white/5 z-20 pointer-events-none" />
                                        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent z-20 pointer-events-none skew-y-[-15deg] translate-y-[-25%]" />

                                        {/* Head Side Sensors (Antennas) */}
                                        <div className="absolute top-2 left-4 w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/50 animate-pulse z-30" />
                                        <div className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/50 animate-pulse delay-700 z-30" />

                                        {/* Inner Shadow Mesh / Mechanical Detail - Deep Obsidian */}
                                        <div className="absolute inset-1 bg-[#0a0a0a] rounded-[2.3rem] shadow-[inset_0_0_15px_black] z-10">
                                            <div className="absolute inset-0 opacity-10"
                                                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                                        </div>

                                        {/* Large Circular Expressive Eyes - Higher Intensity */}
                                        <div className="flex gap-6 relative z-30">
                                            {[1, 2].map(eye => (
                                                <motion.div
                                                    key={eye}
                                                    animate={{
                                                        scaleY: [1, 1, 0.1, 1, 1],
                                                        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        times: [0, 0.45, 0.5, 0.55, 1],
                                                        delay: eye * 0.1
                                                    }}
                                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#6CA3A2] shadow-[0_0_25px_#6CA3A2,0_0_10px_#fff]"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Body Segment - Harmonized obsidian with Metallic Rim */}
                                    <div className="relative mt-2 flex flex-col items-center">
                                        <div className="w-16 h-14 sm:w-20 sm:h-16 bg-[#0f0f0f] rounded-[1.8rem] border-2 border-[#6CA3A2]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_2px_8px_rgba(255,255,255,0.08)] flex flex-col items-center justify-center relative overflow-visible">
                                            {/* Body Rim Light Highlight */}
                                            <div className="absolute inset-0 border-[2px] border-t-white/10 border-l-white/5 border-r-transparent border-b-transparent rounded-[1.8rem] z-20 pointer-events-none" />

                                            {/* Body Panel Lines */}
                                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/60 z-20" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                                            {/* Advanced Energy Core */}
                                            <div className="w-10 h-3 rounded-full bg-[#050505] border border-white/5 flex items-center px-1 gap-1 relative z-10 shadow-inner">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{
                                                                opacity: [0.3, 1, 0.3],
                                                                backgroundColor: ['#FF8C42', '#6CA3A2', '#FF8C42']
                                                            }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                                            className="w-1.5 h-1.5 rounded-sm"
                                                        />
                                                    ))}
                                                </div>
                                                <div className="ml-auto w-1 h-1 rounded-full bg-[#6CA3A2] shadow-[0_0_8px_#6CA3A2]" />
                                            </div>

                                            {/* Status LED */}
                                            <div className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-[#FF8C42] shadow-[0_0_8px_#FF8C42]" />

                                            {/* Single Integrated Waving Hand - Harmonized Design */}
                                            <motion.div
                                                animate={{
                                                    rotate: [35, 65, 35],
                                                    y: [0, -1, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="absolute -right-4 -top-3 w-3 h-8 bg-[#1a1a1a] border-2 border-[#6CA3A2]/60 rounded-full flex flex-col items-center justify-start p-1 shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_15px_rgba(108,163,162,0.3)] origin-bottom-left z-30"
                                            >
                                                {/* Hand Glow Core */}
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] shadow-[0_0_12px_#6CA3A2,0_0_5px_#fff]" />
                                                <div className="mt-1 w-0.5 h-2 bg-[#6CA3A2]/60 rounded-full shadow-[0_0_5px_rgba(108,163,162,0.5)]" />
                                            </motion.div>
                                        </div>

                                        {/* Bottom Propulsor - Intense Glow */}
                                        <div className="w-8 h-4 bg-gradient-to-b from-[#6CA3A2]/60 to-transparent rounded-full -mt-1 blur-[1px]">
                                            <motion.div
                                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="w-full h-full bg-[#6CA3A2] blur-md"
                                            />
                                        </div>
                                    </div>

                                    {/* High-Contrast Under-Shadow for Silhouette Separation */}
                                    <div className="absolute -bottom-16 w-32 h-32 bg-black blur-[45px] rounded-full mix-blend-multiply" />
                                </motion.div>

                                {/* Radiating Scale Fields - Expanded to 8 Rings with Higher Visibility */}
                                {[
                                    { s: 'w-[550px] h-[550px]', c: '#6CA3A2', o: '15', r: 60, d: 35 }, // Extended Scale 4
                                    { s: 'w-[480px] h-[480px]', c: '#FF8C42', o: '20', r: 50, d: 30 }, // Extended Scale 3
                                    { s: 'w-[410px] h-[410px]', c: '#6CA3A2', o: '25', r: 45, d: 28 }, // Extended Scale 2
                                    { s: 'w-[350px] h-[350px]', c: '#FF8C42', o: '30', r: 40, d: 25 }, // Extended Scale 1
                                    { s: 'w-80 h-80', c: '#6CA3A2', o: '40', r: 35, d: 22 }, // Agency
                                    { s: 'w-64 h-64', c: '#FF8C42', o: '50', r: 30, d: 18 }, // Individual
                                    { s: 'w-48 h-48', c: '#6CA3A2', o: '60', r: 25, d: 15 }, // Freelancer
                                    { s: 'w-32 h-32', c: '#FF8C42', o: '75', r: 20, d: 12 }  // Student
                                ].map((ring, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            rotate: i % 2 === 0 ? 360 : -360,
                                            scale: [1, 1.01, 1]
                                        }}
                                        transition={{
                                            rotate: { duration: ring.r, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 5, repeat: Infinity, delay: i * 0.4 }
                                        }}
                                        className={`absolute ${ring.s} rounded-full border flex items-center justify-center group pointer-events-none`}
                                        style={{
                                            borderColor: `${ring.c}${ring.o}`,
                                            boxShadow: `0 0 15px ${ring.c}${Math.floor(parseInt(ring.o, 16) / 2).toString(16).padStart(2, '0')}`
                                        }}
                                    >
                                        {/* Logic Density Particles in this scale field */}
                                        <div className="absolute inset-0">
                                            {[...Array(ring.d)].map((_, j) => (
                                                <motion.div
                                                    key={j}
                                                    animate={{ opacity: [0.05, 0.4, 0.05] }}
                                                    transition={{ duration: 3 + ((j * 17 + i * 31) % 4), repeat: Infinity }}
                                                    className="absolute w-[1.5px] h-[1.5px] rounded-full"
                                                    style={{
                                                        backgroundColor: ring.c,
                                                        left: `${(Math.cos(j * (360 / ring.d) * (Math.PI / 180)) * 50 + 50).toFixed(4)}%`,
                                                        top: `${(Math.sin(j * (360 / ring.d) * (Math.PI / 180)) * 50 + 50).toFixed(4)}%`
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Activity Pulse Ring Overlay */}
                                        <div className="absolute inset-0 rounded-full border-t border-transparent transition-colors duration-1000"
                                            style={{ borderTopColor: `${ring.c}20` }} />
                                    </motion.div>
                                ))}

                                {/* Deep Ambient Black Void Glow */}
                                <div className="absolute w-[400px] h-[400px] bg-black blur-[120px] rounded-full -z-10 opacity-70" />
                            </motion.div>
                        </div>

                        <div className="lg:w-[50%] space-y-12 relative z-10">
                            <div className="space-y-4 text-center lg:text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-3 mb-2"
                                >
                                    <span className="w-6 h-[2px] bg-[#6CA3A2]" />
                                </motion.div>

                                <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                                    Better Results <br />
                                    <span className="relative inline-block text-[#6CA3A2] italic mt-1 pb-1">
                                        for Every Scale
                                        <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6CA3A2]/40 to-transparent" />
                                    </span>
                                </h3>

                                <p className="text-base md:text-lg text-[#848484] font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    A singular <span className="text-white font-bold">agentic architecture</span> that adapts its logic density based on your unique operation depth.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 relative mt-10">
                                {/* Vertical Connection Spine */}
                                <div className="absolute left-6 lg:left-8 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />

                                {[
                                    { l: 'Students', d: 'Master Data Learning', i: Target, color: '#6CA3A2', id: '01' },
                                    { l: 'Freelancers', d: 'Boost Daily Output', i: Zap, color: '#FF8C42', id: '02' },
                                    { l: 'Individuals', d: 'Deep Niche Insights', i: Lightbulb, color: '#6CA3A2', id: '03' },
                                    { l: 'Agencies', d: 'Multi-Client Strategy', i: TrendingUp, color: '#FF8C42', id: '04' }
                                ].map((tier, index) => (
                                    <motion.div
                                        key={tier.l}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative flex items-center gap-6 sm:gap-10 p-2"
                                    >
                                        {/* Status Node */}
                                        <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#151515] border border-white/5 shadow-neu-raised flex items-center justify-center shrink-0 group-hover:border-[#6CA3A2]/30 transition-all duration-500 group-hover:scale-105">
                                            <tier.i className="w-4 h-4 transition-colors duration-500" style={{ color: tier.color }} />
                                            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#6CA3A2] animate-pulse opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#6CA3A2]" />
                                        </div>

                                        <div className="flex-1 pb-4 border-b border-white/[0.03] relative">
                                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-[8px] font-black text-[#555] uppercase tracking-[0.2em] group-hover:text-[#6CA3A2] transition-colors">{tier.d}</div>
                                                    </div>
                                                    <div className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter group-hover:text-glow-teal transition-all duration-500 leading-none">
                                                        {tier.l}
                                                    </div>
                                                </div>

                                                {/* Status Indicator (Subtle) */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                    <div className="w-1 h-1 rounded-full bg-[#6CA3A2]" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
