"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Downloads() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const downloads = [
    {
      title: t("downloads.file1Title"),
      type: "PDF",
      size: t("downloads.file1Size"),
      icon: FileText,
    },
    {
      title: t("downloads.file2Title"),
      type: "PDF",
      size: t("downloads.file2Size"),
      icon: FileText,
    },
    {
      title: t("downloads.file3Title"),
      type: "PDF",
      size: t("downloads.file3Size"),
      icon: FileText,
    },
    {
      title: t("downloads.file4Title"),
      type: "PDF",
      size: t("downloads.file4Size"),
      icon: FileText,
    },
    {
      title: t("downloads.file5Title"),
      type: "Excel",
      size: t("downloads.file5Size"),
      icon: FileSpreadsheet,
    },
    {
      title: t("downloads.file6Title"),
      type: "PDF",
      size: t("downloads.file6Size"),
      icon: FileIcon,
    },
  ];

  // ফিল্টারিং লজিক
  const filteredFiles = downloads.filter((file) => {
    const matchesSearch = file.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || file.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pb-20 bg-[#F8FAFC] min-h-screen">
      {/* Hero Section with Glassmorphism Search */}
      <section className="bg-primary text-white py-28 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            {t("downloads.title")}
          </motion.h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            {t("downloads.subtitle")}
          </p>

          {/* Glass Search Bar */}
          <div className="max-w-xl mx-auto mt-10 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-black" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full bg-white backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Filter Tabs & Content */}
      <div className="max-w-6xl mx-auto px-4 mt-[-40px] relative z-20">
        <div className="flex justify-center space-x-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
          {["All", "PDF", "Excel"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                activeFilter === tab
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Files Grid with Animation */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      <file.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 leading-tight mb-1">
                        {file.title}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {file.type} • {file.size}
                      </span>
                    </div>
                  </div>
                  <button className="p-3 rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic">
            No files found matching your search...
          </div>
        )}
      </div>
    </div>
  );
}
