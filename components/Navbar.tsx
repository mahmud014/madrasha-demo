"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Home,
  Info,
  GraduationCap,
  ClipboardList,
  Image as ImageIcon,
  Phone,
  Download,
  Lock,
  Globe,
  LayoutDashboard,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = React.useMemo(
    () => [
      { name: t("nav.home"), path: "/", icon: Home },
      { name: t("nav.about"), path: "/about", icon: Info },
      { name: t("nav.departments"), path: "/departments", icon: BookOpen },
      { name: t("nav.admission"), path: "/admission", icon: GraduationCap },
      { name: t("nav.results"), path: "/results", icon: ClipboardList },
      { name: t("nav.gallery"), path: "/gallery", icon: ImageIcon },
      { name: t("nav.downloads"), path: "/downloads", icon: Download },
      { name: t("nav.contact"), path: "/contact", icon: Phone },
    ],
    [t],
  );

  const toggleLanguage = () => setLanguage(language === "bn" ? "en" : "bn");

  const dashboardLink = React.useMemo(() => {
    if (!user) return "/login";
    return user.role === "admin" ? "/admin/dashboard" : "/student";
  }, [user]);

  const dashboardLabel = React.useMemo(() => {
    if (!user) return t("nav.dashboard");
    return user.role === "admin"
      ? language === "bn"
        ? "অ্যাডমিন"
        : "Admin"
      : language === "bn"
        ? "শিক্ষার্থী"
        : "Student";
  }, [user, language, t]);

  const closeMobileMenu = () => setIsOpen(false);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-accent/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/50 rounded-full animate-pulse" />
              <div className="flex flex-col">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-32 bg-gray-100 rounded animate-pulse mt-1" />
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse lg:hidden" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-accent/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20">
          {/* লোগো সেকশন */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 lg:space-x-3 group"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300 bg-primary flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement("span");
                      span.className =
                        "text-white font-bold text-lg lg:text-xl";
                      span.textContent = language === "bn" ? "ম" : "M";
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>

              {language === "bn" ? (
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm lg:text-xl font-bold text-primary leading-tight">
                    মাদ্রাসা ওয়েবসাইট
                  </span>
                  <span className="text-[8px] lg:text-[10px] text-secondary font-bold uppercase tracking-widest">
                    Islamic Education Center
                  </span>
                </div>
              ) : (
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm lg:text-lg font-bold text-primary leading-tight tracking-tight">
                    Madrasa Website
                  </span>
                  <span className="text-[7px] lg:text-[9px] text-secondary font-bold uppercase tracking-wider">
                    Islamic Education Center
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* ডেস্কটপ নেভিগেশন */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "px-3 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center space-x-1.5",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-slate-600 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="flex items-center space-x-2 ml-4 border-l border-slate-200 pl-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-xs font-bold border border-slate-200"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "English" : "বাংলা"}</span>
              </button>

              <Link
                href={dashboardLink}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 border",
                  user
                    ? "bg-secondary border-secondary text-white shadow-md hover:opacity-90"
                    : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10",
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{dashboardLabel}</span>
              </Link>
            </div>
          </div>

          {/* মোবাইল মেনু বাটন */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-bold bg-slate-100 px-2 py-1.5 rounded-lg"
            >
              {language === "bn" ? "EN" : "বাং"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল মেনু - ছোট সাইজ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-slate-100 absolute w-1/2 shadow-xl max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <div className="px-3 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex px-3 py-2.5 rounded-lg text-sm font-medium items-center space-x-3 transition-all",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-100">
                <Link
                  href={dashboardLink}
                  onClick={closeMobileMenu}
                  className="flex px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary items-center justify-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{dashboardLabel}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
