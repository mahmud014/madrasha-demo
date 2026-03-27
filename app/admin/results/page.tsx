'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  db,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

export default function ResultsPage() {
  const { t } = useLanguage();
  const [results, setResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'results'), orderBy('year', 'desc')),
      (s) => setResults(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    const studentName = prompt(t('admin.promptStudentName'));
    const roll = prompt(t('admin.promptRoll'));
    const gpa = prompt(t('admin.promptGpa'));
    const year = prompt(t('admin.promptYear'));
    const exam = prompt(t('admin.promptExam'));

    if (studentName && roll && gpa && year && exam) {
      await addDoc(collection(db, 'results'), {
        studentName,
        roll,
        gpa,
        year,
        exam,
        createdAt: serverTimestamp()
      });
      toast.success(t('admin.addSuccess'));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      await deleteDoc(doc(db, 'results', id));
      toast.success(t('admin.deleteSuccess'));
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">
          {t('admin.navResults')}
        </h2>

        <button
          onClick={handleAdd}
          className="bg-secondary text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          {t('admin.addResult')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-accent/50 overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-primary/5 text-primary">
            <tr>
              <th className="px-6 py-4">{t('admin.tableStudentName')}</th>
              <th className="px-6 py-4">{t('admin.tableRoll')}</th>
              <th className="px-6 py-4">{t('admin.tableGpa')}</th>
              <th className="px-6 py-4">{t('admin.tableYear')}</th>
              <th className="px-6 py-4 text-right">{t('admin.tableActions')}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-accent">
            {results.map((res) => (
              <tr key={res.id} className="hover:bg-accent/10">
                <td className="px-6 py-4 font-medium text-ink">
                  {res.studentName}
                </td>
                <td className="px-6 py-4 text-ink/70">
                  {res.roll}
                </td>
                <td className="px-6 py-4 text-ink/70">
                  {res.gpa}
                </td>
                <td className="px-6 py-4 text-ink/70">
                  {res.year}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-ink/30">
                  {t('admin.tableNoResults')}
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}