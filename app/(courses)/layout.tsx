import { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/lib/supabase/auth";

export const heroTitle = {
  en: "Learn real skills from real production projects!",
  "zh-cn": "从真实生产项目中学习真实技能!",
};

export const metadata: Metadata = {
  title: "raytonx-learn | Learn Modern Web Development",
  description:
    "Hands-on learning for modern web development. Build real-world projects with Next.js, Nest.js, Supabase, Stripe, TypeScript, and production-ready architecture.",
  openGraph: {
    title: "raytonx-learn",
    description: heroTitle.en,
    url: "https://raytonx.com/courses",
    siteName: "raytonx-learn",
    type: "website",
  },
};

export default async function CoursesLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar initialUser={user} />

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
