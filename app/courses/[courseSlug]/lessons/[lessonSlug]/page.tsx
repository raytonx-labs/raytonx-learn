import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses/detail";
import { getLessonBySlug } from "@/services/lessons/detail";
import { listLessonsByCourse } from "@/services/lessons/list";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { LessonContent } from "./components/LessonContent";
import { LessonSidebar } from "./components/LessonSidebar";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const supabase: TypedSupabaseClient = await createSupabaseServerClient();

  const course = await getCourseBySlug(supabase, courseSlug);
  const { data: lessons, hasMore } = await listLessonsByCourse(supabase, courseSlug, {
    pageSize: 20,
  });
  const lesson = await getLessonBySlug(supabase, course.id, lessonSlug);

  return (
    <>
      <LessonSidebar
        course={course}
        initialLessons={lessons}
        hasMore={hasMore}
        currentLessonSlug={lessonSlug}
      />

      <LessonContent lesson={lesson} />
    </>
  );
}
