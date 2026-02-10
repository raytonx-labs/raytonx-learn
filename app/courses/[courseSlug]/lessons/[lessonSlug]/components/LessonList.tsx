"use client";

import { useState } from "react";

import { Lesson } from "@/types/lesson";

import { LessonItem } from "./LessonItem";
import { LessonListLoader } from "./LessonListLoader";

export function LessonList({
  initialLessons,
  hasMore,
  currentLessonSlug,
  courseSlug,
}: {
  initialLessons: Lesson[];
  hasMore: boolean;
  currentLessonSlug: string;
  courseSlug: string;
}) {
  const [lessons, setLessons] = useState(initialLessons);

  return (
    <>
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          active={lesson.slug === currentLessonSlug}
          courseSlug={courseSlug}
        />
      ))}

      {hasMore && (
        <LessonListLoader
          courseSlug={courseSlug}
          onLoad={(newLessons) => setLessons((prev) => [...prev, ...newLessons])}
        />
      )}
    </>
  );
}
