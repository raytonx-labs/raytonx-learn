import { TypedSupabaseClient } from "@/types/supabase-client";

import { lessonBySlugQuery, publishedLessonsByCourseSlugQuery } from "./queries";

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
  const { data, error } = await publishedLessonsByCourseSlugQuery(supabase, courseSlug)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};
