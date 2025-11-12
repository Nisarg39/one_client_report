import { describe, expect, it } from "vitest";

import { AVAILABLE_PLATFORMS, MOCK_CLIENTS } from "@/data/mockDemoData";

const REQUIRED_NUMERIC_METRICS = [
  "sessions",
  "users",
  "pageViews",
  "bounceRate",
  "conversionRate",
] as const;

describe("demo data contracts", () => {
  const platformIds = new Set(AVAILABLE_PLATFORMS.map((platform) => platform.id));

  it("ensures every mock client references known platforms and valid metrics", () => {
    MOCK_CLIENTS.forEach((client) => {
      expect(client.id).toMatch(/^\d+$/);
      expect(client.name.trim()).not.toHaveLength(0);
      expect(client.logo.startsWith("https://")).toBe(true);
      expect(client.platforms.length).toBeGreaterThan(0);

      client.platforms.forEach((platform) => {
        expect(platformIds.has(platform.id)).toBe(true);
        REQUIRED_NUMERIC_METRICS.forEach((metricKey) => {
          const value = platform.metrics[metricKey];
          expect(typeof value).toBe("number");
          expect(Number.isFinite(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(0);
          if (metricKey === "bounceRate" || metricKey === "conversionRate") {
            expect(value).toBeLessThanOrEqual(100);
          }
        });

        if (platform.topPages) {
          expect(Array.isArray(platform.topPages)).toBe(true);
          platform.topPages.forEach((page) => {
            expect(page.url.startsWith("/")).toBe(true);
            expect(page.views).toBeGreaterThan(0);
            expect(typeof page.bounceRate).toBe("string");
          });
        }

        expect(platform.insights.length).toBeGreaterThan(0);
        platform.insights.forEach((insight) => {
          expect(insight.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("guarantees every available platform appears in at least one client configuration", () => {
    const referencedPlatforms = new Set(
      MOCK_CLIENTS.flatMap((client) => client.platforms.map((platform) => platform.id))
    );

    AVAILABLE_PLATFORMS.forEach((platform) => {
      expect(referencedPlatforms.has(platform.id)).toBe(true);
    });
  });
});
