"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CalendarCheck,
  GraduationCap,
  Calendar,
  Bell,
  FileText,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        const saved = localStorage.getItem("adminSidebarCollapsed");
        if (saved !== null) {
          setIsCollapsed(saved === "true");
        }
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (!isMobile) {
      localStorage.setItem("adminSidebarCollapsed", String(newState));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(
        language === "bn"
          ? "সফলভাবে লগআউট হয়েছে!"
          : "Logged out successfully!",
        {
          duration: 2000,
          position: "top-right",
        },
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      toast.error(
        language === "bn" ? "লগআউট করতে সমস্যা হয়েছে" : "Failed to logout",
        {
          duration: 3000,
          position: "top-right",
        },
      );
    }
  };

  const confirmLogout = () => {
    setShowConfirm(true);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

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
      icon: GraduationCap,
    },
    { href: "/admin/events", label: t("admin.navEvents"), icon: Calendar },
    { href: "/admin/notices", label: t("admin.navNotices"), icon: Bell },
    { href: "/admin/results", label: t("admin.navResults"), icon: FileText },
    {
      href: "/admin/admissions",
      label: t("admin.navAdmissions"),
      icon: ClipboardList,
    },
    {
      href: "/admin/leave-requests",
      label: t("admin.navLeaveRequests"),
      icon: MessageSquare,
    },
    {
      href: "/admin/messages",
      label: t("admin.navMessages"),
      icon: MessageSquare,
    },
    { href: "/admin/gallery", label: t("nav.gallery"), icon: ImageIcon },
    { href: "/admin/settings", label: t("admin.navSettings"), icon: Settings },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      <aside
        className={`
          ${sidebarWidth}
          bg-primary text-white
          shadow-xl
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile ? "fixed left-0 top-0 h-full z-30" : "sticky top-0 h-screen"}
        `}
      >
        {/* হেডার ও টগল বাটন */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="text-lg font-bold">Admin</h1>
                <p className="text-xs text-white/70">Panel</p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isCollapsed ? "mx-auto" : ""}`}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>
        </div>

        {/* নেভিগেশন মেনু */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-white/80"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* লগআউট বাটন */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={confirmLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              hover:bg-red-500/20 text-red-200 transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{t("admin.logout")}</span>
            )}
          </button>
        </div>
      </aside>

      {/* কনফার্মেশন ডায়ালগ */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {language === "bn" ? "লগআউট নিশ্চিত করুন" : "Confirm Logout"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? "আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?"
                  : "Are you sure you want to logout?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  {language === "bn" ? "লগআউট" : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
