import { SupabaseClient } from "@supabase/supabase-js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export default async function Home() {
  const supabase: SupabaseClient<Database> = await createSupabaseServerClient();

  const coursesPromise = supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const tagsPromise = supabase.from("course_tags").select("*");

  const [{ data: courses, error: coursesError }, { data: tags, error: tagsError }] =
    await Promise.all([coursesPromise, tagsPromise]);

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
    <div>
      {/* Category Tabs */}
      <section className="max-w-4xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            {tags?.map((tag) => (
              <TabsTrigger key={tag.id} value={tag.slug}>
                {tag.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Course Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses ? (
          courses.map((c) => (
            <Card key={c.slug}>
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.description}</CardContent>
            </Card>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </section>
    </div>
  );
}
