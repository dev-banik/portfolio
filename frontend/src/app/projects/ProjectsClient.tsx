"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, GitFork, Star, Search, ArrowLeft, Home } from "lucide-react";
import api from "@/lib/api";
import type { Project, ProjectCategory } from "@/types";

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async (cat = activeCategory, q = search, p = page) => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects", { params: { categoryId: cat || undefined, search: q || undefined, page: p, pageSize: 9 } });
      setProjects(data.data?.data ?? []);
      setTotalPages(data.data?.totalPages ?? 1);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    api.get("/projects/categories").then(r => setCategories(r.data.data ?? []));
    fetchProjects();
  }, []);

  const handleCategory = (id: string) => {
    setActiveCategory(id); setPage(1); fetchProjects(id, search, 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setPage(1); fetchProjects(activeCategory, search, 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Home size={14} /> Home
        </Link>
        <span>/</span>
        <span className="text-slate-300">Projects</span>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-12 p-10 md:p-16 text-center"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(167,139,250,0.08) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="absolute bottom-8 right-12 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl" />
        </div>
        <div className="relative z-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-4">Portfolio</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-6">
            A collection of things I've built — from full-stack web apps to APIs and developer tools.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" /> Full-Stack Apps</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" /> APIs & Backend</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" /> Open Source</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleCategory("")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === "" ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => handleCategory(c.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === c.id ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No projects found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all group"
            >
              {project.thumbnailUrl ? (
                <div className="h-48 overflow-hidden">
                  <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                  <span className="text-4xl font-bold gradient-text opacity-30">{project.title[0]}</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-bold text-lg leading-tight">{project.title}</h3>
                  {project.isFeatured && <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0 mt-1" />}
                </div>
                {project.categoryName && (
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{project.categoryName}</span>
                )}
                <p className="text-slate-400 text-sm mt-3 line-clamp-2">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.techStackList?.slice(0, 4).map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs bg-white/5 text-slate-400 rounded-full">{t}</span>
                  ))}
                  {(project.techStackList?.length ?? 0) > 4 && (
                    <span className="px-2 py-0.5 text-xs bg-white/5 text-slate-500 rounded-full">+{project.techStackList!.length - 4}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <Link href={`/projects/${project.slug}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                    View Details →
                  </Link>
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <GitFork size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { setPage(p); fetchProjects(activeCategory, search, p); }} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === p ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
