// Platform types
export type PlatformType = "google-analytics" | "google-ads" | "meta-ads" | "linkedin-ads" | "tiktok-ads";

// Platform data interface
export interface PlatformData {
  id: PlatformType;
  name: string;
  iconType: PlatformType;
  metrics: {
    sessions: number;
    users: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    conversionRate: number;
  };
  topPages?: Array<{
    url: string;
    views: number;
    bounceRate: string;
  }>;
  insights: string[];
}

// Client interface
export interface Client {
  id: string;
  name: string;
  industry: string;
  logo: string; // Company logo/avatar text or emoji
  platforms: PlatformData[];
}

// Available platform interface
export interface AvailablePlatform {
  id: PlatformType;
  name: string;
}

// Aggregated data interface
export interface AggregatedData {
  metrics: {
    sessions: number;
    users: number;
    pageViews: number;
    bounceRate: string;
    avgSessionDuration: string;
    conversionRate: string;
  };
  topPages: Array<{
    url: string;
    views: number;
    bounceRate: string;
  }>;
  insights: string[];
  platformCount: number;
}
