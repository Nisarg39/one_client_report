import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneReport - AI-Powered Client Reporting Software for Freelancers & Agencies",
  description: "Generate professional marketing reports in 5 minutes with AI-powered insights. Affordable reporting software for freelancers and agencies starting at $49/mo. 50-80% cheaper than AgencyAnalytics. Start free trial - no credit card required.",
  keywords: [
    "client reporting software",
    "marketing reporting tool",
    "AI marketing reports",
    "automated client reports",
    "affordable reporting software",
    "agency reporting",
    "freelance marketing",
    "white label reporting",
  ],
  authors: [{ name: "OneReport" }],
  creator: "OneReport",
  publisher: "OneReport",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
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
    locale: "en_US",
    url: "https://onereport.in/",
    siteName: "OneReport",
    title: "OneReport - AI-Powered Client Reporting Software",
    description: "Generate professional marketing reports in 5 minutes. Plans from $49-199/mo with generous report limits.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OneReport - AI-Powered Client Reporting Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneReport - AI-Powered Client Reporting Software",
    description: "Generate professional marketing reports in 5 minutes. Plans from $49-199/mo with generous report limits.",
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
    <html lang="en" className="dark bg-[#1a1a1a] ">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
