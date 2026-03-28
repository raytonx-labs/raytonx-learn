import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const { courseSlug, lessonSlug, secret } = await request.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidatePath(`/courses/${courseSlug}`, "layout");
  // 重新更新课时内容，实现SSG更新
  revalidatePath(`/courses/${courseSlug}/lessons/${lessonSlug}`, "page");

  return Response.json({ message: "Static site updated" });
}
