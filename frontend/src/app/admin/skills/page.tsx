"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Code2, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { SkillCategory, Skill, ApiResponse } from "@/types";

function Modal({ title, onClose, onSave, saving, children }: { title: string; onClose: () => void; onSave: () => void; saving: boolean; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const InputField = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="text-slate-400 text-xs mb-1 block">{label}</label>
    <input {...props} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
  </div>
);

export default function AdminSkillsPage() {
  const { data: categories, loading, refetch } = useData<SkillCategory[]>("/skills/categories");
  const [catModal, setCatModal] = useState<{ open: boolean; data: Partial<SkillCategory> | null }>({ open: false, data: null });
  const [skillModal, setSkillModal] = useState<{ open: boolean; data: Partial<Skill> & { categoryId?: string } | null }>({ open: false, data: null });
  const [saving, setSaving] = useState(false);

  const saveCat = async () => {
    setSaving(true);
    try {
      if (catModal.data?.id) await api.put(`/skills/categories/${catModal.data.id}`, catModal.data);
      else await api.post("/skills/categories", catModal.data);
      toast.success("Category saved!"); setCatModal({ open: false, data: null }); refetch();
    } catch { toast.error("Failed to save."); } finally { setSaving(false); }
  };

  const deleteCat = async (id: string) => {
    if (!confirm("Delete this category and all its skills?")) return;
    try { await api.delete(`/skills/categories/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  const saveSkill = async () => {
    setSaving(true);
    try {
      if (skillModal.data?.id) await api.put(`/skills/${skillModal.data.id}`, skillModal.data);
      else await api.post("/skills", skillModal.data);
      toast.success("Skill saved!"); setSkillModal({ open: false, data: null }); refetch();
    } catch { toast.error("Failed to save."); } finally { setSaving(false); }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try { await api.delete(`/skills/${id}`); toast.success("Deleted!"); refetch(); } catch { toast.error("Failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Code2 size={22} /> Skills</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your skills and categories</p>
        </div>
        <button onClick={() => setCatModal({ open: true, data: {} })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {(categories ?? []).map((cat) => (
            <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{cat.name}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => setSkillModal({ open: true, data: { categoryId: cat.id } })} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors" title="Add skill">
                    <Plus size={15} />
                  </button>
                  <button onClick={() => setCatModal({ open: true, data: cat })} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteCat(cat.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {cat.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3 group">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{skill.name}</span>
                        <span className="text-indigo-400">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${skill.percentage}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSkillModal({ open: true, data: { ...skill } })} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => deleteSkill(skill.id)} className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
                {cat.skills.length === 0 && <p className="text-slate-500 text-sm">No skills yet. Click + to add one.</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <AnimatePresence>
        {catModal.open && (
          <Modal title={catModal.data?.id ? "Edit Category" : "New Category"} onClose={() => setCatModal({ open: false, data: null })} onSave={saveCat} saving={saving}>
            <InputField label="Category Name" value={catModal.data?.name ?? ""} onChange={(e) => setCatModal({ ...catModal, data: { ...catModal.data, name: e.target.value } })} placeholder="e.g., Programming & Frameworks" />
            <InputField label="Icon (emoji or icon name)" value={catModal.data?.icon ?? ""} onChange={(e) => setCatModal({ ...catModal, data: { ...catModal.data, icon: e.target.value } })} placeholder="e.g., 💻" />
            <InputField label="Display Order" type="number" value={catModal.data?.displayOrder ?? 0} onChange={(e) => setCatModal({ ...catModal, data: { ...catModal.data, displayOrder: Number(e.target.value) } })} />
          </Modal>
        )}

        {skillModal.open && (
          <Modal title={skillModal.data?.id ? "Edit Skill" : "New Skill"} onClose={() => setSkillModal({ open: false, data: null })} onSave={saveSkill} saving={saving}>
            <InputField label="Skill Name" value={skillModal.data?.name ?? ""} onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, name: e.target.value } })} placeholder="e.g., C#" />
            <InputField label="Percentage (0-100)" type="number" min={0} max={100} value={skillModal.data?.percentage ?? 80} onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, percentage: Number(e.target.value) } })} />
            <InputField label="Icon" value={skillModal.data?.icon ?? ""} onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, icon: e.target.value } })} placeholder="e.g., devicon-csharp-plain" />
            <InputField label="Color (hex)" value={skillModal.data?.color ?? ""} onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, color: e.target.value } })} placeholder="#6366f1" />
            <InputField label="Display Order" type="number" value={skillModal.data?.displayOrder ?? 0} onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, displayOrder: Number(e.target.value) } })} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
