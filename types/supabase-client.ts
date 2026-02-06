import type { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "./supabase";

export type TypedSupabaseClient = SupabaseClient<Database>;
