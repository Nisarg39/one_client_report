"use client";

import { motion } from "framer-motion";
import { Hourglass, Search, Zap, Activity, ShieldAlert, Cpu } from "lucide-react";

export function ProblemStatement() {
  const points = [
    {
      id: "DISCOVERY",
      icon: Search,
      title: "Insight Discovery",
      description: "Traditional reports show what happened, but leave you guessing why. Query your data in plain English to uncover actual causes.",
      metric: "INSTANT_QUERY",
      label: "Response Latency",
      color: "#6CA3A2"
    },
    {
      id: "DIAGNOSTIC",
      icon: ShieldAlert,
      title: "Flaw Detection",
      description: "Automatic node scans identify leaks in your funnel. We don't just provide a dashboard; we provide real-time solutions.",
      metric: "PATTERN_LOCK",
      label: "Diagnostic Status",
      color: "#FF8C42"
    },
    {
      id: "DECISION",
      icon: Zap,
      title: "Decision Flow",
      description: "Move from questioning to action within minutes. Pure productive intelligence designed for marketers who build, not just report.",
      metric: "ZERO_FRICTION",
      label: "Workflow Velocity",
      color: "#E74C3C"
    }
  ];

  return (
    <section className="relative bg-[#1a1a1a] py-24 sm:py-32 overflow-x-clip">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col xl:flex-row gap-16 xl:gap-24">

          {/* Left: The Paradigm Thesis */}
          <div className="xl:w-2/5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-white/5 shadow-neu-inset mb-8">
                <Activity className="w-3 h-3 text-[#6CA3A2]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#666]">System_Paradigm_v4.2</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#f5f5f5] uppercase tracking-tighter leading-[0.9] mb-8">
                Beyond <span className="text-[#E74C3C] italic">Conventional</span> <br />
                Reporting <span className="text-[#6CA3A2] italic">Protocols</span>
              </h2>

              <div className="space-y-6 text-[#999] font-medium leading-relaxed">
                <p className="text-lg text-[#c0c0c0] opacity-80">
                  Everyone has their own reporting style, but conventional tools fail to bridge the gap between <span className="text-white">Data</span> and <span className="text-[#6CA3A2]">Action</span>.
                </p>
                <p className="text-sm">
                  We focus on the productive side of analysis. By implementing a chat-based, agentic approach, we help you identify hidden patterns and critical flaws in your marketing data instantly.
                </p>
                <div className="pt-8 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#f5f5f5] italic">82%</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#444]">Action Lag Reduction</span>
                  </div>
                  <div className="w-px h-10 bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#6CA3A2] italic">AI</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#444]">Agentic Core Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: The Integrated Diagnostic Console */}
          <div className="xl:w-3/5">
            <div className="relative p-1 bg-[#151515] rounded-[2.5rem] shadow-neu-inset border border-white/5 overflow-hidden">
              {/* Internal Scanning Beam */}
              <motion.div
                animate={{ y: [0, 600, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-[#6CA3A2]/5 to-transparent z-0 pointer-events-none"
              />

              <div className="relative z-10 grid grid-cols-1 divide-y divide-white/5">
                {points.map((point, index) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col md:flex-row items-center md:items-stretch group"
                  >
                    {/* Diagnostic Label Layer */}
                    <div className="w-full md:w-40 p-8 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-white/5 bg-[#1a1a1a]/50">
                      <span className="text-[10px] font-black font-mono text-[#333] mb-4 group-hover:text-[#6CA3A2] transition-colors uppercase tracking-[0.2em]">{point.id}</span>
                      <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center border border-white/5 group-hover:shadow-neu-inset transition-all duration-300">
                        <point.icon className="w-5 h-5" style={{ color: point.color }} />
                      </div>
                    </div>

                    {/* Content Layer */}
                    <div className="flex-grow p-8 md:p-12 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Cpu className="w-4 h-4 text-[#444]" />
                      </div>

                      <h3 className="text-2xl font-black text-[#f5f5f5] mb-4 uppercase tracking-tighter italic">
                        {point.title}
                      </h3>
                      <p className="text-sm text-[#999] leading-relaxed max-w-lg mb-8 group-hover:text-[#c0c0c0] transition-colors">
                        {point.description}
                      </p>

                      {/* Metric HUD */}
                      <div className="flex items-center gap-4">
                        <div className="flex-grow h-[1px] bg-white/5" />
                        <div className="text-right">
                          <div className="text-[9px] font-black uppercase tracking-widest text-[#444] mb-1">{point.label}</div>
                          <div className="text-xl font-black text-[#f5f5f5] italic tracking-tighter" style={{ color: point.color }}>{point.metric}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Console Footer */}
              <div className="p-4 bg-[#1a1a1a] border-t border-white/5 flex justify-between items-center relative z-20">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6CA3A2] animate-pulse" />
                  <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: [-80, 80] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1/2 h-full bg-[#6CA3A2]/20"
                    />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#333] uppercase font-mono tracking-widest">Live_Signal_Synchronization_Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
