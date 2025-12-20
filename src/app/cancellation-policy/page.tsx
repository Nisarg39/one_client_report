import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Cancellation Policy | OneReport",
  description: "Cancellation Policy for OneReport - Information about subscription cancellations and duration",
  alternates: {
    canonical: "/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
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
            Cancellation Policy
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
                  At OneReport, we understand that circumstances may change, and you may need to cancel your subscription. This Cancellation Policy outlines the terms, conditions, and duration for canceling your subscription to our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  2. Cancellation Rights
                </h2>
                <p className="leading-relaxed mb-3">
                  You have the right to cancel your subscription at any time. There are no cancellation fees, and you can cancel through any of the following methods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Through your account settings on the Service dashboard</li>
                  <li>By contacting our support team via email at{" "}
                    <a
                      href="mailto:shah.nisarg39@gmail.com"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      shah.nisarg39@gmail.com
                    </a>
                  </li>
                  <li>By calling us at{" "}
                    <a
                      href="tel:+918888215802"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      +91 8888215802
                    </a>
                  </li>
                  <li>Through our{" "}
                    <Link
                      href="/contact"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      Contact Us
                    </Link>
                    {" "}page
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  3. Cancellation Duration and Timeline
                </h2>
                
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  3.1 Immediate Cancellation
                </h3>
                <p className="leading-relaxed mb-3">
                  When you cancel your subscription:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Processing Time:</strong> Cancellation requests are processed immediately upon receipt</li>
                  <li><strong>Confirmation:</strong> You will receive an email confirmation within 24 hours of your cancellation request</li>
                  <li><strong>Effective Date:</strong> Cancellation takes effect at the end of your current billing period</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  3.2 Service Access Duration After Cancellation
                </h3>
                <p className="leading-relaxed mb-3">
                  After canceling your subscription:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You will retain full access to the Service until the end of your paid billing period</li>
                  <li>For monthly subscriptions: Access continues until the end of the current month</li>
                  <li>For annual subscriptions: Access continues until the end of the current annual period</li>
                  <li>No service interruption occurs during the remaining paid period</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  3.3 Cancellation During Free Trial
                </h3>
                <p className="leading-relaxed">
                  If you cancel during the free trial period:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cancellation is effective immediately</li>
                  <li>No charges will be applied to your payment method</li>
                  <li>You will lose access to premium features immediately upon cancellation</li>
                  <li>You can reactivate your account at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  4. Cancellation Process Duration
                </h2>
                <p className="leading-relaxed mb-3">
                  The cancellation process follows these timelines:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Online Cancellation:</strong> Processed instantly when done through account settings</li>
                  <li><strong>Email Cancellation:</strong> Processed within 24 hours of receiving your request</li>
                  <li><strong>Phone Cancellation:</strong> Processed immediately during the call</li>
                  <li><strong>Confirmation Email:</strong> Sent within 24 hours of processing your cancellation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  5. What Happens After Cancellation
                </h2>
                <p className="leading-relaxed mb-3">
                  Upon cancellation:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your subscription will not renew automatically</li>
                  <li>You will not be charged for future billing periods</li>
                  <li>You will receive a cancellation confirmation email</li>
                  <li>Your data will be retained for 30 days after cancellation (you can request immediate deletion)</li>
                  <li>You can reactivate your subscription at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  6. Refunds and Cancellation
                </h2>
                <p className="leading-relaxed">
                  Cancellation and refunds are separate processes. For information about refunds, please refer to our{" "}
                  <Link
                    href="/refund-policy"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    Refund Policy
                  </Link>
                  . Generally, cancellation does not automatically entitle you to a refund for the current billing period, except as specified in our Refund Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  7. Reactivation
                </h2>
                <p className="leading-relaxed mb-3">
                  If you wish to reactivate your subscription after cancellation:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You can reactivate at any time through your account settings</li>
                  <li>Reactivation is immediate upon payment confirmation</li>
                  <li>You will regain access to all features based on your selected plan</li>
                  <li>Previous data and settings will be restored if available</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  8. Changes to This Policy
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to modify this Cancellation Policy at any time. Changes will be effective immediately upon posting to this page. We encourage you to review this policy periodically. Your continued use of the Service after changes are posted constitutes acceptance of the modified policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  9. Contact Us
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about this Cancellation Policy or need assistance with canceling your subscription, please contact us at{" "}
                  <a
                    href="mailto:shah.nisarg39@gmail.com"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    shah.nisarg39@gmail.com
                  </a>
                  {" "}or call us at{" "}
                  <a
                    href="tel:+918888215802"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    +91 8888215802
                  </a>
                  . You can also visit our{" "}
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

