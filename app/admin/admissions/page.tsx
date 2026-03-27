'use client';

import React from 'react';
import { db, collection, query, orderBy, onSnapshot } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { doc, deleteDoc } from 'firebase/firestore';

export default function AdminAdmissions() {
  const { t, language } = useLanguage();
  const [admissions, setAdmissions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'admissions'), orderBy('createdAt', 'desc')),
      (s) => setAdmissions(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (e) => handleFirestoreError(e, OperationType.LIST, 'admissions')
    );
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'admissions', id));
        toast.success(t('admin.deleteSuccess'));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `admissions/${id}`);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-accent/30">
      <h2 className="text-3xl font-bold text-primary mb-6">{t('admin.navAdmissions')}</h2>
      <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-primary/5 text-primary">
            <tr>
              <th className="px-6 py-4 font-bold">{t('admin.tableStudentName')}</th>
              <th className="px-6 py-4 font-bold">{t('admin.tableDepartment')}</th>
              <th className="px-6 py-4 font-bold">{t('admin.tablePhone')}</th>
              <th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent">
            {admissions.map((app) => (
              <tr key={app.id} className="hover:bg-accent/10 transition-colors">
                <td className="px-6 py-4 text-ink font-medium">{app.studentName}</td>
                <td className="px-6 py-4 text-ink/50 text-sm">{app.department}</td>
                <td className="px-6 py-4 text-ink/50 text-sm">{app.phone}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" onClick={() => alert(`Details:\n${JSON.stringify(app, null, 2)}`)} />
                  </button>
                  <button onClick={() => handleDelete(app.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {admissions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink/30">
                  {t('admin.tableNoAdmissions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}