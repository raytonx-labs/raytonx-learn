import matter from "gray-matter";
import "server-only";

import { Lesson } from "@/types/lesson";

export async function loadMdx(lesson: Lesson) {
  const res = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${lesson.mdx_path}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw", // 返回原始文本
      },
      cache: "no-store",
    },
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
