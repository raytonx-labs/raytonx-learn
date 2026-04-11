import { TypedSupabaseClient } from "@/types/supabase-client";

export function publicCoursesQuery(supabase: TypedSupabaseClient) {
  return supabase
    .from("courses")
    .select(
      "*, course_tag_relations(course_tags(slug, name)), filter_rel:course_tag_relations!inner(course_tags!inner(slug))",
    )
    .in("status", ["published", "coming_soon"])
    .is("deleted_at", null);
}

export function publishedCoursesQuery(supabase: TypedSupabaseClient) {
  return publicCoursesQuery(supabase).eq("status", "published");
}
