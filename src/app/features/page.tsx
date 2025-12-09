import type { Metadata } from "next";
import { FeaturesPageClient } from "./features-page-client";

export const metadata: Metadata = {
  title: "Features - OneReport | AI-Powered Client Reporting",
  description: "Explore OneReport's features: Education Mode for students and Professional Mode for businesses. AI chatbot, platform integrations, and more.",
  keywords: [
    "AI chatbot features",
    "marketing platform integrations",
    "education mode",
    "professional mode",
    "student marketing analytics",
    "business reporting",
    "Google Analytics integration",
    "Meta Ads integration",
    "automated client reporting",
    "platform features",
  ],
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Features - OneReport | AI-Powered Client Reporting",
    description: "Explore OneReport's features: Education Mode for students and Professional Mode for businesses.",
    url: "https://onereport.in/features",
  },
};

export default function FeaturesPage() {
  return <FeaturesPageClient />;
}
