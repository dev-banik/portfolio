"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { Profile, ApiResponse } from "@/types";

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
  rows?: number;
}

function Field({ label, value, onChange, type = "text", rows }: FieldProps) {
  return (
    <div>
      <label className="text-slate-400 text-sm mb-1.5 block">{label}</label>
      {rows ? (
        <textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
        />
      )}
    </div>
  );
}

export default function AdminProfilePage() {
  const { data: profile, loading } = useData<Profile>("/profile");
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put<ApiResponse<Profile>>("/profile", form);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const f = (field: keyof Profile) => ({
    value: (form[field] as string | number) ?? "",
    onChange: (val: string | number) => setForm((prev) => ({ ...prev, [field]: val })),
  });

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><User size={22} /> Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your personal information</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors disabled:opacity-50 text-sm font-medium">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5 grid gap-5 sm:grid-cols-2">
        <h2 className="text-white font-semibold col-span-full">Personal Information</h2>
        <Field label="Full Name *" {...f("fullName")} />
        <Field label="Title" {...f("title")} />
        <Field label="Email" {...f("email")} type="email" />
        <Field label="Phone" {...f("phone")} />
        <Field label="Location" {...f("location")} />
        <Field label="Tagline" {...f("tagline")} />
        <Field label="Bio" {...f("bio")} rows={4} />
        <Field label="Avatar URL" {...f("avatarUrl")} />
        <Field label="Resume URL" {...f("resumeUrl")} />
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5 grid gap-5 sm:grid-cols-3">
        <h2 className="text-white font-semibold col-span-full">Stats</h2>
        <Field label="Years of Experience" {...f("yearsOfExperience")} type="number" />
        <Field label="Projects Completed" {...f("projectsCompleted")} type="number" />
        <Field label="Happy Clients" {...f("happyClients")} type="number" />
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5 grid gap-5 sm:grid-cols-2">
        <h2 className="text-white font-semibold col-span-full">Social Links</h2>
        <Field label="GitHub URL" {...f("githubUrl")} />
        <Field label="GitHub Username" {...f("githubUsername")} />
        <Field label="LinkedIn URL" {...f("linkedinUrl")} />
        <Field label="Twitter URL" {...f("twitterUrl")} />
        <Field label="Codeforces URL" {...f("codeforcesUrl")} />
        <Field label="LeetCode URL" {...f("leetcodeUrl")} />
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5 grid gap-5 sm:grid-cols-2">
        <h2 className="text-white font-semibold col-span-full">SEO Settings</h2>
        <Field label="Meta Title" {...f("metaTitle")} />
        <Field label="Meta Keywords" {...f("metaKeywords")} />
        <Field label="Meta Description" {...f("metaDescription")} rows={3} />
        <Field label="OG Image URL" {...f("ogImageUrl")} />
        <div className="flex items-center gap-3">
          <input type="checkbox" id="available" checked={form.isAvailableForHire ?? false} onChange={(e) => setForm((prev) => ({ ...prev, isAvailableForHire: e.target.checked }))} className="w-4 h-4 accent-indigo-500" />
          <label htmlFor="available" className="text-slate-300 text-sm">Available for hire</label>
        </div>
      </div>
    </div>
  );
}
