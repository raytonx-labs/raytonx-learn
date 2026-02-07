import { TypedSupabaseClient } from "@/types/supabase-client";

import { publishedLessonsByCourseIdQuery } from "./queries";

type ListLessonsParams = {
  page?: number;
  pageSize?: number;
};

export const listLessonsByCourse = async (
  supabase: TypedSupabaseClient,
  courseId: string,
  params: ListLessonsParams = {},
) => {
  const { page = 1, pageSize = 10 } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = publishedLessonsByCourseIdQuery(supabase, courseId)
    .order("sort_order", { ascending: true })
    .range(from, to);

  const { data, error } = await query;

  if (error) throw error;

  return data;
};
