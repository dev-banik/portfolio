"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Award, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { Certification } from "@/types";
import { formatDate } from "@/lib/utils";

const empty: Partial<Certification> = { name: "", issuer: "", issuedDate: "", doesNotExpire: false, displayOrder: 0, isFeatured: false };

export default function AdminCertificationsPage() {
  const { data: items, loading, refetch } = useData<Certification[]>("/certifications");
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Certification> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (modal.data.id) await api.put(`/certifications/${modal.data.id}`, modal.data);
      else await api.post("/certifications", modal.data);
      toast.success("Saved!"); setModal({ open: false, data: empty }); refetch();
    } catch { toast.error("Failed."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await api.delete(`/certifications/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const set = (key: keyof Certification, value: any) => setModal(m => ({ ...m, data: { ...m.data, [key]: value } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Award size={22} /> Certifications</h1>
          <p className="text-slate-400 text-sm mt-1">{(items ?? []).length} certifications</p>
        </div>
        <button onClick={() => setModal({ open: true, data: empty })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {loading ? <div className="grid sm:grid-cols-2 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {(items ?? []).map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4 border border-white/5 hover:border-indigo-500/20 transition-all group flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400"><Award size={18} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-white font-semibold text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-indigo-400 text-xs">{item.issuer}</p>
                    <p className="text-slate-500 text-xs mt-1">{formatDate(item.issuedDate)}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => setModal({ open: true, data: { ...item, issuedDate: item.issuedDate?.split("T")[0], expiryDate: item.expiryDate?.split("T")[0] } })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="text-white font-semibold">{modal.data.id ? "Edit" : "Add"} Certification</h3>
                <button onClick={() => setModal({ open: false, data: empty })} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {([["Name", "name"], ["Issuer", "issuer"], ["Credential ID", "credentialId"], ["Credential URL", "credentialUrl"], ["Image URL", "imageUrl"], ["Issuer Logo URL", "issuerLogoUrl"]] as [string, keyof Certification][]).map(([label, field]) => (
                  <div key={field} className={field === "name" || field === "credentialUrl" ? "sm:col-span-2" : ""}>
                    <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                    <input value={(modal.data as any)[field] ?? ""} onChange={e => set(field, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Issued Date</label>
                  <input type="date" value={modal.data.issuedDate as string ?? ""} onChange={e => set("issuedDate", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Expiry Date</label>
                  <input type="date" value={modal.data.expiryDate as string ?? ""} onChange={e => set("expiryDate", e.target.value)} disabled={modal.data.doesNotExpire} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all disabled:opacity-40" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="noexp" checked={modal.data.doesNotExpire ?? false} onChange={e => set("doesNotExpire", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                  <label htmlFor="noexp" className="text-slate-300 text-sm">Does not expire</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="feat" checked={modal.data.isFeatured ?? false} onChange={e => set("isFeatured", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                  <label htmlFor="feat" className="text-slate-300 text-sm">Featured</label>
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
