import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "";

  if (!next.startsWith("/")) next = "";

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const siteUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  if (!code) {
    return NextResponse.redirect(`${siteUrl}${basePath}?message=code is required`);
  }

  const successUrl = `${siteUrl}${basePath}${next}`;
  const failureUrl = `${siteUrl}${basePath}?message=Auth failed`;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(error || !data.session ? failureUrl : successUrl);
}
