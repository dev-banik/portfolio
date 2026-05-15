"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Star, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { Testimonial } from "@/types";

const empty: Partial<Testimonial> = { clientName: "", clientRole: "", clientCompany: "", content: "", rating: 5, displayOrder: 0, isFeatured: false };

export default function AdminTestimonialsPage() {
  const { data: items, loading, refetch } = useData<Testimonial[]>("/testimonials");
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Testimonial> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (modal.data.id) await api.put(`/testimonials/${modal.data.id}`, modal.data);
      else await api.post("/testimonials", modal.data);
      toast.success("Saved!"); setModal({ open: false, data: empty }); refetch();
    } catch { toast.error("Failed."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await api.delete(`/testimonials/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const set = (key: keyof Testimonial, value: any) => setModal(m => ({ ...m, data: { ...m.data, [key]: value } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Star size={22} /> Testimonials</h1>
          <p className="text-slate-400 text-sm mt-1">Client reviews and testimonials</p>
        </div>
        <button onClick={() => setModal({ open: true, data: empty })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? <div className="grid md:grid-cols-2 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {(items ?? []).map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />)}
                  </div>
                  <p className="text-slate-300 text-sm italic mb-3 line-clamp-3">"{item.content}"</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.clientName}</p>
                    <p className="text-slate-500 text-xs">{item.clientRole} @ {item.clientCompany}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ open: true, data: item })} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="text-white font-semibold">{modal.data.id ? "Edit" : "Add"} Testimonial</h3>
                <button onClick={() => setModal({ open: false, data: empty })} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                {([["Client Name", "clientName"], ["Client Role", "clientRole"], ["Client Company", "clientCompany"], ["Avatar URL", "clientAvatarUrl"], ["LinkedIn URL", "clientLinkedinUrl"]] as [string, keyof Testimonial][]).map(([label, field]) => (
                  <div key={field}>
                    <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                    <input value={(modal.data as any)[field] ?? ""} onChange={e => set(field, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Review Content</label>
                  <textarea value={modal.data.content ?? ""} onChange={e => set("content", e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Rating (1-5)</label>
                  <input type="number" min={1} max={5} value={modal.data.rating ?? 5} onChange={e => set("rating", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
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
