import { Metadata } from "next";
import { notFound } from "next/navigation";

import { LESSON_PAGE_SIZE } from "@/config/pagination";
import { supabaseStaticClient } from "@/lib/supabase/static";
import { getCourseBySlug } from "@/services/courses/detail";
import { getLessonBySlug } from "@/services/lessons/detail";
import { listLessonsByCourse, listPublishedLessons } from "@/services/lessons/list";

import { LessonContent } from "./components/LessonContent";
import { LessonSidebar } from "./components/LessonSidebar";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await getLessonBySlug(supabaseStaticClient, courseSlug, lessonSlug);

  return {
    title: lesson?.name,
    description: lesson?.description?.slice(0, 160),
    alternates: { canonical: `/${courseSlug}/lessons/${lessonSlug}` },
    openGraph: {
      images: [
        {
          url: `/${courseSlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: lesson?.name,
        },
      ],
    },
  };
}

type Params = {
  courseSlug: string;
  lessonSlug: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const lessons = await listPublishedLessons(supabaseStaticClient, { pageSize: 1000 });

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

  const coursePromise = getCourseBySlug(supabaseStaticClient, courseSlug);
  const lessonsPromise = listLessonsByCourse(supabaseStaticClient, courseSlug, {
    pageSize: LESSON_PAGE_SIZE,
  });
  const lessonPromise = getLessonBySlug(supabaseStaticClient, courseSlug, lessonSlug);

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
      <LessonContent lesson={lesson} courseSlug={courseSlug} />
    </>
  );
}
