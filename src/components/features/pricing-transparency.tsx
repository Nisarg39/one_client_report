"use client";

import { motion } from "framer-motion";
import { Check, Lock, CreditCard, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface PricingTransparencyProps {
  trialExpired?: boolean;
}

export function PricingTransparency({ trialExpired = false }: PricingTransparencyProps) {
  const router = useRouter();

  const handlePlanClick = (planName: string, isEnterprise: boolean) => {
    if (isEnterprise) {
      const element = document.getElementById("get-in-touch");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/#get-in-touch");
      }
      return;
    }

    if (planName === "Student") {
      router.push("/signin"); // Or wherever student flow goes
      return;
    }

    // Professional or Agency
    // If trial expired OR if user explicitly wants to subscribe (we assume clicking on pricing means intent)
    // Actually, "Start Free Trial" usually means sign up. "Subscribe Now" means pay.
    // If trialExpired is true, go to payment.
    // If trialExpired is false, usually sign up -> trial.
    // BUT the requirements say: "If trialExpired === true: Change button text... Redirect to /subscribe/[plan]"
    // What if trial NOT expired? It says "Start Free Trial".
    // I should probably check if user is logged in. But this component is likely on public landing page too.
    // If on public page, "Start Free Trial" -> Sign Up.
    // If logged in & trial expired -> Subscribe.
    // The requirements say:
    // "Pricing section detects trial expired -> Shows Subscribe Now"
    // "Student Upgrade -> Clicks Subscribe Now -> Redirect to /subscribe/[plan]"

    // So if trialExpired is passed as true, we go to subscribe page.
    // If false (default), likely Sign Up or Dashboard if logged in.
    // For now, I'll implement the trialExpired logic.
    // If !trialExpired, I'll keep default behavior (which was likely nothing or just a button, previous code had no onclick).
    // I'll add redirect to /auth/signup for "Start Free Trial" as a safe default for new users.

    if (trialExpired) {
      router.push(`/subscribe/${planName.toLowerCase()}`);
    } else {
      // Default behavior for new users
      router.push("/signin");
    }
  };

  const plans = [
    {
      name: "Student",
      price: "FREE",
      originalPrice: null,
      period: "",
      badge: "Free Forever",
      badgeColor: "from-[#6CA3A2] to-[#5A8D8C]",
      description: "Perfect for students learning marketing analytics",
      reports: "Unlimited campaigns • 50 messages/day",
      features: [
        "Unlimited practice campaigns",
        "50 messages per day (forever)",
        "Unlimited conversations",
        "Mock data scenarios for learning",
        "Specialized tutoring agent",
        "Educational mode",
        "No trial expiry - truly free",
      ],
      highlighted: false,
      isEnterprise: false,
      includesTrial: false,
    },
    {
      name: "Professional",
      price: "₹299",
      originalPrice: "₹1,299",
      period: "/month",
      badge: "FOUNDER'S DEAL",
      badgeColor: "from-[#FF8C42] to-[#E67A33]",
      description: "Ideal for freelancers and small businesses",
      reports: "Unlimited campaigns • 150 messages/day",
      includesPrevious: "Student",
      features: [
        "Everything in Student, plus:",
        "Unlimited real campaigns",
        "150 AI messages per day",
        "7-day free trial (50 msg/day)",
        "Real platform API connections",
        "Priority email support",
        "JSON export",
        "Forever chat history",
      ],
      highlighted: true,
      isEnterprise: false,
      includesTrial: true,
    },
    {
      name: "Agency",
      price: "₹999",
      originalPrice: "₹4,499",
      period: "/month",
      badge: "EARLY ADOPTER",
      badgeColor: "from-[#6CA3A2] to-[#5A8D8C]",
      description: "For growing agencies with high volume needs",
      reports: "Unlimited campaigns • 300 messages/day",
      includesPrevious: "Professional",
      features: [
        "Everything in Professional, plus:",
        "Unlimited campaigns at scale",
        "300 AI messages per day",
        "5 team members",
        "7-day free trial (50 msg/day)",
        "Large context support",
        "Support for large AI models",
        "Dedicated account manager",
      ],
      highlighted: false,
      isEnterprise: false,
      includesTrial: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      originalPrice: null,
      period: "",
      badge: "White Glove Service",
      badgeColor: "from-[#9333ea] to-[#7e22ce]",
      description: "For large agencies & enterprises at scale",
      reports: "Unlimited campaigns • Unlimited messages",
      includesPrevious: "Agency",
      features: [
        "Everything in Agency, plus:",
        "Unlimited campaigns",
        "Unlimited messages",
        "24/7 priority support (phone)",
        "Custom onboarding & training",
        "SLA guarantees (99.9% uptime)",
        "Annual contract discounts",
      ],
      highlighted: false,
      isEnterprise: true,
      includesTrial: false,
    },
  ];

  const trustSignals = [
    { icon: Lock, text: "Secure payment via PayU" },
    { icon: CreditCard, text: "Cancel anytime, no questions asked" },
    { icon: DollarSign, text: "30-day money-back guarantee" },
  ];

  return (
    <section id="pricing" className="relative bg-[#1a1a1a] py-16 sm:py-20">

      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a1a] shadow-neu-inset border border-white/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#FF8C42] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Resource Allocation Protocols</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-[#f5f5f5] mb-6 uppercase tracking-tighter">
            Simple Pricing That <span className="text-[#6CA3A2] italic">Scales</span> With You
          </h2>
          <p className="text-[#c0c0c0] text-lg md:text-xl max-w-3xl mx-auto font-medium opacity-70">
            Choose the plan that fits your needs. No per-client fees. No surprises.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative z-10">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative ${plan.highlighted ? 'lg:scale-105 z-20' : 'z-10'}`}
            >
              <div
                className={`group relative h-full p-8 rounded-[2.5rem] bg-[#1a1a1a] shadow-neu-raised border ${plan.highlighted ? 'border-[#FF8C42]/30' : 'border-white/5'
                  } transition-all duration-300 hover:border-[#6CA3A2]/30 overflow-hidden`}
              >
                {/* Stage Indicator Overlay */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1d1d1d] rotate-45 border-l border-white/5" />
                <span className="absolute top-4 right-5 text-[10px] font-black font-mono text-[#333]">0{index + 1}</span>

                {/* Badge Overlay for Recommended */}
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF8C42] to-transparent" />
                )}

                {/* Plan Metadata */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${plan.highlighted ? 'bg-[#FF8C42]/10 text-[#FF8C42]' : 'bg-[#151515] text-[#666]'
                      }`}>
                      {plan.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#f5f5f5] uppercase tracking-tighter italic">
                    {plan.name}
                  </h3>
                </div>

                {/* Pricing Core */}
                <div className="mb-10">
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.originalPrice && (
                      <span className="text-sm font-bold text-[#444] line-through decoration-[#FF8C42]/50 mr-2 uppercase tracking-tighter">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl sm:text-5xl font-black text-[#f5f5f5] tracking-tighter">
                      {plan.price}
                    </span>
                    <span className="text-sm font-bold text-[#444] uppercase tracking-widest">
                      {plan.period}
                    </span>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#151515] border border-white/5 shadow-neu-inset">
                    <span className="text-[10px] font-black text-[#6CA3A2] uppercase tracking-widest leading-none">
                      {plan.reports}
                    </span>
                  </div>
                  {(plan.name === 'Professional' || plan.name === 'Agency') && (
                    <div className="mt-3 text-[8px] font-black text-[#FF8C42] uppercase tracking-[0.2em] italic">
                      * Limited to first 100 Founding Users
                    </div>
                  )}
                </div>

                {/* Contextual Description */}
                <p className="text-xs font-bold text-[#666] leading-relaxed mb-10 h-10">
                  {plan.description}
                </p>

                {/* Unified Feature List */}
                <div className="space-y-4 mb-10">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#333] border-b border-white/5 pb-2">Enabled_Capability_Set</div>
                  {plan.features.map((feature, featureIndex) => {
                    const isIncludesText = feature.toLowerCase().includes('everything in');
                    return (
                      <div key={featureIndex} className="flex items-start gap-3">
                        {!isIncludesText && (
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#333] group-hover:bg-[#6CA3A2]/50 transition-colors" />
                        )}
                        <span className={`text-[11px] font-medium leading-tight ${isIncludesText ? 'text-[#6CA3A2] uppercase italic font-black text-[9px] tracking-widest' : 'text-[#999]'
                          }`}>
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Action Buffer */}
                <div className="mt-auto pt-4 relative z-10">
                  <button
                    onClick={() => handlePlanClick(plan.name, plan.isEnterprise)}
                    className={`w-full group/btn relative overflow-hidden h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 ${plan.highlighted
                      ? 'bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised'
                      : plan.isEnterprise
                        ? 'bg-[#1a1a1a] border border-[#9333ea]/30 text-[#9333ea] shadow-neu-inset'
                        : 'bg-[#1a1a1a] shadow-neu-raised text-[#f5f5f5] border border-white/5 hover:shadow-neu-inset active:scale-[0.98]'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {plan.isEnterprise
                        ? 'Contact Sales'
                        : plan.name === 'Student'
                          ? "Let's Learn"
                          : (trialExpired && plan.name !== 'Student')
                            ? 'Subscribe Now'
                            : 'Start Free Trial'
                      }
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  {plan.includesTrial && !trialExpired && (
                    <div className="mt-4 text-[9px] font-black text-center uppercase tracking-[0.3em] text-[#333]">
                      7-Day Trial Period // Active
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Disruption Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto relative z-10 px-6 sm:px-10"
        >
          <div className="relative py-12 sm:py-16 overflow-hidden group">

            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
              {/* Left: The Verdict */}
              <div className="flex-shrink-0 text-left lg:w-1/3">
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-lg bg-[#151515] border border-white/5 shadow-neu-inset">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#999999]">Cost Protocol Deviation</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#f5f5f5] uppercase tracking-tighter italic leading-[0.9] mb-4">
                  Economic <br /> <span className="text-gradient-teal">Advantage</span> <br /> Audit
                </h3>
                <p className="text-[10px] font-bold text-[#444] uppercase tracking-widest">Comparative Platform Analysis v2.5</p>
              </div>

              {/* Right: The Data Stream */}
              <div className="flex-grow w-full space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16">
                  {/* Legacy Stream */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#E74C3C]">Legacy Protocol</div>
                      <div className="text-2xl font-black text-[#f5f5f5] italic">₹1,650 <span className="text-[10px] uppercase not-italic text-[#444]">/ unit</span></div>
                    </div>
                    <div className="h-2 w-full bg-[#151515] rounded-full overflow-hidden shadow-neu-inset p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#E74C3C] to-[#FF8C42] rounded-full"
                      />
                    </div>
                    <div className="text-[9px] font-bold text-[#444] uppercase tracking-[0.1em]">Drain Factor: High (₹41k at Scale)</div>
                  </div>

                  {/* OneReport Protocol Stream */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6CA3A2]">OneReport Protocol</div>
                      <div className="text-2xl font-black text-[#f5f5f5] italic">
                        <span className="text-sm line-through decoration-[#6CA3A2]/50 mr-2 not-italic text-[#444]">₹1,299</span>
                        ₹299 <span className="text-[10px] uppercase not-italic text-[#444]">/ unit</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#151515] rounded-full overflow-hidden shadow-neu-inset p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "18%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] rounded-full shadow-[0_0_10px_rgba(108,163,162,0.5)]"
                      />
                    </div>
                    <div className="text-[9px] font-bold text-[#6CA3A2] uppercase tracking-[0.1em]">Efficiency Gain: 82% Locked</div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] leading-relaxed max-w-lg text-center sm:text-left">
                    Predictable growth without per-client overhead. <br />
                    Unlimited campaigns across all active nodes.
                  </div>
                  <div className="px-6 py-2 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-[#6CA3A2]/20">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#6CA3A2]">ROI Target: +640%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto relative z-10"
        >
          {trustSignals.map((signal, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2"
            >
              <signal.icon
                className="w-5 h-5 text-[#6CA3A2] flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs text-[#999]">
                {signal.text}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
