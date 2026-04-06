import { type NextRequest } from "next/server";

import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Routes Proxy should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|opengraph-image|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)",
  ],
};
