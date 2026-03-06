// app/page.tsx
import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect("/courses");
}
