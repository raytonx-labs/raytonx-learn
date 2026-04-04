"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "./ui/button";
import { UserAvatar } from "./user-avatar";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const publicSite = process.env.NEXT_PUBLIC_SITE_URL;

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

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
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <UserAvatar user={user} onSignOut={onSignOut} />
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-normal">
                登录
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
