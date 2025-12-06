import type { Metadata } from "next";
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
    <>
      <ContactSection />
      <Footer />
    </>
  );
}

