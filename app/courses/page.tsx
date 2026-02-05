import { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const supabase: SupabaseClient<Database> = await createSupabaseServerClient();

  const tag = (await searchParams).tag ?? "all";

  const coursesQuery = supabase
    .from("courses")
    .select(
      `*,course_tag_relations!inner(
        course_tags!inner(slug)
      )`,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(12);

  if (tag !== "all") {
    coursesQuery.eq("course_tag_relations.course_tags.slug", tag);
  }

  const tagsQuery = supabase.from("course_tags").select("*");

  const [{ data: courses, error: coursesError }, { data: tags, error: tagsError }] =
    await Promise.all([coursesQuery, tagsQuery]);

  if (coursesError || tagsError) {
    return (
      <div>
        Error loading courses:
        {coursesError ? ` Courses error: ${coursesError.message}` : ""}
        {tagsError ? ` Tags error: ${tagsError.message}` : ""}
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      {/* Category Tabs */}
      <section className="">
        <Tabs defaultValue="all" className="w-full">
          <TabsList
            className="flex w-full gap-2
              overflow-x-auto
              whitespace-nowrap
              justify-start"
          >
            <TabsTrigger value="all" className="shrink-0">
              All
            </TabsTrigger>
            {tags?.map((tag) => (
              <TabsTrigger asChild key={tag.id} value={tag.slug} className="shrink-0">
                <Link href={`/courses?tag=${tag.slug}`}>{tag.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Course Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {courses && courses.length > 0 ? (
          courses.map((c) => (
            <Link href={`/courses/${c.slug}`} className="block h-full" key={c.id}>
              <Card className="h-[220px] flex flex-col hover:shadow-lg transition">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base">{c.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground line-clamp-4">
                  {c.description}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </section>
    </div>
  );
}
