'use client';
import { Megaphone, Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NoticeBoardPage() {
  const { t } = useLanguage();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{t('noticeBoard.title')}</h1>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all">
          <Plus size={20} /> {t('admin.addNotice')}
        </button>
      </div>

      <div className="grid gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
                <Megaphone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-700">রমজানের পবিত্রতা রক্ষা ও মাদরাসা ছুটি</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Calendar size={14} /> ২০ মার্চ, ২০২৬
                </p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}