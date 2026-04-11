import { COURSE_PAGE_SIZE } from "@/config/pagination";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { publicCoursesQuery, publishedCoursesQuery } from "./queries";

type ListCoursesPgarams = {
  page?: number;
  pageSize?: number;
  tag?: string;
  publishedOnly?: boolean;
};

export const listCourses = async (
  supabase: TypedSupabaseClient,
  params: ListCoursesPgarams = {},
) => {
  const { page = 1, pageSize = COURSE_PAGE_SIZE, tag, publishedOnly = false } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  const query = publishedOnly ? publishedCoursesQuery(supabase) : publicCoursesQuery(supabase);

  if (tag && tag !== "all") {
    query.eq("filter_rel.course_tags.slug", tag);
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
