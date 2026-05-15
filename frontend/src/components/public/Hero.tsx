"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { Download, ArrowDown, Mail, MapPin, CheckCircle, ExternalLink } from "lucide-react";
import type { Profile, SocialLink } from "@/types";
import { useData } from "@/hooks/useData";

interface ParticleProps { x: number; y: number; delay: number; }

function Particle({ x, y, delay }: ParticleProps) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-40"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

export default function Hero() {
  const { data: profile } = useData<Profile>("/profile");
  const { data: socialLinks } = useData<SocialLink[]>("/site-config/social-links");

  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 3,
    })));
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    github: <span className="text-xs font-bold">GH</span>,
    linkedin: <span className="text-xs font-bold">LI</span>,
    mail: <Mail size={18} />,
    twitter: <span className="text-xs font-bold">TW</span>,
    x: <span className="text-xs font-bold">X</span>,
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#05050f] via-[#0a0a1f] to-[#0a0a0f]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />)}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 lg:order-1"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {profile?.isAvailableForHire ? "Available for hire" : "Open to opportunities"}
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          >
            Hi, I'm <span className="gradient-text">{profile?.fullName ?? "Parthib Banik"}</span>
          </motion.h1>

          {/* Typing animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-indigo-400 font-semibold mb-4 h-8"
          >
            <TypeAnimation
              sequence={[
                profile?.title ?? "Back-End Software Engineer",
                2000,
                ".NET Core Developer",
                2000,
                "API Architect",
                2000,
                "Cloud Systems Engineer",
                2000,
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
            />
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-2 text-slate-400 text-sm mb-6"
          >
            <MapPin size={14} className="text-indigo-400" />
            {profile?.location ?? "Dhaka, Bangladesh"}
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
          >
            {profile?.tagline ?? "Building scalable backend systems with .NET Core & cloud-based architecture. 2+ years transforming complex requirements into elegant APIs."}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Link
              href="/#contact"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              Get In Touch
            </Link>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download
                className="px-6 py-3 border border-indigo-500/30 text-indigo-400 font-medium rounded-xl hover:bg-indigo-500/10 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Download size={16} />
                Download CV
              </a>
            )}
            <a
              href="/parthib-resume.pdf"
              download
              className="px-6 py-3 border border-indigo-500/30 text-indigo-400 font-medium rounded-xl hover:bg-indigo-500/10 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Download size={16} />
              Download CV
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            {(socialLinks ?? []).slice(0, 5).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 border border-white/5 hover:border-indigo-500/30 transition-all duration-200 hover:scale-110"
              >
                {iconMap[link.icon?.toLowerCase() ?? ""] ?? <span className="text-xs font-bold">{link.platform[0]}</span>}
              </a>
            ))}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 border border-white/5 hover:border-indigo-500/30 transition-all duration-200 hover:scale-110"
              >
                <Mail size={18} />
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Profile image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-xl animate-pulse" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-40" />

            {/* Avatar */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
              {profile?.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.fullName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl font-bold gradient-text">
                  PB
                </div>
              )}
            </div>

            {/* Stats floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-12 top-1/2 -translate-y-1/2 glass rounded-xl p-3 shadow-xl shadow-black/50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <div>
                  <p className="text-white font-bold text-sm">{profile?.yearsOfExperience ?? 2}+</p>
                  <p className="text-slate-400 text-xs">Years Exp</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-12 top-1/3 glass rounded-xl p-3 shadow-xl shadow-black/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold text-sm">{profile?.projectsCompleted ?? 10}+</span>
                <p className="text-slate-400 text-xs">Projects</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-slate-500 text-xs tracking-widest uppercase">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} className="text-indigo-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
