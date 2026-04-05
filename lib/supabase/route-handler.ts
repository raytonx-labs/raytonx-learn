import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function createSupabaseRouteHandlerClient(request: Request, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") ?? "";

          if (!cookieHeader) return [];

          return cookieHeader
            .split(";")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
              const [name, ...rest] = part.split("=");
              return {
                name,
                value: rest.join("="),
              };
            });
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          response.headers.set("Cache-Control", "private, no-store");
        },
      },
    },
  );
}
