"use client";

import { Course } from "@/types/course";
import { Lesson } from "@/types/lesson";

import { LessonList } from "./LessonList";

export function LessonSidebar({
  course,
  initialLessons,
  hasMore,
  currentLessonSlug,
}: {
  course: Course;
  initialLessons: Lesson[];
  hasMore: boolean;
  currentLessonSlug: string;
}) {
  return (
    <aside className="w-80 border-r overflow-y-auto">
      <h2 className="px-4 py-3 font-semibold">{course.name}</h2>

      <LessonList
        initialLessons={initialLessons}
        hasMore={hasMore}
        currentLessonSlug={currentLessonSlug}
        courseSlug={course.slug}
      />
    </aside>
  );
}
