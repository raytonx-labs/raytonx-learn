import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default async function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
