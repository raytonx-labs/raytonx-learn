import { Lesson } from "@/types/lesson";
import { TypedSupabaseClient } from "@/types/supabase-client";

import {
  lessonBySlugQuery,
  lessonsByMdxPathsQuery,
  publicLessonsByCourseSlugQuery,
} from "./queries";

export type LessonWithCourseSlug = Lesson & {
  courses: {
    slug: string;
  } | null;
};

export const getLessonBySlug = async (
  supabase: TypedSupabaseClient,
  courseSlug: string,
  lessonSlug: string,
) => {
  const { data, error } = await lessonBySlugQuery(supabase, courseSlug, lessonSlug).single();

  if (error) throw error;
  return data;
};

export const getFirstLessonByCourse = async (supabase: TypedSupabaseClient, courseSlug: string) => {
  const { data, error } = await publicLessonsByCourseSlugQuery(supabase, courseSlug)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const listLessonsByMdxPaths = async (
  supabase: TypedSupabaseClient,
  mdxPaths: string[],
): Promise<LessonWithCourseSlug[]> => {
  if (mdxPaths.length === 0) {
    return [];
  }

  const { data, error } = await lessonsByMdxPathsQuery(supabase, mdxPaths);

  if (error) throw error;

  return (data ?? []) as LessonWithCourseSlug[];
};
