// app/courses/[courseId]/components/CourseResources.tsx
import Link from "next/link";

export function CourseResources({ sourceUrl }: { sourceUrl?: string }) {
  if (!sourceUrl) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-medium">资源</h2>
      <Link href={sourceUrl} target="_blank" className="text-sm text-primary underline">
        源代码地址
      </Link>
    </section>
  );
}
