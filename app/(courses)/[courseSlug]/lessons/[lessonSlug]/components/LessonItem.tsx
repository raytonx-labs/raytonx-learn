import Link from "next/link";

import { cn } from "@/lib/utils";
import { Lesson } from "@/types/lesson";

export function LessonItem({
  lesson,
  active,
  courseSlug,
  index,
}: {
  lesson: Lesson;
  active: boolean;
  courseSlug: string;
  index: number;
}) {
  const isComingSoon = lesson.status === "coming_soon";

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-2.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-foreground font-medium"
          : isComingSoon
            ? "text-muted-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
      )}
    >
      <span className="text-xs text-muted-foreground/60 font-mono mt-0.5 flex-shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 line-clamp-2 leading-snug">{lesson.name}</span>
      {isComingSoon ? (
        <span className="text-xs text-muted-foreground whitespace-nowrap">敬请期待</span>
      ) : null}
    </div>
  );

  if (isComingSoon) {
    return content;
  }

  return <Link href={`/${courseSlug}/lessons/${lesson.slug}`}>{content}</Link>;
}
