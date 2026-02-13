import Link from "next/link";

import { Button } from "@/components/ui/button";

export function StartLearningButton({
  courseSlug,
  firstLessonSlug,
}: {
  courseSlug: string;
  firstLessonSlug?: string;
}) {
  if (!firstLessonSlug) {
    return (
      <Button disabled className="w-full">
        课程内容即将上线
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className="w-full">
      <Link href={`/courses/${courseSlug}/lessons/${firstLessonSlug}`}>开始学习</Link>
    </Button>
  );
}
