import { notFound } from "next/navigation";

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

  const coursePromise = getCourseBySlug(supabase, courseSlug);
  const lessonsPromise = listLessonsByCourse(supabase, courseSlug, {
    pageSize: LESSON_PAGE_SIZE,
  });
  const lessonPromise = getLessonBySlug(supabase, courseSlug, lessonSlug);

  const [course, lessonsResult, lesson] = await Promise.all([
    coursePromise,
    lessonsPromise,
    lessonPromise,
  ]);

  const lessons = lessonsResult.data;

  if (!lesson) notFound();

  return (
    <>
      <LessonSidebar course={course} initialLessons={lessons} currentLessonSlug={lessonSlug} />

      <LessonContent lesson={lesson} />
    </>
  );
}
