import { MDXRemote } from "next-mdx-remote/rsc";

import { loadMdx } from "@/lib/mdx/load-mdx";
import { Lesson } from "@/types/lesson";

export async function LessonContent({ lesson }: { lesson: Lesson }) {
  let content: string;

  try {
    const result = await loadMdx(lesson);
    content = result.content;
  } catch (error) {
    console.log("LessonContent load error:", error);

    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center space-y-3">
          <h2 className="text-lg font-semibold">课程内容加载失败</h2>
          <p className="text-sm text-muted-foreground">该课程内容暂时不可用，请稍后重试。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 h-full">
      <article className="prose max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
