import Link from "next/link";

import { cn } from "@/lib/utils";
import { Lesson } from "@/types/lesson";

export function LessonItem({
  lesson,
  active,
  courseSlug,
}: {
  lesson: Lesson;
  active: boolean;
  courseSlug: string;
}) {
  return (
    <Link
      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
      className={cn(
        "block px-4 py-2 text-sm rounded-md transition-colors",
        active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60",
      )}
    >
      {lesson.name}
    </Link>
  );
}
