"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthClick = async (provider: "google" | "github") => {
    try {
      setIsLoading(true);
      setError("");

      // NextAuth will auto-detect new vs returning user
      // New users → /onboarding, Returning users → /chat
      await signIn(provider);
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo/Title */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-bold text-[#f5f5f5] mb-2"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
        >
          <span className="text-[#6CA3A2]">One</span>Report
        </h1>
        <p className="text-[#c0c0c0] text-sm">Sign in to continue</p>
      </div>

      {/* Sign-In Card */}
      <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthClick("google")}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#f5f5f5] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleOAuthClick("github")}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#f5f5f5] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Continue with GitHub"}
          </button>
        </div>

        {/* Auto-Account Creation Notice */}
        <p className="mt-6 text-xs text-[#999] text-center">
          New to OneReport? Signing in will create your account automatically.
        </p>
      </div>
    </div>
  );
}
