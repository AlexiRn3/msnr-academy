// Fichier: app/courses/layout.tsx
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/data"; // On récupère la fonction qui lit le cookie

export default async function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getCurrentUser();

  const role = user?.role === "ADMIN" ? "ADMIN" : "STUDENT";

  return (
    <div className="flex flex-col min-h-screen">

      <DashboardNavbar role={role} userName={user?.name} />
      
      <main className="flex-1 pt-20">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}