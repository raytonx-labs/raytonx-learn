"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteLessons } from "@/hooks/lesson/useInfiniteLessons";
import { Lesson } from "@/types/lesson";

import { LessonItem } from "./LessonItem";

export function LessonListLoader({
  courseSlug,
  currentLessonSlug,
  initialLessons,
}: {
  courseSlug: string;
  currentLessonSlug?: string;
  initialLessons: Lesson[];
}) {
  const { lessons, isLoading, isLoadingMore, hasMore, loadMore, error } = useInfiniteLessons(
    courseSlug,
    initialLessons,
  );

  if (error) {
    return <div>加载失败</div>;
  }

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          active={lesson.slug === currentLessonSlug}
          courseSlug={courseSlug}
        />
      ))}

      <div className="flex justify-center mt-4">
        {isLoading ? (
          <div>加载中...</div> // 首屏加载中
        ) : hasMore ? (
          <Button onClick={loadMore} disabled={isLoadingMore} variant="ghost">
            {isLoadingMore ? "加载中..." : "加载更多"}
          </Button>
        ) : (
          <div>没有更多了</div>
        )}
      </div>
    </div>
  );
}
