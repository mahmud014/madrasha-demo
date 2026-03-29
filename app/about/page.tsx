"use client";

import { motion } from "motion/react";
import {
  Target,
  Eye,
  History,
  Award,
  CheckCircle2,
  Users, // নতুন আইকন
  BookOpen, // নতুন আইকন
  ShieldCheck, // নতুন আইকন
  School, // নতুন আইকন
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

interface BoardMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

type BoardMemberArrayFunc = (
  key: string,
  options: { returnObjects: boolean },
) => BoardMember[];

export default function About() {
  const { t } = useLanguage();

  const boardMembers =
    (t as unknown as BoardMemberArrayFunc)("about.boardMembers", {
      returnObjects: true,
    }) || [];

  // Statistics Data
  const stats = [
    { label: "Students", value: "1200+", icon: <Users className="w-6 h-6" /> },
    { label: "Hafiz", value: "450+", icon: <Award className="w-6 h-6" /> },
    { label: "Teachers", value: "40+", icon: <BookOpen className="w-6 h-6" /> },
    { label: "Founded", value: "1995", icon: <History className="w-6 h-6" /> },
  ];

  return (
    <div className="pb-20 bg-gray-50/30 min-h-screen">
      {/* --- Hero Section --- */}
      <section className="bg-primary text-white py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://i.postimg.cc/vHL75kH0/moon.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold tracking-tight"
          >
            {t("about.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {t("about.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* --- Statistics Section (New) --- */}
      <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 border border-accent/10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="flex justify-center text-primary mb-2">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-secondary">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-widest font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Mission & Vision --- */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-accent/20 space-y-6 group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-secondary group-hover:text-primary transition-colors">
              {t("about.missionTitle")}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {t("about.missionDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-accent/20 space-y-6 group"
          >
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-secondary group-hover:text-primary transition-colors">
              {t("about.visionTitle")}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {t("about.visionDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Core Values (New) --- */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary">Our Core Values</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Islamic Integrity",
              desc: "Building character based on pure Sunnah and moral excellence.",
              icon: <ShieldCheck className="w-10 h-10" />,
            },
            {
              title: "Academic Excellence",
              desc: "Providing top-tier religious and general education side by side.",
              icon: <School className="w-10 h-10" />,
            },
            {
              title: "Community Service",
              desc: "Preparing students to lead and serve the society with compassion.",
              icon: <Users className="w-10 h-10" />,
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2rem] border border-accent/20 text-center shadow-sm"
            >
              <div className="text-primary flex justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">
                {value.title}
              </h3>
              <p className="text-gray-500">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- History Section --- */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full font-bold">
              <History className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">
                Our Legacy
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
              {t("about.historyHeading")}
            </h2>
            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
              <p>{t("about.historyDesc1")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-secondary font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Quality Education</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Islamic Values</span>
                </div>
              </div>
              <p>{t("about.historyDesc2")}</p>
            </div>
          </motion.div>
          <div className="flex-1 relative w-full aspect-[4/3] h-[450px]">
            <Image
              src="https://i.postimg.cc/Qx64WxHX/antique-ancient-building-culture-tiksey-view.jpg"
              alt="History Image"
              fill
              className="rounded-[3rem] shadow-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- Board of Directors --- */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              {t("about.boardTitle")}
            </h2>
            <p className="text-gray-500 text-lg">{t("about.boardDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {boardMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-gray-50 rounded-[2.5rem] p-8 text-center space-y-6 transition-all group-hover:bg-white group-hover:shadow-2xl border border-transparent group-hover:border-primary/10">
                  <div className="relative w-40 h-40 mx-auto">
                    <Image
                      src={
                        member.image || `https://i.pravatar.cc/150?u=${index}`
                      }
                      alt={member.name}
                      fill
                      className="rounded-full object-cover border-8 border-white shadow-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
