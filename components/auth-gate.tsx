"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/components/auth-provider";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, openLoginModal } = useAuth();
  const pathname = usePathname();
  const promptedPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loading && !user && promptedPathnameRef.current !== pathname) {
      openLoginModal();
      promptedPathnameRef.current = pathname;
    }
  }, [loading, user, pathname, openLoginModal]);

  return <>{children}</>;
}
