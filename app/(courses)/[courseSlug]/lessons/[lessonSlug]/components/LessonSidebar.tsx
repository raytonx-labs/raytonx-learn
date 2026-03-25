"use client";

import { Course } from "@/types/course";
import { Lesson } from "@/types/lesson";

import { LessonListLoader } from "./LessonListLoader";

export function LessonSidebar({
  course,
  initialLessons,
  currentLessonSlug,
}: {
  course: Course;
  initialLessons: Lesson[];
  currentLessonSlug: string;
}) {
  return (
    <aside className="w-80 border-r overflow-y-auto">
      <h2 className="px-4 py-3 font-semibold">{course.name}</h2>

      <LessonListLoader
        initialLessons={initialLessons}
        currentLessonSlug={currentLessonSlug}
        courseSlug={course.slug}
      />
    </aside>
  );
}
