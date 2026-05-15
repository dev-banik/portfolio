"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Eye, Calendar, Tag, Send, Home } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Blog } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [comment, setComment] = useState({ authorName: "", authorEmail: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(r => setBlog(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    setSubmitting(true);
    try {
      await api.post(`/blog/${blog.id}/comments`, comment);
      toast.success("Comment submitted for review!");
      setComment({ authorName: "", authorEmail: "", content: "" });
    } catch { toast.error("Failed to submit comment."); } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="skeleton h-8 w-40 rounded-xl" />
      <div className="skeleton h-10 w-full rounded-xl" />
      <div className="skeleton h-6 w-60 rounded-xl" />
      <div className="skeleton h-96 rounded-2xl" />
    </div>
  );

  if (notFound || !blog) return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <p className="text-slate-500 text-lg">Article not found.</p>
      <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Home size={14} /> Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-[200px]">{blog?.title ?? "..."}</span>
      </motion.div>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {blog.categoryName && (
          <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full mb-4 inline-block">{blog.categoryName}</span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{blog.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-6 pb-6 border-b border-white/5">
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(blog.publishedAt ?? blog.createdAt)}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {blog.readTimeMinutes} min read</span>
          <span className="flex items-center gap-1.5"><Eye size={14} /> {blog.viewCount} views</span>
        </div>

        {blog.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
            <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-72 object-cover" />
          </div>
        )}

        {blog.excerpt && (
          <p className="text-slate-300 text-lg italic mb-8 pl-4 border-l-2 border-indigo-500">{blog.excerpt}</p>
        )}

        <div
          className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-indigo-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-blockquote:border-l-indigo-500 prose-blockquote:text-slate-400
            prose-ul:text-slate-300 prose-ol:text-slate-300
            prose-li:marker:text-indigo-400
            prose-hr:border-white/10
            prose-img:rounded-xl prose-img:border prose-img:border-white/10
            mb-10"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content ?? "") }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t border-white/5">
            {blog.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-slate-400 rounded-full text-sm hover:bg-white/10 transition-colors">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold text-xl mb-6">Leave a Comment</h2>
          <form onSubmit={submitComment} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Name *</label>
                <input value={comment.authorName} onChange={e => setComment(c => ({ ...c, authorName: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Email *</label>
                <input type="email" value={comment.authorEmail} onChange={e => setComment(c => ({ ...c, authorEmail: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Comment *</label>
              <textarea value={comment.content} onChange={e => setComment(c => ({ ...c, content: e.target.value }))} required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none" />
            </div>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
              <Send size={14} /> {submitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        </div>
      </motion.article>
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`{3}([\w]*)\n([\s\S]*?)`{3}/gm, "<pre><code class=\"language-$1\">$2</code></pre>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/^---$/gm, "<hr>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|o|b|p|l|c])/gm, "<p>")
    .replace(/(?<![>])$/gm, "</p>")
    .replace(/<p><\/p>/g, "");
}
