"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2 } from "lucide-react";
import { useData } from "@/hooks/useData";
import type { NavigationMenu } from "@/types";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: navItems } = useData<NavigationMenu[]>("/navigation");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultNav = [
    { id: "1", label: "Home", href: "/", isExternal: false, children: [], displayOrder: 1, isVisible: true },
    { id: "2", label: "About", href: "/#about", isExternal: false, children: [], displayOrder: 2, isVisible: true },
    { id: "3", label: "Skills", href: "/#skills", isExternal: false, children: [], displayOrder: 3, isVisible: true },
    { id: "4", label: "Projects", href: "/projects", isExternal: false, children: [], displayOrder: 4, isVisible: true },
    { id: "5", label: "Blog", href: "/blog", isExternal: false, children: [], displayOrder: 5, isVisible: true },
    { id: "6", label: "Contact", href: "/#contact", isExternal: false, children: [], displayOrder: 6, isVisible: true },
  ];

  const items = navItems || defaultNav;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">
              Parthib<span className="text-indigo-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-400 group-hover:w-4/5 transition-all duration-300 rounded-full" />
              </Link>
            ))}
            <Link
              href="/#contact"
              className="ml-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4 py-3 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-center"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
