import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

export async function loadMdx(mdxPath: string) {
  const filePath = path.join(process.cwd(), mdxPath);

  const source = await fs.readFile(filePath, "utf-8");

  const { content, data } = matter(source);

  return {
    content: content,
    frontmatter: data,
  };
}
