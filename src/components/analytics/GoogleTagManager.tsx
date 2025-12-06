'use client';

import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId?: string;
}

/**
 * Google Tag Manager Component
 * 
 * This component loads Google Tag Manager for tracking and analytics.
 * It should be placed in the root layout.tsx file.
 * 
 * @param gtmId - Your GTM container ID (e.g., "GTM-XXXXXXX")
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_GTM_ID environment variable
 * 2. Add <GoogleTagManager /> to your root layout.tsx
 * 
 * Environment Variable:
 * NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 */
export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  // Get GTM ID from props or environment variable
  const containerId = gtmId || process.env.NEXT_PUBLIC_GTM_ID;

  // Don't render if GTM ID is not provided
  if (!containerId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Google Tag Manager: GTM ID not found. Set NEXT_PUBLIC_GTM_ID environment variable.'
      );
    }
    return null;
  }

  return (
    <>
      {/* Google Tag Manager Script - loads in head */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${containerId}');
          `,
        }}
      />
    </>
  );
}

/**
 * Google Tag Manager Noscript Component
 * 
 * This should be placed immediately after the opening <body> tag
 * for users with JavaScript disabled.
 */
export function GoogleTagManagerNoscript({ gtmId }: GoogleTagManagerProps) {
  const containerId = gtmId || process.env.NEXT_PUBLIC_GTM_ID;

  if (!containerId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

