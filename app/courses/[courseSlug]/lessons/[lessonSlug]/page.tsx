import { LESSON_PAGE_SIZE } from "@/config/pagination";
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
  const { data: lessons } = await listLessonsByCourse(supabase, courseSlug, {
    pageSize: LESSON_PAGE_SIZE,
  });
  const lesson = await getLessonBySlug(supabase, course.id, lessonSlug);

  return (
    <>
      <LessonSidebar course={course} initialLessons={lessons} currentLessonSlug={lessonSlug} />

      <LessonContent lesson={lesson} />
    </>
  );
}
