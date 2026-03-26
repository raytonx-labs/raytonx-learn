import { cache } from "react";
import "server-only";

import { createSupabaseServerClient } from "./server";

export const getCurrentUser = cache(async () => {
  const {
    data: { user },
  } = await (await createSupabaseServerClient()).auth.getUser();
  if (!user?.id) {
    return { isAuth: false, user: null };
  } else {
    return { isAuth: true, user };
  }
});
