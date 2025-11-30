"use client";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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