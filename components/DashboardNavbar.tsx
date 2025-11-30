"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Users, 
  GraduationCap, 
  BarChart 
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardNavbarProps {
  role: "ADMIN" | "STUDENT";
}

export default function DashboardNavbar({ role }: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Définition des menus selon le rôle
  const menus = {
    ADMIN: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Courses", href: "/admin/courses", icon: BookOpen },
      { label: "Students", href: "/admin/users", icon: Users },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
    STUDENT: [
      { label: "My Space", href: "/dashboard", icon: LayoutDashboard },
      { label: "My Courses", href: "/dashboard/courses", icon: GraduationCap },
      { label: "Progress", href: "/dashboard/progress", icon: BarChart },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ]
  };

  const currentMenu = menus[role];

  const handleLogout = () => {
    // Ici, on supprimerait le cookie de session en vrai
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-tighter text-white">
            MSNR <span className="text-blue-500">ACADEMY</span>
          </Link>
          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wide rounded border ${
            role === "ADMIN" 
              ? "bg-red-500/10 text-red-500 border-red-500/20" 
              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
          }`}>
            {role} PANEL
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {currentMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative px-4 py-2 group">
                <div className="flex items-center gap-2 relative z-10">
                  <item.icon className={`w-4 h-4 transition-colors ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`} />
                  <span className={`text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`}>
                    {item.label}
                  </span>
                </div>
                {/* Petit trait actif */}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white/5 rounded-lg border border-white/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-white">
              {role === "ADMIN" ? "Administrator" : "Student Account"}
            </span>
            <span className="text-[10px] text-gray-500">Online</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}