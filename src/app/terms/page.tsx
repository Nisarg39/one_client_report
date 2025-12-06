import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | OneReport",
  description: "Terms and Conditions for OneReport - AI-powered client reporting software",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-sm text-[#999]">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
            <div className="space-y-6 text-[#c0c0c0]">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="leading-relaxed">
                  By accessing and using OneReport (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  2. Use License
                </h2>
                <p className="leading-relaxed mb-3">
                  Permission is granted to temporarily access the materials on OneReport&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on OneReport&apos;s website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  3. Service Description
                </h2>
                <p className="leading-relaxed">
                  OneReport is an AI-powered client reporting software that helps agencies and freelance marketers create professional marketing reports. The Service includes features such as automated data collection, report generation, and AI-powered insights.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  4. User Accounts
                </h2>
                <p className="leading-relaxed mb-3">
                  To access certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information to keep it accurate</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Accept all responsibility for activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  5. Subscription and Payment
                </h2>
                <p className="leading-relaxed mb-3">
                  The Service is offered on a subscription basis. By subscribing, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pay all fees associated with your subscription plan</li>
                  <li>Provide valid payment information and authorize us to charge your payment method</li>
                  <li>Understand that subscription fees are billed in advance on a recurring basis</li>
                  <li>Accept that prices may change with 30 days&apos; notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  6. Data and Privacy
                </h2>
                <p className="leading-relaxed">
                  Your use of the Service is also governed by our Privacy Policy. We collect and process data as described in our Privacy Policy. You retain ownership of all data you upload to the Service, and we will not use your data except as necessary to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  7. Intellectual Property
                </h2>
                <p className="leading-relaxed">
                  The Service and its original content, features, and functionality are owned by OneReport and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  8. Prohibited Uses
                </h2>
                <p className="leading-relaxed mb-3">
                  You may not use the Service:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>In any way that violates any applicable law or regulation</li>
                  <li>To transmit any malicious code or viruses</li>
                  <li>To impersonate or attempt to impersonate the company or any employee</li>
                  <li>In any way that infringes upon the rights of others</li>
                  <li>To engage in any automated use of the system that is unauthorized</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  9. Termination
                </h2>
                <p className="leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  10. Disclaimer
                </h2>
                <p className="leading-relaxed">
                  The materials on OneReport&apos;s website are provided on an &apos;as is&apos; basis. OneReport makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  11. Limitation of Liability
                </h2>
                <p className="leading-relaxed">
                  In no event shall OneReport or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on OneReport&apos;s website, even if OneReport or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  12. Changes to Terms
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  13. Contact Information
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms, please contact us at{" "}
                  <a
                    href="mailto:hello@onereport.com"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    hello@onereport.com
                  </a>
                  {" "}or visit our{" "}
                  <Link
                    href="/contact"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    Contact Us
                  </Link>
                  {" "}page.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

