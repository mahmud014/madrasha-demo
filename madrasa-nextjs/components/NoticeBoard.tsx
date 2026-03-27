'use client';

import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { db, collection, query, orderBy, limit, onSnapshot, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';

interface Notice {
  id: string;
  title: string;
  date: string;
  category: string;
}

export default function NoticeBoard() {
  const { t, language } = useLanguage();
  const [notices, setNotices] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('date', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notice[]);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notices');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 card-shadow border border-accent/50 animate-pulse">
        <div className="h-8 bg-accent rounded w-1/2 mb-6"></div>
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-accent rounded"></div>)}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow border border-accent/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-secondary/10 p-2 rounded-lg"><Bell className="w-6 h-6 text-secondary animate-bounce" /></div>
          <h3 className="text-xl font-bold text-primary">{t('noticeBoard.title')}</h3>
        </div>
        <button className="text-sm font-medium text-secondary hover:underline flex items-center">
          {t('noticeBoard.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        {notices.length > 0 ? notices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-accent/30 transition-colors cursor-pointer border-b border-accent/50 last:border-0"
          >
            <div className="bg-primary/5 px-3 py-2 rounded-lg text-center min-w-[80px]">
              <span className="block text-xs text-primary/60 font-medium">
                {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long' })}
              </span>
              <span className="block text-xs text-primary font-bold">
                {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric' })}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-ink group-hover:text-primary transition-colors line-clamp-2">{notice.title}</h4>
            </div>
          </motion.div>
        )) : (
          <p className="text-center text-ink/40 py-8">{t('noticeBoard.notFound')}</p>
        )}
      </div>
    </div>
  );
}
