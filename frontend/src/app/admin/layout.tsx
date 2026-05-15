"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Code2, Briefcase, GraduationCap, FolderKanban,
  FileText, Award, Star, MessageSquare, Navigation, Settings, LogOut,
  Menu, X, ChevronRight, Bell
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/contact", label: "Messages", icon: MessageSquare },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    clearAuth();
    router.push("/admin/login");
    toast.success("Logged out successfully.");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Code2 size={16} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-bold text-white text-sm">Portfolio Admin</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              {sidebarOpen && isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className={`flex items-center gap-3 px-3 py-2 mb-2 ${sidebarOpen ? "" : "justify-center"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0] ?? "A"}
          </div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-slate-500 text-xs truncate">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full ${sidebarOpen ? "" : "justify-center"}`}
        >
          <LogOut size={16} />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07070e] flex">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col glass border-r border-white/5 transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(!mobileOpen); }} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <Menu size={18} />
            </button>
            <Link href="/" target="_blank" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
              ← View Portfolio
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
