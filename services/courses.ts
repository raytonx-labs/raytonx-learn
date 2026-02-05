import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";

export const getCourseById = async (supabase: SupabaseClient<Database>, courseId: string) => {
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

export const getCourseBySlug = async (supabase: SupabaseClient<Database>, courseSlug: string) => {
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
