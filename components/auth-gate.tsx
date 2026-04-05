"use client";

import { useEffect } from "react";

import { useAuth } from "./auth-provider";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, openLoginModal } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      openLoginModal();
    }
  }, [loading, user, openLoginModal]);

  return <>{children}</>;
}
