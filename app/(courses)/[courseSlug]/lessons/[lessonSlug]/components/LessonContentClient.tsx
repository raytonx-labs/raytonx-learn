"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";

import { LessonContentLoginPrompt } from "./LessonContentLoginPrompt";

type LessonContentResponse = {
  mdxSource: MDXRemoteSerializeResult;
};

type FullContentStatus = "preview" | "loading" | "error" | "ready";

function isValidMdxSource(value: unknown): value is MDXRemoteSerializeResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as MDXRemoteSerializeResult).compiledSource === "string";
}

export function LessonContentClient({
  courseSlug,
  lessonSlug,
  lessonName,
  preview,
}: {
  courseSlug: string;
  lessonSlug: string;
  lessonName: string;
  preview: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [fullSource, setFullSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [status, setStatus] = useState<FullContentStatus>("preview");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setStatus("preview");
      setFullSource(null);
      return;
    }

    if (fullSource) {
      return;
    }

    let cancelled = false;

    const fetchFullContent = async () => {
      try {
        setStatus("loading");
        setFetchError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_PATH}/api/content/${process.env.NEXT_PUBLIC_BASE_PATH}/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch lesson content: ${response.status}`);
        }

        const data = (await response.json()) as LessonContentResponse;

        if (!isValidMdxSource(data.mdxSource)) {
          throw new Error("Invalid lesson content payload");
        }

        if (!cancelled) {
          setFullSource(data.mdxSource);
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("LessonContentClient fetch error:", error);
          setStatus("error");
          setFetchError("完整内容加载失败，请稍后重试。");
        }
      }
    };

    fetchFullContent();

    return () => {
      cancelled = true;
    };
  }, [courseSlug, fullSource, lessonSlug, loading, user]);

  if (fullSource) {
    return (
      <article className="prose prose-neutral max-w-none">
        <MDXRemote {...fullSource} />
      </article>
    );
  }

  return (
    <div className="relative">
      {preview}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/95 to-transparent" />
      <div className="relative z-10 -mt-12 rounded-2xl border border-border/60 bg-background/95 p-6 shadow-sm backdrop-blur">
        <LessonContentLoginPrompt
          lessonName={lessonName}
          status={status}
          errorMessage={fetchError}
        />
      </div>
    </div>
  );
}
