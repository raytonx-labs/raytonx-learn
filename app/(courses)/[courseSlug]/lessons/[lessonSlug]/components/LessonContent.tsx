import { MDXRemote } from "next-mdx-remote/rsc";

import { getLessonContentBySlug } from "@/lib/content/get-lesson-content";
import { Lesson } from "@/types/lesson";

import { LessonContentClient } from "./LessonContentClient";

const PREVIEW_LINE_LIMIT = 20;

function getPreviewContent(source: string, lineLimit = PREVIEW_LINE_LIMIT) {
  const lines = source.split("\n");
  const previewLines: string[] = [];
  let codeFenceDelimiter: string | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const fenceMatch = trimmedLine.match(/^(```|~~~)/);

    if (fenceMatch) {
      const delimiter = fenceMatch[1];
      codeFenceDelimiter = codeFenceDelimiter === delimiter ? null : delimiter;
    }

    previewLines.push(line);

    if (previewLines.length >= lineLimit && !codeFenceDelimiter) {
      break;
    }
  }

  if (codeFenceDelimiter) {
    previewLines.push(codeFenceDelimiter);
  }

  return previewLines.join("\n").trim();
}

export async function LessonContent({
  lesson,
  courseSlug,
}: {
  lesson: Lesson;
  courseSlug: string;
}) {
  try {
    const result = await getLessonContentBySlug(courseSlug, lesson.slug);
    return renderLessonContent({
      courseSlug,
      lessonSlug: lesson.slug,
      lessonName: lesson.name,
      previewContent: getPreviewContent(result.content),
    });
  } catch (error) {
    console.log("LessonContent load error:", error);

    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center space-y-3">
          <h2 className="text-lg font-medium text-foreground">内容不可用</h2>
          <p className="text-sm text-muted-foreground">该内容暂时不可用，请稍后重试。</p>
        </div>
      </div>
    );
  }
}

function renderLessonContent({
  courseSlug,
  lessonSlug,
  lessonName,
  previewContent,
}: {
  courseSlug: string;
  lessonSlug: string;
  lessonName: string;
  previewContent: string;
}) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <LessonContentClient
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          lessonName={lessonName}
          preview={renderPreviewContent(previewContent)}
        />
      </div>
    </main>
  );
}

function renderPreviewContent(previewContent: string) {
  return (
    <article className="prose prose-neutral max-w-none">
      <MDXRemote source={previewContent} />
    </article>
  );
}
