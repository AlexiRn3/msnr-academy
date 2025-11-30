// Fichier: app/admin/layout.tsx
import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: BookOpen, label: "Formations", href: "/admin/courses" },
    { icon: Users, label: "Étudiants", href: "/admin/users" },
    { icon: Settings, label: "Réglages", href: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      {/* Sidebar - Style "Trading Panel" */}
      <aside className="w-64 border-r border-white/10 bg-surface flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tighter text-white">
            MSNR <span className="text-primary">ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-white/5 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  );
}