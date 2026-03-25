import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Home, Info, GraduationCap, ClipboardList, Image as ImageIcon, Phone, Download, User, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth, onAuthStateChanged, FirebaseUser } from '@/firebase';
import { useLanguage } from '@/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = !!user;

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                ম
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary leading-tight">
                  {language === 'bn' ? 'মাদ্রাসা ওয়েবসাইট' : 'Madrasa Website'}
                </span>
                <span className="text-xs text-secondary font-medium uppercase tracking-wider">Islamic Education Center</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center space-x-1",
                  location.pathname === item.path
                    ? "text-primary bg-primary/5"
                    : "text-ink/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-1.5 ml-2 border-l border-accent/30 pl-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-accent/30 text-ink hover:bg-accent/50 transition-all text-[11px] font-bold"
              >
                <Globe className="w-3 h-3" />
                <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
              </button>

              <Link
                to="/admin"
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5",
                  isAdmin 
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {isAdmin ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t('nav.dashboard')}</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>{t('nav.login')}</span>
                  </>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-accent/30 text-ink hover:bg-accent/50 transition-all text-xs font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ink hover:text-primary p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-accent overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-md text-base font-medium flex items-center space-x-3",
                    location.pathname === item.path
                      ? "text-primary bg-primary/5"
                      : "text-ink/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 rounded-md text-base font-bold text-primary bg-primary/5 flex items-center space-x-3"
              >
                <Lock className="w-5 h-5" />
                <span>{isAdmin ? t('nav.dashboard') : t('nav.login')}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
