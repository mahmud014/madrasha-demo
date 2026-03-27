'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, GraduationCap, BookOpen, Heart, Mic2, Languages, CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import NoticeBoard from '@/components/NoticeBoard';
import { useLanguage } from '@/context/LanguageContext';
import { db, doc, onSnapshot } from '@/lib/firebase';

const stats = [
  { key: 'students', value: '১২০০+', icon: Users },
  { key: 'teachers', value: '৫০+', icon: GraduationCap },
  { key: 'departments', value: '০৮', icon: BookOpen },
  { key: 'success', value: '১০০%', icon: Heart },
];

const deptCards = [
  { icon: Mic2, color: 'bg-blue-500', titleKey: 'departments.dept1Title', descKey: 'departments.dept1Desc' },
  { icon: BookOpen, color: 'bg-green-500', titleKey: 'departments.dept2Title', descKey: 'departments.dept2Desc' },
  { icon: GraduationCap, color: 'bg-amber-500', titleKey: 'departments.dept3Title', descKey: 'departments.dept3Desc' },
  { icon: Languages, color: 'bg-purple-500', titleKey: 'departments.dept4Title', descKey: 'departments.dept4Desc' },
];

const events = [
  { date: '২০ এপ্রিল', dateEn: 'Apr 20', titleBn: 'বার্ষিক পুরস্কার বিতরণী', titleEn: 'Annual Prize Giving', timeBn: 'সকাল ১০টা', timeEn: '10:00 AM', tag: '🏆' },
  { date: '০৫ মে', dateEn: 'May 05', titleBn: 'কুরআন তেলাওয়াত প্রতিযোগিতা', titleEn: 'Quran Recitation Competition', timeBn: 'সকাল ৯টা', timeEn: '9:00 AM', tag: '📖' },
  { date: '১৫ মে', dateEn: 'May 15', titleBn: 'অভিভাবক সমাবেশ', titleEn: 'Parent-Teacher Meeting', timeBn: 'বিকাল ৩টা', timeEn: '3:00 PM', tag: '👨‍👩‍👧' },
  { date: '০১ জুন', dateEn: 'Jun 01', titleBn: 'নতুন শিক্ষাবর্ষ শুরু', titleEn: 'New Academic Year Begins', timeBn: 'সকাল ৮টা', timeEn: '8:00 AM', tag: '🎓' },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (d) => {
      if (d.exists()) setSettings(d.data());
    });
    return () => unsub();
  }, []);

  const madrasaName = settings ? (language === 'bn' ? settings.madrasaNameBn : settings.madrasaNameEn) : t('footer.aboutTitle');

  return (
    <div className="space-y-20 pb-20">

      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://i.postimg.cc/vHL75kH0/moon.jpg" alt="Madrasa Building" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl space-y-8">
            <div className="inline-block px-4 py-1.5 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary rounded-full text-sm font-bold uppercase tracking-widest mb-4">
              {t('hero.subtitle')}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              {madrasaName} - <span className="text-secondary italic">{language === 'bn' ? 'সমন্বয়' : 'Education'}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">{t('hero.title')}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/admission" className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center shadow-xl shadow-secondary/20">
                {t('hero.cta')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-2xl font-bold text-lg transition-all">
                {t('home.learnMore')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl card-shadow text-center space-y-4 border border-accent/50 group hover:border-primary/30 transition-all">
              <div className="inline-flex p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-ink/60 font-bold uppercase tracking-wider">{t(`home.stats.${stat.key}`)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Principal + Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">{t('home.principalMessageTitle')}</div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-48 shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Principal" className="w-full aspect-square object-cover rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">{t('home.principalGreeting')}</h2>
                <p className="text-ink/70 leading-relaxed italic">{t('home.principalQuote')}</p>
                <div className="pt-4">
                  <h4 className="font-bold text-ink">{t('home.principalName')}</h4>
                  <p className="text-sm text-ink/50">{t('home.principalRole')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1"><NoticeBoard /></div>
        </div>
      </section>

      {/* Departments Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              {t('home.deptSectionTitle')}
            </div>
            <p className="text-ink/60 max-w-xl">{t('home.deptSectionSubtitle')}</p>
          </div>
          <Link href="/departments" className="flex items-center space-x-2 text-primary font-bold hover:text-secondary transition-colors shrink-0">
            <span>{t('home.deptViewAll')}</span><ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deptCards.map((dept, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-6 card-shadow border border-accent/50 hover:border-primary/30 hover:-translate-y-1 transition-all space-y-4">
              <div className={`w-14 h-14 ${dept.color}/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <dept.icon className={`w-7 h-7 ${dept.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-lg font-bold text-primary">{t(dept.titleKey)}</h3>
              <p className="text-sm text-ink/60 leading-relaxed line-clamp-2">{t(dept.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-primary">{t('home.featuresTitle')}</h2>
            <p className="text-ink/60">{t('home.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('home.feature1Title'), desc: t('home.feature1Desc'), icon: '📖', color: 'bg-green-500/10 text-green-600' },
              { title: t('home.feature2Title'), desc: t('home.feature2Desc'), icon: '🔬', color: 'bg-blue-500/10 text-blue-600' },
              { title: t('home.feature3Title'), desc: t('home.feature3Desc'), icon: '🌟', color: 'bg-amber-500/10 text-amber-600' },
              { title: t('home.feature4Title'), desc: t('home.feature4Desc'), icon: '🎓', color: 'bg-purple-500/10 text-purple-600' },
              { title: t('home.feature5Title'), desc: t('home.feature5Desc'), icon: '📊', color: 'bg-secondary/10 text-secondary' },
            ].map((feature, index) => (
              <div key={index} className={`bg-white p-8 rounded-2xl card-shadow border border-accent/50 space-y-4 hover:border-primary/20 transition-all hover:-translate-y-1 ${index === 3 ? 'md:col-start-1' : ''}`}>
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl`}>{feature.icon}</div>
                <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold uppercase tracking-wider">
            {t('home.eventsSectionTitle')}
          </div>
          <p className="text-ink/60">{t('home.eventsSectionSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl card-shadow border border-accent/50 overflow-hidden group hover:border-secondary/30 transition-all">
              <div className="bg-primary p-4 text-white text-center">
                <div className="text-3xl mb-1">{event.tag}</div>
                <div className="text-2xl font-bold">{language === 'bn' ? event.date : event.dateEn}</div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                  {language === 'bn' ? event.titleBn : event.titleEn}
                </h3>
                <div className="flex items-center space-x-2 text-ink/50 text-sm">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{language === 'bn' ? event.timeBn : event.timeEn}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 xl:mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          className="relative bg-primary rounded-3xl overflow-hidden px-8 py-16 md:px-16 text-white text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="text-5xl">🕌</div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">{t('home.ctaTitle')}</h2>
            <p className="text-white/70 text-lg">{t('home.ctaSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/admission" className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center shadow-xl shadow-black/20">
                {t('home.ctaButton')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/about" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all">
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
