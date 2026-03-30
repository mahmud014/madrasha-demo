"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CalendarCheck,
  UserSquare2,
  Trophy,
  Bell,
  FileCheck,
  UserPlus,
  ClipboardList,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const subscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isMounted = useIsMounted();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    {
      href: "/admin/dashboard",
      label: t("admin.navDashboard"),
      icon: LayoutDashboard,
    },
    { href: "/admin/users", label: t("admin.navUsers"), icon: Users },
    { href: "/admin/finance", label: t("admin.navFinance"), icon: Wallet },
    {
      href: "/admin/attendance",
      label: t("admin.navAttendance"),
      icon: CalendarCheck,
    },
    {
      href: "/admin/students",
      label: t("admin.navStudents"),
      icon: UserSquare2,
    },
    { href: "/admin/events", label: t("admin.navEvents"), icon: Trophy },
    { href: "/admin/notices", label: t("admin.navNotices"), icon: Bell },
    { href: "/admin/results", label: t("admin.navResults"), icon: FileCheck },
    {
      href: "/admin/admissions",
      label: t("admin.navAdmissions"),
      icon: UserPlus,
    },
    {
      href: "/admin/leave-requests",
      label: t("admin.navLeaveRequests"),
      icon: ClipboardList,
    },
    { href: "/admin/messages", label: t("admin.navMessages"), icon: Mail },
    { href: "/admin/settings", label: t("admin.navSettings"), icon: Settings },
  ];

  if (!isMounted) return null;

  return (
    <div
      className={`bg-indigo-900 text-white min-h-screen p-4 flex flex-col justify-between transition-all duration-300 sticky top-0 z-[100] 
        ${isCollapsed ? "w-20" : "w-64"} 
        max-md:w-20 overflow-hidden`}
    >
      <div className="space-y-6 flex flex-col h-full">
        {/* লোগো ও টগল বাটন */}
        <div className="pb-6 border-b border-indigo-800 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold px-2 truncate max-md:hidden uppercase">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg mx-auto md:mx-0 max-md:hidden"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* নেভিগেশন লিস্ট */}
        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-indigo-900 shadow-lg"
                      : "hover:bg-white/10 text-indigo-100"
                  } ${isCollapsed ? "justify-center" : "justify-start"}`}
                >
                  <div className="min-w-[24px] flex justify-center flex-shrink-0">
                    <Icon size={22} />
                  </div>

                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap max-md:hidden text-sm">
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* লগআউট */}
      <div className="pt-4 border-t border-indigo-800">
        <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-500/20 text-red-200">
          <div className="min-w-[24px] flex justify-center mx-auto md:mx-0">
            <LogOut size={22} />
          </div>
          {!isCollapsed && (
            <span className="max-md:hidden text-sm">{t("admin.logout")}</span>
          )}
        </button>
      </div>
    </div>
  );
}
