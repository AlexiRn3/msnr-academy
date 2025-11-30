// Fichier: app/dashboard/layout.tsx
import DashboardNavbar from "@/components/DashboardNavbar";
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Vérification de session
  const user = await getCurrentUser();

  // 2. Pas connecté ? -> Login
  if (!user) {
    redirect("/login");
  }

  // (Optionnel) Si un ADMIN va sur le dashboard étudiant, on peut le laisser passer 
  // pour qu'il puisse voir ce que voient les élèves.

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Version Étudiant */}
      <DashboardNavbar role="STUDENT" />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}