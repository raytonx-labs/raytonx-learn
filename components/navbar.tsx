"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "./ui/button";

export const Navbar = ({ initialUser }: { initialUser: User | null }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [supabase] = useState(() => createSupabaseBrowserClient());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">RaytonX Learn</h1>
      <div className="flex gap-4">
        {user ? (
          <div className="flex gap-4">
            <span>你好, {user.email}</span>
            <button onClick={signOut}>登出</button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="link">Login</Button>
          </Link>
        )}
        <Button>Browse Newsletter</Button>
      </div>
    </header>
  );
};
