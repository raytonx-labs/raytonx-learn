import { Lesson } from "@/types/lesson";

export function LessonContent({ lesson }: { lesson: Lesson }) {
  // const mdxSource = loadMdx(lesson.mdx_path);

  // return (
  //   <article className="prose max-w-none px-8">
  //     <MDXRenderer source={mdxSource} />
  //   </article>
  // );
  return <div className="p-8">Lesson Content for {lesson.name}</div>;
}
