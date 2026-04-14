"use client";

import React from "react";
import { Bell, Calendar, ChevronRight, Filter, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

const NoticePage = () => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // নোটিশ ডাটা
  const notices = [
    {
      titleBn: "পবিত্র রমজান উপলক্ষে মাদ্রাসা বন্ধের নোটিশ",
      titleEn: "Notice of Madrasa closure on the occasion of Holy Ramadan",
      date: "২৫ মার্চ, ২০২৬",
      dateEn: "March 25, 2026",
      type: "ছুটি",
      typeEn: "Holiday",
      icon: "🕌",
    },
    {
      titleBn: "আগামী ১০ই এপ্রিল থেকে দ্বিতীয় সাময়িক পরীক্ষা শুরু",
      titleEn: "Second semester exam starts from April 10",
      date: "২০ মার্চ, ২০২৬",
      dateEn: "March 20, 2026",
      type: "পরীক্ষা",
      typeEn: "Exam",
      icon: "📝",
    },
    {
      titleBn: "পরিষ্কার-পরিচ্ছন্নতা দিবস পালন সংক্রান্ত",
      titleEn: "Regarding the celebration of Cleanliness Day",
      date: "১৫ মার্চ, ২০২৬",
      dateEn: "March 15, 2026",
      type: "সাধারণ",
      typeEn: "General",
      icon: "🧹",
    },
    {
      titleBn: "নতুন শিক্ষাবর্ষের ভর্তি বিজ্ঞপ্তি ২০২৬",
      titleEn: "Admission Notice for New Academic Year 2026",
      date: "১০ মার্চ, ২০২৬",
      dateEn: "March 10, 2026",
      type: "ভর্তি",
      typeEn: "Admission",
      icon: "📚",
    },
    {
      titleBn: "শিক্ষক-কর্মচারীদের জন্য প্রশিক্ষণ কর্মশালা",
      titleEn: "Training Workshop for Teachers and Staff",
      date: "৫ মার্চ, ২০২৬",
      dateEn: "March 5, 2026",
      type: "কর্মশালা",
      typeEn: "Workshop",
      icon: "👨‍🏫",
    },
  ];

  // ফিল্টার অপশন
  const filterOptions = [
    { value: "all", labelBn: "সকল", labelEn: "All" },
    { value: "ছুটি", labelBn: "ছুটি", labelEn: "Holiday" },
    { value: "পরীক্ষা", labelBn: "পরীক্ষা", labelEn: "Exam" },
    { value: "ভর্তি", labelBn: "ভর্তি", labelEn: "Admission" },
    { value: "সাধারণ", labelBn: "সাধারণ", labelEn: "General" },
  ];

  // ফিল্টার এবং সার্চ করা নোটিশ
  const filteredNotices = notices.filter((notice) => {
    const matchesFilter = filter === "all" || notice.type === filter;
    const title = language === "bn" ? notice.titleBn : notice.titleEn;
    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // টাইপ অনুযায়ী স্টাইল
  const getTypeStyle = (type: string) => {
    if (type === "ছুটি" || type === "Holiday")
      return "bg-orange-100 text-orange-600 border-orange-200";
    if (type === "পরীক্ষা" || type === "Exam")
      return "bg-red-100 text-red-600 border-red-200";
    if (type === "ভর্তি" || type === "Admission")
      return "bg-purple-100 text-purple-600 border-purple-200";
    return "bg-blue-100 text-blue-600 border-blue-200";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
          {language === "bn" ? "নোটিশ বোর্ড" : "Notice Board"}
        </h2>
        <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {language === "bn" ? "মোট নোটিশ" : "Total Notices"}:{" "}
          {filteredNotices.length}
        </div>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        {/* সার্চ বক্স */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={
              language === "bn" ? "নোটিশ খুঁজুন..." : "Search notices..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>

        {/* ফিল্টার বাটন */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-gray-400 self-center hidden sm:block" />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all
                ${
                  filter === option.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {language === "bn" ? option.labelBn : option.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* নোটিশ লিস্ট */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 space-y-2">
                  {/* টাইপ ব্যাজ ও আইকন */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase border ${getTypeStyle(
                        language === "bn" ? notice.type : notice.typeEn,
                      )}`}
                    >
                      {language === "bn" ? notice.type : notice.typeEn}
                    </span>
                    <span className="text-sm sm:text-base">{notice.icon}</span>
                  </div>

                  {/* টাইটেল */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">
                    {language === "bn" ? notice.titleBn : notice.titleEn}
                  </h3>

                  {/* তারিখ */}
                  <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-400">
                    <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                    {language === "bn" ? notice.date : notice.dateEn}
                  </p>
                </div>

                {/* ডিটেইলস বাটন */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button className="text-xs text-primary font-medium hover:underline">
                    {language === "bn" ? "বিস্তারিত" : "Details"}
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-all" />
                </div>
              </div>
            </div>
          ))
        ) : (
          // নো ডাটা স্টেট
          <div className="bg-white p-8 sm:p-12 rounded-xl sm:rounded-2xl border text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm sm:text-base">
              {language === "bn"
                ? "কোনো নোটিশ পাওয়া যায়নি"
                : "No notices found"}
            </p>
            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                {language === "bn" ? "ফিল্টার রিসেট করুন" : "Reset filters"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* কুইক লিংকস */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 text-center">
          <p className="text-orange-600 font-bold text-sm">ছুটি</p>
          <p className="text-xs text-gray-500">2টি নোটিশ</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-3 text-center">
          <p className="text-red-600 font-bold text-sm">পরীক্ষা</p>
          <p className="text-xs text-gray-500">1টি নোটিশ</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 text-center">
          <p className="text-purple-600 font-bold text-sm">ভর্তি</p>
          <p className="text-xs text-gray-500">1টি নোটিশ</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 text-center">
          <p className="text-blue-600 font-bold text-sm">সাধারণ</p>
          <p className="text-xs text-gray-500">1টি নোটিশ</p>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
