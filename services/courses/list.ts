import { COURSE_PAGE_SIZE } from "@/config/pagination";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { publishedCoursesQuery } from "./queries";

type ListCoursesPgarams = {
  page?: number;
  pageSize?: number;
  tag?: string;
};

export const listCourses = async (
  supabase: TypedSupabaseClient,
  params: ListCoursesPgarams = {},
) => {
  const { page = 1, pageSize = COURSE_PAGE_SIZE, tag } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  const query = publishedCoursesQuery(supabase);

  if (tag && tag !== "all") {
    query.eq("course_tag_relations.course_tags.slug", tag);
  }

  query.order("updated_at", { ascending: true });
  query.range(from, to);

  const { data, error } = await query;

  const hasMore = (data?.length ?? 0) > pageSize;

  return {
    data: data?.slice(0, pageSize) || [],
    hasMore,
    error,
  };
};
