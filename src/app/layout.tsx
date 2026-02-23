import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resumetailor.teamvince.com"),
  title: "ResumeTailor - AI-Powered Career Optimization",
  description:
    "Instantly tailor your resume and LinkedIn profile to any job description with AI-powered analysis, gap detection, and ATS keyword optimization.",
  authors: [{ name: "Vincent DiPaola", url: "https://teamvince.com" }],
  creator: "Vincent DiPaola",
  publisher: "TeamVince",
  alternates: {
    canonical: "https://resumetailor.teamvince.com/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "ResumeTailor - AI-Powered Career Optimization",
    description:
      "Instantly tailor your resume and LinkedIn profile to any job description with AI-powered analysis, gap detection, and ATS keyword optimization.",
    type: "article",
    url: "https://resumetailor.teamvince.com/",
    siteName: "ResumeTailor",
    publishedTime: "2026-02-22T00:00:00.000Z",
    authors: ["Vincent DiPaola"],
    images: [
      {
        url: "https://teamvince.com/og-image.png",
        width: 1200,
        height: 627,
        alt: "TeamVince icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeTailor - AI-Powered Career Optimization",
    description:
      "Instantly tailor your resume and LinkedIn profile to any job description with AI-powered analysis, gap detection, and ATS keyword optimization.",
    images: ["https://teamvince.com/og-image.png"],
  },
  other: {
    "article:author": "Vincent DiPaola",
    "article:published_time": "2026-02-22T00:00:00.000Z",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-300/50`}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
