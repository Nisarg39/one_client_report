"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Eye, MousePointer, Calendar, TrendingUp, Sparkles, BarChart2, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { TrafficSourcesChart } from "./TrafficSourcesChart";
import { PerformanceTrendsChart } from "./PerformanceTrendsChart";
import { DeviceBreakdownChart } from "./DeviceBreakdownChart";
import type { Client, AggregatedData, PlatformType } from "@/types/demo";

interface ReportViewProps {
  currentClient: Client;
  aggregatedData: AggregatedData | null;
  isGenerating: boolean;
  selectedPlatforms: Set<PlatformType>;
  showReport: boolean;
  hasGeneratedReport: boolean;
}

export function ReportView({ currentClient, aggregatedData, isGenerating, selectedPlatforms, showReport, hasGeneratedReport }: ReportViewProps) {
  const router = useRouter();
  const [expandedCards, setExpandedCards] = useState({
    visualAnalytics: false,
    aiInsights: true,
  });

  const toggleCard = (cardName: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({ ...prev, [cardName]: !prev[cardName] }));
  };

  // Generate mock chart data based on aggregated metrics
  const trafficSources = aggregatedData
    ? currentClient.platforms
        .filter((p) => selectedPlatforms.has(p.id))
        .map((platform) => {
          const percentage = (platform.metrics.sessions / aggregatedData.metrics.sessions) * 100;
          return {
            platform: platform.id,
            name: platform.name,
            sessions: platform.metrics.sessions,
            percentage,
          };
        })
    : [];

  const performanceTrends = [
    { week: "Week 1", sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.22), conversions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.015) },
    { week: "Week 2", sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.24), conversions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.018) },
    { week: "Week 3", sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.26), conversions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.020) },
    { week: "Week 4", sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.28), conversions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.022) },
  ];

  const deviceBreakdown = [
    { device: "Mobile" as const, sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.58), percentage: 58 },
    { device: "Desktop" as const, sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.35), percentage: 35 },
    { device: "Tablet" as const, sessions: Math.round((aggregatedData?.metrics.sessions || 0) * 0.07), percentage: 7 },
  ];

  // Show loading state only when actively generating
  if (isGenerating) {
    return (
      <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <svg
            className="animate-spin h-16 w-16 text-[#6CA3A2] mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-[#c0c0c0] text-lg">Aggregating data from platforms...</p>
        </div>
      </div>
    );
  }

  // Show initial state when report hasn't been generated
  if (!showReport || !aggregatedData) {
    return (
      <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-[#6CA3A2] mx-auto mb-4" />
          <p className="text-[#c0c0c0] text-lg mb-2">Ready to Generate Your Report</p>
          <p className="text-[#999] text-sm">
            Click <span className="font-semibold text-[#6CA3A2]">&quot;Generate Report&quot;</span> to see your aggregated analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] space-y-6">
        {/* Report Header */}
        <div className="border-b border-[#2a2a2a] pb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] flex items-center justify-center overflow-hidden shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)]">
                <Image
                  src={currentClient.logo}
                  alt={`${currentClient.name} logo`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold text-[#f5f5f5]"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
              >
                {currentClient.name}
              </h1>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]">
              <p className="text-xs text-[#6CA3A2] font-semibold">
                {aggregatedData.platformCount} Platform
                {aggregatedData.platformCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-[#c0c0c0] text-sm">{currentClient.industry} • Oct 1-31, 2024</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<Users className="w-4 h-4 text-[#6CA3A2]" />}
            label="Sessions"
            value={aggregatedData.metrics.sessions.toLocaleString()}
          />
          <MetricCard
            icon={<Users className="w-4 h-4 text-[#6CA3A2]" />}
            label="Users"
            value={aggregatedData.metrics.users.toLocaleString()}
          />
          <MetricCard
            icon={<Eye className="w-4 h-4 text-[#6CA3A2]" />}
            label="Page Views"
            value={aggregatedData.metrics.pageViews.toLocaleString()}
          />
          <MetricCard
            icon={<MousePointer className="w-4 h-4 text-[#6CA3A2]" />}
            label="Bounce Rate"
            value={aggregatedData.metrics.bounceRate}
          />
          <MetricCard
            icon={<Calendar className="w-4 h-4 text-[#6CA3A2]" />}
            label="Avg. Duration"
            value={aggregatedData.metrics.avgSessionDuration}
          />
          <MetricCard
            icon={<TrendingUp className="w-4 h-4 text-[#6CA3A2]" />}
            label="Conversion"
            value={aggregatedData.metrics.conversionRate}
          />
        </div>

        {/* Visual Analytics - Combined Card */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCard('visualAnalytics')}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#f5f5f5] flex items-center gap-2" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                <BarChart2 className="w-6 h-6 text-[#6CA3A2]" />
                Visual Analytics
              </h2>
              {!expandedCards.visualAnalytics && (
                <span className="text-sm text-[#999] italic">Click here to expand</span>
              )}
            </div>
            <button
              type="button"
              aria-label={
                expandedCards.visualAnalytics
                  ? "Collapse visual analytics section"
                  : "Expand visual analytics section"
              }
              aria-expanded={expandedCards.visualAnalytics}
              className="p-1.5 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              {expandedCards.visualAnalytics ? (
                <ChevronUp className="w-5 h-5 text-[#999]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#999]" />
              )}
            </button>
          </div>

          {expandedCards.visualAnalytics && (
            <div className="mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column: Traffic Sources & Performance Trends */}
                <div className="md:col-span-2 space-y-6">
                  {/* Traffic Sources */}
                  <div>
                    <h3 className="text-base font-bold text-[#f5f5f5] mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#6CA3A2]" />
                      Traffic Sources
                    </h3>
                    <TrafficSourcesChart sources={trafficSources} />
                  </div>

                  {/* Performance Trends */}
                  <div className="pt-6 border-t border-[#2a2a2a]">
                    <h3 className="text-base font-bold text-[#f5f5f5] mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#6CA3A2]" />
                      Performance Trends
                    </h3>
                    <PerformanceTrendsChart data={performanceTrends} />
                  </div>
                </div>

                {/* Right Column: Device Breakdown */}
                <div className="md:col-span-1">
                  <h3 className="text-base font-bold text-[#f5f5f5] mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#6CA3A2]" />
                    Device Breakdown
                  </h3>
                  <DeviceBreakdownChart data={deviceBreakdown} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold text-[#f5f5f5] flex items-center gap-2"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              <Sparkles className="w-5 h-5 text-[#FF8C42]" />
              AI-Powered Insights Across {aggregatedData.platformCount} Platform
              {aggregatedData.platformCount !== 1 ? "s" : ""}
            </h2>
            <button
              type="button"
              onClick={() => toggleCard('aiInsights')}
              aria-label={
                expandedCards.aiInsights
                  ? "Collapse AI insights section"
                  : "Expand AI insights section"
              }
              aria-expanded={expandedCards.aiInsights}
              className="p-1.5 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              {expandedCards.aiInsights ? (
                <ChevronUp className="w-5 h-5 text-[#999]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#999]" />
              )}
            </button>
          </div>

          {/* Summary with Key Insights */}
          {expandedCards.aiInsights && (
          <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
            {!hasGeneratedReport ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Sparkles className="w-12 h-12 text-[#FF8C42] mb-4" />
                <p className="text-[#c0c0c0] text-sm text-center max-w-md">
                  Click the <span className="font-semibold text-[#6CA3A2]">&quot;Generate Report&quot;</span> button in the demo controls section to generate AI-powered insights and recommendations
                </p>
              </div>
            ) : aggregatedData ? (
              <>
                <h3 className="text-base font-semibold text-[#6CA3A2] mb-3">Executive Summary</h3>
                <p className="text-sm text-[#c0c0c0] leading-relaxed mb-6">
                  Your {currentClient.industry.toLowerCase()} business demonstrated strong digital performance in October 2024,
                  achieving{" "}
                  <span className="font-semibold text-[#f5f5f5]">
                    {aggregatedData.metrics.sessions.toLocaleString()} sessions
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-[#f5f5f5]">
                    {aggregatedData.metrics.users.toLocaleString()} unique users
                  </span>{" "}
                  across {aggregatedData.platformCount} integrated marketing platform
                  {aggregatedData.platformCount !== 1 ? "s" : ""}. This multi-channel approach
                  generated{" "}
                  <span className="font-semibold text-[#f5f5f5]">
                    {aggregatedData.metrics.pageViews.toLocaleString()} page views
                  </span>
                  , indicating robust content engagement.
                  <br /><br />
                  The data reveals a conversion rate of{" "}
                  <span className="font-semibold text-[#6CA3A2]">
                    {aggregatedData.metrics.conversionRate}
                  </span>
                  , with users spending an average of{" "}
                  <span className="font-semibold text-[#f5f5f5]">
                    {aggregatedData.metrics.avgSessionDuration}
                  </span>
                  {" "}on your properties. The bounce rate of{" "}
                  <span className="font-semibold text-[#f5f5f5]">
                    {aggregatedData.metrics.bounceRate}
                  </span>
                  {" "}suggests opportunities for improving landing page relevance and user experience.
                  Our AI-powered analysis has identified several strategic insights and actionable
                  recommendations to optimize your marketing performance and maximize ROI across all channels.
                </p>

                {/* Key Insights */}
                <h4 className="text-sm font-semibold text-[#f5f5f5] mb-3">Key Insights:</h4>
                <div className="space-y-3">
                  {aggregatedData.insights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6CA3A2] mt-2"></div>
                      <p className="text-sm text-[#c0c0c0] leading-relaxed flex-1">{insight}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
          )}
        </div>

        {/* Top Pages (if GA is selected) */}
        {aggregatedData.topPages.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold text-[#f5f5f5] mb-4"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Top Pages
            </h2>
            <div className="overflow-hidden rounded-2xl shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)]">
              <table className="w-full">
                <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#999] uppercase tracking-wider">
                      Page URL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#999] uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#999] uppercase tracking-wider">
                      Bounce Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1a1a1a] divide-y divide-[#2a2a2a]">
                  {aggregatedData.topPages.map((page, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-[#c0c0c0] font-mono">
                        {page.url}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#f5f5f5] font-semibold">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#f5f5f5]">
                        {page.bounceRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#1e1e1e] to-[#1a1a1a] shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] border border-[#2a2a2a] text-center">
        <h3
          className="text-2xl font-bold text-[#f5f5f5] mb-2"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
        >
          Like What You See?
        </h3>
        <p className="text-[#c0c0c0] mb-6">
          Connect Google Analytics, Google Ads, Meta Ads, and more. Generate unified reports
          in minutes.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="relative overflow-hidden px-8 py-3 rounded-2xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] transition-all duration-300"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          <span className="relative flex items-center justify-center">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </>
  );
}

// MetricCard sub-component
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-[#999]">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#f5f5f5]">{value}</p>
    </div>
  );
}
