"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SkillCategory } from "@/types";
import { useData } from "@/hooks/useData";

function SkillBar({ name, percentage, color, delay }: { name: string; percentage: number; color?: string; delay: number }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{name}</span>
        <span className="text-indigo-400 text-sm font-semibold">{percentage}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: color ? `linear-gradient(90deg, ${color}, ${color}aa)` : "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Skills() {
  const { data: categories, loading } = useData<SkillCategory[]>("/skills/categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const allCategories = categories ?? [];
  const displayCategories = activeCategory
    ? allCategories.filter((c) => c.id === activeCategory)
    : allCategories;

  return (
    <section id="skills" className="section-padding bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Technical Expertise</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">My <span className="gradient-text">Skills</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-6" />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!activeCategory ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: catIndex * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all group"
              >
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, i) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      percentage={skill.percentage}
                      color={skill.color}
                      delay={catIndex * 0.1 + i * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            ))}

            {allCategories.length === 0 && (
              // Fallback skills
              [
                { name: "Programming & Frameworks", skills: [{ name: "C# / .NET Core", pct: 90 }, { name: "ASP.NET Core", pct: 88 }, { name: "Entity Framework", pct: 85 }] },
                { name: "Databases & Caching", skills: [{ name: "MS SQL Server", pct: 85 }, { name: "PostgreSQL", pct: 80 }, { name: "Redis", pct: 75 }] },
                { name: "Architecture & DevOps", skills: [{ name: "Clean Architecture", pct: 82 }, { name: "Docker", pct: 72 }, { name: "Azure", pct: 70 }] },
              ].map((cat, catIndex) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: catIndex * 0.1 }}
                  className="glass rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all"
                >
                  <h3 className="text-white font-semibold text-lg mb-4">{cat.name}</h3>
                  <div className="space-y-4">
                    {cat.skills.map((skill, i) => (
                      <SkillBar key={skill.name} name={skill.name} percentage={skill.pct} delay={catIndex * 0.1 + i * 0.05} />
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
