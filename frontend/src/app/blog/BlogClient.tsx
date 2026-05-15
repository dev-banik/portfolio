"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Clock, Eye, Calendar, Tag, Home } from "lucide-react";
import api from "@/lib/api";
import type { Blog, BlogCategory } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BlogClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (cat = activeCategory, q = search, p = page) => {
    setLoading(true);
    try {
      const { data } = await api.get("/blog", { params: { categoryId: cat || undefined, search: q || undefined, page: p, pageSize: 9 } });
      setBlogs(data.data ?? []);
      setTotalPages(data.totalPages ?? 1);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    api.get("/blog/categories").then(r => setCategories(r.data));
    fetchBlogs();
  }, []);

  const handleCategory = (id: string) => {
    setActiveCategory(id); setPage(1); fetchBlogs(id, search, 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setPage(1); fetchBlogs(activeCategory, search, 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Home size={14} /> Home
        </Link>
        <span>/</span>
        <span className="text-slate-300">Blog</span>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-12 p-10 md:p-16 text-center"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(236,72,153,0.06) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl" />
          <div className="absolute bottom-8 left-12 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl" />
        </div>
        <div className="relative z-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full mb-4">Writing</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            The <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-6">
            Thoughts on backend engineering, .NET, system design, and everything in between.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" /> .NET & C#</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" /> System Design</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" /> Career & Tips</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleCategory("")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === "" ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>All</button>
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
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No articles found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col"
            >
              {blog.coverImageUrl ? (
                <div className="h-48 overflow-hidden flex-shrink-0">
                  <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex-shrink-0" />
              )}
              <div className="p-5 flex flex-col flex-1">
                {blog.categoryName && (
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full self-start mb-2">{blog.categoryName}</span>
                )}
                <h2 className="text-white font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{blog.excerpt}</p>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-slate-500 flex items-center gap-1"><Tag size={10} />{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-500 text-xs pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(blog.publishedAt ?? blog.createdAt)}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock size={11} /> {blog.readTimeMinutes}m</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {blog.viewCount}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { setPage(p); fetchBlogs(activeCategory, search, p); }} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === p ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
