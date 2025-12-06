import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About Us | OneReport",
  description: "Learn about OneReport - Our mission, vision, and the team behind AI-powered client reporting software",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
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
            About Us
          </h1>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
            <div className="space-y-6 text-[#c0c0c0]">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Our Mission
                </h2>
                <p className="leading-relaxed">
                  At OneReport, we believe that creating professional client reports shouldn&apos;t take hours of manual work. Our mission is to empower agencies and freelance marketers with AI-powered tools that transform data into beautiful, insightful reports in just 5 minutes.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  What We Do
                </h2>
                <p className="leading-relaxed mb-3">
                  OneReport is an AI-powered client reporting software designed specifically for marketing agencies and freelance marketers. We help you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Automatically collect data from multiple marketing platforms (Google Analytics, Meta Ads, LinkedIn Ads, and more)</li>
                  <li>Generate professional, white-label reports in minutes instead of hours</li>
                  <li>Provide AI-powered insights and recommendations</li>
                  <li>Save 50-80% compared to traditional reporting platforms</li>
                  <li>Deliver reports that impress clients and win more business</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Our Story
                </h2>
                <p className="leading-relaxed">
                  OneReport was born from frustration. As marketers ourselves, we spent countless hours every month manually compiling data from different platforms, creating reports, and formatting them for clients. We knew there had to be a better way. After experiencing the high costs and complexity of existing reporting tools, we set out to build a solution that was both affordable and easy to use. Today, OneReport helps hundreds of agencies and freelancers save time and deliver better results to their clients.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Our Values
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      Simplicity
                    </h3>
                    <p className="leading-relaxed">
                      We believe powerful tools should be easy to use. No complex setup, no steep learning curve—just results.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      Affordability
                    </h3>
                    <p className="leading-relaxed">
                      Professional reporting shouldn&apos;t break the bank. We&apos;re committed to providing exceptional value at a fair price.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      Innovation
                    </h3>
                    <p className="leading-relaxed">
                      We leverage cutting-edge AI technology to automate tedious tasks and provide insights that help you make better decisions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      Customer Success
                    </h3>
                    <p className="leading-relaxed">
                      Your success is our success. We&apos;re here to support you every step of the way, from onboarding to ongoing success.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Why Choose OneReport?
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      Time Savings
                    </h3>
                    <p className="leading-relaxed">
                      Create reports in 5 minutes instead of 5 hours. Spend more time on strategy and less time on manual data entry.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      Cost Effective
                    </h3>
                    <p className="leading-relaxed">
                      Our pricing is 50-80% lower than traditional reporting platforms, making professional reporting accessible to agencies of all sizes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      AI-Powered Insights
                    </h3>
                    <p className="leading-relaxed">
                      Get intelligent insights and recommendations that help you understand your data and communicate value to clients.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                      White-Label Ready
                    </h3>
                    <p className="leading-relaxed">
                      All reports are fully customizable and white-label ready, so you can maintain your brand identity.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Legal Information
                </h2>
                <p className="leading-relaxed mb-4">
                  This website is operated by <strong className="text-[#f5f5f5]">Nisarg Manojkumar Shah</strong>.
                </p>
                <div className="bg-[#1a1a1a] rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-semibold text-[#f5f5f5] mb-3">Registered Address:</h3>
                  <p className="text-[#c0c0c0] leading-relaxed">
                    314/25, Netaji Nagar, Wanowrie,<br />
                    Pune - 411040, Maharashtra, India
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Our Location
                </h2>
                <p className="leading-relaxed">
                  OneReport is based in Pune, India. We serve customers worldwide and are committed to providing excellent support regardless of your location.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Get in Touch
                </h2>
                <p className="leading-relaxed">
                  We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to{" "}
                  <Link
                    href="/contact"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    contact us
                  </Link>
                  . You can reach us at{" "}
                  <a
                    href="mailto:hello@onereport.com"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    hello@onereport.com
                  </a>
                  {" "}or call us at{" "}
                  <a
                    href="tel:+918888215802"
                    className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
                  >
                    +91 8888215802
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-4">
                  Join Our Community
                </h2>
                <p className="leading-relaxed">
                  Follow us on social media to stay updated with the latest features, tips, and insights. Connect with other marketers and share your success stories!
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

