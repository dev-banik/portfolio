"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, ExternalLink, Calendar } from "lucide-react";
import type { Certification } from "@/types";
import { useData } from "@/hooks/useData";
import { formatDate } from "@/lib/utils";

export default function CertificationsSection() {
  const { data: certifications, loading } = useData<Certification[]>("/certifications");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  if (!loading && (!certifications || certifications.length === 0)) return null;

  return (
    <section id="certifications" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Credentials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            <span className="gradient-text">Certifications</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(certifications ?? []).map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <Award size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">{cert.name}</h3>
                    <p className="text-indigo-400 text-xs mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                      <Calendar size={10} />
                      {formatDate(cert.issuedDate)}
                      {cert.doesNotExpire && <span className="ml-1 text-green-500">· No Expiry</span>}
                    </div>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ExternalLink size={11} /> Verify Credential
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
