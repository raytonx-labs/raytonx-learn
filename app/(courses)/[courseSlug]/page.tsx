import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { supabaseStaticClient } from "@/lib/supabase/static";
import { getCourseBySlug } from "@/services/courses/detail";
import { listCourses } from "@/services/courses/list";
import { getFirstLessonByCourse } from "@/services/lessons/detail";
import { listLessonsByCourse } from "@/services/lessons/list";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = await getCourseBySlug(supabaseStaticClient, courseSlug);

  if (!course) {
    return {
      title: "解决方案不存在",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: course.name,
    description: course.description?.slice(0, 160),
    alternates: { canonical: `/${courseSlug}` },
    openGraph: {
      title: course.name,
      description: course.description?.slice(0, 160),
    },
    twitter: {
      card: "summary_large_image",
      title: course.name,
      description: course.description?.slice(0, 160),
    },
  };
}

type Params = {
  courseSlug: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const courses = await listCourses(supabaseStaticClient, {
      pageSize: 1000,
      publishedOnly: true,
    });

    if (courses.error) throw new Error("Failed to fetch courses");

    const paramsList: Params[] = [];

    for (const course of courses.data) {
      paramsList.push({
        courseSlug: course.slug,
      });
    }

    return paramsList;
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

export default async function CoursePage({ params }: { params: Promise<{ courseSlug?: string }> }) {
  const { courseSlug } = await params;

  if (!courseSlug) {
    notFound();
  }

  const course = await getCourseBySlug(supabaseStaticClient, courseSlug);

  if (!course) {
    notFound();
  }

  const firstLesson = await getFirstLessonByCourse(supabaseStaticClient, courseSlug);
  const { data: lessons } = await listLessonsByCourse(supabaseStaticClient, courseSlug, {
    pageSize: 100,
  });

  const tags = course.course_tag_relations?.map((rel) => rel.course_tags.name) ?? [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH!;
  const canonicalUrl = `${siteUrl}${basePath}/${course.slug}`;
  const solutionJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: course.name,
    description: course.description,
    serviceType: "企业解决方案",
    provider: {
      "@type": "Organization",
      name: "Practices",
    },
    url: canonicalUrl,
    keywords: tags,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "解决方案",
        item: `${siteUrl}${basePath}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: course.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          解决方案
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-sm text-foreground">{course.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr,280px] gap-12">
        {/* Main Content */}
        <div>
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              {course.name}
            </h1>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {course.description && (
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            )}
          </header>

          {/* CTA */}
          <div className="mb-12">
            {firstLesson ? (
              <Button asChild size="lg" className="font-medium">
                <Link href={`/${courseSlug}/lessons/${firstLesson.slug}`}>查看方案详情</Link>
              </Button>
            ) : (
              <Button disabled size="lg">
                模块整理中
              </Button>
            )}
          </div>

          {/* Resources */}
          {course.source_url && (
            <section className="mb-12">
              <h2 className="text-lg font-medium text-foreground mb-3">相关资源</h2>
              <Link
                href={course.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                查看源代码
              </Link>
            </section>
          )}
        </div>

        {/* Sidebar - Module List */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="border border-border rounded-lg p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">
              能力模块 ({lessons?.length || 0})
            </h2>
            {lessons && lessons.length > 0 ? (
              <nav className="space-y-1">
                {lessons.map((lesson, index) => {
                  const isComingSoon = lesson.status === "coming_soon";

                  const content = (
                    <div
                      className={`flex items-start gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        isComingSoon
                          ? "text-muted-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted group"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground/60 font-mono mt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 line-clamp-2">{lesson.name}</span>
                      {isComingSoon ? (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          敬请期待
                        </span>
                      ) : null}
                    </div>
                  );

                  if (isComingSoon) {
                    return <div key={lesson.id}>{content}</div>;
                  }

                  return (
                    <Link key={lesson.id} href={`/${courseSlug}/lessons/${lesson.slug}`}>
                      {content}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <p className="text-sm text-muted-foreground">暂无可展示的模块内容。</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
