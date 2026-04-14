"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Mic2,
  GraduationCap,
  Languages,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// টাইপ ডিফাইন করুন
interface Department {
  title: string;
  icon: React.ElementType;
  desc: string;
  features: string[];
  color: string;
  bgColor: string;
  category: string;
}

export default function Departments() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ডিপার্টমেন্ট ডাটা - ট্রান্সলেশন থেকে নেওয়া
  const departments: Department[] = useMemo(() => {
    return [
      {
        title: t("departments.dept1Title"),
        icon: Mic2,
        desc: t("departments.dept1Desc"),
        features: t("departments.dept1Features") as unknown as string[],
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        category: "Islamic",
      },
      {
        title: t("departments.dept2Title"),
        icon: BookOpen,
        desc: t("departments.dept2Desc"),
        features: t("departments.dept2Features") as unknown as string[],
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        category: "General",
      },
      {
        title: t("departments.dept3Title"),
        icon: GraduationCap,
        desc: t("departments.dept3Desc"),
        features: t("departments.dept3Features") as unknown as string[],
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        category: "Higher",
      },
      {
        title: t("departments.dept4Title"),
        icon: Languages,
        desc: t("departments.dept4Desc"),
        features: t("departments.dept4Features") as unknown as string[],
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        category: "Language",
      },
    ];
  }, [t]);

  const categories = ["All", "Islamic", "General", "Higher", "Language"];

  // ফিল্টারিং লজিক
  const filteredDepts = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        dept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.features.some((feature) =>
          feature.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "All" || dept.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, departments]);

  return (
    <div className="pb-20 bg-gray-50/50 min-h-screen">
      {/* হিরো সেকশন */}
      <section className="bg-primary text-white py-24 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold"
          >
            {t("departments.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl mx-auto text-lg"
          >
            {t("departments.subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* সার্চ ও ফিল্টার বার */}
        <div className="bg-white rounded-3xl p-4 shadow-xl border border-accent/20 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                language === "bn"
                  ? "বিভাগ অনুসন্ধান..."
                  : "Search departments..."
              }
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50 text-ink"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Filter className="w-4 h-4 text-gray-400 mr-2 hidden md:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ডিপার্টমেন্ট গ্রিড */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDepts.length > 0 ? (
              filteredDepts.map((dept, index) => (
                <motion.div
                  layout
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl border border-accent/20 group hover:border-primary/40 flex flex-col h-full"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0">
                    <div
                      className={`w-16 h-16 ${dept.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform`}
                    >
                      <dept.icon className={`w-8 h-8 ${dept.color}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors">
                        {dept.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {dept.desc}
                      </p>
                      {dept.features &&
                        Array.isArray(dept.features) &&
                        dept.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {dept.features.map((feature, fIndex) => (
                              <span
                                key={fIndex}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[10px] md:text-xs font-bold rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-dashed border-gray-200 inline-block">
                  <p className="text-gray-400 text-lg">
                    {language === "bn"
                      ? "আপনার অনুসন্ধানে কোনো বিভাগ পাওয়া যায়নি।"
                      : "No departments found matching your search."}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    {language === "bn" ? "সব ফিল্টার清除" : "Clear all filters"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
