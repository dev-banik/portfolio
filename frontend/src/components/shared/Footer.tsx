"use client";

import Link from "next/link";
import { Code2, Heart, Lock } from "lucide-react";
import { useData } from "@/hooks/useData";
import type { SocialLink, SiteConfig } from "@/types";

const iconMap: Record<string, string> = {
  github: "GH",
  linkedin: "LI",
  twitter: "TW",
  x: "X",
  instagram: "IG",
  youtube: "YT",
};

export default function Footer() {
  const { data: socialLinks } = useData<SocialLink[]>("/site-config/social-links");
  const { data: configs } = useData<Record<string, string>>("/site-config/public");

  const footerText = configs?.footer_text ?? "© 2025 Parthib Banik. All rights reserved.";

  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">
              Parthib<span className="text-indigo-400">.</span>dev
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {(socialLinks ?? []).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 transition-all duration-200 hover:scale-110"
                title={link.platform}
              >
                <span className="text-xs font-bold">{iconMap[link.platform?.toLowerCase() ?? ""] ?? link.platform[0]}</span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2">
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Made with <Heart size={14} className="text-red-400 fill-red-400" /> — {footerText}
            </p>
            <Link
              href="/admin"
              title="Admin"
              className="text-slate-700 hover:text-slate-400 transition-colors duration-300"
            >
              <Lock size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
