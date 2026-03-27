export function CourseStats({ lessonsCount }: { lessonsCount: number }) {
  return (
    <section className="space-y-1">
      <h2 className="text-lg font-medium">课程信息</h2>
      <div className="text-sm text-muted-foreground">共 {lessonsCount} 节课</div>
    </section>
  );
}
