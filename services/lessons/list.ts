import { LESSON_PAGE_SIZE } from "@/config/pagination";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { publicLessonsByCourseSlugQuery, publishedLessonsQuery } from "./queries";

type ListLessonsParams = {
  page?: number;
  pageSize?: number;
};

export const listLessonsByCourse = async (
  supabase: TypedSupabaseClient,
  courseSlug: string,
  params: ListLessonsParams = {},
) => {
  const { page = 1, pageSize = LESSON_PAGE_SIZE } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  const query = publicLessonsByCourseSlugQuery(supabase, courseSlug)
    .order("sort_order", { ascending: true })
    .range(from, to);

  const { data, error } = await query;

  const hasMore = (data?.length ?? 0) > pageSize;

  return {
    data: data?.slice(0, pageSize) || [],
    hasMore,
    error,
  };
};

export const listPublishedLessons = async (
  supabase: TypedSupabaseClient,
  params: ListLessonsParams = {},
) => {
  const { page = 1, pageSize = LESSON_PAGE_SIZE } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  const query = publishedLessonsQuery(supabase)
    .order("sort_order", { ascending: true })
    .range(from, to);

  const { data, error } = await query;

  const hasMore = (data?.length ?? 0) > pageSize;

  return {
    data: data?.slice(0, pageSize) || [],
    hasMore,
    error,
  };
};
