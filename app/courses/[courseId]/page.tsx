import { CourseHeader } from "./components/courseHeader";
import { CourseOverview } from "./components/courseOverview";
import { CourseResources } from "./components/courseResources";
import { CourseStats } from "./components/courseStats";

export default async function Home({ params }: { params: Promise<{ courseId?: string }> }) {
  const { courseId } = await params;

  const course = {
    id: courseId || "default-course",
    title: "Sample Course Title",
    description: "This is a sample course description.",
    tags: ["tag1", "tag2"],
    lessonsCount: 10,
    sourceUrl: "https://github.com/raytonx-labs/raytonx-learn",
  };

  return (
    <div className="space-y-8">
      <CourseHeader title={course.title} tags={course.tags} />

      <CourseOverview description={course.description} />

      <CourseStats lessonsCount={course.lessonsCount} />

      <CourseResources sourceUrl={course.sourceUrl} />
    </div>
  );
}
