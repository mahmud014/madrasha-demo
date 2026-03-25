import { motion } from 'motion/react';
import { BookOpen, Mic2, GraduationCap, Languages } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

export default function Departments() {
  const { t } = useLanguage();

  const departments = [
    {
      title: t('departments.dept1Title'),
      icon: Mic2,
      desc: t('departments.dept1Desc'),
      features: t('departments.dept1Features', { returnObjects: true }) as string[],
      color: 'bg-blue-500',
    },
    {
      title: t('departments.dept2Title'),
      icon: BookOpen,
      desc: t('departments.dept2Desc'),
      features: t('departments.dept2Features', { returnObjects: true }) as string[],
      color: 'bg-green-500',
    },
    {
      title: t('departments.dept3Title'),
      icon: GraduationCap,
      desc: t('departments.dept3Desc'),
      features: t('departments.dept3Features', { returnObjects: true }) as string[],
      color: 'bg-amber-500',
    },
    {
      title: t('departments.dept4Title'),
      icon: Languages,
      desc: t('departments.dept4Desc'),
      features: t('departments.dept4Features', { returnObjects: true }) as string[],
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('departments.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('departments.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 card-shadow border border-accent/50 group hover:border-primary/30 transition-all"
            >
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 ${dept.color}/10 rounded-2xl flex items-center justify-center text-ink group-hover:scale-110 transition-transform`}>
                  <dept.icon className={`w-8 h-8 ${dept.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-primary">{dept.title}</h3>
                  <p className="text-ink/60 leading-relaxed">{dept.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.features.map((feature, fIndex) => (
                      <span key={fIndex} className="px-3 py-1 bg-accent/50 text-ink/70 text-xs font-bold rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
