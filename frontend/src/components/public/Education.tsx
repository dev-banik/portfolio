"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react";
import type { Education } from "@/types";
import { useData } from "@/hooks/useData";
import { formatMonthYear } from "@/lib/utils";

export default function EducationSection() {
  const { data: educations, loading } = useData<Education[]>("/education");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fallback: Partial<Education>[] = [
    { id: "1", degree: "Bachelor of Science in Computer Science", fieldOfStudy: "Computer Science", institution: "American International University-Bangladesh", location: "Dhaka, Bangladesh", cgpa: 3.80, maxCgpa: "4.00", startDate: "2020-01-01", endDate: "2023-11-01", isCurrent: false, description: "Graduated with a strong academic record, focusing on software engineering, algorithms, and data structures." },
  ];

  const items = (educations && educations.length > 0 ? educations : fallback) as Education[];

  return (
    <section id="education" className="section-padding bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Academic Background</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">My <span className="gradient-text">Education</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-6">
          {loading
            ? [...Array(2)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)
            : items.map((edu, i) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all group flex gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1 group-hover:border-indigo-500/60 transition-colors">
                  <GraduationCap size={20} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-white font-bold text-lg">{edu.degree}</h3>
                      <div className="flex items-center gap-2">
                        {edu.institutionUrl ? (
                          <a href={edu.institutionUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium hover:underline flex items-center gap-1 text-sm">
                            {edu.institution} <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-indigo-400 font-medium text-sm">{edu.institution}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar size={12} />
                        {formatMonthYear(edu.startDate)} — {edu.isCurrent ? "Present" : edu.endDate ? formatMonthYear(edu.endDate) : "Present"}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <MapPin size={12} />
                        {edu.location}
                      </div>
                    </div>
                  </div>

                  {edu.cgpa && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-3">
                      CGPA: {edu.cgpa}{edu.maxCgpa ? ` / ${edu.maxCgpa}` : ""}
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-slate-400 text-sm leading-relaxed">{edu.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
