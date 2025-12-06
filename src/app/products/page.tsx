import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Products & Services | OneReport",
  description: "OneReport products and services with detailed descriptions and pricing in INR",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-[#6CA3A2] hover:text-[#7db3b2] transition-colors mb-6"
          >
            ← Back to Home
          </Link>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
          >
            Products & Services
          </h1>
          <p className="text-lg text-[#c0c0c0]">
            Detailed information about our subscription plans, features, and pricing in Indian Rupees (INR)
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            {/* Service Overview */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-4">
                Service Description
              </h2>
              <p className="text-[#c0c0c0] leading-relaxed mb-4">
                OneReport is an AI-powered client reporting software designed for marketing agencies and freelance marketers. Our platform helps you create professional marketing reports in minutes instead of hours by automatically collecting data from multiple marketing platforms and generating insightful, white-label reports.
              </p>
              <p className="text-[#c0c0c0] leading-relaxed">
                We provide Software-as-a-Service (SaaS) through our web-based platform, accessible at onereport.in. All services are delivered digitally with no physical products or shipping required.
              </p>
            </section>

            {/* Student Plan */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5]">
                  Student Plan
                </h2>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5A8D8C] text-white text-sm font-semibold">
                  FREE Forever
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#f5f5f5] mb-2">₹0</p>
                <p className="text-[#c0c0c0]">Free forever - No charges</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Best For:</h3>
                <p className="text-[#c0c0c0]">Students learning marketing analytics and reporting</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Service Description:</h3>
                <p className="text-[#c0c0c0] leading-relaxed mb-4">
                  The Student Plan provides access to our educational platform with practice client workspaces and AI-powered learning tools. This plan is designed for students who want to learn marketing analytics and reporting without any cost.
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#c0c0c0] ml-4">
                  <li>5 practice client workspaces for learning</li>
                  <li>50 AI messages per day (forever, no expiry)</li>
                  <li>Unlimited conversations with AI agents</li>
                  <li>Mock data scenarios for educational purposes</li>
                  <li>Specialized tutoring agent for learning support</li>
                  <li>Quiz mode for testing knowledge</li>
                  <li>Educational mode with learning resources</li>
                  <li>30-day chat history retention</li>
                  <li>No trial expiry - truly free forever</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Pricing Details:</h3>
                <p className="text-[#c0c0c0]">
                  <strong>Price:</strong> ₹0 (Free)<br />
                  <strong>Billing Period:</strong> No billing required<br />
                  <strong>Payment Method:</strong> Not applicable<br />
                  <strong>Currency:</strong> Indian Rupees (INR)
                </p>
              </div>
            </section>

            {/* Professional Plan */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)] border-2 border-[#FF8C42]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5]">
                  Professional Plan
                </h2>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#E67A33] text-white text-sm font-semibold">
                  RECOMMENDED
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#f5f5f5] mb-2">₹299</p>
                <p className="text-[#c0c0c0]">per month (billed monthly)</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Best For:</h3>
                <p className="text-[#c0c0c0]">Freelancers managing 5-10 clients</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Service Description:</h3>
                <p className="text-[#c0c0c0] leading-relaxed mb-4">
                  The Professional Plan is ideal for freelance marketers who need professional reporting tools for their clients. This plan includes all features from the Student Plan plus real platform integrations and professional reporting capabilities.
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#c0c0c0] ml-4">
                  <li>Everything in Student Plan, plus:</li>
                  <li>10 client workspaces for managing multiple clients</li>
                  <li>150 AI messages per day</li>
                  <li>7-day free trial (50 messages per day during trial)</li>
                  <li>Real platform API connections (Google Analytics, Meta Ads, LinkedIn Ads, etc.)</li>
                  <li>Priority email support</li>
                  <li>JSON export functionality</li>
                  <li>Forever chat history retention</li>
                  <li>White-label report generation</li>
                  <li>Automated data collection from connected platforms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Pricing Details:</h3>
                <p className="text-[#c0c0c0]">
                  <strong>Price:</strong> ₹299 per month<br />
                  <strong>Billing Period:</strong> Monthly (recurring)<br />
                  <strong>Payment Method:</strong> Credit/Debit Card, UPI, Net Banking<br />
                  <strong>Currency:</strong> Indian Rupees (INR)<br />
                  <strong>Free Trial:</strong> 7 days (50 messages per day)
                </p>
              </div>
            </section>

            {/* Agency Plan */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5]">
                  Agency Plan
                </h2>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5A8D8C] text-white text-sm font-semibold">
                  Best Value
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#f5f5f5] mb-2">₹999</p>
                <p className="text-[#c0c0c0]">per month (billed monthly)</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Best For:</h3>
                <p className="text-[#c0c0c0]">Growing agencies managing 15-25 clients</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Service Description:</h3>
                <p className="text-[#c0c0c0] leading-relaxed mb-4">
                  The Agency Plan is designed for marketing agencies that need to manage multiple clients efficiently. This plan includes all Professional Plan features plus team collaboration tools and advanced support.
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#c0c0c0] ml-4">
                  <li>Everything in Professional Plan, plus:</li>
                  <li>25 client workspaces</li>
                  <li>300 AI messages per day</li>
                  <li>5 team members support</li>
                  <li>7-day free trial (50 messages per day during trial)</li>
                  <li>Large context support for complex reports</li>
                  <li>Support for large AI models</li>
                  <li>Dedicated account manager</li>
                  <li>Priority email & chat support</li>
                  <li>Advanced reporting templates</li>
                  <li>Custom branding options</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Pricing Details:</h3>
                <p className="text-[#c0c0c0]">
                  <strong>Price:</strong> ₹999 per month<br />
                  <strong>Billing Period:</strong> Monthly (recurring)<br />
                  <strong>Payment Method:</strong> Credit/Debit Card, UPI, Net Banking<br />
                  <strong>Currency:</strong> Indian Rupees (INR)<br />
                  <strong>Free Trial:</strong> 7 days (50 messages per day)
                </p>
              </div>
            </section>

            {/* Enterprise Plan */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5]">
                  Enterprise Plan
                </h2>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white text-sm font-semibold">
                  White Glove Service
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#f5f5f5] mb-2">Custom Pricing</p>
                <p className="text-[#c0c0c0]">Starting from ₹25,000 per month</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Best For:</h3>
                <p className="text-[#c0c0c0]">Large agencies & enterprises with 100+ clients</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Service Description:</h3>
                <p className="text-[#c0c0c0] leading-relaxed mb-4">
                  The Enterprise Plan is designed for large organizations that require unlimited scale, custom integrations, and dedicated support. This plan includes all Agency Plan features plus enterprise-grade support and custom solutions.
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#c0c0c0] ml-4">
                  <li>Everything in Agency Plan, plus:</li>
                  <li>Unlimited client workspaces</li>
                  <li>Unlimited AI messages per day</li>
                  <li>Unlimited team members</li>
                  <li>24/7 priority support (phone, email, chat)</li>
                  <li>Custom onboarding & training</li>
                  <li>SLA guarantees (99.9% uptime)</li>
                  <li>API access for custom integrations</li>
                  <li>White-label custom domain</li>
                  <li>Dedicated infrastructure (if required)</li>
                  <li>Annual contract discounts available</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Pricing Details:</h3>
                <p className="text-[#c0c0c0]">
                  <strong>Price:</strong> Custom pricing (starting from ₹25,000 per month)<br />
                  <strong>Billing Period:</strong> Monthly or Annual (as per contract)<br />
                  <strong>Payment Method:</strong> Invoice, Bank Transfer, Credit/Debit Card<br />
                  <strong>Currency:</strong> Indian Rupees (INR)<br />
                  <strong>Contact:</strong> Please contact us at{" "}
                  <a
                    href="mailto:hello@onereport.com"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    hello@onereport.com
                  </a>
                  {" "}for custom pricing
                </p>
              </div>
            </section>

            {/* Payment Information */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-4">
                Payment Information
              </h2>
              <div className="space-y-4 text-[#c0c0c0]">
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Accepted Payment Methods:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Credit Cards (Visa, Mastercard, RuPay)</li>
                    <li>Debit Cards</li>
                    <li>UPI (Unified Payments Interface)</li>
                    <li>Net Banking</li>
                    <li>Digital Wallets (for applicable plans)</li>
                    <li>Bank Transfer (for Enterprise plans)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Currency:</h3>
                  <p>All prices are displayed in Indian Rupees (INR - ₹). Payments are processed in INR.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Billing:</h3>
                  <p>Subscriptions are billed in advance on a recurring basis (monthly or annually as per plan). All charges are clearly displayed before payment confirmation.</p>
                </div>
              </div>
            </section>

            {/* Contact for More Information */}
            <section className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-4">
                Need More Information?
              </h2>
              <p className="text-[#c0c0c0] leading-relaxed mb-4">
                If you have questions about our products, services, or pricing, please don&apos;t hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:hello@onereport.com"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-br from-[#6CA3A2] to-[#5A8D8C] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Email Us
                </a>
                <a
                  href="tel:+918888215802"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Call Us: +91 8888215802
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-[#6CA3A2] text-[#6CA3A2] font-semibold hover:bg-[#6CA3A2] hover:text-white transition-colors"
                >
                  Contact Page
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

