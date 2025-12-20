import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Refund Policy | OneReport",
  description: "Refund Policy for OneReport - Information about refunds and cancellations",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
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
            Refund Policy
          </h1>
          <p className="text-sm text-[#999]">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-6 text-[#c0c0c0]">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  1. Overview
                </h2>
                <p className="leading-relaxed">
                  At OneReport, we strive to provide excellent service and ensure customer satisfaction. This Refund Policy outlines the terms and conditions under which refunds may be issued for our subscription-based service.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  2. Subscription Refunds
                </h2>
                
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  2.1 Free Trial Period
                </h3>
                <p className="leading-relaxed">
                  We offer a free trial period for new users. During the free trial, you can cancel your subscription at any time without being charged. No refund is necessary as no payment has been processed.
                </p>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  2.2 Monthly Subscriptions
                </h3>
                <p className="leading-relaxed mb-3">
                  For monthly subscription plans:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation takes effect at the end of your current billing period</li>
                  <li>No refunds are provided for the current billing period once payment has been processed</li>
                  <li>You will continue to have access to the Service until the end of your paid period</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  2.3 Annual Subscriptions
                </h3>
                <p className="leading-relaxed mb-3">
                  For annual subscription plans:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>If you cancel within the first 30 days, you are eligible for a full refund</li>
                  <li>After 30 days, refunds are calculated on a prorated basis for the remaining unused months</li>
                  <li>Refund requests must be submitted within 7 days of cancellation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  3. Refund Eligibility
                </h2>
                <p className="leading-relaxed mb-3">
                  Refunds may be considered in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Technical issues that prevent you from using the Service and cannot be resolved by our support team</li>
                  <li>Billing errors or duplicate charges</li>
                  <li>Service unavailability for an extended period (more than 48 hours) due to our fault</li>
                  <li>Annual subscription cancellation within the first 30 days</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Refunds will NOT be provided for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Change of mind after the refund period</li>
                  <li>Failure to use the Service or lack of understanding of features</li>
                  <li>Issues caused by user error or third-party platform connectivity problems</li>
                  <li>Monthly subscriptions after the billing period has started</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  4. How to Request a Refund
                </h2>
                <p className="leading-relaxed mb-3">
                  To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact our support team at{" "}
                    <a
                      href="mailto:shah.nisarg39@gmail.com"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      shah.nisarg39@gmail.com
                    </a>
                    {" "}or use our{" "}
                    <Link
                      href="/contact"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      Contact Us
                    </Link>
                    {" "}page
                  </li>
                  <li>Provide your account email address and subscription details</li>
                  <li>Explain the reason for your refund request</li>
                  <li>Include any relevant documentation or screenshots if applicable</li>
                </ol>
                <p className="leading-relaxed mt-4">
                  We will review your request and respond within <strong>5-7 business days</strong>. The review process includes verification of your account details, subscription status, and eligibility for refund based on our policy terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  5. Refund Processing Duration and Mode
                </h2>
                
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  5.1 Refund Processing Duration
                </h3>
                <p className="leading-relaxed mb-3">
                  If your refund request is approved, the following timelines apply:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Request Review:</strong> 5-7 business days from submission</li>
                  <li><strong>Approval Notification:</strong> Email confirmation sent within 24 hours of approval</li>
                  <li><strong>Refund Processing:</strong> 5-10 business days from approval date</li>
                  <li><strong>Total Duration:</strong> 10-17 business days from refund request submission to completion</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  5.2 Refund Mode
                </h3>
                <p className="leading-relaxed mb-3">
                  Refunds are processed using the following methods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Original Payment Method:</strong> Refunds are credited back to the original payment method used for the purchase</li>
                  <li><strong>Credit/Debit Cards:</strong> Refunds appear on your statement within 5-10 business days</li>
                  <li><strong>UPI Payments:</strong> Refunds are processed to the original UPI ID within 3-7 business days</li>
                  <li><strong>Net Banking:</strong> Refunds are credited to the source bank account within 5-10 business days</li>
                  <li><strong>Digital Wallets:</strong> Refunds are credited to the original wallet within 3-5 business days</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  5.3 Refund Confirmation
                </h3>
                <p className="leading-relaxed mb-3">
                  Upon refund completion:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You will receive an email confirmation with refund details</li>
                  <li>The confirmation email includes refund amount, transaction ID, and expected credit date</li>
                  <li>Your account access will be terminated upon refund completion (unless otherwise specified)</li>
                  <li>Refund receipt/invoice will be provided upon request</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  6. Cancellation Policy
                </h2>
                <p className="leading-relaxed mb-3">
                  You can cancel your subscription at any time:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Through your account settings on the Service</li>
                  <li>By contacting our support team</li>
                  <li>Cancellation is effective at the end of your current billing period</li>
                  <li>No cancellation fees apply</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  After cancellation, you will retain access to the Service until the end of your paid subscription period. We recommend canceling before your next billing date if you do not wish to be charged.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  7. Chargebacks
                </h2>
                <p className="leading-relaxed">
                  If you initiate a chargeback or dispute with your payment provider, we reserve the right to suspend or terminate your account immediately. We encourage you to contact us directly to resolve any billing issues before initiating a chargeback, as we are committed to resolving disputes amicably.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  8. Changes to This Policy
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to this page. We encourage you to review this policy periodically. Your continued use of the Service after changes are posted constitutes acceptance of the modified policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  9. Contact Us
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about this Refund Policy or need assistance with a refund request, please contact us at{" "}
                  <a
                    href="mailto:shah.nisarg39@gmail.com"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    shah.nisarg39@gmail.com
                  </a>
                  {" "}or visit our{" "}
                  <Link
                    href="/contact"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    Contact Us
                  </Link>
                  {" "}page. Our support team is available to assist you.
                </p>
              </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

