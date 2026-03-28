'use client';

import React, { useEffect, useState } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // 'motion/react' এর বদলে 'framer-motion' ব্যবহার করা ভালো
import { useLanguage } from '@/context/LanguageContext';

interface Notice {
  _id: string; // MongoDB তে id হয় _id
  title: string;
  date: string;
  category: string;
}

export default function NoticeBoard() {
  const { t, language } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch('/api/notices');
        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        }
      } catch (error) {
        console.error("Notice fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 animate-pulse">
        <div className="h-8 bg-slate-100 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Bell className="w-6 h-6 text-orange-500 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{t('noticeBoard.title')}</h3>
        </div>
        <button className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center transition-colors">
          {t('noticeBoard.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {notices.length > 0 ? notices.map((notice, index) => (
          <motion.div
            key={notice._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
          >
            <div className="bg-slate-100 px-3 py-2 rounded-lg text-center min-w-[90px]">
              <span className="block text-xs text-slate-500 font-bold uppercase tracking-tighter">
                {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' })}
              </span>
              <span className="block text-sm text-slate-900 font-black">
                {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric' })}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                {notice.title}
              </h4>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-10">
             <p className="text-slate-400 font-medium">{t('noticeBoard.notFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}