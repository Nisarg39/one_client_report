"use client";

import { motion } from "framer-motion";
import { Check, Lock, CreditCard, DollarSign, ArrowRight, Sparkles } from "lucide-react";

export function PricingTransparency() {
  const plans = [
    {
      name: "Student",
      price: "FREE",
      period: "",
      badge: "Free Forever",
      badgeColor: "from-[#6CA3A2] to-[#5A8D8C]",
      description: "Perfect for students learning marketing analytics",
      reports: "5 clients • 50 messages/day",
      features: [
        "5 practice clients",
        "50 messages per day (forever)",
        "Unlimited conversations",
        "Mock data scenarios for learning",
        "Specialized tutoring agent",
        "Quiz mode",
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
      period: "/month",
      badge: "RECOMMENDED",
      badgeColor: "from-[#FF8C42] to-[#E67A33]",
      description: "Ideal for freelancers managing up to 10 clients",
      reports: "10 clients • 150 messages/day",
      includesPrevious: "Student",
      features: [
        "Everything in Student, plus:",
        "10 client workspaces",
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
      period: "/month",
      badge: "Best Value",
      badgeColor: "from-[#6CA3A2] to-[#5A8D8C]",
      description: "For growing agencies managing up to 25 clients",
      reports: "25 clients • 300 messages/day",
      includesPrevious: "Professional",
      features: [
        "Everything in Professional, plus:",
        "25 client workspaces",
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
      period: "",
      badge: "White Glove Service",
      badgeColor: "from-[#9333ea] to-[#7e22ce]",
      description: "For large agencies & enterprises with 100+ clients",
      reports: "Unlimited clients • Unlimited messages",
      includesPrevious: "Agency",
      features: [
        "Everything in Agency, plus:",
        "Unlimited clients",
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
    { icon: Lock, text: "Secure payment via Stripe" },
    { icon: CreditCard, text: "Cancel anytime, no questions asked" },
    { icon: DollarSign, text: "30-day money-back guarantee" },
  ];

  return (
    <section id="pricing" className="relative bg-[#242424] py-16 sm:py-20 md:py-24">
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#242424] via-[#1e1e1e] to-[#1a1a1a] pointer-events-none" />

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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Simple Pricing That Scales With You
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-2xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Choose the plan that fits your needs. No per-client fees. No surprises.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-12 relative z-10">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative ${plan.highlighted ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <div
                className={`relative h-full p-6 sm:p-8 rounded-3xl bg-[#1a1a1a] ${
                  plan.highlighted
                    ? 'shadow-[-12px_-12px_30px_rgba(70,70,70,0.4),12px_12px_30px_rgba(0,0,0,0.9),0_0_40px_rgba(255,140,66,0.15)]'
                    : plan.isEnterprise
                      ? 'shadow-[-12px_-12px_30px_rgba(70,70,70,0.4),12px_12px_30px_rgba(0,0,0,0.9),0_0_40px_rgba(147,51,234,0.2)] border border-purple-500/20'
                      : 'shadow-[-12px_-12px_24px_rgba(70,70,70,0.3),12px_12px_24px_rgba(0,0,0,0.7)]'
                }`}
              >

                {/* Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-auto max-w-[90%]">
                  <div
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r ${plan.badgeColor} shadow-[-4px_-4px_8px_rgba(70,70,70,0.2),4px_4px_8px_rgba(0,0,0,0.6)]`}
                  >
                    <span className="text-xs font-bold text-white whitespace-nowrap flex items-center gap-1">
                      {plan.highlighted && <Sparkles className="w-3 h-3" aria-hidden="true" />}
                      {plan.badge}
                      {plan.highlighted && <Sparkles className="w-3 h-3" aria-hidden="true" />}
                    </span>
                  </div>
                </div>

                {/* Plan Name & Description */}
                <div className="text-center mb-6 mt-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#999] min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className="mb-1">
                    <span
                      className="text-4xl sm:text-5xl font-black text-[#f5f5f5]"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-xl sm:text-2xl text-[#999] ml-1"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#6CA3A2]">
                    {plan.reports}
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => {
                      const isIncludesText = feature.toLowerCase().includes('everything in');
                      return (
                        <div
                          key={featureIndex}
                          className="flex items-start"
                        >
                          {!isIncludesText && (
                            <div
                              className="w-5 h-5 rounded-full bg-[#242424] flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)]"
                            >
                              <Check className="w-3.5 h-3.5 text-[#6CA3A2]" aria-hidden="true" />
                            </div>
                          )}
                          <span
                            className={`text-xs sm:text-sm leading-tight ${
                              isIncludesText
                                ? 'text-[#6CA3A2] font-semibold italic w-full'
                                : 'text-[#e5e5e5]'
                            }`}
                          >
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full relative overflow-hidden px-6 h-12 sm:h-14 rounded-3xl font-semibold group ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.4)]'
                      : plan.isEnterprise
                        ? 'bg-gradient-to-br from-[#9333ea] to-[#7e22ce] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(147,51,234,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(147,51,234,0.4)]'
                        : 'bg-[#1a1a1a] text-[#6CA3A2] shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)]'
                  } active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] transition-all duration-300`}
                  aria-label={plan.isEnterprise ? `Contact sales for ${plan.name} plan` : `Start free trial with ${plan.name} plan`}
                  style={{ textShadow: (plan.highlighted || plan.isEnterprise) ? '0 2px 4px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  <span className="relative flex items-center justify-center text-sm sm:text-base">
                    {plan.isEnterprise ? 'Contact Sales' : 'Start Free Trial'}
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </button>

                {/* Trial Note */}
                {plan.includesTrial && (
                  <p className="text-center text-xs text-[#999] mt-5">
                    7-day free trial
                  </p>
                )}

              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div
            className="p-4 sm:p-6 rounded-xl bg-[#151515] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.5),inset_-6px_-6px_12px_rgba(40,40,40,0.3)] text-center"
          >
            <div className="mb-2">
              <span
                className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#E67A33] text-xs font-bold text-white shadow-[-4px_-4px_8px_rgba(255,140,66,0.2),4px_4px_8px_rgba(0,0,0,0.6)]"
              >
                60-80% cheaper than Traditional Reporting Platforms
              </span>
            </div>
            <p className="text-sm text-[#c0c0c0] leading-relaxed">
              <span className="font-semibold text-[#f5f5f5]">Traditional reporting platforms</span> charge{" "}
              <span className="text-[#FF8C42] font-bold">₹1,000-1,650 per client</span>.
              That&apos;s <span className="text-[#FF8C42] font-bold">₹10,000-16,500/month</span> for 10 clients or{" "}
              <span className="text-[#FF8C42] font-bold">₹25,000-41,250/month</span> for 25 clients.{" "}
              <span className="font-semibold text-[#6CA3A2]">Our plans: ₹299/month (10 clients) or ₹999/month (25 clients).</span>
            </p>
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
