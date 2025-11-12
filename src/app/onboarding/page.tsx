"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  ExternalLink,
  Upload,
  Palette,
  FileText,
} from "lucide-react";

// Platform types for connection
interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step 2: Platform connections state
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "google-analytics",
      name: "Google Analytics",
      icon: "📊",
      description: "Track website traffic and user behavior",
      connected: false,
    },
    {
      id: "google-ads",
      name: "Google Ads",
      icon: "🎯",
      description: "Monitor paid search campaigns",
      connected: false,
    },
    {
      id: "meta-ads",
      name: "Meta Ads",
      icon: "📘",
      description: "Track Facebook & Instagram ads",
      connected: false,
    },
    {
      id: "linkedin-ads",
      name: "LinkedIn Ads",
      icon: "💼",
      description: "Monitor B2B advertising campaigns",
      connected: false,
    },
    {
      id: "tiktok-ads",
      name: "TikTok Ads",
      icon: "🎵",
      description: "Track short-form video advertising",
      connected: false,
    },
  ]);

  // Step 3: Branding state
  const [brandName, setBrandName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6CA3A2");
  const [logoPreview, setLogoPreview] = useState("");

  const handlePlatformConnect = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId ? { ...p, connected: !p.connected } : p
      )
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload - in real app would upload to server
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - redirect to dashboard
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        // At least one platform must be connected
        return platforms.some((p) => p.connected);
      case 3:
        // Brand name is required
        return brandName.trim().length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-[#f5f5f5]"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
          >
            <span className="text-[#6CA3A2]">One</span>Report
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-[#999] hover:text-[#c0c0c0] transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[#c0c0c0]">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-sm text-[#999]">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </p>
          </div>
          <div className="relative h-2 rounded-full bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6CA3A2] to-[#5a9493] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-xs transition-all ${
                  step < currentStep
                    ? "bg-[#6CA3A2] text-white shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)]"
                    : step === currentStep
                    ? "bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] text-white shadow-[-6px_-6px_12px_rgba(70,70,70,0.4),6px_6px_12px_rgba(0,0,0,0.7)]"
                    : "bg-[#1a1a1a] text-[#666] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]"
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="bg-[#1a1a1a] p-8 md:p-12 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-4"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
              >
                Welcome to OneReport!
              </h2>
              <p className="text-lg text-[#c0c0c0] max-w-2xl mx-auto leading-relaxed">
                Let&apos;s get you set up in just a few minutes. We&apos;ll help you
                connect your marketing platforms, customize your branding, and
                generate your first report.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
                <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center mb-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#f5f5f5] mb-2">
                    Connect Platforms
                  </h3>
                  <p className="text-sm text-[#999] leading-relaxed">
                    Link your Google Analytics, Google Ads, Meta Ads, and more
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center mb-4">
                    <Palette className="text-2xl text-[#6CA3A2]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#f5f5f5] mb-2">
                    Customize Branding
                  </h3>
                  <p className="text-sm text-[#999] leading-relaxed">
                    Add your logo and choose your brand colors
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] flex items-center justify-center mb-4">
                    <FileText className="text-2xl text-[#FF8C42]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#f5f5f5] mb-2">
                    Generate Report
                  </h3>
                  <p className="text-sm text-[#999] leading-relaxed">
                    Create your first beautiful marketing report
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Platform Connection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-3xl font-bold text-[#f5f5f5] mb-3"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                >
                  Connect Your Platforms
                </h2>
                <p className="text-[#c0c0c0]">
                  Select at least one platform to get started. You can add more
                  later.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`p-6 rounded-2xl transition-all cursor-pointer ${
                      platform.connected
                        ? "bg-[#1a1a1a] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] border-2 border-[#6CA3A2]"
                        : "bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)] border border-[#2a2a2a] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.3),6px_6px_16px_rgba(0,0,0,0.7)]"
                    }`}
                    onClick={() => handlePlatformConnect(platform.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{platform.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#f5f5f5] mb-1">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-[#999]">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          platform.connected
                            ? "bg-[#6CA3A2] shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)]"
                            : "bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)]"
                        }`}
                      >
                        {platform.connected && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    {platform.connected && (
                      <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#2a2a2a]">
                        <span className="text-sm text-[#6CA3A2] font-medium">
                          ✓ Connected
                        </span>
                        <button className="text-xs text-[#999] hover:text-[#c0c0c0] flex items-center gap-1">
                          Configure
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1a1a] p-4 rounded-2xl shadow-[-8px_-8px_16px_rgba(70,70,70,0.3),8px_8px_16px_rgba(0,0,0,0.7)] border border-[#2a2a2a]">
                <p className="text-sm text-[#999] leading-relaxed">
                  <span className="font-semibold text-[#6CA3A2]">
                    {platforms.filter((p) => p.connected).length}
                  </span>{" "}
                  platform{platforms.filter((p) => p.connected).length !== 1 ? "s" : ""}{" "}
                  connected. Don&apos;t worry, this is a mock setup. Real OAuth
                  integration will be added in Phase 3.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Branding Customization */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-3xl font-bold text-[#f5f5f5] mb-3"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                >
                  Customize Your Branding
                </h2>
                <p className="text-[#c0c0c0]">
                  Make your reports look professional with your brand identity
                </p>
              </div>

              <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
                <div className="space-y-8">
                  {/* Brand Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#c0c0c0] mb-3">
                      Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Enter your company or brand name"
                      className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-none shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all outline-none"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#c0c0c0] mb-3">
                      Company Logo
                    </label>
                    <div className="flex items-start gap-6">
                      {/* Logo Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] flex items-center justify-center overflow-hidden">
                          {logoPreview ? (
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <Upload className="w-8 h-8 text-[#666]" />
                          )}
                        </div>
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1">
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <div className="px-6 py-3 rounded-2xl bg-[#1a1a1a] text-[#6CA3A2] font-medium shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all inline-flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Choose File
                          </div>
                        </label>
                        <p className="text-xs text-[#999] mt-2">
                          Recommended: Square image, at least 200x200px, PNG or
                          JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-[#c0c0c0] mb-3">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-16 rounded-2xl cursor-pointer bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] border-none"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] font-mono border-none shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="pt-6 border-t border-[#2a2a2a]">
                    <p className="text-sm font-medium text-[#c0c0c0] mb-4">
                      Preview
                    </p>
                    <div className="p-6 rounded-2xl bg-[#1a1a1a] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] border border-[#2a2a2a]">
                      <div className="flex items-center gap-4">
                        {logoPreview && (
                          <Image
                            src={logoPreview}
                            alt="Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                            unoptimized
                          />
                        )}
                        <div>
                          <h3
                            className="text-xl font-bold text-[#f5f5f5]"
                            style={{
                              color: brandName ? primaryColor : "#f5f5f5",
                            }}
                          >
                            {brandName || "Your Brand Name"}
                          </h3>
                          <p className="text-sm text-[#999]">
                            Marketing Report • October 2024
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: First Report Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2
                  className="text-3xl font-bold text-[#f5f5f5] mb-3"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                >
                  You&apos;re All Set!
                </h2>
                <p className="text-[#c0c0c0]">
                  Here&apos;s a preview of what your reports will look like
                </p>
              </div>

              <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
                {/* Mock Report Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#2a2a2a]">
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <Image
                        src={logoPreview}
                        alt="Logo"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)]"
                        unoptimized
                      />
                    )}
                    <div>
                      <h3
                        className="text-2xl font-bold text-[#f5f5f5]"
                        style={{
                          color: brandName ? primaryColor : "#f5f5f5",
                        }}
                      >
                        {brandName || "Your Brand"}
                      </h3>
                      <p className="text-sm text-[#999]">
                        Marketing Performance Report
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#c0c0c0]">October 2024</p>
                    <p className="text-xs text-[#999]">
                      {platforms.filter((p) => p.connected).length} platforms
                      connected
                    </p>
                  </div>
                </div>

                {/* Mock Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Sessions", value: "24,567" },
                    { label: "Total Users", value: "18,234" },
                    { label: "Conversion Rate", value: "4.8%" },
                    { label: "Avg. Duration", value: "4m 32s" },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.3),8px_8px_20px_rgba(0,0,0,0.7)]"
                    >
                      <p className="text-xs text-[#999] mb-1">
                        {metric.label}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{
                          color: brandName ? primaryColor : "#6CA3A2",
                        }}
                      >
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mock Insights */}
                <div>
                  <h4 className="text-lg font-bold text-[#f5f5f5] mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF8C42]" />
                    AI-Powered Insights
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Website traffic increased by 23% compared to last month",
                      "Mobile users show 34% higher engagement rates",
                      "Recommended: Focus on content that drives organic traffic",
                    ].map((insight, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-[#1a1a1a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] border border-[#2a2a2a]"
                      >
                        <p className="text-sm text-[#c0c0c0] leading-relaxed">
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-gradient-to-br from-[#1e1e1e] to-[#1a1a1a] p-6 rounded-2xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] border border-[#2a2a2a] text-center">
                <p className="text-[#c0c0c0] leading-relaxed">
                  Your dashboard is ready! You can generate reports anytime, add
                  more platforms, and customize your settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-[#2a2a2a] bg-[#1a1a1a] px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-2xl font-medium text-[#c0c0c0] bg-[#1a1a1a] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="relative overflow-hidden px-8 py-3 rounded-2xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <span className="relative flex items-center">
              {currentStep === totalSteps ? "Go to Dashboard" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
