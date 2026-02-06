import { TypedSupabaseClient } from "@/types/supabase-client";

import { publishedCoursesQuery } from "./queries";

export const getCourseById = async (supabase: TypedSupabaseClient, courseId: string) => {
  const { data, error } = await publishedCoursesQuery(supabase).eq("id", courseId).single();

  if (error) {
    throw new Error(`Error fetching course with ID ${courseId}: ${error.message}`);
  }

  return data;
};

export const getCourseBySlug = async (supabase: TypedSupabaseClient, courseSlug: string) => {
  const { data, error } = await publishedCoursesQuery(supabase).eq("slug", courseSlug).single();

  if (error) {
    throw new Error(`Error fetching course with ID ${courseSlug}: ${error.message}`);
  }

  return data;
};
