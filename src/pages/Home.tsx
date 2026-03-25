import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, GraduationCap, BookOpen, Heart } from 'lucide-react';
import NoticeBoard from '@/components/NoticeBoard';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/LanguageContext';
import { db, doc, onSnapshot } from '@/firebase';

const stats = [
  { key: 'students', value: '১২০০+', icon: Users },
  { key: 'teachers', value: '৫০+', icon: GraduationCap },
  { key: 'departments', value: '০৮', icon: BookOpen },
  { key: 'success', value: '১০০%', icon: Heart },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    });
    return () => unsub();
  }, []);

  const madrasaName = settings ? (language === 'bn' ? settings.madrasaNameBn : settings.madrasaNameEn) : t('footer.aboutTitle');

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.postimg.cc/vHL75kH0/moon.jpg"
            alt="Madrasa Building"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <div className="inline-block px-4 py-1.5 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary rounded-full text-sm font-bold uppercase tracking-widest mb-4">
              {t('hero.subtitle')}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              {language === 'bn' ? (
                <>{madrasaName} - <span className="text-secondary italic">সমন্বয়</span></>
              ) : (
                <>{madrasaName} - <span className="text-secondary italic">Education</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
              {t('hero.title')}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/admission"
                className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center shadow-xl shadow-secondary/20"
              >
                {t('hero.cta')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl card-shadow text-center space-y-4 border border-accent/50 group hover:border-primary/30 transition-all"
            >
              <div className="inline-flex p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-ink/60 font-bold uppercase tracking-wider">
                {t(`home.stats.${stat.key}`)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Message & Notice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Principal's Message */}
          <div className="lg:col-span-2 space-y-8">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              {t('home.principalMessageTitle')}
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-48 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                  alt="Principal"
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">{t('home.principalGreeting')}</h2>
                <p className="text-ink/70 leading-relaxed italic">
                  {t('home.principalQuote')}
                </p>
                <div className="pt-4">
                  <h4 className="font-bold text-ink">{t('home.principalName')}</h4>
                  <p className="text-sm text-ink/50">{t('home.principalRole')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notice Board */}
          <div className="lg:col-span-1">
            <NoticeBoard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-primary">{t('home.featuresTitle')}</h2>
            <p className="text-ink/60">{t('home.featuresSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('home.feature1Title'), desc: t('home.feature1Desc') },
              { title: t('home.feature2Title'), desc: t('home.feature2Desc') },
              { title: t('home.feature3Title'), desc: t('home.feature3Desc') },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl card-shadow border border-accent/50 space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
