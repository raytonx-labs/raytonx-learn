import { TypedSupabaseClient } from "@/types/supabase-client";

import { lessonByIdQuery } from "./queries";

export const getLessonById = async (supabase: TypedSupabaseClient, lessonId: string) => {
  const { data, error } = await lessonByIdQuery(supabase, lessonId).single();

  if (error) throw error;

  return data;
};
