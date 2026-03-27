import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/lib/supabase/auth";

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
  metadataBase: new URL("https://raytonx.com"),

  title: {
    default: "RaytonX Learn - 远程开发技术分享",
    template: "%s | RaytonX Learn",
  },

  description:
    "RaytonX Learn 提供高质量的 Next.js、Supabase、TypeScript等全栈开发技术分享，帮助开发者提升远程工作能力。",

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
        url: "https://raytonx.com/courses/og-image.png",
        width: 1200,
        height: 630,
        alt: "RaytonX Learn - 高质量编程技术课程",
      },
      {
        url: "https://raytonx.com/courses/og-image-square.png",
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
    images: ["https://raytonx.com/courses/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar initialUser={user} />

          <div className="flex-1">{children}</div>

          {/* Footer */}
          <Footer />
        </main>
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
