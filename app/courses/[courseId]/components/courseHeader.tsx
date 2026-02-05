import { CourseTags } from "./courseTag";

export function CourseHeader({ title, tags }: { title: string; tags: string[] }) {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <CourseTags tags={tags} />
    </header>
  );
}
