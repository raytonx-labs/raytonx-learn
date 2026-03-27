import { notFound } from "next/navigation";

import { LESSON_PAGE_SIZE } from "@/config/pagination";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses/detail";
import { getLessonBySlug } from "@/services/lessons/detail";
import { listLessonsByCourse, listPublishedLessons } from "@/services/lessons/list";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { LessonContent } from "./components/LessonContent";
import { LessonSidebar } from "./components/LessonSidebar";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Params = {
  courseSlug: string;
  lessonSlug: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const supabase: TypedSupabaseClient = await createSupabaseAdminClient();
    const lessons = await listPublishedLessons(supabase, { pageSize: 1000 });

    if (lessons.error) throw new Error("Failed to fetch lessons");

    const paramsList: Params[] = [];

    for (const lesson of lessons.data) {
      paramsList.push({
        courseSlug: lesson.courses.slug,
        lessonSlug: lesson.slug,
      });
    }

    console.log(`生成 ${paramsList.length} 个静态课时路径`);
    return paramsList;
  } catch (error) {
    console.error("generateStaticParams 错误:", error);
    return [];
  }
}

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
