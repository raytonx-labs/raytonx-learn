import { TypedSupabaseClient } from "@/types/supabase-client";

export function publishedCoursesQuery(supabase: TypedSupabaseClient) {
  return supabase
    .from("courses")
    .select("*, course_tag_relations!inner(course_tags!inner(slug, name))")
    .eq("status", "published")
    .is("deleted_at", null);
}
