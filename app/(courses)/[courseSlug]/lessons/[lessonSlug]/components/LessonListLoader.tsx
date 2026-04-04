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
    return <div className="px-4 py-2 text-sm text-muted-foreground">Failed to load lessons</div>;
  }

  return (
    <div>
      <nav className="space-y-0.5">
        {lessons.map((lesson, index) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            active={lesson.slug === currentLessonSlug}
            courseSlug={courseSlug}
            index={index}
          />
        ))}
      </nav>

      <div className="px-4 py-3">
        {isLoading ? (
          <span className="text-xs text-muted-foreground">Loading...</span>
        ) : hasMore ? (
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            variant="ghost"
            size="sm"
            className="w-full text-xs h-8"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </Button>
        ) : lessons.length > 5 ? (
          <span className="text-xs text-muted-foreground">All lessons loaded</span>
        ) : null}
      </div>
    </div>
  );
}
