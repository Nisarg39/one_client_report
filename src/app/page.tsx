import { HeroSectionSkeuomorphic } from "@/components/features/hero-section-skeuomorphic";
import { SocialProofBar } from "@/components/features/social-proof-bar";
import { ProblemStatement } from "@/components/features/problem-statement";
import { SolutionOverview } from "@/components/features/solution-overview";
import { PricingTransparency } from "@/components/features/pricing-transparency";
import { FAQSection } from "@/components/features/faq-section";
import { FinalCTA } from "@/components/features/final-cta";
import { ContactSection } from "@/components/features/contact-section";
import { Footer } from "@/components/layout/footer";
import { HashScrollHandler } from "@/components/features/hash-scroll-handler";

export default function Home() {
  return (
    <>
      <HashScrollHandler />
      <HeroSectionSkeuomorphic />
      <SocialProofBar />
      <ProblemStatement />
      <SolutionOverview />
      <PricingTransparency />
      <FAQSection />
      <FinalCTA />
      <ContactSection />
      <Footer />
    </>
  );
}
