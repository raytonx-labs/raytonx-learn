import Link from "next/link";

export const Footer = () => {
  const publicSite = process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href={`${publicSite}/zh`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              RaytonX
            </Link>
            <Link
              href={`${publicSite}/zh/blog`}
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
