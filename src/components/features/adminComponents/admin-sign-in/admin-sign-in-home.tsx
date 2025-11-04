"use client";

import { useState } from "react";
import { adminLogin } from "@/backend/server_actions/adminActions";

interface AdminSignInHomeProps {
  onLoginSuccess?: () => void;
}

export default function AdminSignInHome({ onLoginSuccess }: AdminSignInHomeProps) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Create FormData from form
      const formData = new FormData();
      formData.set("password", password);

      // Call server action
      const result = await adminLogin(formData);

      if (result.success) {
        // Success! Cookie is set automatically by server
        // Update parent component state or reload page
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        setError(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#151515] shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#f5f5f5] mb-2">
            Admin Login
          </h1>
          <p className="text-[#c0c0c0]">
            Enter your password to access the admin panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-900/20 border border-red-800/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm text-[#c0c0c0] font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              disabled={isSubmitting}
              className="w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] placeholder:text-[#666] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(40,40,40,0.2)] focus:ring-2 focus:ring-[#6CA3A2] focus:border-[#6CA3A2] transition-all outline-none disabled:opacity-50"
              placeholder="Enter admin password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full h-12 rounded-xl font-semibold bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-8px_-8px_16px_rgba(70,70,70,0.5),8px_8px_16px_rgba(0,0,0,0.9)] hover:shadow-[-6px_-6px_12px_rgba(70,70,70,0.5),6px_6px_12px_rgba(0,0,0,0.9)] active:shadow-[inset_6px_6px_12px_rgba(179,87,28,0.7),inset_-6px_-6px_12px_rgba(255,140,66,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}