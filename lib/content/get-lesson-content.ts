import { unstable_cache } from "next/cache";
import "server-only";

import { loadMdx } from "@/lib/mdx/load-mdx";
import { supabaseStaticClient } from "@/lib/supabase/static";
import { getLessonBySlug } from "@/services/lessons/detail";
import { Lesson } from "@/types/lesson";

type LessonFrontmatter = Record<string, unknown>;

export type LessonContentPayload = {
  lesson: Lesson;
  content: string;
  frontmatter: LessonFrontmatter;
};

export const getLessonContentTagBySlug = (courseSlug: string, lessonSlug: string) =>
  `lesson-content:slug:${courseSlug}/${lessonSlug}`;

export const getLessonContentTagByLessonId = (lessonId: string) =>
  `lesson-content:lesson:${lessonId}`;

export const getLessonContentTagByMdxPath = (mdxPath: string) => `lesson-content:mdx:${mdxPath}`;

export const getLessonContentTags = (lesson: Lesson, courseSlug: string) => [
  getLessonContentTagBySlug(courseSlug, lesson.slug),
  getLessonContentTagByLessonId(lesson.id),
  getLessonContentTagByMdxPath(lesson.mdx_path),
];

function normalizeFrontmatter(value: unknown): LessonFrontmatter {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as LessonFrontmatter;
}

async function loadLessonContent(lesson: Lesson): Promise<LessonContentPayload> {
  const { content, frontmatter } = await loadMdx(lesson);

  return {
    lesson,
    content,
    frontmatter: normalizeFrontmatter(frontmatter),
  };
}

export async function getLessonContent(
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonContentPayload> {
  const lesson = await getLessonBySlug(supabaseStaticClient, courseSlug, lessonSlug);
  const tags = getLessonContentTags(lesson, courseSlug);

  const cachedLoader = unstable_cache(
    async () => loadLessonContent(lesson),
    ["lesson-content", lesson.id, courseSlug, lessonSlug, lesson.mdx_path],
    {
      revalidate: false,
      tags,
    },
  );

  return cachedLoader();
}

export async function getLessonContentBySlug(
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonContentPayload> {
  return getLessonContent(courseSlug, lessonSlug);
}
