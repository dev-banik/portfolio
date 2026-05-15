"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Settings, Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { SiteConfig, SocialLink } from "@/types";

export default function AdminSettingsPage() {
  const { data: configs, loading: configLoading, refetch: refetchConfigs } = useData<SiteConfig[]>("/site-config");
  const { data: socialLinks, loading: socialLoading, refetch: refetchSocial } = useData<SocialLink[]>("/site-config/social-links");
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (configs) {
      const vals: Record<string, string> = {};
      configs.forEach(c => { vals[c.key] = c.value; });
      setEditValues(vals);
    }
  }, [configs]);

  const saveConfig = async (key: string) => {
    setSaving(key);
    try {
      await api.put(`/site-config/${key}`, JSON.stringify(editValues[key]), { headers: { "Content-Type": "application/json" } });
      toast.success("Saved!"); refetchConfigs();
    } catch { toast.error("Failed."); } finally { setSaving(null); }
  };

  const deleteSocial = async (id: string) => {
    if (!confirm("Delete social link?")) return;
    try { await api.delete(`/site-config/social-links/${id}`); toast.success("Deleted!"); refetchSocial(); } catch { toast.error("Failed."); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings size={22} /> Site Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your portfolio site settings</p>
      </div>

      {/* Site Config */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 border border-white/5">
        <h2 className="text-white font-semibold mb-4">General Configuration</h2>
        {configLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-4">
            {(configs ?? []).map((config) => (
              <div key={config.key} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-slate-400 text-xs mb-1 block">{config.key} {config.description && <span className="text-slate-600">— {config.description}</span>}</label>
                  {config.dataType === "color" ? (
                    <div className="flex items-center gap-2">
                      <input type="color" value={editValues[config.key] ?? "#6366f1"} onChange={e => setEditValues(v => ({ ...v, [config.key]: e.target.value }))} className="h-10 w-16 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                      <input value={editValues[config.key] ?? ""} onChange={e => setEditValues(v => ({ ...v, [config.key]: e.target.value }))} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                    </div>
                  ) : (
                    <input value={editValues[config.key] ?? ""} onChange={e => setEditValues(v => ({ ...v, [config.key]: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                  )}
                </div>
                <button onClick={() => saveConfig(config.key)} disabled={saving === config.key} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0">
                  {saving === config.key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Social Links</h2>
        </div>
        {socialLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-2">
            {(socialLinks ?? []).map((link) => (
              <div key={link.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{link.platform}</p>
                  <p className="text-slate-500 text-xs truncate">{link.url}</p>
                </div>
                <button onClick={() => deleteSocial(link.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(socialLinks ?? []).length === 0 && <p className="text-slate-500 text-sm">No social links. Add them from the Profile section.</p>}
          </div>
        )}
      </motion.div>

      {/* Password Change */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-5 border border-white/5">
        <h2 className="text-white font-semibold mb-4">Change Password</h2>
        <ChangePasswordForm />
      </motion.div>
    </div>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error("Passwords don't match."); return; }
    setLoading(true);
    try {
      await api.post("/auth/change-password", form);
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to change password.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {[["Current Password", "currentPassword"], ["New Password", "newPassword"], ["Confirm New Password", "confirmPassword"]].map(([label, field]) => (
        <div key={field}>
          <label className="text-slate-400 text-xs mb-1 block">{label}</label>
          <input type="password" value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" required />
        </div>
      ))}
      <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Update Password
      </button>
    </form>
  );
}
