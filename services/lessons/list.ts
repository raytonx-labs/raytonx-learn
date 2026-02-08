import { TypedSupabaseClient } from "@/types/supabase-client";

import { publishedLessonsByCourseSlugQuery } from "./queries";

type ListLessonsParams = {
  page?: number;
  pageSize?: number;
};

export const listLessonsByCourse = async (
  supabase: TypedSupabaseClient,
  courseSlug: string,
  params: ListLessonsParams = {},
) => {
  const { page = 1, pageSize = 10 } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  const query = publishedLessonsByCourseSlugQuery(supabase, courseSlug)
    .order("sort_order", { ascending: true })
    .range(from, to);

  const { data, error } = await query;

  if (error) throw error;

  const hasMore = (data.length ?? 0) > pageSize;

  return {
    data: data.slice(0, pageSize) || [],
    hasMore,
  };
};
