export function CourseTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <span key={tag} className="text-xs rounded-md bg-muted px-2 py-1">
          {tag}
        </span>
      ))}
    </div>
  );
}
