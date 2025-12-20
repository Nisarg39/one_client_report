"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to chat if already signed in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/chat");
    }
  }, [status, session, router]);

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

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="w-full max-w-2xl flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6CA3A2] border-t-transparent" />
          <p className="text-[#999] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the sign-in form if already authenticated (will redirect)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      <header className="text-center space-y-3">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8a8a8a]">
          Welcome back
        </p>
        <h1
          className="text-4xl md:text-5xl font-black text-[#f5f5f5]"
          style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <span className="text-[#6CA3A2]">O</span>
          <span className="text-[#f5f5f5]">ne</span>
          <span className="text-[#FF8C42]">R</span>
          <span className="text-[#f5f5f5]">eport</span>
        </h1>
        <p
          className="text-sm md:text-base text-[#c0c0c0]"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          Sign in to unify your campaign data with AI-guided insights.
        </p>
      </header>

      <div className="rounded-3xl border border-white/5 bg-[#1a1a1a] p-8 shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9)]">

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300 shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)]"
          >
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-live="polite">
          <OAuthButton
            label="Google"
            accentClass="bg-gradient-to-r from-[#5a9493] to-[#6CA3A2]"
            icon={<GoogleGlyph />}
            onClick={() => handleOAuthClick("google")}
            isLoading={isLoading}
          />
          <OAuthButton
            label="GitHub"
            accentClass="bg-gradient-to-r from-[#FF8C42] to-[#E67A33]"
            icon={<GitHubGlyph />}
            onClick={() => handleOAuthClick("github")}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#9b9b9b]">
          <span className="rounded-full bg-[#151515] px-3 py-1 shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)]">
            New to OneReport? We’ll create your account automatically.
          </span>
        </div>
      </div>
    </div>
  );
}

type OAuthButtonProps = {
  label: string;
  accentClass: string;
  icon: React.ReactNode;
  onClick: () => Promise<void>;
  isLoading: boolean;
};

function OAuthButton({
  label,
  accentClass,
  icon,
  onClick,
  isLoading,
}: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="group relative w-full overflow-hidden rounded-2xl bg-[#151515] px-5 py-4 text-left text-[#f5f5f5] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        className={`${accentClass} absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15`}
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#151515] shadow-neu-inset-sm">
            {icon}
          </div>
          <span className="font-semibold">{label}</span>
        </div>

        {isLoading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#6CA3A2] border-t-transparent" />
        )}
      </div>
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.23 3.6l6.9-6.9C36.33 2.2 30.72 0 24 0 14.62 0 6.48 5.38 2.56 13.22l8.05 6.26C12.73 13.41 17.88 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.55c0-1.64-.15-3.21-.43-4.73H24v9h12.65c-.55 2.96-2.24 5.47-4.75 7.16l7.3 5.68C43.93 37.24 46.5 31.45 46.5 24.55z" />
      <path fill="#FBBC05" d="M10.61 28.48a14.47 14.47 0 0 1-.76-4.48c0-1.56.27-3.07.76-4.48l-8.05-6.26A23.93 23.93 0 0 0 0 24c0 3.87.93 7.52 2.56 10.74l8.05-6.26z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.81l-7.3-5.68C30.74 37.55 27.62 38.5 24 38.5c-6.12 0-11.27-3.91-13.39-9.48l-8.05 6.26C6.48 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.73 0 8.33c0 3.68 2.29 6.8 5.47 7.9.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.57-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.97-.82-1.17-.28-.15-.68-.52-.01-.53.63-.01 1.08.6 1.23.85.72 1.26 1.87.9 2.33.68.07-.54.28-.9.5-1.11-1.78-.2-3.64-.92-3.64-4.09 0-.9.31-1.64.82-2.22-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.85a7.3 7.3 0 0 1 2-.28c.68 0 1.36.09 2 .28 1.53-1.07 2.2-.85 2.2-.85.44 1.1.16 1.92.08 2.12.51.58.82 1.32.82 2.22 0 3.18-1.87 3.88-3.65 4.08.29.26.54.77.54 1.55 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.36 8.36 0 0 0 16 8.33C16 3.73 12.42 0 8 0z" />
    </svg>
  );
}
