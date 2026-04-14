"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

export default function StudentSidebar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // কনফার্মেশন ডায়ালগের জন্য

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        const saved = localStorage.getItem("sidebarCollapsed");
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
      localStorage.setItem("sidebarCollapsed", String(newState));
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

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
    { href: "/student/", label: t("nav.dashboard"), icon: LayoutDashboard },
    {
      href: "/student/attendance",
      label: t("nav.Attendance"),
      icon: CalendarCheck,
    },
    { href: "/student/finance", label: t("nav.Finance"), icon: Wallet },
    { href: "/student/results", label: t("nav.results"), icon: FileText },
    { href: "/student/notices", label: t("nav.Notices"), icon: Bell },
    {
      href: "/student/leave-request",
      label: t("nav.LeaveRequest"),
      icon: ClipboardList,
    },
    { href: "/student/profile", label: t("student.profile"), icon: UserCircle },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      <aside
        className={`
          ${sidebarWidth}
          bg-primary text-primary-content
          shadow-xl
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile ? "fixed left-0 top-0 h-full z-30" : "sticky top-0 h-screen"}
        `}
      >
        {/* হেডার */}
        <div className="drawer-header p-4 border-b border-primary-focus">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="text-xl font-bold">Student</h1>
                <p className="text-xs text-primary-content/70 mt-1">Portal</p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`btn btn-ghost btn-sm ${isCollapsed ? "mx-auto" : ""}`}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>
        </div>

        {/* মেনু */}
        <ul className="menu menu-sm flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3
                    ${isCollapsed ? "justify-center" : ""}
                    ${isActive ? "active" : ""}
                  `}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* লগআউট বাটন */}
        <div className="p-4 border-t border-primary-focus">
          <button
            onClick={confirmLogout}
            className={`
              btn btn-outline btn-error btn-sm w-full
              ${isCollapsed ? "btn-square" : ""}
            `}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>{t("admin.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* কনফার্মেশন ডায়ালগ */}
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
