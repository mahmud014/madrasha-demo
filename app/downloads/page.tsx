'use client';

import { motion } from 'motion/react';
import { Download, FileText, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Downloads() {
  const { t } = useLanguage();

  const downloads = [
    { title: t('downloads.file1Title'), type: 'PDF', size: t('downloads.file1Size'), icon: FileText },
    { title: t('downloads.file2Title'), type: 'PDF', size: t('downloads.file2Size'), icon: FileText },
    { title: t('downloads.file3Title'), type: 'PDF', size: t('downloads.file3Size'), icon: FileText },
    { title: t('downloads.file4Title'), type: 'PDF', size: t('downloads.file4Size'), icon: FileText },
    { title: t('downloads.file5Title'), type: 'Excel', size: t('downloads.file5Size'), icon: FileSpreadsheet },
    { title: t('downloads.file6Title'), type: 'PDF', size: t('downloads.file6Size'), icon: FileIcon },
  ];

  return (
    <div className="pb-20">
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('downloads.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('downloads.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 card-shadow border border-accent/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((file, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-6 rounded-2xl border border-accent hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <file.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink group-hover:text-primary transition-colors">{file.title}</h3>
                    <p className="text-xs text-ink/50">{file.type} • {file.size}</p>
                  </div>
                </div>
                <div className="bg-secondary/10 p-3 rounded-full text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                  <Download className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
