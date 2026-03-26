import type { Metadata } from "next";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/services/courses/detail";
import { getFirstLessonByCourse } from "@/services/lessons/detail";
import { TypedSupabaseClient } from "@/types/supabase-client";

import { CourseHeader } from "./components/courseHeader";
import { CourseOverview } from "./components/courseOverview";
import { CourseResources } from "./components/courseResources";
import { StartLearningButton } from "./components/courseStartLearn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  const { courseSlug } = await params;
  const course = await getCourseBySlug(supabase, courseSlug);

  return {
    title: course?.name,
    description: course?.description?.slice(0, 160),
    alternates: { canonical: `https://raytonx.com/courses/${courseSlug}` },
  };
}

export default async function Home({ params }: { params: Promise<{ courseSlug?: string }> }) {
  const { courseSlug } = await params;

  if (!courseSlug) {
    throw new Error("Course slug is required");
  }

  const supabase: TypedSupabaseClient = await createSupabaseServerClient();

  const course = await getCourseBySlug(supabase, courseSlug!);

  if (!course) {
    throw new Error("Course not found");
  }

  const firstLesson = await getFirstLessonByCourse(supabase, courseSlug);

  if (!firstLesson) {
    throw new Error("No published lessons found for this course");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <CourseHeader
        title={course.name}
        tags={course.course_tag_relations?.map((rel) => rel.course_tags.slug) ?? []}
      />

      <CourseOverview description={course.description ?? ""} />

      {/* <CourseStats lessonsCount={course.lessonsCount} /> */}

      {course.source_url && <CourseResources sourceUrl={course.source_url} />}

      <StartLearningButton courseSlug={courseSlug} firstLessonSlug={firstLesson.slug} />
    </div>
  );
}
