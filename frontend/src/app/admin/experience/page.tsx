"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Briefcase, X, Save, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { Experience } from "@/types";
import { formatMonthYear } from "@/lib/utils";

const empty: Partial<Experience> = { company: "", role: "", location: "", employmentType: "Full-time", startDate: new Date().toISOString().split("T")[0], isCurrent: false, description: "", techStack: "", displayOrder: 0 };

export default function AdminExperiencePage() {
  const { data: items, loading, refetch } = useData<Experience[]>("/experience");
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Experience> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (modal.data.id) await api.put(`/experience/${modal.data.id}`, modal.data);
      else await api.post("/experience", modal.data);
      toast.success("Saved!"); setModal({ open: false, data: empty }); refetch();
    } catch { toast.error("Failed."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await api.delete(`/experience/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const set = (key: keyof Experience, value: any) => setModal(m => ({ ...m, data: { ...m.data, [key]: value } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Briefcase size={22} /> Experience</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your work experience</p>
        </div>
        <button onClick={() => setModal({ open: true, data: empty })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {loading ? <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div> : (
        <div className="space-y-4">
          {(items ?? []).map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold">{item.role}</h3>
                  <p className="text-indigo-400 text-sm">{item.company} · {item.employmentType}</p>
                  <div className="flex items-center gap-4 text-slate-500 text-xs mt-1">
                    <span className="flex items-center gap-1"><Calendar size={11} />{formatMonthYear(item.startDate)} — {item.isCurrent ? "Present" : item.endDate ? formatMonthYear(item.endDate) : "Present"}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{item.location}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                  {item.techStackList?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.techStackList.slice(0, 5).map(t => <span key={t} className="px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ open: true, data: { ...item, startDate: item.startDate.split("T")[0], endDate: item.endDate?.split("T")[0] } })} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={15} /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="text-white font-semibold">{modal.data.id ? "Edit" : "Add"} Experience</h3>
                <button onClick={() => setModal({ open: false, data: empty })} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {[["Company", "company"], ["Role", "role"], ["Location", "location"], ["Employment Type", "employmentType"]].map(([label, field]) => (
                  <div key={field}>
                    <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                    <input value={(modal.data as any)[field] ?? ""} onChange={e => set(field as any, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Start Date</label>
                  <input type="date" value={(modal.data.startDate as string) ?? ""} onChange={e => set("startDate", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">End Date</label>
                  <input type="date" value={(modal.data.endDate as string) ?? ""} onChange={e => set("endDate", e.target.value)} disabled={modal.data.isCurrent} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all disabled:opacity-40" />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <input type="checkbox" id="current" checked={modal.data.isCurrent ?? false} onChange={e => set("isCurrent", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                  <label htmlFor="current" className="text-slate-300 text-sm">Currently working here</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 text-xs mb-1 block">Description</label>
                  <textarea value={modal.data.description ?? ""} onChange={e => set("description", e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 text-xs mb-1 block">Tech Stack (comma separated)</label>
                  <input value={modal.data.techStack ?? ""} onChange={e => set("techStack", e.target.value)} placeholder="C#, .NET Core, SQL Server..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
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
