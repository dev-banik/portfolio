"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Profile } from "@/types";
import { useData } from "@/hooks/useData";

export default function Contact() {
  const { data: profile } = useData<Profile>("/profile");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! I'll get back to you soon. 🎉");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact <span className="gradient-text">Me</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-white text-xl font-semibold mb-2">Let's Work Together</h3>
              <p className="text-slate-400 leading-relaxed">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            {[
              { icon: <Mail size={18} />, label: "Email", value: profile?.email ?? "banikparthib401@gmail.com", href: `mailto:${profile?.email}` },
              { icon: <Phone size={18} />, label: "Phone", value: profile?.phone ?? "+880 1633 575072", href: `tel:${profile?.phone}` },
              { icon: <MapPin size={18} />, label: "Location", value: profile?.location ?? "Dhaka, Bangladesh", href: null },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:border-indigo-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-slate-300 hover:text-white transition-colors font-medium">{item.value}</a>
                  ) : (
                    <p className="text-slate-300 font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project inquiry..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
