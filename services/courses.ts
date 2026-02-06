import { TypedSupabaseClient } from "@/types/supabase-client";

export const getCourseById = async (supabase: TypedSupabaseClient, courseId: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_tag_relations!inner(course_tags!inner(slug, name))")
    .eq("id", courseId)
    .single();

  if (error) {
    throw new Error(`Error fetching course with ID ${courseId}: ${error.message}`);
  }

  return data;
};

export const getCourseBySlug = async (supabase: TypedSupabaseClient, courseSlug: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_tag_relations!inner(course_tags!inner(slug, name))")
    .eq("slug", courseSlug)
    .single();

  if (error) {
    throw new Error(`Error fetching course with ID ${courseSlug}: ${error.message}`);
  }

  return data;
};
