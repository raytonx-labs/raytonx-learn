import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

import { createSupabaseServerClient } from "./server";

export const getCurrentUser = cache(async () => {
  const {
    data: { user },
  } = await (await createSupabaseServerClient()).auth.getUser();
  if (!user?.id) {
    redirect("/login");
  }
  return { isAuth: true, user };
});
