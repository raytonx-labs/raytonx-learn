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
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">RaytonX Learn</h1>

      <div className="flex gap-4">
        {user ? (
          <UserAvatar user={user} onSignOut={onSignOut} />
        ) : (
          <Link href="/login">
            <Button variant="link">登录</Button>
          </Link>
        )}
      </div>
    </header>
  );
};
