import { Database } from "./supabase";

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
