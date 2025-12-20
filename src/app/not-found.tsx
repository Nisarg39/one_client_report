"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-[#1a1a1a] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-[#6CA3A2] selection:text-[#1a1a1a]">
            {/* Include Navbar for context if desired, or keep it isolated. User asked to "refer to navbar", likely implying style match, but having the navbar itself is good UX for 404s. */}
            <Navbar />

            {/* Subtle Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF8C42]/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6CA3A2]/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: "1s" }} />

            {/* Main Content Container - Direct Layout (No Card) */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">

                {/* 404 Text - Embossed Effect with Brand Gradient */}
                <h1
                    className="text-[8rem] sm:text-[12rem] leading-none font-black tracking-tighter select-none"
                    style={{
                        textShadow: "0 4px 8px rgba(0,0,0,0.5)",
                    }}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6CA3A2] via-[#f5f5f5] to-[#FF8C42]">404</span>
                </h1>

                {/* Floating Element Over 404 */}
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none mix-blend-overlay">
                    <div className="w-[120%] h-32 bg-gradient-to-r from-transparent via-[#FF8C42]/20 to-transparent blur-xl" />
                </div>

                <div className="w-24 h-2 rounded-full my-8 bg-gradient-to-r from-[#FF8C42] to-[#6CA3A2] shadow-[0_0_20px_rgba(255,140,66,0.3)]" />

                <h2
                    className="text-3xl sm:text-4xl font-bold mb-6 text-[#f5f5f5]"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                >
                    Page Not Found
                </h2>

                <p
                    className="text-lg text-[#c0c0c0] text-center mb-10 max-w-lg leading-relaxed"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                {/* Buttons Group */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link
                        href="/"
                        className="group relative px-8 py-4 rounded-2xl bg-[#1a1a1a] text-[#FF8C42] font-bold text-lg transition-all duration-300 shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:text-[#ff9d5e] active:scale-95 active:shadow-[inset_6px_6px_10px_rgba(0,0,0,0.7),inset_-6px_-6px_10px_rgba(60,60,60,0.4)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Return Home
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1 rotate-180">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </span>
                    </Link>

                    <button
                        className="px-8 py-4 rounded-2xl bg-[#1a1a1a] text-[#6CA3A2] font-medium text-lg transition-all duration-300 shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:text-[#7db5b4] active:scale-95 active:shadow-[inset_6px_6px_10px_rgba(0,0,0,0.7),inset_-6px_-6px_10px_rgba(60,60,60,0.4)]"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Footer Text */}
            <div className="absolute bottom-6 text-[#888] text-xs font-medium tracking-widest uppercase opacity-40">
                OneReport System
            </div>
        </div>
    );
}

