'use client';

import React from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from '@/lib/firebase';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

export default function NoticesPage() {
  const { t, language } = useLanguage();
  const [notices, setNotices] = React.useState<any[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'notices'), orderBy('date', 'desc')),
      (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    const title = prompt(t('admin.promptNoticeTitle'));
    const content = prompt(t('admin.promptNoticeContent'));

    if (title && content) {
      await addDoc(collection(db, 'notices'), {
        title,
        content,
        date: new Date().toISOString(),
      });
      toast.success(t('admin.addSuccess'));
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'notices', id));
    toast.success(t('admin.deleteSuccess'));
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">
          {t('admin.navNotices')}
        </h2>

        <button onClick={handleAdd}
          className="bg-secondary text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg">
          <Plus className="w-4 h-4" />
          {t('admin.addNotice')}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-accent/50 overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-primary/5 text-primary">
            <tr>
              <th className="px-6 py-4">{t('admin.tableNoticeTitle')}</th>
              <th className="px-6 py-4">{t('admin.tableDate')}</th>
              <th className="px-6 py-4 text-right">{t('admin.tableActions')}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-accent">
            {notices.map(n => (
              <tr key={n.id} className="hover:bg-accent/10">
                <td className="px-6 py-4">{n.title}</td>
                <td className="px-6 py-4 text-sm text-ink/50">
                  {new Date(n.date).toLocaleDateString(
                    language === 'bn' ? 'bn-BD' : 'en-US'
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(n.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}

            {notices.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-ink/30">
                  {t('admin.tableNoNotices')}
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}