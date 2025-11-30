// Fichier: app/admin/layout.tsx
import DashboardNavbar from "@/components/DashboardNavbar";
import { getCurrentUser } from "@/lib/data";
import { redirect, notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      {/* On passe le nom ici */}
      <DashboardNavbar role="ADMIN" userName={user.name} />

      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}