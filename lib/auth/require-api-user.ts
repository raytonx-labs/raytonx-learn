import { type User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import "server-only";

import { getCurrentUser } from "@/lib/supabase/auth";

type RequireApiUserResult =
  | {
      user: User;
      unauthorizedResponse: null;
    }
  | {
      user: null;
      unauthorizedResponse: NextResponse;
    };

export async function requireApiUser(): Promise<RequireApiUserResult> {
  const { isAuth, user } = await getCurrentUser();

  if (!isAuth || !user) {
    return {
      user: null,
      unauthorizedResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    user,
    unauthorizedResponse: null,
  };
}
