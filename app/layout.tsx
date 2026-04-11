import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/components/auth-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH!;
const canonicalUrl = `${siteUrl}${basePath}`;
const siteDescription =
  "RaytonX Practices 展示我们在真实项目中的技术实践，涵盖 Next.js 应用开发、AI 集成、认证系统、SEO 优化与系统架构设计，帮助你了解我们如何设计与实现复杂系统。";
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Practices",
  url: canonicalUrl,
  description: siteDescription,
};
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Practices",
  url: canonicalUrl,
  inLanguage: "zh-CN",
  description: siteDescription,
};

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),

  title: {
    default: "Practices - 企业解决方案展示",
    template: "%s | Practices",
  },

  description: siteDescription,

  keywords: [
    "企业解决方案",
    "技术能力产品化",
    "数字化方案展示",
    "Web 平台开发",
    "AI 集成方案",
    "SEO 方案",
    "认证与权限系统",
    "Supabase",
    "TypeScript",
    "全栈开发",
    "Next.js",
    "Node.js",
    "解决方案架构",
    "软件交付",
  ],

  authors: [{ name: "RaytonX Team" }],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Practices",
    title: "Practices - 企业解决方案展示",
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Practices 企业解决方案展示封面",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "Practices 企业解决方案展示封面",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Practices - 企业解决方案展示",
    description: siteDescription,
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: canonicalUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
      <Analytics
        eventEndpoint={`${canonicalUrl}/_vercel/insights/event`}
        viewEndpoint={`${canonicalUrl}/_vercel/insights/view`}
        scriptSrc={`${canonicalUrl}/_vercel/insights/script.js`}
      />
      <SpeedInsights />
    </html>
  );
}
