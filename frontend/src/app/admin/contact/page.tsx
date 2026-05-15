"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone, Calendar, Trash2, Eye, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useData } from "@/hooks/useData";
import type { ApiResponse } from "@/types";
import { formatDate } from "@/lib/utils";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

interface PagedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export default function AdminContactPage() {
  const { data, loading, refetch } = useData<PagedResult<ContactMessage>>("/contact");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const messages = data?.data ?? [];

  const handleView = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await api.get(`/contact/${msg.id}`);
        refetch();
      } catch {}
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success("Message deleted.");
      if (selected?.id === id) setSelected(null);
      refetch();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><MessageSquare size={22} /> Messages</h1>
        <p className="text-slate-400 text-sm mt-1">{data?.totalCount ?? 0} total messages</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* List */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No messages yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleView(msg)}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors ${selected?.id === msg.id ? "bg-indigo-500/10 border-l-2 border-indigo-500" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400 text-sm font-bold">
                    {msg.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                      <div className="flex items-center gap-1">
                        {!msg.isRead && <span className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0" />}
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs truncate">{msg.subject}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-5 border border-white/5 h-fit">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{selected.name}</h3>
                <p className="text-indigo-400 text-sm">{selected.subject}</p>
              </div>
              <button onClick={() => handleDelete(selected.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-400"><Mail size={14} className="text-indigo-400" />{selected.email}</div>
              {selected.phone && <div className="flex items-center gap-2 text-slate-400"><Phone size={14} className="text-indigo-400" />{selected.phone}</div>}
              <div className="flex items-center gap-2 text-slate-400"><Calendar size={14} className="text-indigo-400" />{formatDate(selected.createdAt)}</div>
              {selected.isRead && <div className="flex items-center gap-2 text-green-400"><CheckCircle size={14} /> Read</div>}
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>
          </motion.div>
        ) : (
          <div className="glass rounded-2xl border border-white/5 flex items-center justify-center p-8 text-slate-500 text-sm">
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
}
