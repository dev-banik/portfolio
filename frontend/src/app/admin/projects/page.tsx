"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, FolderKanban, X, Save, ExternalLink, GitFork, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { Project, ProjectCategory, ApiResponse } from "@/types";

const empty: Partial<Project> = { title: "", shortDescription: "", description: "", techStack: "", isFeatured: false, status: "Completed", displayOrder: 0 };

export default function AdminProjectsPage() {
  const { data: projectsData, loading, refetch } = useData<any>("/projects", { params: { pageSize: 50 } });
  const { data: categories } = useData<ProjectCategory[]>("/projects/categories");
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Project> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);
  const projects: Project[] = projectsData?.data ?? [];

  const save = async () => {
    setSaving(true);
    try {
      if (modal.data.id) await api.put(`/projects/${modal.data.id}`, modal.data);
      else await api.post("/projects", modal.data);
      toast.success("Saved!"); setModal({ open: false, data: empty }); refetch();
    } catch { toast.error("Failed."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try { await api.delete(`/projects/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const set = (key: keyof Project, value: any) => setModal(m => ({ ...m, data: { ...m.data, [key]: value } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FolderKanban size={22} /> Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projects</p>
        </div>
        <button onClick={() => setModal({ open: true, data: empty })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? <div className="grid md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold truncate">{item.title}</h3>
                    {item.isFeatured && <Star size={13} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                  </div>
                  {item.categoryName && <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{item.categoryName}</span>}
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.techStackList?.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 text-xs bg-white/5 text-slate-400 rounded-full">{t}</span>)}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 flex items-center gap-1 hover:underline"><ExternalLink size={11} /> Live</a>}
                    {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 flex items-center gap-1 hover:underline"><GitFork size={11} /> Code</a>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => setModal({ open: true, data: item })} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="text-white font-semibold">{modal.data.id ? "Edit" : "Add"} Project</h3>
                <button onClick={() => setModal({ open: false, data: empty })} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-slate-400 text-xs mb-1 block">Title *</label>
                  <input value={modal.data.title ?? ""} onChange={e => set("title", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 text-xs mb-1 block">Short Description</label>
                  <input value={modal.data.shortDescription ?? ""} onChange={e => set("shortDescription", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 text-xs mb-1 block">Description</label>
                  <textarea value={modal.data.description ?? ""} onChange={e => set("description", e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Live URL</label>
                  <input value={modal.data.liveUrl ?? ""} onChange={e => set("liveUrl", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">GitHub URL</label>
                  <input value={modal.data.githubUrl ?? ""} onChange={e => set("githubUrl", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Thumbnail URL</label>
                  <input value={modal.data.thumbnailUrl ?? ""} onChange={e => set("thumbnailUrl", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Category</label>
                  <select value={modal.data.categoryId ?? ""} onChange={e => set("categoryId", e.target.value || undefined)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                    <option value="">No category</option>
                    {(categories ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 text-xs mb-1 block">Tech Stack (comma separated)</label>
                  <input value={modal.data.techStack ?? ""} onChange={e => set("techStack", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" placeholder="C#, .NET, PostgreSQL..." />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Status</label>
                  <select value={modal.data.status ?? "Completed"} onChange={e => set("status", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                    {["Completed", "In Progress", "Archived", "Planned"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Display Order</label>
                  <input type="number" value={modal.data.displayOrder ?? 0} onChange={e => set("displayOrder", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={modal.data.isFeatured ?? false} onChange={e => set("isFeatured", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                  <label htmlFor="featured" className="text-slate-300 text-sm">Featured project</label>
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
