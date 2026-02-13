import useSWRInfinite from "swr/infinite";

import { LESSON_PAGE_SIZE } from "@/config/pagination";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { listLessonsByCourse } from "@/services/lessons/list";
import { Lesson } from "@/types/lesson";

type LessonsKey = readonly ["lessons", string, number];

export function useInfiniteLessons(courseSlug: string, initialData?: Lesson[]) {
  const supabase = createSupabaseBrowserClient();

  const getKey = (
    pageIndex: number,
    previousPageData: { hasMore: boolean } | null,
  ): LessonsKey | null => {
    if (pageIndex === 0) return ["lessons", courseSlug, pageIndex];

    if (previousPageData && !previousPageData?.hasMore) return null;
    return ["lessons", courseSlug, pageIndex];
  };

  const fetchLessons = async (key: LessonsKey) => {
    const [, courseSlug, page] = key;

    return listLessonsByCourse(supabase, courseSlug, {
      page: page + 1,
      pageSize: LESSON_PAGE_SIZE,
    });
  };

  const fallbackData = initialData
    ? [{ data: initialData, hasMore: initialData.length === LESSON_PAGE_SIZE }]
    : undefined;
  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetchLessons, {
    fallbackData,
    revalidateFirstPage: false, // 禁用首屏自动校验
    revalidateOnMount: false, // 挂载时不重新请求
  });

  const lessons = data?.flatMap((page) => page.data) ?? [];
  const isLoading = !data && !error;
  const isLoadingMore = isValidating && size > 0 && data && typeof data[size - 1] === "undefined";
  const hasMore = data?.[data.length - 1]?.hasMore ?? false;

  return {
    lessons,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore: () => setSize(size + 1),
  };
}
