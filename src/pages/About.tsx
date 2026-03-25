import { motion } from 'motion/react';
import { Target, Eye, History } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('about.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-3xl card-shadow border border-accent/50 space-y-6"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-primary">{t('about.missionTitle')}</h2>
            <p className="text-ink/70 leading-relaxed">
              {t('about.missionDesc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-3xl card-shadow border border-accent/50 space-y-6"
          >
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <Eye className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-primary">{t('about.visionTitle')}</h2>
            <p className="text-ink/70 leading-relaxed">
              {t('about.visionDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center space-x-2 text-primary font-bold">
              <History className="w-6 h-6" />
              <span>{t('about.historyTitle')}</span>
            </div>
            <h2 className="text-4xl font-bold text-primary leading-tight">{t('about.historyHeading')}</h2>
            <div className="space-y-4 text-ink/70 leading-relaxed">
              <p>{t('about.historyDesc1')}</p>
              <p>{t('about.historyDesc2')}</p>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000"
              alt="Madrasa History"
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-primary">{t('about.boardTitle')}</h2>
            <p className="text-ink/60">{t('about.boardDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(t('about.boardMembers') as any[]).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-3xl card-shadow text-center space-y-4"
              >
                <img
                  src={index === 0 ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' : 
                       index === 1 ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' :
                       'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-primary/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                  <p className="text-sm text-ink/50">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
