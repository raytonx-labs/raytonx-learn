import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default async function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
