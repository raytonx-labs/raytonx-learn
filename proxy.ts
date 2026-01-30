import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "./lib/supabase/server";

// 指定公开路由和保护的路由
const publicRoutes = ["/login", "/courses"];

export default async function proxy(req: NextRequest) {
  // 检查路由是否是公开
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const requestHeaders = req.headers;

  if (isPublicRoute) {
    requestHeaders.set("x-auth-required", "false");
    return NextResponse.next();
  }

  // 检查用户状态
  const {
    data: { user },
  } = await (await createSupabaseServerClient()).auth.getUser();

  // 未授权用户重定向
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
