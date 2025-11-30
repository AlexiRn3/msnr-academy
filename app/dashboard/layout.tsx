"use client";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Version Étudiant */}
      <DashboardNavbar role="STUDENT" />
      
      {/* Le contenu des pages (padding-top pour ne pas être caché par la navbar fixe) */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}