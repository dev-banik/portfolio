"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, GitFork, ArrowRight, Star } from "lucide-react";
import type { Project, ProjectCategory } from "@/types";
import { useData } from "@/hooks/useData";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-1 duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 overflow-hidden">
        {project.thumbnailUrl ? (
          <Image src={project.thumbnailUrl} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-bold text-indigo-500/30">{project.title[0]}</div>
          </div>
        )}
        {project.isFeatured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs">
            <Star size={10} fill="currentColor" /> Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {project.categoryName && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-indigo-500/30 rounded-full text-indigo-300 text-xs border border-indigo-500/20">
            {project.categoryName}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStackList.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-xs bg-white/5 text-slate-400 rounded-full border border-white/5">
              {tech}
            </span>
          ))}
          {project.techStackList.length > 4 && (
            <span className="px-2 py-0.5 text-xs text-slate-500 rounded-full">+{project.techStackList.length - 4}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="flex-1 text-center py-2 text-sm font-medium text-indigo-400 hover:text-white border border-indigo-500/20 hover:bg-indigo-500/20 rounded-xl transition-all"
          >
            View Details
          </Link>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all">
              <GitFork size={15} />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all">
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { data: categoriesData } = useData<ProjectCategory[]>("/projects/categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: projectsData, loading } = useData<any>("/projects", {
    params: { pageSize: 6, categoryId: activeCategory ?? undefined },
  });
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const projects: Project[] = projectsData?.data ?? [];

  return (
    <section id="projects" className="section-padding bg-gradient-to-b from-transparent via-purple-500/3 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">What I've Built</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Featured <span className="gradient-text">Projects</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-8" />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${!activeCategory ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
            >
              All
            </button>
            {(categoriesData ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${activeCategory === cat.id ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all hover:scale-105 font-medium"
          >
            View All Projects <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
