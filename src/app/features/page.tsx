import type { Metadata } from "next";
import { FeaturesHero } from "@/components/features/features-hero";
import { AIChatbotFeatures } from "@/components/features/ai-chatbot-features";
import { PlatformIntegrations } from "@/components/features/platform-integrations";
import { OnboardingShowcase } from "@/components/features/onboarding-showcase";
import { FeaturesCTA } from "@/components/features/features-cta";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Features - OneReport | AI-Powered Client Reporting",
  description: "Explore OneReport's features: AI chatbot, platform integrations, multi-client support, and more. See how we help agencies save time and money.",
  keywords: [
    "AI chatbot features",
    "marketing platform integrations",
    "multi-client reporting",
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
    description: "Explore OneReport's features: AI chatbot, platform integrations, multi-client support, and more.",
    url: "https://onereport.in/features",
  },
};

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />
      <AIChatbotFeatures />
      <PlatformIntegrations />
      <OnboardingShowcase />
      <FeaturesCTA />
      <Footer />
    </>
  );
}

