// Fichier: components/DashboardNavbar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, Settings, LogOut, Users, 
  GraduationCap, BarChart, ChevronDown, Plus, List, LucideIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";

interface DashboardNavbarProps {
  role: "ADMIN" | "STUDENT";
  userName?: string | null;
}

// Définition explicite du type pour éviter l'erreur TypeScript
interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  submenu?: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[];
}

export default function DashboardNavbar({ role, userName }: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // On type explicitement l'objet menus
  const menus: Record<"ADMIN" | "STUDENT", MenuItem[]> = {
    ADMIN: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { 
        label: "Courses", 
        href: "/admin/courses", 
        icon: BookOpen,
        submenu: [
          { label: "All Courses", href: "/admin/courses", icon: List },
          { label: "Add New", href: "/admin/courses/new", icon: Plus },
        ]
      },
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

  const handleLogout = async () => {
    await logoutAction();
  };

  const displayName = userName || (role === "ADMIN" ? "Administrator" : "Student");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
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

        {/* Navigation avec Dropdown */}
        <nav className="hidden md:flex items-center gap-1">
          {currentMenu.map((item) => {
            // Vérifie si l'item ou un de ses sous-menus est actif
            const isSubmenuActive = item.submenu?.some(sub => pathname === sub.href);
            const isActive = pathname === item.href || isSubmenuActive;
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div 
                key={item.label} 
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link 
                  href={item.href} 
                  className={`relative px-4 py-2 group flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {hasSubmenu && <ChevronDown className="w-3 h-3 opacity-50" />}
                  
                  {isActive && !hoveredMenu && (
                    <motion.div 
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/5 rounded-lg border border-white/5 -z-10"
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {hasSubmenu && hoveredMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-48 pt-2"
                    >
                      <div className="bg-[#121212] border border-white/10 rounded-xl shadow-xl overflow-hidden p-1">
                        {item.submenu!.map((subItem) => (
                          <Link 
                            key={subItem.href} 
                            href={subItem.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <subItem.icon className="w-4 h-4" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-white">{displayName}</span>
            <span className="text-[10px] text-gray-500">Online</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}