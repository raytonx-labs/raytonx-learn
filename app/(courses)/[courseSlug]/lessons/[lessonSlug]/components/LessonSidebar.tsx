"use client";

import Link from "next/link";

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
    <aside className="hidden md:flex flex-col w-72 border-r border-border bg-sidebar overflow-hidden flex-shrink-0">
      {/* Course Title */}
      <div className="px-4 py-4 border-b border-border">
        <Link
          href={`/${course.slug}`}
          className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors line-clamp-2"
        >
          {course.name}
        </Link>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto py-2">
        <LessonListLoader
          initialLessons={initialLessons}
          currentLessonSlug={currentLessonSlug}
          courseSlug={course.slug}
        />
      </div>
    </aside>
  );
}
