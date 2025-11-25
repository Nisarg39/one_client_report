"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Signup Redirect Page
 *
 * Redirects to /signin since we use OAuth-only authentication.
 * Signing in with OAuth automatically creates an account if needed.
 */
export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in page
    router.replace("/signin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#999]">Redirecting to sign in...</p>
    </div>
  );
}
