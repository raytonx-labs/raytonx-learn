import { MDXRemote } from "next-mdx-remote/rsc";

import { loadMdx } from "@/lib/mdx/load-mdx";
import { Lesson } from "@/types/lesson";

export async function LessonContent({ lesson }: { lesson: Lesson }) {
  const { content } = await loadMdx(lesson.mdx_path);
  return (
    <div className="flex-1 overflow-y-auto px-8 h-full">
      <article className="prose max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
