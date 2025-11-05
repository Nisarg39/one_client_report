import { BarChart3, Target, Share2, Briefcase, Music } from "lucide-react";
import type { PlatformType } from "@/types/demo";

interface PlatformIconProps {
  platformType: PlatformType;
  className?: string;
}

// Platform brand colors
const PLATFORM_COLORS: Record<PlatformType, string> = {
  "google-analytics": "#F9AB00",
  "google-ads": "#4285F4",
  "meta-ads": "#0081FB",
  "linkedin-ads": "#0A66C2",
  "tiktok-ads": "#00F2EA",
};

export function PlatformIcon({ platformType, className = "w-5 h-5" }: PlatformIconProps) {
  const color = PLATFORM_COLORS[platformType];
  const iconProps = { className, style: { color } };

  switch (platformType) {
    case "google-analytics":
      return <BarChart3 {...iconProps} />;
    case "google-ads":
      return <Target {...iconProps} />;
    case "meta-ads":
      return <Share2 {...iconProps} />;
    case "linkedin-ads":
      return <Briefcase {...iconProps} />;
    case "tiktok-ads":
      return <Music {...iconProps} />;
  }
}
