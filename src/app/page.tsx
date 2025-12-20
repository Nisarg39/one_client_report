import { HeroSectionSkeuomorphic } from "@/components/features/hero-section-skeuomorphic";
import { SocialProofBar } from "@/components/features/social-proof-bar";
import { ProblemStatement } from "@/components/features/problem-statement";
import { SolutionOverview } from "@/components/features/solution-overview";
import { InteractiveChatbotDemo } from "@/components/features/interactive-chatbot-demo";
import { PricingTransparency } from "@/components/features/pricing-transparency";
import { FAQSection } from "@/components/features/faq-section";
import { FinalCTA } from "@/components/features/final-cta";
import { ContactSection } from "@/components/features/contact-section";
import { Footer } from "@/components/layout/footer";
import { HashScrollHandler } from "@/components/features/hash-scroll-handler";
import { getCurrentUser } from "@/lib/auth/adapter";
import { checkTrialLimits } from "@/lib/utils/trialLimits";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  let trialExpired = false;

  if (user) {
    // Check if trial expired
    // We only care about trial expiry for Pro/Agency tiers usually, 
    // but checkTrialLimits handles logic for Student (never expires) too.
    // If checkTrialLimits returns allowed: false and reason: trial_expired, then set true.
    const limits = await checkTrialLimits(user.id);
    if (!limits.allowed && limits.reason === 'trial_expired') {
      trialExpired = true;
    }
  }

  return (
    <>
      <HashScrollHandler />
      <HeroSectionSkeuomorphic />
      <SocialProofBar />
      <ProblemStatement />
      <SolutionOverview />
      <InteractiveChatbotDemo />
      <PricingTransparency trialExpired={trialExpired} />
      <FAQSection />
      <FinalCTA />
      <ContactSection />
      <Footer />
    </>
  );
}
