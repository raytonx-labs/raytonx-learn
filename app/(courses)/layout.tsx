import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function CoursesLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar initialUser={user} />

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
