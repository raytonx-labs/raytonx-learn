import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="https://www.raytonx.com/zh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              RaytonX
            </Link>
            <Link
              href="https://www.raytonx.com/zh/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="https://github.com/raytonx-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} RaytonX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
