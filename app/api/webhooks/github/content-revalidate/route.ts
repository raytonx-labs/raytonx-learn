import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getLessonContentTagByMdxPath } from "@/lib/content/get-lesson-content";
import { supabaseStaticClient } from "@/lib/supabase/static";
import { getGitHubWebhookSecret, verifyGitHubWebhookSignature } from "@/lib/webhooks/github";
import { listLessonsByMdxPaths } from "@/services/lessons/detail";

type GitHubPushPayload = {
  commits?: Array<{
    added?: string[];
    modified?: string[];
    removed?: string[];
  }>;
};

const REVALIDATE_TAG_PROFILE = "max";

function getChangedPaths(payload: GitHubPushPayload) {
  const paths = new Set<string>();

  for (const commit of payload.commits ?? []) {
    for (const path of commit.added ?? []) {
      paths.add(path);
    }

    for (const path of commit.modified ?? []) {
      paths.add(path);
    }

    for (const path of commit.removed ?? []) {
      paths.add(path);
    }
  }

  return [...paths];
}

export async function POST(request: Request) {
  const event = request.headers.get("x-github-event");

  if (event !== "push") {
    return NextResponse.json({ ok: true, ignored: true, reason: "Unsupported event" });
  }

  const payloadText = await request.text();

  let secret: string;

  try {
    secret = getGitHubWebhookSecret();
  } catch (error) {
    console.error("GitHub webhook config error:", error);
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyGitHubWebhookSignature(payloadText, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: GitHubPushPayload;

  try {
    payload = JSON.parse(payloadText) as GitHubPushPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const changedPaths = getChangedPaths(payload);

  if (changedPaths.length === 0) {
    return NextResponse.json({
      ok: true,
      revalidatedLessons: 0,
      matchedPaths: [],
      unmatchedPaths: [],
    });
  }

  try {
    console.log("GitHub webhook received, changed paths:", changedPaths);
    const lessons = await listLessonsByMdxPaths(supabaseStaticClient, changedPaths);
    const matchedPaths = new Set<string>();

    for (const lesson of lessons) {
      const courseSlug = lesson.courses?.slug;

      if (!courseSlug) {
        continue;
      }

      matchedPaths.add(lesson.mdx_path);
      revalidateTag(getLessonContentTagByMdxPath(lesson.mdx_path), REVALIDATE_TAG_PROFILE);
      revalidatePath(`/courses/${courseSlug}/lessons/${lesson.slug}`);
    }

    return NextResponse.json({
      ok: true,
      revalidatedLessons: lessons.length,
      matchedPaths: [...matchedPaths],
      unmatchedPaths: changedPaths.filter((path) => !matchedPaths.has(path)),
    });
  } catch (error) {
    console.error("GitHub webhook revalidation error:", error);
    return NextResponse.json({ error: "Failed to revalidate content" }, { status: 500 });
  }
}
