import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "./lib/supabase/server";

// 指定公开路由和保护的路由
const PROTECTED_PREFIXES = ["/dashboard", "/profile"];

export default async function proxy(req: NextRequest) {
  // 检查是否是受保护的路由
  const path = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 先做“乐观检查”（是否有 token）
  const hasAuthCookie = req.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"));

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL(`${req.nextUrl.basePath}/login`, req.url));
  }

  // 检查用户状态
  const {
    data: { user },
  } = await (await createSupabaseServerClient()).auth.getUser();

  // 未授权用户重定向
  if (!user) {
    return NextResponse.redirect(new URL(`${req.nextUrl.basePath}/login`, req.nextUrl));
  }
  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|opengraph-image|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)",
  ],
};
