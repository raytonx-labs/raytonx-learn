export function CourseOverview({ description }: { description: string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-medium">课程介绍</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
