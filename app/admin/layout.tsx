// Fichier: app/admin/layout.tsx
import DashboardNavbar from "@/components/DashboardNavbar";
import { getCurrentUser } from "@/lib/data";
import { redirect, notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. On récupère l'utilisateur via le cookie (Côté Serveur)
  const user = await getCurrentUser();

  // 2. Si personne n'est connecté -> Dehors (Login)
  if (!user) {
    redirect("/login");
  }

  // 3. Si c'est un STUDENT qui essaie d'entrer -> 404 (Interdit)
  // Utiliser notFound() est mieux que redirect() ici car cela cache l'existence de l'admin
  if (user.role !== "ADMIN") {
    notFound(); 
  }

  // 4. Si c'est un ADMIN, on affiche la page
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      {/* Navbar Version Admin */}
      <DashboardNavbar role="ADMIN" />

      {/* Contenu principal */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}