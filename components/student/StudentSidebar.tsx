"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  FileText,
  Bell,
  UserCircle,
  LogOut,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function StudentSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: "/student/", label: t("nav.dashboard"), icon: LayoutDashboard },
    {
      href: "/student/attendance",
      label: t("admin.navAttendance"),
      icon: CalendarCheck,
    },
    { href: "/student/finance", label: t("admin.navFinance"), icon: Wallet },
    { href: "/student/results", label: t("nav.results"), icon: FileText },
    { href: "/student/notices", label: t("admin.navNotices"), icon: Bell },
    {
      href: "/student/leave-request",
      label: t("admin.markAttendance"),
      icon: ClipboardList,
    },
    { href: "/student/profile", label: t("student.profile"), icon: UserCircle },
  ];

  return (
    <div
      className={`bg-indigo-900 text-white min-h-screen p-4 flex flex-col justify-between transition-all duration-300 sticky top-0 z-50
        ${isCollapsed ? "w-20" : "w-64"} 
        max-md:w-20`}
    >
      <div className="space-y-6">
        <div className="pb-6 border-b border-indigo-800 flex items-center justify-between overflow-hidden">
          {!isCollapsed && (
            <h1 className="text-xl font-bold px-2 truncate max-md:hidden">
              Student Portal
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors mx-auto md:mx-0 max-md:hidden"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-white text-indigo-900 shadow-lg"
                      : "hover:bg-white/10 text-indigo-100 active:bg-white/20"
                  }`}
                >
                  <div className="min-w-[24px] flex justify-center">
                    <Icon size={22} />
                  </div>

                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap max-md:hidden">
                      {item.label}
                    </span>
                  )}

                  <div
                    className={`absolute left-14 bg-indigo-700 text-white text-[10px] md:text-xs px-2 py-1.5 rounded-md 
                    pointer-events-none transition-all z-[100] whitespace-nowrap border border-indigo-600 shadow-xl
                    opacity-0 scale-95 origin-left
                    group-hover:opacity-100 group-hover:scale-100
                    group-active:opacity-100 group-active:scale-100
                    ${!isCollapsed ? "md:hidden" : "block"}`}
                  >
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-indigo-700 rotate-45 border-l border-b border-indigo-600"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* লগআউট */}
      <div className="pt-6 border-t border-indigo-800">
        <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-500/20 text-red-200 transition-colors group relative active:bg-red-500/30">
          <div className="min-w-[24px] flex justify-center">
            <LogOut size={22} />
          </div>
          {!isCollapsed && (
            <span className="max-md:hidden">{t("admin.logout")}</span>
          )}

          <div
            className={`absolute left-14 bg-red-600 text-white text-xs px-2 py-1.5 rounded-md 
            opacity-0 scale-95 pointer-events-none transition-all z-50 whitespace-nowrap
            group-hover:opacity-100 group-hover:scale-100
            group-active:opacity-100 group-active:scale-100
            ${!isCollapsed ? "md:hidden" : "block"}`}
          >
            {t("admin.logout")}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
