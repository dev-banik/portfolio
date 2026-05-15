"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { MapPin, Mail, Phone, Calendar, Code2, Briefcase, GraduationCap, Award } from "lucide-react";
import type { Profile } from "@/types";
import { useData } from "@/hooks/useData";

function StatCard({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="glass rounded-2xl p-5 text-center hover:glow-primary transition-all group border border-white/5 hover:border-indigo-500/30">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 transition-colors text-indigo-400">
        {icon}
      </div>
      <div className="text-3xl font-bold gradient-text mb-1">
        {inView ? <CountUp end={value} duration={2} /> : "0"}
        <span>+</span>
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

export default function About() {
  const { data: profile } = useData<Profile>("/profile");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { value: profile?.yearsOfExperience ?? 2, label: "Years Experience", icon: <Calendar size={18} /> },
    { value: profile?.projectsCompleted ?? 10, label: "Projects Completed", icon: <Code2 size={18} /> },
    { value: profile?.happyClients ?? 35, label: "Companies Served", icon: <Briefcase size={18} /> },
    { value: 4, label: "Certifications", icon: <Award size={18} /> },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Who I Am</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">About <span className="gradient-text">Me</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">
                {profile?.title ?? "Back-End Software Engineer"}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {profile?.bio ?? "Backend Software Engineer with 2+ years of hands-on experience in .NET Core and cloud-based systems, specializing in designing, developing, and optimizing high-availability RESTful APIs using C#, ASP.NET Core, and SQL Server. Proficient in scalable system design and microservices architecture, with a strong focus on security, performance optimization, and collaborative agile development."}
              </p>
            </div>

            {/* Personal info */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: <MapPin size={15} />, label: "Location", value: profile?.location ?? "Dhaka, Bangladesh" },
                { icon: <Mail size={15} />, label: "Email", value: profile?.email ?? "banikparthib401@gmail.com" },
                { icon: <Phone size={15} />, label: "Phone", value: profile?.phone ?? "+880 1633 575072" },
                { icon: <GraduationCap size={15} />, label: "Education", value: "BSc CS, AIUB" },
              ].map((item) => (
                <div key={item.label} className="glass rounded-xl p-3 border border-white/5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{item.label}</p>
                    <p className="text-slate-300 text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {profile?.isAvailableForHire && (
              <div className="flex items-center gap-3 glass rounded-xl p-4 border border-green-500/20 bg-green-500/5">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <p className="text-green-400 text-sm font-medium">
                  {profile.availabilityNote ?? "Currently available for new opportunities"}
                </p>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>

            {/* Tech tags */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-slate-300 text-sm font-semibold mb-3">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {["C#", ".NET Core", "ASP.NET", "EF Core", "SQL Server", "PostgreSQL", "Redis", "Docker", "Azure", "Git"].map((tech) => (
                  <span key={tech} className="px-3 py-1 text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full hover:bg-indigo-500/20 transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
