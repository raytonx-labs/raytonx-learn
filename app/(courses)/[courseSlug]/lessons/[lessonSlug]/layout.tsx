export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex justify-center min-h-0">
      <div className="w-full max-w-5xl flex min-h-0">{children}</div>
    </div>
  );
}
