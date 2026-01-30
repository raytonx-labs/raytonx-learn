"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const data = Object.fromEntries(formData);

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  });

  if (error) redirect("/login?message=Could not authenticate user");

  revalidatePath("/", "layout");
  redirect("/courses"); // 登录成功跳转到课程页
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const data = Object.fromEntries(formData);

  const { error } = await supabase.auth.signUp({
    email: data.email as string,
    password: data.password as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) redirect("/login?message=Could not initialize signup");

  redirect("/login?message=Check your email to continue"); // 提醒用户去 Resend 发出的邮件里激活
}
