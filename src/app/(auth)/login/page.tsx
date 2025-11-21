"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Mock validation
    const newErrors: Record<string, string> = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Mock success
    setTimeout(() => {
      console.log("Login successful (mock):", formData);
      setIsLoading(false);
      alert("Login successful! (Mock - no backend yet)\\nWould redirect to dashboard or onboarding");
      // router.push("/dashboard"); // or /onboarding if incomplete
    }, 1000);
  };

  const handleOAuthClick = async (provider: "google" | "github") => {
    try {
      setIsLoading(true);
      // NextAuth will redirect to /chat after successful sign-in (configured in authOptions)
      await signIn(provider, { callbackUrl: "/chat" });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
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
        <p className="text-[#c0c0c0] text-sm">Welcome back</p>
      </div>

      {/* Login Form Card */}
      <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#c0c0c0] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-none shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all outline-none ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#c0c0c0]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#6CA3A2] hover:text-[#5a9493] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] border-none shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(60,60,60,0.4)] focus:shadow-[inset_10px_10px_20px_rgba(0,0,0,0.7),inset_-10px_-10px_20px_rgba(70,70,70,0.5)] transition-all outline-none ${
                errors.password ? "ring-2 ring-red-500" : ""
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden px-6 py-3 rounded-2xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9)] active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <span className="relative flex items-center justify-center">
              {isLoading ? "Logging in..." : "Log In"}
              {!isLoading && (
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
          <span className="px-4 text-xs text-[#999]">or continue with</span>
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthClick("google")}
            className="w-full px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#f5f5f5] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all duration-300"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthClick("github")}
            className="w-full px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#f5f5f5] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all duration-300"
          >
            Continue with GitHub
          </button>
        </div>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#999]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#6CA3A2] hover:text-[#5a9493] transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
