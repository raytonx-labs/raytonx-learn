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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          <Link href="/" className="block">
            RaytonX Learn
          </Link>
        </h1>

        {/* Center - Search */}
        <div className="flex-1 max-w-md px-6">
          <input
            type="text"
            placeholder="Search courses..."
            className="
            w-full
            rounded-lg
            border
            border-gray-200
            bg-gray-50
            px-4 py-2
            text-sm
            outline-none
            focus:border-blue-600
            focus:ring-1
            focus:bg-white
          "
          />
        </div>

        <div className="flex items-center  gap-4">
          {loading ? null : user ? (
            <UserAvatar user={user} onSignOut={onSignOut} />
          ) : (
            <Link href="/login">
              <Button variant="link">登录</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
