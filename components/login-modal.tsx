"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createSupabaseBrowserClient();

  const createCallbackUrl = () => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const callbackUrl = new URL(`${basePath}/auth/callback`, process.env.NEXT_PUBLIC_SITE_URL!);

    if (typeof window !== "undefined") {
      const nextPath = `${window.location.pathname}${window.location.search}`;
      const relativeNextPath =
        basePath && nextPath.startsWith(basePath)
          ? nextPath.slice(basePath.length) || "/"
          : nextPath;

      callbackUrl.searchParams.set("next", relativeNextPath);
    }

    return callbackUrl.toString();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        onOpenChange(false);
        window.location.reload();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: createCallbackUrl(),
        },
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("请检查您的邮箱以确认账号");
      }
    }

    setLoading(false);
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: createCallbackUrl(),
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setMessage("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm();
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-center">
            {mode === "login" ? "欢迎回来" : "创建账号"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {mode === "login" ? "登录以查看完整方案说明" : "创建账号以查看完整方案说明"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* OAuth Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-10 font-normal"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 继续
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 font-normal"
              onClick={() => handleOAuthLogin("github")}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              使用 GitHub 继续
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="modal-email" className="text-sm font-normal">
                邮箱
              </Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-password" className="text-sm font-normal">
                密码
              </Label>
              <Input
                id="modal-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            {message && <p className="text-sm text-center text-muted-foreground">{message}</p>}

            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? "加载中..." : mode === "login" ? "登录" : "注册"}
            </Button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                {"还没有账号？"}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  去注册
                </button>
              </>
            ) : (
              <>
                已经有账号了？
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  去登录
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
