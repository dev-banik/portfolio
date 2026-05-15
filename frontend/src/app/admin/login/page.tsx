"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Loader2, Code2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse, LoginResponse } from "@/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "admin@portfolio.com", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<ApiResponse<LoginResponse>>("/auth/login", form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success(`Welcome back, ${data.data.user.firstName}!`);
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05050f] via-[#0a0a1f] to-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Code2 size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-1">Portfolio Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
                  placeholder="admin@portfolio.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In to Dashboard</>}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            Default: admin@portfolio.com / Admin@123456
          </p>
        </div>
      </motion.div>
    </div>
  );
}
