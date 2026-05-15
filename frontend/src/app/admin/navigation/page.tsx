"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Menu, X, Save, ChevronRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  parentId?: string;
  displayOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
  children?: NavItem[];
}

const empty: Partial<NavItem> = { label: "", href: "", icon: "", parentId: undefined, displayOrder: 0, isVisible: true, openInNewTab: false };

export default function AdminNavigationPage() {
  const { data: items, loading, refetch } = useData<NavItem[]>("/navigation/admin");
  const [modal, setModal] = useState<{ open: boolean; data: Partial<NavItem> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);

  const topLevel = (items ?? []).filter(i => !i.parentId);

  const save = async () => {
    setSaving(true);
    try {
      if (modal.data.id) await api.put(`/navigation/${modal.data.id}`, modal.data);
      else await api.post("/navigation", modal.data);
      toast.success("Saved!"); setModal({ open: false, data: empty }); refetch();
    } catch { toast.error("Failed."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    try { await api.delete(`/navigation/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const toggle = async (item: NavItem) => {
    try { await api.put(`/navigation/${item.id}`, { ...item, isVisible: !item.isVisible }); refetch(); } catch { toast.error("Failed."); }
  };

  const set = (key: keyof NavItem, value: any) => setModal(m => ({ ...m, data: { ...m.data, [key]: value } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Menu size={22} /> Navigation</h1>
          <p className="text-slate-400 text-sm mt-1">Manage site navigation menus</p>
        </div>
        <button onClick={() => setModal({ open: true, data: empty })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          {topLevel.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No navigation items yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {topLevel.sort((a, b) => a.displayOrder - b.displayOrder).map((item) => (
                <div key={item.id}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                      {item.displayOrder}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-slate-500 text-xs truncate">{item.href}</p>
                    </div>
                    {item.children && item.children.length > 0 && (
                      <span className="text-xs text-slate-500 flex items-center gap-1"><ChevronRight size={12} /> {item.children.length} children</span>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggle(item)} className={`p-2 rounded-lg transition-colors ${item.isVisible ? "hover:bg-white/10 text-green-400" : "hover:bg-white/10 text-slate-600"}`}>
                        {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button onClick={() => setModal({ open: true, data: item })} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                  {item.children?.sort((a, b) => a.displayOrder - b.displayOrder).map((child) => (
                    <motion.div key={child.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 pl-16 hover:bg-white/5 transition-colors group border-t border-white/5 bg-white/[0.02]">
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 text-sm">{child.label}</p>
                        <p className="text-slate-500 text-xs truncate">{child.href}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggle(child)} className={`p-2 rounded-lg transition-colors ${child.isVisible ? "hover:bg-white/10 text-green-400" : "hover:bg-white/10 text-slate-600"}`}>
                          {child.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={() => setModal({ open: true, data: child })} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => del(child.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="text-white font-semibold">{modal.data.id ? "Edit" : "Add"} Menu Item</h3>
                <button onClick={() => setModal({ open: false, data: empty })} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                {([["Label", "label"], ["URL / Href", "href"], ["Icon (optional)", "icon"]] as [string, keyof NavItem][]).map(([label, field]) => (
                  <div key={field}>
                    <label className="text-slate-400 text-xs mb-1 block">{label}</label>
                    <input value={(modal.data as any)[field] ?? ""} onChange={e => set(field, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Parent Item</label>
                  <select value={modal.data.parentId ?? ""} onChange={e => set("parentId", e.target.value || undefined)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                    <option value="">No parent (top level)</option>
                    {topLevel.filter(i => i.id !== modal.data.id).map(i => (
                      <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Display Order</label>
                  <input type="number" value={modal.data.displayOrder ?? 0} onChange={e => set("displayOrder", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={modal.data.isVisible ?? true} onChange={e => set("isVisible", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                    <span className="text-slate-300 text-sm">Visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={modal.data.openInNewTab ?? false} onChange={e => set("openInNewTab", e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                    <span className="text-slate-300 text-sm">Open in new tab</span>
                  </label>
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
