"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  GraduationCap,
  BookOpen,
  Heart,
  Mic2,
  Languages,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import NoticeBoard from "@/components/NoticeBoard";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

// টাইপ ইন্টারফেস
interface IPrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

// ২৪ ঘণ্টা থেকে ১২ ঘণ্টায় রূপান্তর ---
const formatTime12 = (time24: string | undefined) => {
  if (!time24) return "--:--";
  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
};

const staticSettings = {
  madrasaNameBn: "আল-হিকমাহ ইসলামিয়া মাদ্রাসা",
  madrasaNameEn: "Al-Hikmah Islamic Madrasa",
};

const stats = [
  { key: "students", value: "১২০০+", icon: Users },
  { key: "teachers", value: "৫০+", icon: GraduationCap },
  { key: "departments", value: "০৮", icon: BookOpen },
  { key: "success", value: "১০০%", icon: Heart },
];

const deptCards = [
  {
    icon: Mic2,
    color: "bg-blue-500",
    titleKey: "departments.dept1Title",
    descKey: "departments.dept1Desc",
  },
  {
    icon: BookOpen,
    color: "bg-green-500",
    titleKey: "departments.dept2Title",
    descKey: "departments.dept2Desc",
  },
  {
    icon: GraduationCap,
    color: "bg-amber-500",
    titleKey: "departments.dept3Title",
    descKey: "departments.dept3Desc",
  },
  {
    icon: Languages,
    color: "bg-purple-500",
    titleKey: "departments.dept4Title",
    descKey: "departments.dept4Desc",
  },
];
const events = [
  {
    date: "২০ এপ্রিল",
    dateEn: "Apr 20",
    titleBn: "বার্ষিক পুরস্কার বিতরণী",
    titleEn: "Annual Prize Giving",
    timeBn: "সকাল ১০টা",
    timeEn: "10:00 AM",
    tag: "🏆",
  },
  {
    date: "০৫ মে",
    dateEn: "May 05",
    titleBn: "কুরআন তেলাওয়াত প্রতিযোগিতা",
    titleEn: "Quran Recitation Competition",
    timeBn: "সকাল ৯টা",
    timeEn: "9:00 AM",
    tag: "📖",
  },
  {
    date: "২০ এপ্রিল",
    dateEn: "Apr 20",
    titleBn: "বার্ষিক পুরস্কার বিতরণী",
    titleEn: "Annual Prize Giving",
    timeBn: "সকাল ১০টা",
    timeEn: "10:00 AM",
    tag: "🏆",
  },
  {
    date: "০৫ মে",
    dateEn: "May 05",
    titleBn: "কুরআন তেলাওয়াত প্রতিযোগিতা",
    titleEn: "Quran Recitation Competition",
    timeBn: "সকাল ৯টা",
    timeEn: "9:00 AM",
    tag: "📖",
  },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [prayerTimes, setPrayerTimes] = useState<IPrayerTimings | null>(null);
  const [loading, setLoading] = useState(true);

  // Prayer Times Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchPrayerTimes = async () => {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=2",
          { cache: "no-store" },
        );
        const data = await res.json();
        if (data.code === 200 && isMounted) {
          setPrayerTimes(data.data.timings);
        }
      } catch (err) {
        console.error("Failed to fetch prayer times", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPrayerTimes();
    return () => {
      isMounted = false;
    };
  }, []);

  const madrasaName =
    language === "bn"
      ? staticSettings.madrasaNameBn
      : staticSettings.madrasaNameEn;

  // নামাজের লিস্ট সরাসরি API ডাটার সাথে ম্যাপিং (নতুন ডিজাইন অনুযায়ী Iqamah সহ)
  const prayers = [
    {
      nameBn: "ফজর",
      nameEn: "Fajr",
      time: prayerTimes?.Fajr,
      iqamah: "5:25 AM",
    },
    {
      nameBn: "যোহর",
      nameEn: "Zuhr",
      time: prayerTimes?.Dhuhr,
      iqamah: "1:30 PM",
    },
    { nameBn: "আসর", nameEn: "Asr", time: prayerTimes?.Asr, iqamah: "4:45 PM" },
    {
      nameBn: "মাগরিব",
      nameEn: "Maghrib",
      time: prayerTimes?.Maghrib,
      iqamah: "6:20 PM",
    },
    {
      nameBn: "এশা",
      nameEn: "Isha",
      time: prayerTimes?.Isha,
      iqamah: "8:00 PM",
    },
    {
      nameBn: "জুমা",
      nameEn: "Jummah",
      time: prayerTimes?.Dhuhr,
      iqamah: "1:30 PM",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.postimg.cc/vHL75kH0/moon.jpg"
            alt="Madrasa Building"
            fill
            priority
            className="object-cover"
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
            <div className="inline-block px-4 py-1.5 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary rounded-full text-sm font-bold uppercase tracking-widest">
              {t("hero.subtitle")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              {madrasaName} -{" "}
              <span className="text-secondary italic">
                {language === "bn" ? "সমন্বয়" : "Education"}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl">
              {t("hero.title")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/admission"
                className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center shadow-xl shadow-secondary/20"
              >
                {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
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
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl card-shadow text-center space-y-4 border border-accent/50 group hover:border-primary/30 transition-all"
            >
              <div className="inline-flex p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-ink/60 font-bold uppercase tracking-wider">
                {t(`home.stats.${stat.key}`)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prayer Times Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-accent shadow-xl shadow-primary/5 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-4xl font-black text-primary tracking-tight">
                {language === "bn" ? "নামাজের সময়সূচী" : "Prayer Times"}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-bold">
                <MapPin className="w-4 h-4" />
                <span className="text-sm uppercase tracking-widest">
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>
            <div className="px-8 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-bold shadow-sm">
              {new Date().toLocaleDateString(
                language === "bn" ? "bn-BD" : "en-US",
                { weekday: "long", day: "numeric", month: "long" },
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {prayers.map((prayer, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-[2rem] text-center space-y-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative"
                >
                  <div className="w-16 h-16 border-2 border-dashed border-emerald-600/50 rounded-full flex items-center justify-center mx-auto text-emerald-700 group-hover:border-solid group-hover:bg-emerald-50 transition-all">
                    <Clock className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {language === "bn" ? prayer.nameBn : prayer.nameEn}
                    </h3>
                    {/* --- এখানে formatTime12 ব্যবহার করা হয়েছে ১২ ঘণ্টা করার জন্য --- */}
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
                      {formatTime12(prayer.time)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-50">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      Iqamah:{" "}
                      <span className="text-gray-900">{prayer.iqamah}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Principal + Notice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              {t("home.principalMessageTitle")}
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-full md:w-48 h-64 md:h-60 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                <Image
                  src="https://i.ibb.co.com/RTR5S0fh/Muhammadullah-Hafezzi.jpg"
                  alt="Principal"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">
                  {t("home.principalGreeting")}
                </h2>
                <p className="text-ink/70 leading-relaxed italic">
                  {t("home.principalQuote")}
                </p>
                <div className="pt-4">
                  <h4 className="font-bold text-ink">
                    {t("home.principalName")}
                  </h4>
                  <p className="text-sm text-ink/50">
                    {t("home.principalRole")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <NoticeBoard />
          </div>
        </div>
      </section>

      {/* Departments Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              {t("home.deptSectionTitle")}
            </div>
            <p className="text-ink/60 max-w-xl">
              {t("home.deptSectionSubtitle")}
            </p>
          </div>
          <Link
            href="/departments"
            className="flex items-center space-x-2 text-primary font-bold hover:text-secondary transition-colors shrink-0"
          >
            <span>{t("home.deptViewAll")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deptCards.map((dept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-6 card-shadow border border-accent/50 hover:border-primary/30 hover:-translate-y-1 transition-all space-y-4"
            >
              <div
                className={`w-14 h-14 ${dept.color}/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <dept.icon
                  className={`w-7 h-7 ${dept.color.replace("bg-", "text-")}`}
                />
              </div>
              <h3 className="text-lg font-bold text-primary">
                {t(dept.titleKey)}
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed line-clamp-2">
                {t(dept.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* 1. Education Features - পড়াশোনার বৈশিষ্ট্য */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4">
            <h2 className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              {language === "bn" ? "আমাদের বিশেষত্ব" : "Our Speciality"}
            </h2>
            <p className="text-ink/60 max-w-xl">
              {language === "bn"
                ? "আধুনিক ও দ্বীনি শিক্ষার এক অপূর্ব সমন্বয়"
                : "A perfect blend of modern and Islamic education"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "হিফজুল কুরআন",
                desc: "আন্তর্জাতিক মানের হাফেজ গড়ার লক্ষ্যে বিশেষ তত্ত্বাবধান।",
                icon: "📖",
              },
              {
                title: "আধুনিক কারিকুলাম",
                desc: "দ্বীনি শিক্ষার সাথে ইংরেজি ও গণিতের বিশেষ পাঠদান।",
                icon: "🎓",
              },
              {
                title: "নৈতিক উন্নয়ন",
                desc: "ছাত্রদের আদব ও আখলাক গঠনে সার্বক্ষণিক মেন্টরিং।",
                icon: "🌟",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-[2.5rem] card-shadow border border-accent/50 hover:border-emerald-500/30 transition-all group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-ink/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Infrastructure - সুযোগ-সুবিধা */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-primary leading-tight">
              {language === "bn"
                ? "উন্নত ক্যাম্পাস ও নিরাপদ পরিবেশ"
                : "Modern Campus & Safe Environment"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "ডিজিটাল ক্লাসরুম",
                "সমৃদ্ধ লাইব্রেরি",
                "বিশুদ্ধ পানি ও খাবার",
                "নিরাপদ হোস্টেল",
                "সিসিটিভি নিরাপত্তা",
                "খেলার মাঠ",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 font-bold text-ink/70"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">
                    ✓
                  </div>
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary font-black border-b-2 border-primary pb-1"
            >
              বিস্তারিত দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
            <Image
              src="https://i.postimg.cc/vHL75kH0/moon.jpg"
              alt="Campus"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 hover:bg-transparent transition-all"></div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events - ইভেন্টসমূহ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className=" inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
            {language === "bn" ? "আসন্ন ইভেন্ট" : "Upcoming Events"}
          </h2>
          <div className="h-1 flex-1 mx-8 bg-accent/30 hidden md:block"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 10 }}
              className="bg-white rounded-3xl p-8 border border-accent flex items-center gap-8 group cursor-pointer"
            >
              <div className="bg-primary text-white p-6 rounded-2xl text-center min-w-[100px] group-hover:bg-secondary transition-colors">
                <span className="block text-2xl font-black leading-none">
                  {language === "bn"
                    ? event.date.split(" ")[0]
                    : event.dateEn.split(" ")[1]}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  {language === "bn"
                    ? event.date.split(" ")[1]
                    : event.dateEn.split(" ")[0]}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors">
                  {language === "bn" ? event.titleBn : event.titleEn}
                </h3>
                <div className="flex items-center gap-4 text-sm font-bold text-ink/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />{" "}
                    {language === "bn" ? event.timeBn : event.timeEn}
                  </span>
                  <span className="text-xl">{event.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 xl:mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-primary rounded-3xl overflow-hidden px-8 py-16 md:px-16 text-white text-center"
        >
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="text-5xl">🕌</div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-white/70 text-lg">{t("home.ctaSubtitle")}</p>
            <Link
              href="/admission"
              className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center shadow-xl shadow-black/20"
            >
              {t("home.ctaButton")} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
