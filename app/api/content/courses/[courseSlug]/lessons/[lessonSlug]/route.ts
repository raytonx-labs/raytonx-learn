import { serialize } from "next-mdx-remote/serialize";
import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/require-api-user";
import { getLessonContentBySlug } from "@/lib/content/get-lesson-content";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ courseSlug: string; lessonSlug: string }>;
  },
) {
  const { unauthorizedResponse } = await requireApiUser();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { courseSlug, lessonSlug } = await params;

  try {
    const result = await getLessonContentBySlug(courseSlug, lessonSlug);
    const mdxSource = await serialize(result.content);

    return NextResponse.json({
      lesson: result.lesson,
      frontmatter: result.frontmatter,
      mdxSource,
    });
  } catch (error) {
    console.error("Lesson content API error:", error);

    return NextResponse.json({ error: "Lesson content unavailable" }, { status: 500 });
  }
}
