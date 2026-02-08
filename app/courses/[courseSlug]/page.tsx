import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses/detail";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { CourseHeader } from "./components/courseHeader";
import { CourseOverview } from "./components/courseOverview";
import { CourseResources } from "./components/courseResources";

export default async function Home({ params }: { params: Promise<{ courseSlug?: string }> }) {
  const { courseSlug } = await params;
  const supabase: TypedSupabaseClient = await createSupabaseServerClient();

  const course = await getCourseBySlug(supabase, courseSlug!);

  return (
    <div className="space-y-8">
      <CourseHeader
        title={course.name}
        tags={course.course_tag_relations?.map((rel) => rel.course_tags.slug) ?? []}
      />

      <CourseOverview description={course.description ?? ""} />

      {/* <CourseStats lessonsCount={course.lessonsCount} /> */}

      {course.source_url && <CourseResources sourceUrl={course.source_url} />}
    </div>
  );
}
