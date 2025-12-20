import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/highlight.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { OrganizationSchema } from "@/components/schema/organization-schema";
import { KeyboardShortcuts } from "@/components/chat/KeyboardShortcuts";
import { NextAuthSessionProvider } from "@/components/providers/SessionProvider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Toaster } from "sonner";
import { Toaster as RadixToaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneReport | Agentic AI Client Reporting & Marketing Intelligence",
  description: "Scale your agency with OneReport. An AI-powered agentic reporting platform that turns marketing data into actionable growth strategies in minutes. 80% more efficient than traditional tools.",
  keywords: [
    "agentic AI reporting",
    "client reporting software",
    "marketing intelligence platform",
    "AI marketing analytics",
    "automated agency reports",
    "OneReport AI",
    "marketing automation india",
    "data-driven growth strategies",
    "affordable agency tools",
    "white label reporting platform"
  ],
  authors: [{ name: "OneReport", url: "https://onereport.in" }],
  creator: "OneReport",
  publisher: "OneReport",

  // Geographic targeting for India
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Pune",
    "geo.position": "18.5204;73.8567",
    "ICBM": "18.5204, 73.8567",
  },

  verification: {
    google: "eQ3KWk9WiqtTxeT7XORRa_7OoRIAkUpIOSlv6iDzdbE",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://onereport.in/",
    siteName: "OneReport",
    title: "OneReport | Agentic AI Client Reporting",
    description: "The next generation of marketing intelligence. OneReport uses agentic AI to analyze, report, and strategize your client growth automatically.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OneReport Agentic AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneReport | Agentic AI Reporting",
    description: "Automate your client reporting and marketing strategy with OneReport's agentic AI. Built for modern agencies.",
    images: ["/twitter-image.jpg"],
    creator: "@onereport",
  },
  metadataBase: new URL("https://onereport.in"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="dark bg-[#1a1a1a] ">
      <head>
        <OrganizationSchema />
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthSessionProvider>
          <ConditionalNavbar />
          {children}
          <Toaster position="top-center" richColors />
          <RadixToaster />
          <KeyboardShortcuts />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
