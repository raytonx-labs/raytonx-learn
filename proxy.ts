import { NextRequest, NextResponse } from "next/server";

import { createClient } from "./lib/supabase/server";

// 指定公开路由和保护的路由
const publicRoutes = ["/login", "/"];

export default async function proxy(req: NextRequest) {
  // 检查路由是否是公开
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 检查用户状态
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();

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
