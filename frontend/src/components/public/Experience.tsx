"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Briefcase, MapPin, Calendar, ExternalLink } from "lucide-react";
import type { Experience } from "@/types";
import { useData } from "@/hooks/useData";
import { formatMonthYear } from "@/lib/utils";

export default function ExperienceSection() {
  const { data: experiences, loading } = useData<Experience[]>("/experience");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fallback: Partial<Experience>[] = [
    { id: "1", company: "Akij iBOS Limited", role: "Software Engineer L-1", location: "Lalmatia, Dhaka", employmentType: "Full-time", startDate: "2024-08-01", isCurrent: true, description: "Led scalable backend development and designed high-performance RESTful APIs using C#, ASP.NET Core, and SQL Server. Implemented secure authentication, RBAC, and built modular HRM systems.", techStackList: ["C#", ".NET Core", "SQL Server", "EF Core", "RDLC"] },
  ];

  const items = (experiences && experiences.length > 0 ? experiences : fallback) as Experience[];

  return (
    <section id="experience" className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Professional Journey</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Work <span className="gradient-text">Experience</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent" />

          <div className="space-y-8">
            {loading
              ? [...Array(2)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl ml-16" />)
              : items.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-6 group"
                >
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 mt-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center group-hover:border-indigo-500/60 transition-colors">
                      <Briefcase size={18} className="text-indigo-400" />
                    </div>
                    {exp.isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 glass rounded-2xl p-5 border border-white/5 group-hover:border-indigo-500/20 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">{exp.role}</h3>
                        <div className="flex items-center gap-2">
                          {exp.companyUrl ? (
                            <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium hover:underline flex items-center gap-1">
                              {exp.company} <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-indigo-400 font-medium">{exp.company}</span>
                          )}
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500 text-sm">{exp.employmentType}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Calendar size={12} />
                          {formatMonthYear(exp.startDate)} — {exp.isCurrent ? "Present" : exp.endDate ? formatMonthYear(exp.endDate) : "Present"}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <MapPin size={12} />
                          {exp.location}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">{exp.description}</p>

                    {exp.techStackList && exp.techStackList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techStackList.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
