import type { Metadata } from "next";
import Link from "next/link";

import { supabaseStaticClient } from "@/lib/supabase/static";
import { listCourses } from "@/services/courses/list";

export const metadata: Metadata = {
  title: "解决方案总览",
  description:
    "浏览 Practices 的解决方案模块，快速了解我们在 Web 平台、AI 集成、认证、SEO 与交付上的落地能力。",
};

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const tag = (await searchParams).tag ?? "all";

  const coursesQuery = listCourses(supabaseStaticClient, { tag });
  const tagsQuery = supabaseStaticClient
    .from("course_tags")
    .select("*")
    .order("position", { ascending: true });

  const [{ data: courses, error: coursesError }, { data: tags, error: tagsError }] =
    await Promise.all([coursesQuery, tagsQuery]);

  if (coursesError || tagsError) {
    return (
      <div className="w-full max-w-5xl mx-auto px-6 py-16">
        <p className="text-muted-foreground">
          内容加载出错:
          {coursesError ? ` ${coursesError.message}` : ""}
          {tagsError ? ` ${tagsError.message}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">解决方案</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          将技术能力产品化展示，拆成可理解的业务模块，帮助团队快速判断适用场景、交付方式与落地范围。
        </p>
      </header>

      {/* Category Filter */}
      <nav className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              tag === "all"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            全部
          </Link>
          {tags?.map((t) => (
            <Link
              key={t.id}
              href={`/?tag=${t.slug}`}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                tag === t.slug
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Solution List */}
      <div className="space-y-4">
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            const isComingSoon = course.status === "coming_soon";

            const content = (
              <article
                className={`p-5 border border-border rounded-lg transition-colors ${
                  isComingSoon ? "opacity-80" : "hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`text-base font-medium text-foreground mb-1.5 transition-colors ${
                        isComingSoon ? "" : "group-hover:text-foreground/80"
                      }`}
                    >
                      {course.name}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    {course.course_tag_relations?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {course.course_tag_relations.map((rel, idx) => (
                          <span
                            key={idx}
                            className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
                          >
                            {rel.course_tags.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {isComingSoon ? (
                    <span className="text-sm text-muted-foreground flex-shrink-0 mt-0.5">
                      敬请期待
                    </span>
                  ) : (
                    <svg
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </article>
            );

            if (isComingSoon) {
              return <div key={course.id}>{content}</div>;
            }

            return (
              <Link key={course.id} href={`/${course.slug}`} className="block group">
                {content}
              </Link>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">暂无可展示的解决方案。</p>
          </div>
        )}
      </div>
    </div>
  );
}
