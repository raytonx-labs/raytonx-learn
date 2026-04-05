"use client";

import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { LoginModal } from "./login-modal";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

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

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        openLoginModal,
        closeLoginModal,
        signOut,
      }}
    >
      {children}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </AuthContext.Provider>
  );
}
