"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, GitFork, Star, Calendar, Home } from "lucide-react";
import api from "@/lib/api";
import type { Project } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ProjectDetailClient({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/projects/${slug}`)
      .then(r => setProject(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="skeleton h-8 w-40 rounded-xl" />
      <div className="skeleton h-64 rounded-2xl" />
      <div className="skeleton h-6 w-80 rounded-xl" />
      <div className="skeleton h-40 rounded-2xl" />
    </div>
  );

  if (notFound || !project) return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <p className="text-slate-500 text-lg">Project not found.</p>
      <Link href="/projects" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">← Back to Projects</Link>
    </div>
  );

  const images = project.imageUrls ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Home size={14} /> Home
        </Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-indigo-400 transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-[200px]">{project?.title ?? "..."}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {project.thumbnailUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-72 object-cover" />
          </div>
        )}

        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {project.categoryName && (
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">{project.categoryName}</span>
              )}
              <span className={`text-xs px-3 py-1 rounded-full ${
                project.status === "Completed" ? "bg-green-500/10 text-green-400" :
                project.status === "In Progress" ? "bg-yellow-500/10 text-yellow-400" :
                "bg-slate-500/10 text-slate-400"
              }`}>{project.status}</span>
              {project.isFeatured && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors">
                <GitFork size={14} /> Source Code
              </a>
            )}
          </div>
        </div>

        <p className="text-slate-400 text-lg mb-8">{project.shortDescription}</p>

        <div className="glass rounded-2xl p-6 border border-white/5 mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStackList?.map(t => (
              <span key={t} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-xl text-sm font-medium border border-indigo-500/20">{t}</span>
            ))}
          </div>
        </div>

        {project.description && (
          <div className="glass rounded-2xl p-6 border border-white/5 mb-8">
            <h2 className="text-white font-semibold text-lg mb-4">About This Project</h2>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{project.description}</div>
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold text-lg mb-4">Screenshots</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/5">
                  <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-white/5 text-slate-500 text-sm">
          <span className="flex items-center gap-2"><Calendar size={14} /> {formatDate(project.createdAt)}</span>
          <span>{project.viewCount} views</span>
        </div>
      </motion.div>
    </div>
  );
}
