"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ClientSelector } from "@/components/demo/ClientSelector";
import { PlatformSelector } from "@/components/demo/PlatformSelector";
import { ReportView } from "@/components/demo/ReportView";
import { MOCK_CLIENTS } from "@/data/mockDemoData";
import type { PlatformType, AggregatedData } from "@/types/demo";

export default function DemoPage() {
  const router = useRouter();
  const [selectedClientId, setSelectedClientId] = useState("1");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformType>>(
    new Set(["google-analytics"])
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(true);
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

  // Get current client
  const currentClient = MOCK_CLIENTS.find((c) => c.id === selectedClientId)!;

  // Calculate aggregated metrics from selected platforms
  const aggregatedData = useMemo((): AggregatedData | null => {
    const selectedPlatformData = currentClient.platforms.filter((p) =>
      selectedPlatforms.has(p.id)
    );

    if (selectedPlatformData.length === 0) {
      return null;
    }

    // Sum up metrics
    const totalSessions = selectedPlatformData.reduce((sum, p) => sum + p.metrics.sessions, 0);
    const totalUsers = selectedPlatformData.reduce((sum, p) => sum + p.metrics.users, 0);
    const totalPageViews = selectedPlatformData.reduce((sum, p) => sum + p.metrics.pageViews, 0);
    const avgBounceRate =
      selectedPlatformData.reduce((sum, p) => sum + p.metrics.bounceRate, 0) /
      selectedPlatformData.length;
    const avgConversionRate =
      selectedPlatformData.reduce((sum, p) => sum + p.metrics.conversionRate, 0) /
      selectedPlatformData.length;

    // Get all insights
    const allInsights = selectedPlatformData.flatMap((p) => p.insights);

    // Get top pages from GA if selected
    const topPages =
      selectedPlatformData.find((p) => p.id === "google-analytics")?.topPages || [];

    return {
      metrics: {
        sessions: totalSessions,
        users: totalUsers,
        pageViews: totalPageViews,
        bounceRate: avgBounceRate.toFixed(1) + "%",
        avgSessionDuration: "4m 12s", // Could calculate weighted average
        conversionRate: avgConversionRate.toFixed(1) + "%",
      },
      topPages,
      insights: allInsights,
      platformCount: selectedPlatformData.length,
    };
  }, [currentClient, selectedPlatforms]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setShowReport(false);

    setTimeout(() => {
      setShowReport(true);
      setIsGenerating(false);
      setHasGeneratedReport(true);
    }, 2000);
  };

  const togglePlatform = (platformId: PlatformType) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      // Don't allow removing all platforms
      if (newSelected.size > 1) {
        newSelected.delete(platformId);
      }
    } else {
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    // Reset to only GA for new client
    setSelectedPlatforms(new Set(["google-analytics"]));
    // Reset AI insights generation state
    setHasGeneratedReport(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1
              className="text-2xl font-bold text-[#f5f5f5]"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
            >
              <span className="text-[#6CA3A2]">One</span>Report
            </h1>
          </Link>
          <button
            onClick={() => router.push("/signup")}
            className="relative overflow-hidden px-6 py-2.5 rounded-2xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white text-sm shadow-[-8px_-8px_16px_rgba(70,70,70,0.4),8px_8px_16px_rgba(0,0,0,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,140,66,0.3)] hover:shadow-[-6px_-6px_12px_rgba(70,70,70,0.4),6px_6px_12px_rgba(0,0,0,0.8)] transition-all duration-300"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <span className="relative flex items-center">
              Start Free Trial
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full pt-10 px-6 pb-6 gap-6">
        {/* Left Sidebar - Demo Controls */}
        <div className="lg:w-80 flex-shrink-0 space-y-4">
          <ClientSelector
            selectedClientId={selectedClientId}
            onClientChange={handleClientChange}
            isGenerating={isGenerating}
            onGenerateReport={handleGenerateReport}
          />

          <PlatformSelector
            currentClient={currentClient}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={togglePlatform}
          />

          {/* Info Box */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl shadow-[-8px_-8px_16px_rgba(70,70,70,0.3),8px_8px_16px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            <p className="text-xs text-[#999] leading-relaxed">
              This demo shows how OneReport aggregates data from multiple platforms. Connect
              your real accounts to generate unified reports!
            </p>
          </div>
        </div>

        {/* Right Side - Report Preview */}
        <div className="flex-1 min-w-0">
          <ReportView
            currentClient={currentClient}
            aggregatedData={showReport ? aggregatedData : null}
            isGenerating={isGenerating}
            selectedPlatforms={selectedPlatforms}
            showReport={showReport}
            hasGeneratedReport={hasGeneratedReport}
          />
        </div>
      </div>
    </div>
  );
}
