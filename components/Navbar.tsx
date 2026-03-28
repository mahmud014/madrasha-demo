'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, BookOpen, Home, Info, GraduationCap, 
  ClipboardList, Image as ImageIcon, Phone, 
  Download, User, Lock, Globe, LayoutDashboard, LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth(); // AuthContext থেকে ডাটা নেওয়া

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Home },
    { name: t('nav.about'), path: '/about', icon: Info },
    { name: t('nav.departments'), path: '/departments', icon: BookOpen },
    { name: t('nav.admission'), path: '/admission', icon: GraduationCap },
    { name: t('nav.results'), path: '/results', icon: ClipboardList },
    { name: t('nav.gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav.downloads'), path: '/downloads', icon: Download },
    { name: t('nav.contact'), path: '/contact', icon: Phone },
  ];

  const toggleLanguage = () => setLanguage(language === 'bn' ? 'en' : 'bn');

  // ড্যাশবোর্ড লিঙ্ক এবং লেবেলের লজিক
  const dashboardLink = !user ? '/login' : (user.role === 'admin' ? '/admin/dashboard' : '/student');
  const dashboardLabel = !user ? (language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard') : (user.role === 'admin' ? 'Admin Panel' : 'Parent Panel');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-accent/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">ম</div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary leading-tight">
                  {language === 'bn' ? 'মাদ্রাসা ওয়েবসাইট' : 'Madrasa Website'}
                </span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Islamic Education Center</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "px-3 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center space-x-1.5",
                  pathname === item.path ? "text-primary bg-primary/10" : "text-slate-600 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="flex items-center space-x-2 ml-4 border-l border-slate-200 pl-4">
              {/* Language Switcher */}
              <button onClick={toggleLanguage} className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-xs font-bold border border-slate-200">
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
              </button>

              {/* Dashboard Button */}
              <Link
                href={dashboardLink}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 border",
                  user 
                  ? "bg-secondary border-secondary text-white shadow-md hover:opacity-90" 
                  : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                )}
              >
                {user ? <LayoutDashboard className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{dashboardLabel}</span>
              </Link>

              {/* Logout Button (Only if user exists) */}
              {user && (
                <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button onClick={toggleLanguage} className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">
              {language === 'bn' ? 'EN' : 'বাংলা'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex px-4 py-3 rounded-xl text-base font-semibold items-center space-x-4",
                    pathname === item.path ? "text-primary bg-primary/5" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-100">
                <Link 
                  href={dashboardLink} 
                  onClick={() => setIsOpen(false)} 
                  className="flex px-4 py-4 rounded-xl text-base font-bold text-white bg-primary items-center justify-center space-x-3 shadow-lg shadow-primary/20"
                >
                  {user ? <LayoutDashboard className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  <span>{dashboardLabel}</span>
                </Link>
                
                {user && (
                  <button onClick={logout} className="w-full mt-3 flex px-4 py-4 rounded-xl text-base font-bold text-red-500 bg-red-50 items-center justify-center space-x-3">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}