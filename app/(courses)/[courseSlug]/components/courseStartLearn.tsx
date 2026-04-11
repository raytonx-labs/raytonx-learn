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
        内容即将上线
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className="w-full">
      <Link href={`/${courseSlug}/lessons/${firstLessonSlug}`}>了解详情</Link>
    </Button>
  );
}
