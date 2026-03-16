import matter from "gray-matter";

import { Lesson } from "@/types/lesson";

export async function loadMdx(lesson: Lesson) {
  const start = Date.now();
  const res = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${lesson.mdx_path}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw", // 返回原始文本
      },
      // 使用 tags, Next.js 缓存可精确刷新
      next: {
        revalidate: process.env.MDX_REVALIDATE_SECONDS
          ? Number(process.env.MDX_REVALIDATE_SECONDS)
          : false,
        tags: [`lesson-${lesson.slug}`],
      },
      cache: "force-cache",
    },
  );

  console.log(
    `GitHub fetch took ${Date.now() - start}ms, MDX_REVALIDATE_SECONDS: ${Number(process.env.MDX_REVALIDATE_SECONDS)}`,
  );

  if (!res.ok) {
    throw new Error(`GitHub fetch failed: ${res.status}`);
  }

  const source = await res.text();
  const { content, data } = matter(source);

  return {
    content: content,
    frontmatter: data,
  };
}
