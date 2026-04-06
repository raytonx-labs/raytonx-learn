import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "";

  if (!next.startsWith("/")) next = "";

  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const siteUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  if (!code) {
    return NextResponse.redirect(`${siteUrl}${BASE_PATH}?message=code is required`);
  }

  const successUrl = `${siteUrl}${BASE_PATH}${next}`;
  const failureUrl = `${siteUrl}${BASE_PATH}?message=Auth failed`;

  const cookiesToSet: CookieToSet[] = [];
  let cookiesWritten = false;
  let resolveCookiesWritten: (() => void) | null = null;
  const cookiesWrittenPromise = new Promise<void>((resolve) => {
    resolveCookiesWritten = resolve;
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(newCookies) {
          cookiesToSet.push(...newCookies);
          cookiesWritten = true;
          resolveCookiesWritten?.();
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error && data.session && !cookiesWritten) {
    await cookiesWrittenPromise;
  }

  const response = NextResponse.redirect(error || !data.session ? failureUrl : successUrl);

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  response.headers.set("Cache-Control", "private, no-store");

  return response;
}
