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

export const metadata: Metadata = {
  metadataBase: new URL(
    `${process.env.NEXT_PUBLIC_SITE_URL!}${process.env.NEXT_PUBLIC_BASE_PATH!}`,
  ),

  title: {
    default: "RaytonX Learn - 远程开发技术分享",
    template: "%s | RaytonX Learn",
  },

  description:
    "RaytonX Learn 分享真实项目中的技术实践，涵盖 Next.js、Supabase、NestJS 等现代开发技术，帮助你构建可用于远程工作的技术体系。",

  keywords: [
    "TS全栈",
    "Next.js 教程",
    "Supabase",
    "TypeScript",
    "数字游民",
    "自由职业",
    "海外外包",
    "全栈开发",
    "远程工作",
    "编程在线课程",
    "React 教程",
    "Node.js",
    "软件工程实践",
    "DevOps",
    "AI集成",
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
    siteName: "RaytonX Learn",
    title: "RaytonX Learn - 远程开发技术分享",
    description:
      "实战导向的 Next.js、Supabase、TypeScript 全栈课程，帮助你快速提升远程开发能力，构建高质量生产级项目。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RaytonX Learn - 高质量编程技术课程",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "RaytonX Learn 课程封面",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "RaytonX Learn - 远程开发技术分享",
    description:
      "实战导向的 Next.js、Supabase、TypeScript 全栈课程，帮助你快速提升远程开发能力，构建高质量生产级项目。",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL!}${process.env.NEXT_PUBLIC_BASE_PATH!}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
      <Analytics
        eventEndpoint={`${process.env.NEXT_PUBLIC_SITE_URL!}${process.env.NEXT_PUBLIC_BASE_PATH!}/_vercel/insights/event`}
        viewEndpoint={`${process.env.NEXT_PUBLIC_SITE_URL!}${process.env.NEXT_PUBLIC_BASE_PATH!}/_vercel/insights/view`}
        scriptSrc={`${process.env.NEXT_PUBLIC_SITE_URL!}${process.env.NEXT_PUBLIC_BASE_PATH!}/_vercel/insights/script.js`}
      />
      <SpeedInsights />
    </html>
  );
}
