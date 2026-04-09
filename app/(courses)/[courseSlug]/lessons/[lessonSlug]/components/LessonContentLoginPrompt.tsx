"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export function LessonContentLoginPrompt({
  lessonName,
  status = "preview",
  errorMessage,
}: {
  lessonName: string;
  status?: "preview" | "loading" | "error" | "ready";
  errorMessage?: string | null;
}) {
  const { openLoginModal, user } = useAuth();
  const isLoggedIn = !!user;
  const isLoadingFullContent = status === "loading";
  const hasError = status === "error";

  return (
    <div className="flex flex-col items-start gap-3 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          {isLoggedIn
            ? isLoadingFullContent
              ? "正在为你加载完整内容"
              : hasError
                ? "完整内容加载失败"
                : "已登录，准备继续阅读"
            : "登录后继续阅读完整内容"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isLoggedIn
            ? isLoadingFullContent
              ? `已检测到你的登录状态，正在加载《${lessonName}》的完整内容。`
              : hasError
                ? `《${lessonName}》的完整内容暂时加载失败，你可以稍后重试。`
                : `已检测到你的登录状态，完整内容即将替换当前预览。`
            : `当前仅展示《${lessonName}》的部分内容。页面加载时会自动弹出登录框，若你刚刚关闭了它，点击下面按钮可再次继续登录。`}
        </p>
      </div>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {!isLoggedIn ? (
        <Button onClick={openLoginModal}>登录后继续</Button>
      ) : isLoadingFullContent ? (
        <Button disabled>正在加载...</Button>
      ) : null}
    </div>
  );
}
