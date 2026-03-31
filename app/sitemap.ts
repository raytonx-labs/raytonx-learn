// app/sitemap.ts
import type { MetadataRoute } from "next";

import { supabaseStaticClient } from "@/lib/supabase/static";
import { listCourses } from "@/services/courses/list";
import { listPublishedLessons } from "@/services/lessons/list";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH!;

  const [{ data: courses }, { data: lessons }] = await Promise.all([
    listCourses(supabaseStaticClient, {
      pageSize: 1000,
    }),
    listPublishedLessons(supabaseStaticClient, {
      pageSize: 1000,
    }),
  ]);

  const courseUrls =
    courses?.map((course) => ({
      url: `${SITE_URL}${BASE_PATH}/${course.slug}`,
      lastModified: course.updated_at ? new Date(course.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  const lessonUrls =
    lessons?.map((lesson) => ({
      url: `${SITE_URL}${BASE_PATH}/${lesson.courses.slug}/lessons/${lesson.slug}`,
      lastModified: lesson.updated_at ? new Date(lesson.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [
    {
      url: `${SITE_URL}${BASE_PATH}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...courseUrls,
    ...lessonUrls,
  ];
}
