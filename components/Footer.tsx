'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, Globe, Video, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // MongoDB থেকে সেটিংস নিয়ে আসা
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // সেটিংস না থাকলে ডিফল্ট ভ্যালু
  const madrasaName = settings?._id 
    ? (language === 'bn' ? settings.madrasaNameBn : settings.madrasaNameEn) 
    : "মাদরাসা ম্যানেজমেন্ট";

  const address = settings?._id 
    ? (language === 'bn' ? settings.addressBn : settings.addressEn) 
    : 'ঢাকা, বাংলাদেশ';

  const phone = settings?.phone || '+৮৮০ ১২৩৪ ৫৬৭৮৯০';
  const email = settings?.email || 'info@madrasa.com';

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">
                {madrasaName ? madrasaName.charAt(0) : "M"}
              </div>
              <span className="text-xl font-bold">{madrasaName}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{t('footer.aboutDesc')}</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><Video className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/departments" className="hover:text-white transition-colors">{t('nav.departments')}</Link></li>
              <li><Link href="/admission" className="hover:text-white transition-colors">{t('nav.admission')}</Link></li>
              <li><Link href="/results" className="hover:text-white transition-colors">{t('nav.results')}</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">{t('footer.importantLinks')}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">{t('nav.gallery')}</Link></li>
              <li><Link href="/downloads" className="hover:text-white transition-colors">{t('nav.downloads')}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">নোটিশ বোর্ড</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">{t('footer.contact')}</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} {madrasaName}। {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}