import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Shipping Policy | OneReport",
  description: "Shipping Policy for OneReport - Digital delivery and service activation information",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyPage() {
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
            Shipping Policy
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
                  OneReport is a Software-as-a-Service (SaaS) platform that provides digital services through our web-based application. This Shipping Policy outlines our digital delivery process, service activation timelines, and duration for accessing our services. Since we provide digital services only, no physical shipping is required.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  2. Digital Delivery
                </h2>
                <p className="leading-relaxed mb-3">
                  OneReport is delivered digitally through our web platform. There are no physical products to ship. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access to our web-based reporting platform</li>
                  <li>AI-powered analytics and insights</li>
                  <li>Cloud-based data storage and processing</li>
                  <li>Digital report generation and export capabilities</li>
                  <li>API access (for applicable plans)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  3. Service Activation Duration and Timeline
                </h2>
                
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  3.1 Free Trial Activation
                </h3>
                <p className="leading-relaxed mb-3">
                  For free trial accounts:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Activation Time:</strong> Immediate upon account creation</li>
                  <li><strong>Duration:</strong> 7 days from account creation</li>
                  <li><strong>Access:</strong> Full platform access with trial limitations</li>
                  <li><strong>No Payment Required:</strong> No credit card needed for trial activation</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  3.2 Paid Subscription Activation
                </h3>
                <p className="leading-relaxed mb-3">
                  For paid subscriptions:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Activation Time:</strong> Within 5 minutes of successful payment confirmation</li>
                  <li><strong>Payment Processing:</strong> Payment verification typically takes 2-5 minutes</li>
                  <li><strong>Service Access:</strong> Immediate access to all features based on your plan</li>
                  <li><strong>Confirmation Email:</strong> Sent within 15 minutes of activation</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3 mt-4">
                  3.3 Platform Integration Setup
                </h3>
                <p className="leading-relaxed mb-3">
                  For connecting third-party platforms (Google Analytics, Meta Ads, etc.):
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Connection Duration:</strong> Typically completed within 2-10 minutes</li>
                  <li><strong>Data Sync:</strong> Initial data synchronization may take 15-30 minutes</li>
                  <li><strong>Real-time Updates:</strong> Ongoing data updates occur automatically</li>
                  <li><strong>Manual Refresh:</strong> Available for immediate data updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  4. Service Delivery Method
                </h2>
                <p className="leading-relaxed mb-3">
                  Our services are delivered through:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Web Application:</strong> Accessible via web browser at onereport.in</li>
                  <li><strong>Cloud Infrastructure:</strong> Hosted on secure, scalable cloud servers</li>
                  <li><strong>API Access:</strong> Available for Enterprise plans (activation within 24 hours)</li>
                  <li><strong>Email Notifications:</strong> Service updates and confirmations sent via email</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  5. Service Availability Duration
                </h2>
                <p className="leading-relaxed mb-3">
                  Service availability periods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Monthly Subscriptions:</strong> Service available for the entire month (30-31 days) from activation</li>
                  <li><strong>Annual Subscriptions:</strong> Service available for 365 days from activation</li>
                  <li><strong>Free Trial:</strong> Service available for 7 days from account creation</li>
                  <li><strong>Uptime:</strong> We maintain 99.9% service uptime (scheduled maintenance excluded)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  6. No Physical Shipping Required
                </h2>
                <p className="leading-relaxed">
                  Since OneReport is a digital service platform, we do not ship any physical products. All services, features, and reports are delivered digitally through our web platform. You do not need to provide a shipping address for our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  7. Service Delivery Confirmation
                </h2>
                <p className="leading-relaxed mb-3">
                  Upon successful service activation, you will receive:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Welcome email with account access instructions (within 15 minutes)</li>
                  <li>Account activation confirmation</li>
                  <li>Onboarding guide and tutorial resources</li>
                  <li>Access to customer support channels</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  8. Service Delivery Issues
                </h2>
                <p className="leading-relaxed mb-3">
                  If you experience any issues with service activation or access:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Check your email (including spam folder) for activation confirmation</li>
                  <li>Verify your payment was processed successfully</li>
                  <li>Contact our support team at{" "}
                    <a
                      href="mailto:shah.nisarg39@gmail.com"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      shah.nisarg39@gmail.com
                    </a>
                    {" "}or call{" "}
                    <a
                      href="tel:+918888215802"
                      className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                    >
                      +91 8888215802
                    </a>
                  </li>
                  <li>Support response time: Within 24 hours (typically within 2-4 hours during business hours)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  9. International Access
                </h2>
                <p className="leading-relaxed">
                  Our digital services are available worldwide. There are no geographical restrictions on service delivery. All services are accessible from any location with internet connectivity. Service activation duration and timelines remain the same regardless of your location.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  10. Changes to This Policy
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to modify this Shipping Policy at any time. Changes will be effective immediately upon posting to this page. We encourage you to review this policy periodically. Your continued use of the Service after changes are posted constitutes acceptance of the modified policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  11. Contact Us
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about this Shipping Policy or need assistance with service activation, please contact us at{" "}
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

