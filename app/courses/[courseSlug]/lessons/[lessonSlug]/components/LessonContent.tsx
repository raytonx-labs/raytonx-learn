import { MDXRemote } from "next-mdx-remote/rsc";

import { loadMdx } from "@/lib/mdx/load-mdx";
import { Lesson } from "@/types/lesson";

export async function LessonContent({ lesson }: { lesson: Lesson }) {
  const { content } = await loadMdx(lesson.mdx_path);
  return (
    <article className="prose max-w-none px-8">
      <MDXRemote source={content} />
    </article>
  );
}
