import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { ContactSection } from "@/components/features/contact-section";

export const metadata: Metadata = {
  title: "Contact Us | OneReport",
  description: "Get in touch with OneReport - Contact information and support",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p className="text-lg text-[#c0c0c0]">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Contact Information Card */}
        <div className="rounded-2xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)] mb-12">
          <h2
            className="text-2xl font-bold text-[#f5f5f5] mb-6"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Email</h3>
              <a
                href="mailto:hello@onereport.com"
                className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
              >
                hello@onereport.com
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Phone</h3>
              <a
                href="tel:+918888215802"
                className="text-[#6CA3A2] hover:text-[#7db3b2] transition-colors"
              >
                +91 8888215802
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Location</h3>
              <p className="text-[#c0c0c0]">Pune, India</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Response Time</h3>
              <p className="text-[#c0c0c0]">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactSection />
      <Footer />
    </div>
  );
}

