'use client';

import React from 'react';
import { Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { db, collection, query, where, getDocs, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';

export default function Results() {
  const { t } = useLanguage();
  const [roll, setRoll] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'results'), where('roll', '==', roll));
      const querySnapshot = await getDocs(q);
      setResult(querySnapshot.empty ? 'not_found' : querySnapshot.docs[0].data());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'results');
      toast.error(t('results.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('results.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('results.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white p-8 rounded-3xl card-shadow border border-accent/50 space-y-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 w-5 h-5" />
              <input type="text" value={roll} onChange={(e) => setRoll(e.target.value)} placeholder={t('results.placeholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90 text-white font-bold px-10 py-4 rounded-2xl transition-all disabled:opacity-50">
              {loading ? t('results.searching') : t('results.button')}
            </button>
          </form>

          {result && result !== 'not_found' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-accent pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><FileText className="w-8 h-8" /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{result.studentName}</h3>
                    <p className="text-sm text-ink/50">{t('results.roll')}: {result.roll} | {t('results.year')}: {result.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-secondary">GPA: {result.gpa}</div>
                  <div className="flex items-center text-green-600 font-bold text-sm"><CheckCircle className="w-4 h-4 mr-1" />{result.exam || t('results.finalExam')}</div>
                </div>
              </div>
            </motion.div>
          )}

          {result === 'not_found' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h3 className="text-xl font-bold text-ink">{t('results.notFoundTitle')}</h3>
              <p className="text-ink/50">{t('results.notFoundSubtitle')}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
