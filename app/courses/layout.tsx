import { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const heroTitle = {
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
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col gap-12 px-6 py-8">
      {/* Navbar */}
      <Navbar initialUser={user} />

      {/* Hero Title */}
      <section className="text-center">
        <h2 className="text-4xl font-extrabold">{heroTitle["zh-cn"]}</h2>
      </section>

      {children}

      {/* Footer */}
      <Footer />
    </main>
  );
}
