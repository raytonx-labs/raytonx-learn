"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "./ui/button";
import { UserAvatar } from "./user-avatar";

export const Navbar = ({ initialUser }: { initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const onSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">RaytonX Learn</h1>

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
          {user ? (
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
