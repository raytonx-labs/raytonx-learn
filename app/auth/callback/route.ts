import { NextRequest, NextResponse } from "next/server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "";
  if (!next.startsWith("/")) {
    next = "";
  }

  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const siteUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  if (!code) {
    return NextResponse.redirect(`${siteUrl}${BASE_PATH}?message=code is required`);
  }

  const successUrl = `${siteUrl}${BASE_PATH}${next}`;
  const failureUrl = `${siteUrl}${BASE_PATH}?message=Auth failed`;
  const successResponse = NextResponse.redirect(successUrl);
  const supabase = createSupabaseRouteHandlerClient(request, successResponse);
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    successResponse.headers.set("location", failureUrl);
  }
  return successResponse;
}
