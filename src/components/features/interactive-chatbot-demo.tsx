"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
    Bot,
    MessageSquare,
    LayoutDashboard,
    BarChart3,
    Target,
    Share2,
    Briefcase,
    ChevronDown,
    MessageSquarePlus,
    History,
    Send,
    Sparkles,
    ShieldAlert,
    Activity,
    X,
    TrendingUp,
    Cpu,
    MousePointerClick,
    Users,
    Zap,
    Clock,
    Search,
    Settings,
    Plus,
    Eye,
    Check,
    Globe
} from "lucide-react";

type Platform = 'all' | 'googleAnalytics' | 'googleAds' | 'metaAds' | 'linkedInAds';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    id: string;
}

export function InteractiveChatbotDemo() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typedChars, setTypedChars] = useState("");
    const [activePlatform, setActivePlatform] = useState<Platform>('all');
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState(0);
    const isRunningRef = useRef(false);

    const turns = [
        {
            user: "Analyze my website traffic quality",
            assistant: "### TRAFFIC HEALTH SCORE: 62/100\n\n* **Engagement Rate**: 53.5%\n* **Bounce Rate**: 46.5%\n* **Avg Session Duration**: 5m 2s\n\n**KEY FINDINGS**\n\n* **Direct Traffic Dominance**: 71% of total sessions came from direct sources, indicating brand strength but low SEO discovery.\n* **Low User Acquisition**: Only 48 unique users detected in 30 days.\n* **Exit Strategy**: Your homepage has a 45% exit rate, which is healthy for landing nodes.",
            platform: 'googleAnalytics' as Platform,
            metrics: [
                { l: "Users", v: "48", i: Users },
                { l: "Sessions", v: "86", i: MousePointerClick },
                { l: "Pageviews", v: "242", i: Eye },
                { l: "Engagement", v: "53.5%", i: Activity },
                { l: "Bounce Rate", v: "46.5%", i: TrendingUp },
                { l: "Conv. Rate", v: "2.1%", i: Check }
            ]
        },
        {
            user: "Audit Google Ads ROAS by device category",
            assistant: "### DEVICE PERFORMANCE AUDIT\n\n* **Mobile**: 1.2x ROAS (High Spend, Low Conv)\n* **Desktop**: 4.8x ROAS (Stable Growth)\n* **Tablet**: 0.0x ROAS (Wasted Budget)\n\n**DIAGNOSTIC RECOMMENDATION**\n\nExclude **Tablet** devices from 'Search_Branded' campaign immediately to save **$1,400/mo**. Shift that budget to Desktop for a projected 15% ROAS lift.",
            platform: 'googleAds' as Platform,
            metrics: [
                { l: "Mobile ROAS", v: "1.2x", i: TrendingUp },
                { l: "Desktop ROAS", v: "4.8x", i: TrendingUp },
                { l: "Impressions", v: "142K", i: Eye },
                { l: "CPC", v: "$1.84", i: Target },
                { l: "CTR", v: "3.2%", i: Activity },
                { l: "Wasted Spend", v: "$1.4K", i: Zap }
            ]
        },
        {
            user: "Identify drop-off points in Meta Ads conversion funnel",
            assistant: "### FUNNEL FRICTION ANALYSIS\n\n* **Top-of-Funnel**: 8.2% Link Click-through rate (Healthy)\n* **Middle-of-Funnel**: 42% Add-to-cart rate (Slight Drop)\n* **Bottom-of-Funnel**: 2% Checkout completion (Critical Node)\n\n**ROOT CAUSE**\n\nUsers are dropping off at the **Shipping Info** stage. Check for hidden shipping costs or long lead times.",
            platform: 'metaAds' as Platform,
            metrics: [
                { l: "CTR (Link)", v: "8.2%", i: Activity },
                { l: "ATC Rate", v: "42%", i: MousePointerClick },
                { l: "Checkouts", v: "12", i: Target },
                { l: "Abandoned", v: "98", i: TrendingUp },
                { l: "CPM", v: "$14.20", i: BarChart3 },
                { l: "Reach", v: "84K", i: Users }
            ]
        },
        {
            user: "Compare Meta vs Google Ads CPC for 'Spring' campaign",
            assistant: "### CROSS-CHANNEL CPC COMPARISON\n\n* **Meta Ads**: $1.12 (Audience Targeting)\n* **Google Ads**: $2.45 (Keyword Intent)\n\n**OBSERVATION**\n\nWhile Google is 2x more expensive, the **Conversion Intent** is 4x higher. Meta is serving as a great top-of-funnel awareness engine, while Google is closing the sales.",
            platform: 'all' as Platform,
            metrics: [
                { l: "Meta CPC", v: "$1.12", i: Target },
                { l: "Google CPC", v: "$2.45", i: Target },
                { l: "Total Spend", v: "$8,420", i: TrendingUp },
                { l: "Total Conv", v: "142", i: Check },
                { l: "Avg CTR", v: "2.8%", i: Activity },
                { l: "Blended ROAS", v: "3.4x", i: TrendingUp }
            ]
        },
        {
            user: "Surface underperforming landing pages (>60% bounce)",
            assistant: "### CRITICAL PAGE ALERT\n\n1. **/products/legacy-series**: 84% Bounce Rate\n2. **/offer/summer-flash**: 72% Bounce Rate\n\n**DIAGNOSTIC**\n\nHigh layout shift (CLS) detected on '/legacy-series'. Mobile users are leaving within 2 seconds of the first paint.",
            platform: 'googleAnalytics' as Platform,
            metrics: [
                { l: "Avg Bounce", v: "52%", i: TrendingUp },
                { l: "CLS Score", v: "0.24", i: Activity },
                { l: "LCP", v: "4.2s", i: Clock },
                { l: "Page Speed", v: "42/100", i: Zap },
                { l: "Mobile Traffic", v: "84%", i: Users },
                { l: "Conversion", v: "0.8%", i: Target }
            ]
        }
    ];

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping, typedChars]);

    useEffect(() => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;

        const runSequence = async () => {
            let turnIndex = 0;

            while (true) {
                setMessages([]); // Clear previous to show one at a time as requested
                setStep(0);
                setActivePlatform('all');
                await new Promise(r => setTimeout(r, 4000));

                const turn = turns[turnIndex];

                // Typing
                setStep(1);
                for (let i = 0; i <= turn.user.length; i++) {
                    setTypedChars(turn.user.slice(0, i));
                    await new Promise(r => setTimeout(r, 30));
                }
                await new Promise(r => setTimeout(r, 800));

                setMessages([{ role: 'user', content: turn.user, id: `u-${turnIndex}-${Date.now()}` }]);
                setTypedChars("");

                // Thinking
                setStep(2);
                setIsTyping(true);
                setActivePlatform(turn.platform);
                await new Promise(r => setTimeout(r, 2000));

                // Responding
                setIsTyping(false);
                setMessages(prev => [...prev, { role: 'assistant', content: turn.assistant, id: `a-${turnIndex}-${Date.now()}` }]);
                setStep(3);

                await new Promise(r => setTimeout(r, 10000));

                turnIndex = (turnIndex + 1) % turns.length;
            }
        };

        runSequence();
    }, []);

    return (
        <section id="demo" className="relative bg-[#1a1a1a] py-20 sm:py-28 overflow-hidden border-t border-white/5">
            {/* Background Decorative Elements for Continuity */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#6CA3A2]/5 via-transparent to-transparent blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF8C42]/2 blur-[140px] rounded-full pointer-events-none opacity-50" />

            <div className="max-w-[1700px] mx-auto px-4 md:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a1a] shadow-neu-inset border border-white/5 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-[#6CA3A2]">Agentic Intelligence Hud</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8"
                    >
                        Productivity Over <span className="text-[#6CA3A2] italic">Manual Patterns</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-[#888] max-w-3xl mx-auto font-medium leading-relaxed"
                    >
                        Stop wasting hours manually recognizing problem and solution patterns by digging through reporting dashboards.
                        We believe in bringing out <span className="text-white italic">productivity and real results</span> that actually matter, delivered instantly.
                    </motion.p>
                </div>

                {/* Compact & Precise UI Layout - Responsive Update */}
                <div className="relative min-h-[600px] lg:h-[720px] w-full bg-[#0d0d0d] rounded-[2rem] border border-[#222] shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] flex flex-col lg:flex-row overflow-hidden flex-nowrap">

                    {/* SIDEBAR - Hidden on Mobile/Tablet */}
                    <div className="hidden lg:flex w-[280px] shrink-0 border-r border-[#222] bg-[#1a1a1a] flex-col h-full pointer-events-none select-none">
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-8 mt-1">
                                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center border border-white/5">
                                    <Bot className="w-6 h-6 text-[#6CA3A2]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                                        One<span className="text-[#6CA3A2]">Assist</span>
                                    </h2>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] animate-pulse shadow-[0_0_8px_#6CA3A2]" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#888]">System Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat/Dash Switch */}
                            <div className="flex bg-[#121212] rounded-xl p-1 shadow-neu-inset border border-white/5 mb-8">
                                <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#6CA3A2]/20 border border-[#6CA3A2]/30 text-[#6CA3A2]">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Chat</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-2 py-2 text-[#444]">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Dash</span>
                                </div>
                            </div>

                            {/* Platforms */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4 px-1 opacity-50">
                                    <span className="text-[9px] font-black text-[#888] uppercase tracking-[0.2em]">Platforms</span>
                                    <Settings className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex gap-3">
                                    <div className={`w-9 h-9 rounded-full bg-blue-500 shadow-lg flex items-center justify-center ${activePlatform === 'googleAds' || activePlatform === 'all' ? 'opacity-100' : 'opacity-20 grayscale'}`}><Target className="w-4.5 h-4.5 text-white" /></div>
                                    <div className={`w-9 h-9 rounded-full bg-[#1877F2] shadow-lg flex items-center justify-center ${activePlatform === 'metaAds' || activePlatform === 'all' ? 'opacity-100' : 'opacity-20 grayscale'}`}><Share2 className="w-4.5 h-4.5 text-white" /></div>
                                    <div className={`w-9 h-9 rounded-full bg-orange-500 shadow-lg flex items-center justify-center ${activePlatform === 'googleAnalytics' || activePlatform === 'all' ? 'opacity-100' : 'opacity-20 grayscale'}`}><BarChart3 className="w-4.5 h-4.5 text-white" /></div>
                                    <div className={`w-9 h-9 rounded-full bg-blue-700 shadow-lg flex items-center justify-center ${activePlatform === 'linkedInAds' || activePlatform === 'all' ? 'opacity-100' : 'opacity-20 grayscale'}`}><Briefcase className="w-4.5 h-4.5 text-white" /></div>
                                </div>
                            </div>

                            {/* Date Selector */}
                            <div className="p-3.5 bg-[#121212] rounded-xl border border-white/5 flex items-center justify-between shadow-neu-inset mb-8">
                                <div className="flex items-center gap-2.5">
                                    <Clock className="w-3.5 h-3.5 text-[#444]" />
                                    <span className="text-[11px] font-black text-[#666] italic">Last 30 days (default)</span>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-[#444]" />
                            </div>

                            {/* New Chat Button */}
                            <div className="w-full py-3.5 rounded-xl bg-gradient-to-br from-[#FF8C42] to-[#E67A33] flex items-center justify-center gap-3 shadow-[0_15px_30px_-5px_rgba(255,140,66,0.3)] mb-10">
                                <Plus className="w-5 h-5 text-white stroke-[4]" />
                                <span className="text-[14px] font-black text-white uppercase tracking-tighter italic">New Chat</span>
                            </div>

                            {/* History Search Section */}
                            <div className="border-t border-[#222] pt-6 flex-1 overflow-hidden">
                                <div className="flex items-center gap-2.5 mb-4 opacity-30">
                                    <History className="w-4 h-4 text-[#6CA3A2]" />
                                    <span className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em]">Chat History</span>
                                </div>
                                <div className="w-full h-9 bg-[#121212] rounded-lg border border-white/5 shadow-neu-inset flex items-center px-3 gap-2.5 opacity-30 mb-4">
                                    <Search className="w-4 h-4 text-[#333]" />
                                    <span className="text-[10px] text-[#333] font-bold">Search conversations...</span>
                                </div>
                            </div>

                            {/* User Profile Bar */}
                            <div className="pt-4 border-t border-[#222] flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF8C42] to-[#6CA3A2] p-[1px] shadow-lg">
                                    <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-[11px] font-black text-white italic">NS</div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-white tracking-tight leading-none italic">Nisarg Shah</p>
                                    <p className="text-[9px] text-[#555] mt-1 italic font-medium">shah.nisarg39@gmail.com</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="px-1.5 py-0.5 bg-[#6CA3A2]/10 text-[#6CA3A2] text-[8px] font-black rounded italic border border-[#6CA3A2]/20 uppercase tracking-tighter">Pro Account</span>
                                        <span className="text-[9px] text-[#444] font-black uppercase underline underline-offset-2 decoration-1">Billing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CHAT AREA */}
                    <div className="flex-1 bg-[#0d0d0d] flex flex-col h-[500px] lg:h-full pointer-events-none relative shadow-[inset_40px_0_40px_-20px_rgba(0,0,0,0.5)] min-w-0 order-1 lg:order-none">

                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 sm:py-10 scroll-smooth flex flex-col items-center"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            <AnimatePresence mode="popLayout">
                                {messages.length === 0 && !isTyping && !typedChars && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        key="landing"
                                        className="flex flex-col items-center justify-center w-full pt-4 sm:pt-8 text-center"
                                    >
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center border border-white/5 mb-6 sm:mb-8">
                                            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-[#222]" />
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter italic mb-2 leading-tight">
                                            ONEASSIST <span className="text-[#6CA3A2]">NEXUS</span>
                                        </h1>
                                        <p className="text-xs sm:text-sm text-[#777] max-w-[280px] sm:max-w-sm mx-auto mb-8 sm:mb-10 font-medium">
                                            Your neural bridge to marketing data is online. Ask anything about your analytics ecosystems.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-4">
                                            {[
                                                { t: "Traffic Intelligence", d: "Analyze my website traffic quality", i: Users },
                                                { t: "Ad Performance", d: "Audit my cross-channel ad performance", i: Activity },
                                                { t: "Budget Optimization", d: "Find wasted ad spend", i: Zap },
                                                { t: "Conversion Funnel", d: "Where am I losing conversions?", i: TrendingUp }
                                            ].map((card, i) => (
                                                <div key={i} className="p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#151515] border border-white/5 shadow-neu-raised flex gap-3 sm:gap-3.5 text-left items-center">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0d0d0d] shadow-neu-inset flex items-center justify-center shrink-0 border border-white/5">
                                                        <card.i className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CA3A2]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest leading-none">{card.t}</p>
                                                        <p className="text-[9px] sm:text-[10px] text-[#444] font-bold mt-1 leading-snug">{card.d}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {messages.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} w-full mb-6 sm:mb-8`}
                                    >
                                        <div className={`max-w-[95%] sm:max-w-[90%] ${m.role === 'assistant' ? 'flex gap-3 sm:gap-4 w-full' : ''}`}>
                                            {m.role === 'assistant' && (
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center shrink-0 border border-white/5">
                                                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CA3A2]" />
                                                </div>
                                            )}
                                            <div className={`p-4 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] shadow-2xl relative ${m.role === 'user'
                                                ? 'bg-[#151515] border border-white/10 text-white italic font-bold text-[13px] sm:text-[14px] rounded-tr-none'
                                                : 'bg-[#1a1a1a] border border-white/5 text-[#c0c0c0] leading-relaxed rounded-tl-none flex-1'
                                                }`}>
                                                <div className="whitespace-pre-wrap text-[12px] sm:text-[13px] font-semibold leading-relaxed tracking-tight">
                                                    {m.content.split('**').map((part, i) => i % 2 === 1 ? <span key={i} className="text-white font-black italic">{part}</span> : part)}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 sm:gap-4 items-center w-full mb-6 sm:mb-8">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center shadow-neu-raised">
                                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#6CA3A2] animate-spin-slow" />
                                        </div>
                                        <div className="flex gap-1.25 sm:gap-1.5">
                                            <span className="w-1.25 h-1.25 sm:w-1.5 sm:h-1.5 rounded-full bg-[#6CA3A2] animate-bounce" />
                                            <span className="w-1.25 h-1.25 sm:w-1.5 sm:h-1.5 rounded-full bg-[#6CA3A2] animate-bounce delay-100" />
                                            <span className="w-1.25 h-1.25 sm:w-1.5 sm:h-1.5 rounded-full bg-[#6CA3A2] animate-bounce delay-200" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input Container */}
                        <div className="px-6 sm:px-12 pb-6 sm:pb-8 pt-2 shrink-0 bg-[#0d0d0d] border-t border-white/5">
                            <div className="relative group max-w-2xl mx-auto flex items-center gap-2 sm:gap-3 p-1 bg-[#1a1a1a] rounded-full shadow-neu-raised border border-white/5">
                                <div className="flex-1 h-10 sm:h-12 bg-[#121212] rounded-full shadow-neu-inset border border-white/5 flex items-center px-4 sm:px-6">
                                    <span className="text-[11px] sm:text-[13px] text-[#333] font-bold italic truncate flex-1 tracking-tight">
                                        {typedChars || (messages.length === 0 ? "Ask me about your marketing data..." : "")}
                                        {step === 1 && <span className="inline-block w-[1.5px] h-3.5 sm:h-4 bg-[#6CA3A2] ml-1 animate-pulse" />}
                                    </span>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center border border-white/10 shrink-0">
                                    <Send className="w-4 h-4 sm:w-5 sm:h-5 text-[#222]" />
                                </div>
                            </div>
                            <p className="hidden sm:block text-[8px] text-[#333] mt-3 font-black text-center uppercase tracking-[0.3em] italic opacity-40">
                                PRESS ENTER TO SEND // SHIFT + ENTER FOR NEW LINE
                            </p>
                        </div>
                    </div>

                    {/* METRICS PANEL */}
                    <div className="w-full lg:w-[380px] bg-[#1a1a1a] border-t lg:border-t-0 lg:border-l border-[#222] flex flex-col h-[400px] lg:h-full pointer-events-none select-none shrink-0 shadow-2xl overflow-hidden relative order-2 lg:order-none">
                        <div className="p-4 sm:p-6 border-b border-[#222] flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-black text-white leading-none tracking-tighter italic">Platform Metrics</h3>
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#444]" />
                        </div>

                        <div className="flex-1 overflow-y-auto w-full p-4 sm:p-6 space-y-6 sm:y-8">
                            <AnimatePresence mode="wait">
                                {step < 3 ? (
                                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-6">
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                                            <div className="absolute inset-0 rounded-full border-[3px] sm:border-[4px] border-[#222]" />
                                            <div className="absolute inset-0 rounded-full border-[3px] sm:border-[4px] border-t-[#6CA3A2] animate-spin border-transparent shadow-[0_0_15px_rgba(108,163,162,0.4)]" />
                                        </div>
                                        <div className="space-y-1.5 sm:space-y-2">
                                            <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tighter italic leading-none">INITIALIZING TELEMETRY</h4>
                                            <p className="text-[10px] sm:text-xs text-[#444] font-bold italic">Send a message to load metrics</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="metrics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 sm:space-y-8 pb-4 sm:pb-6">

                                        {/* Tabs */}
                                        <div className="flex bg-[#0d0d0d] p-1 rounded-xl border border-white/5 shadow-neu-inset">
                                            {[
                                                { l: "GA4", active: activePlatform === 'googleAnalytics' },
                                                { l: "G-Ads", active: activePlatform === 'googleAds' },
                                                { l: "Meta", active: activePlatform === 'metaAds' }
                                            ].map((t, i) => (
                                                <div key={i} className={`flex-1 py-1 sm:py-1.5 rounded-lg text-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${t.active ? 'bg-[#6CA3A2]/20 text-[#6CA3A2] border border-[#6CA3A2]/30' : 'text-[#444]'}`}>
                                                    {t.l}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Metrics Grid */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <h4 className="text-[8px] sm:text-[9px] font-black text-[#555] uppercase tracking-[0.3em] italic font-mono">CAMPAIGN METRICS</h4>
                                            <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                                                {turns[turns.findIndex(t => t.user === messages[0]?.content) || 0]?.metrics?.map((stat, i) => (
                                                    <div key={i} className="p-3 sm:p-4 bg-[#0d0d0d] rounded-xl sm:rounded-[1.25rem] border border-white/5 shadow-neu-raised flex flex-col items-start gap-1.5 sm:gap-2">
                                                        <div className="flex items-center gap-1.5 opacity-40">
                                                            <stat.i className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#888]" />
                                                            <span className="text-[7px] sm:text-[7.5px] font-black text-[#888] uppercase tracking-widest truncate">{stat.l}</span>
                                                        </div>
                                                        <p className="text-base sm:text-lg font-black text-white italic tracking-tighter leading-none">{stat.v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Health Map */}
                                        <div className="p-4 sm:p-5 bg-[#0d0d0d] rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/5 mt-4 sm:mt-6 shadow-neu-inset">
                                            <h5 className="text-[8px] sm:text-[9px] font-black text-[#444] uppercase tracking-[0.25em] mb-4 sm:mb-6">Neural Health Mapping</h5>
                                            <div className="space-y-4 sm:space-y-6">
                                                {[
                                                    { l: "Discovery", v: "92%", c: "#6CA3A2" },
                                                    { l: "Retention", v: "45%", c: "#444" }
                                                ].map((bar, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-[9px] sm:text-[10px] font-black text-[#555] mb-2 sm:mb-2.5 uppercase tracking-tighter italic">
                                                            <span>{bar.l}</span>
                                                            <span className="text-white">{bar.v}</span>
                                                        </div>
                                                        <div className="w-full h-1.5 sm:h-2 bg-black/60 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: bar.v }}
                                                                transition={{ duration: 1.5, delay: i * 0.2 }}
                                                                className="h-full rounded-full"
                                                                style={{ background: bar.c }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-3 sm:p-4 border-t border-[#222] flex items-center justify-center bg-[#151515]">
                            <span className="text-[7px] sm:text-[8px] font-black text-[#444] uppercase tracking-[0.3em]">Last updated: 03:25:01</span>
                        </div>
                    </div>

                </div>

                {/* Global Floating HUD */}
                <div className="absolute -bottom-8 lg:-bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-10 bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-2xl z-50 pointer-events-none scale-75 sm:scale-100 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
                        <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.3em]">SECURE_LINK: ACTIVE</span>
                    </div>
                    <div className="h-3 sm:h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF8C42] animate-pulse" />
                        <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.3em]">SYNC: 100%</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
