// Fichier: app/dashboard/layout.tsx
import DashboardNavbar from "@/components/DashboardNavbar";
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* On passe le nom ici */}
      <DashboardNavbar role="STUDENT" userName={user.name} />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}