'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Wallet, 
  FileText, 
  Bell, 
  UserCircle, 
  LogOut,
  ClipboardList
} from 'lucide-react';

export default function StudentSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // স্টুডেন্ট প্যানেলের জন্য মেনু আইটেম
  const navItems = [
    { href: '/student/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/student/attendance', label: t('admin.navAttendance'), icon: CalendarCheck },
    { href: '/student/finance', label: t('admin.navFinance'), icon: Wallet },
    { href: '/student/results', label: t('nav.results'), icon: FileText },
    { href: '/student/notices', label: t('admin.navNotices'), icon: Bell },
    { href: '/student/leave-request', label: t('admin.markAttendance'), icon: ClipboardList }, // ছুটির জন্য
    { href: '/student/profile', label: t('student.profile'), icon: UserCircle },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* ব্র্যান্ড লোগো বা নাম */}
        <div className="pb-6 border-b border-indigo-800">
          <h1 className="text-xl font-bold text-center">Student Portal</h1>
        </div>

        {/* নেভিগেশন লিঙ্ক */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-900 shadow-lg'
                      : 'hover:bg-white/10 text-indigo-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* লগআউট বা নিচের অংশ */}
      <div className="pt-6 border-t border-indigo-800">
        <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-500/20 text-red-200 transition-colors">
          <LogOut size={20} />
          <span>{t('admin.logout')}</span>
        </button>
      </div>
    </div>
  );
}