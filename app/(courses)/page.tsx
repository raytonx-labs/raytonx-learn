import Link from "next/link";

import { supabaseStaticClient } from "@/lib/supabase/static";
import { listCourses } from "@/services/courses/list";

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const tag = (await searchParams).tag ?? "all";

  const coursesQuery = listCourses(supabaseStaticClient, { tag });
  const tagsQuery = supabaseStaticClient.from("course_tags").select("*");

  const [{ data: courses, error: coursesError }, { data: tags, error: tagsError }] =
    await Promise.all([coursesQuery, tagsQuery]);

  if (coursesError || tagsError) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-muted-foreground">
          Error loading courses:
          {coursesError ? ` ${coursesError.message}` : ""}
          {tagsError ? ` ${tagsError.message}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">Courses</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          Step-by-step breakdown of real projects, covering architecture, SEO, authentication,
          deployment, and more.
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
            All
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

      {/* Course List */}
      <div className="space-y-4">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <Link key={course.id} href={`/${course.slug}`} className="block group">
              <article className="p-5 border border-border rounded-lg hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-medium text-foreground group-hover:text-foreground/80 transition-colors mb-1.5">
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
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No courses available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
