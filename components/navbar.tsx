"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

export const Navbar = () => {
  const { user, loading, openLoginModal, signOut } = useAuth();

  const publicSite = process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-base font-semibold text-foreground tracking-tight">
            RaytonX Learn
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={`${publicSite}/zh`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            RaytonX
          </Link>
          <Link
            href={`${publicSite}/en/blog`}
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
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <UserAvatar user={user} onSignOut={signOut} />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-normal"
              onClick={openLoginModal}
            >
              登录
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
