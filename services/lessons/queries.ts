import { TypedSupabaseClient } from "@/types/supabase-client";

export const publishedLessonsByCourseIdQuery = (
  supabase: TypedSupabaseClient,
  courseId: string,
) => {
  return supabase.from("lessons").select("*").eq("course_id", courseId).eq("is_published", true);
};

export const publishedLessonsByCourseSlugQuery = (
  supabase: TypedSupabaseClient,
  courseSlug: string,
) => {
  return supabase
    .from("lessons")
    .select("*,courses!inner (slug)")
    .eq("courses.slug", courseSlug)
    .eq("is_published", true);
};

export const publishedLessonsQuery = (supabase: TypedSupabaseClient) => {
  return supabase.from("lessons").select("*").eq("is_published", true);
};

export const lessonByIdQuery = (supabase: TypedSupabaseClient, lessonId: string) => {
  return supabase.from("lessons").select("*").eq("id", lessonId);
};

export const lessonBySlugQuery = (
  supabase: TypedSupabaseClient,
  courseId: string,
  lessonSlug: string,
) => {
  return supabase.from("lessons").select("*").eq("slug", lessonSlug).eq("course_id", courseId);
};
