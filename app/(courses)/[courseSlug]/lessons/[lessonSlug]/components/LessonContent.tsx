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
          <h2 className="text-lg font-medium text-foreground">内容不可用</h2>
          <p className="text-sm text-muted-foreground">该课程内容暂时不可用，请稍后重试。</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        {/* Lesson Title */}
        <header className="mb-8 pb-6 border-b border-border">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{lesson.name}</h1>
          {lesson.description && <p className="mt-2 text-muted-foreground">{lesson.description}</p>}
        </header>

        {/* MDX Content */}
        <article className="prose prose-neutral max-w-none">
          <MDXRemote source={content} />
        </article>
      </div>
    </main>
  );
}
