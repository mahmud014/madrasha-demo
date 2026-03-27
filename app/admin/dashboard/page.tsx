'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      
      <h1 className="text-3xl font-bold text-primary">
        {t('nav.dashboard')}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <h2 className="text-sm text-ink/50">
            {t('home.stats.students')}
          </h2>
          <p className="text-3xl font-bold mt-2 text-primary">120</p>
        </div>

        <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <h2 className="text-sm text-ink/50">
            {t('noticeBoard.title')}
          </h2>
          <p className="text-3xl font-bold mt-2 text-primary">15</p>
        </div>

        <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <h2 className="text-sm text-ink/50">
            {t('admin.navMessages')}
          </h2>
          <p className="text-3xl font-bold mt-2 text-primary">8</p>
        </div>

      </div>

      {/* Activity */}
      <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t('home.eventsSectionTitle')}
        </h2>

        <ul className="space-y-2 text-sm text-ink/60">
          <li>📌 {t('admin.navAdmissions')}</li>
          <li>📢 {t('admin.navNotices')}</li>
          <li>✉️ {t('admin.navMessages')}</li>
        </ul>
      </div>

    </div>
  );
}