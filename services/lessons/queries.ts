import { TypedSupabaseClient } from "@/types/supabase-client";

export const publishedLessonsByCourseIdQuery = (
  supabase: TypedSupabaseClient,
  courseId: string,
) => {
  return supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .in("status", ["published", "coming_soon"]);
};

export const publishedLessonsByCourseSlugQuery = (
  supabase: TypedSupabaseClient,
  courseSlug: string,
) => {
  return supabase
    .from("lessons")
    .select("*,courses!inner (slug)")
    .eq("courses.slug", courseSlug)
    .in("status", ["published", "coming_soon"]);
};

export const publishedLessonsQuery = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("lessons")
    .select("*,courses!inner (slug)")
    .in("status", ["published", "coming_soon"]);
};

export const lessonByIdQuery = (supabase: TypedSupabaseClient, lessonId: string) => {
  return supabase.from("lessons").select("*").eq("id", lessonId);
};

export const lessonBySlugQuery = (
  supabase: TypedSupabaseClient,
  courseSlug: string,
  lessonSlug: string,
) => {
  return supabase
    .from("lessons")
    .select("*,courses!inner(slug)")
    .eq("slug", lessonSlug)
    .eq("courses.slug", courseSlug);
};
