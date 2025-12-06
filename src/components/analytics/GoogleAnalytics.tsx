'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics 4 Component
 * 
 * This component loads Google Analytics 4 using gtag.js directly.
 * It should be placed in the root layout.tsx file.
 * 
 * @param measurementId - Your GA4 Measurement ID (e.g., "G-RDZC5ERJDH")
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_GA_MEASUREMENT_ID environment variable
 * 2. Add <GoogleAnalytics /> to your root layout.tsx
 * 
 * Environment Variable:
 * NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RDZC5ERJDH
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Get Measurement ID from props or environment variable
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render if Measurement ID is not provided
  if (!gaId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Google Analytics: Measurement ID not found. Set NEXT_PUBLIC_GA_MEASUREMENT_ID environment variable.'
      );
    }
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}


