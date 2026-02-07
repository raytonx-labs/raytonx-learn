import { TypedSupabaseClient } from "@/types/supabase-client";

export const publishedLessonsByCourseIdQuery = (
  supabase: TypedSupabaseClient,
  courseId: string,
) => {
  return supabase.from("lessons").select("*").eq("course_id", courseId).eq("is_published", true);
};

export const publishedLessonsQuery = (supabase: TypedSupabaseClient) => {
  return supabase.from("lessons").select("*").eq("is_published", true);
};

export const lessonByIdQuery = (supabase: TypedSupabaseClient, lessonId: string) => {
  return supabase.from("lessons").select("*").eq("id", lessonId);
};
