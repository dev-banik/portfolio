"use client";

import { motion } from "framer-motion";
import { FolderKanban, FileText, MessageSquare, Code2, Award, Star, Users, TrendingUp } from "lucide-react";
import { useData } from "@/hooks/useData";

interface DashboardStats {
  totalProjects: number;
  totalBlogs: number;
  totalMessages: number;
  unreadMessages: number;
  totalSkills: number;
  totalCertifications: number;
  totalTestimonials: number;
  totalVisitors: number;
}

function StatCard({ title, value, icon: Icon, color, sub }: { title: string; value: number; icon: any; color: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: stats, loading } = useData<DashboardStats>("/dashboard/stats");

  const cards = [
    { title: "Total Projects", value: stats?.totalProjects ?? 0, icon: FolderKanban, color: "bg-indigo-500", sub: "All projects" },
    { title: "Published Blogs", value: stats?.totalBlogs ?? 0, icon: FileText, color: "bg-purple-500", sub: "Published posts" },
    { title: "Messages", value: stats?.totalMessages ?? 0, icon: MessageSquare, color: "bg-blue-500", sub: `${stats?.unreadMessages ?? 0} unread` },
    { title: "Skills", value: stats?.totalSkills ?? 0, icon: Code2, color: "bg-emerald-500", sub: "Across all categories" },
    { title: "Certifications", value: stats?.totalCertifications ?? 0, icon: Award, color: "bg-amber-500", sub: "Credentials" },
    { title: "Testimonials", value: stats?.totalTestimonials ?? 0, icon: Star, color: "bg-pink-500", sub: "Client reviews" },
    { title: "Visitors", value: stats?.totalVisitors ?? 0, icon: Users, color: "bg-cyan-500", sub: "Total visits" },
    { title: "Growth", value: 100, icon: TrendingUp, color: "bg-rose-500", sub: "Performance index" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome to your portfolio management system</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-5 border border-white/5">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Add Project", href: "/admin/projects/new", color: "from-indigo-500 to-purple-600" },
            { label: "Write Blog", href: "/admin/blog/new", color: "from-purple-500 to-pink-600" },
            { label: "Add Skill", href: "/admin/skills", color: "from-emerald-500 to-teal-600" },
            { label: "View Messages", href: "/admin/contact", color: "from-blue-500 to-cyan-600" },
          ].map((action) => (
            <a key={action.label} href={action.href} className={`py-3 px-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-sm font-medium text-center hover:opacity-90 hover:scale-[1.02] transition-all`}>
              {action.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
