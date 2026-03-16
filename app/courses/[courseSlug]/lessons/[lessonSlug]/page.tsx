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
  console.time("total");

  console.time("params");
  const { courseSlug, lessonSlug } = await params;
  console.timeEnd("params");

  console.time("createSupabase");
  const supabase: TypedSupabaseClient = await createSupabaseServerClient();
  console.timeEnd("createSupabase");

  console.time("queries");

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

  console.timeEnd("queries");

  console.time("render");

  const lessons = lessonsResult.data;

  if (!lesson) notFound();

  const result = (
    <>
      <LessonSidebar course={course} initialLessons={lessons} currentLessonSlug={lessonSlug} />
      <LessonContent lesson={lesson} />
    </>
  );

  console.timeEnd("render");
  console.timeEnd("total");

  return result;
}
