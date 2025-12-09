"use client";

import { useState } from "react";
import { FeaturesHero } from "@/components/features/features-hero";
import { ModeToggle } from "@/components/features/mode-toggle";
import { EducationModeFeatures } from "@/components/features/education-mode-features";
import { ProfessionalModeFeatures } from "@/components/features/professional-mode-features";
import { FeaturesCTA } from "@/components/features/features-cta";
import { Footer } from "@/components/layout/footer";

type Mode = "education" | "professional";

export function FeaturesPageClient() {
  const [activeMode, setActiveMode] = useState<Mode>("education");

  return (
    <>
      <FeaturesHero />
      
      {/* Mode Toggle Section */}
      <section className="relative bg-[#242424] py-8 sm:py-12">
        {/* Gradient transition - adapts based on mode */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 pointer-events-none z-0"
          style={{
            background: activeMode === "education"
              ? "linear-gradient(to bottom, #242424, #1e1e1e, #242424)"
              : "linear-gradient(to bottom, #242424, #1e1e1e, #1a1a1a)"
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <ModeToggle activeMode={activeMode} onModeChange={setActiveMode} />
        </div>
      </section>

      {/* Show features based on selected mode */}
      {activeMode === "education" && <EducationModeFeatures />}
      {activeMode === "professional" && <ProfessionalModeFeatures />}

      {/* CTA Section */}
      <FeaturesCTA />
      
      <Footer />
    </>
  );
}

