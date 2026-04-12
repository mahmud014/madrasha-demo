'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/admin/dashboard', label: t('admin.navDashboard') },
    { href: '/admin/users', label: t('admin.navUsers') },
    { href: '/admin/finance', label: t('admin.navFinance') },
    { href: '/admin/attendance', label: t('admin.navAttendance') },
    { href: '/admin/students', label: t('admin.navStudents') },
    { href: '/admin/events', label: t('admin.navEvents') },
    { href: '/admin/notices', label: t('admin.navNotices') },
    { href: '/admin/results', label: t('admin.navResults') },
    { href: '/admin/admissions', label: t('admin.navAdmissions') },
    { href: '/admin/leave-requests', label: t('admin.navLeaveRequests')},
    { href: '/admin/messages', label: t('admin.navMessages') },
    { href: '/admin/settings', label: t('admin.navSettings') },
  ];

  return (
    <div className="w-64 bg-primary text-white p-6 space-y-4">
      {navItems.map(item => (
        <Link key={item.href} href={item.href}>
          <div
            className={`p-3 rounded-xl cursor-pointer ${
              pathname === item.href
                ? 'bg-white text-primary'
                : 'hover:bg-white/10'
            }`}
          >
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
}