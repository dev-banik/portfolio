"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, FileText, X, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { Blog, BlogCategory } from "@/types";
import { formatDate } from "@/lib/utils";

const empty: Partial<Blog> = { title: "", excerpt: "", content: "", tags: [], isPublished: false, readTimeMinutes: 5, metaTitle: "", metaDescription: "" };

export default function AdminBlogPage() {
  const { data: blogsData, loading, refetch } = useData<any>("/blog", { params: { pageSize: 50, adminView: true } });
  const { data: categories } = useData<BlogCategory[]>("/blog/categories");
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Blog> & { tagsStr?: string } }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);
  const blogs: Blog[] = blogsData?.data ?? [];

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...modal.data, tags: modal.data.tagsStr ?? (modal.data.tags ?? []).join(", ") };
      if (modal.data.id) await api.put(`/blog/${modal.data.id}`, payload);
      else await api.post("/blog", payload);
      toast.success("Blog saved!"); setModal({ open: false, data: empty }); refetch();
    } catch { toast.error("Failed."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try { await api.delete(`/blog/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const set = (key: string, value: any) => setModal(m => ({ ...m, data: { ...m.data, [key]: value } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText size={22} /> Blog</h1>
          <p className="text-slate-400 text-sm mt-1">{blogs.length} posts</p>
        </div>
        <button onClick={() => setModal({ open: true, data: empty })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div> : (
        <div className="space-y-3">
          {blogs.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4 border border-white/5 hover:border-indigo-500/20 transition-all group flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${item.isPublished ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-1">{item.excerpt}</p>
                <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                  <span>{formatDate(item.publishedAt ?? item.createdAt)}</span>
                  {item.categoryName && <span>· {item.categoryName}</span>}
                  <span>· {item.readTimeMinutes} min read</span>
                  <span>· {item.viewCount} views</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal({ open: true, data: { ...item, tagsStr: item.tags.join(", ") } })} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={15} /></button>
                <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="text-white font-semibold">{modal.data.id ? "Edit" : "New"} Blog Post</h3>
                <button onClick={() => setModal({ open: false, data: empty })} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Title *</label>
                  <input value={modal.data.title ?? ""} onChange={e => set("title", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Excerpt</label>
                  <textarea value={modal.data.excerpt ?? ""} onChange={e => set("excerpt", e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Content (Markdown supported)</label>
                  <textarea value={modal.data.content ?? ""} onChange={e => set("content", e.target.value)} rows={10} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none font-mono" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Cover Image URL</label>
                    <input value={modal.data.coverImageUrl ?? ""} onChange={e => set("coverImageUrl", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Category</label>
                    <select value={modal.data.categoryId ?? ""} onChange={e => set("categoryId", e.target.value || undefined)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                      <option value="">No category</option>
                      {(categories ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Tags (comma separated)</label>
                    <input value={modal.data.tagsStr ?? ""} onChange={e => set("tagsStr", e.target.value)} placeholder=".NET, C#, API..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Read Time (minutes)</label>
                    <input type="number" value={modal.data.readTimeMinutes ?? 5} onChange={e => set("readTimeMinutes", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="published" checked={modal.data.isPublished ?? false} onChange={e => set("isPublished", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                  <label htmlFor="published" className="text-slate-300 text-sm">Published</label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/5">
                <button onClick={() => setModal({ open: false, data: empty })} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
