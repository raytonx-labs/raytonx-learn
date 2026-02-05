export default async function Home({ params }: { params: Promise<{ courseId?: string }> }) {
  const { courseId } = await params;

  return (
    <div className="container mx-auto space-y-8">
      <div>Course: {courseId}</div>
    </div>
  );
}
