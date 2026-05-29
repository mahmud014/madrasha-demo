"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Search,
  Image as ImageIcon,
  Filter,
  Grid3x3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  title: string;
  titleBn: string;
  url: string;
  category: string;
  description?: string;
  descriptionBn?: string;
  createdAt?: string;
}

// ক্যাটাগরি ম্যাপিং (বাংলা ও ইংরেজি)
const categoryMap: Record<string, { bn: string; en: string }> = {
  events: { bn: "অনুষ্ঠান", en: "Events" },
  classes: { bn: "ক্লাস", en: "Classes" },
  ceremony: { bn: "অনুষ্ঠান", en: "Ceremony" },
  general: { bn: "সাধারণ", en: "General" },
};

export default function Gallery() {
  const { language, t } = useLanguage();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");

  // ডাটা ফেচিং
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success) setImages(data.data || []);
      } catch (error) {
        console.error("Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    setActiveFilter(t("gallery.filterAll") || "All");
  }, [t]);

  const filterAll = t("gallery.filterAll") || "All";

  // ক্যাটাগরি অপশন (বাংলা/ইংরেজি অনুযায়ী)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(images.map((img) => img.category).filter(Boolean)),
    );
    const categoryOptions = uniqueCategories.map((cat) => ({
      value: cat,
      label:
        language === "bn"
          ? categoryMap[cat]?.bn || cat
          : categoryMap[cat]?.en || cat,
    }));
    return [{ value: filterAll, label: filterAll }, ...categoryOptions];
  }, [images, filterAll, language]);

  // ✅ সার্চ এবং ফিল্টার লজিক
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesFilter =
        activeFilter === filterAll || img.category === activeFilter;
      const titleText =
        language === "bn"
          ? img.titleBn || img.title || ""
          : img.title || img.titleBn || "";
      const matchesSearch = titleText
        .toLowerCase()
        .includes((searchQuery || "").toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [images, activeFilter, searchQuery, filterAll, language]);

  // ক্যাটাগরি লেবেল পাওয়ার ফাংশন
  const getCategoryLabel = (category: string) => {
    if (language === "bn") {
      return categoryMap[category]?.bn || category;
    }
    return categoryMap[category]?.en || category;
  };

  // নেভিগেশন ফাংশন
  const handleNext = useCallback(() => {
    if (!selectedImg) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img._id === selectedImg._id,
    );
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImg(filteredImages[nextIndex]);
  }, [selectedImg, filteredImages]);

  const handlePrev = useCallback(() => {
    if (!selectedImg) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img._id === selectedImg._id,
    );
    const prevIndex =
      (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImg(filteredImages[prevIndex]);
  }, [selectedImg, filteredImages]);

  // কিবোর্ড কন্ট্রোল
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImg) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedImg(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg, handleNext, handlePrev]);

  const getAltText = (img: GalleryItem) => {
    if (language === "bn") {
      return img.titleBn || img.title || "গ্যালারির ছবি";
    }
    return img.title || img.titleBn || "Gallery image";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          {t("gallery.loading") || "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হিরো সেকশন */}
      <section className="bg-primary pt-24 pb-32 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
            opacity: 0.15,
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white"
            >
              {t("gallery.title") || "গ্যালারি"}
            </motion.h1>
            <p className="text-white/70 text-lg font-light">
              {t("gallery.subtitle") ||
                "আমাদের মাদ্রাসার বিভিন্ন মুহূর্তের ছবি"}
            </p>
          </div>

          {/* সার্চ বার */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                language === "bn" ? "ছবি খুঁজুন..." : "Search images..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-gray-800 text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* ফিল্টার সেকশন */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/50">
            <div className="px-3 py-2 text-gray-400 border-r border-gray-100 hidden md:block">
              <Filter className="w-4 h-4" />
            </div>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeFilter === cat.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ভিউ টগল */}
          <div className="flex bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-primary text-white" : "text-gray-500"
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("masonry")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "masonry"
                  ? "bg-primary text-white"
                  : "text-gray-500"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        {/* গ্যালারি গ্রিড */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredImages.map((img, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  key={img._id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => setSelectedImg(img)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={img.url}
                      alt={getAltText(img)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 text-white">
                      <p className="text-xs font-medium text-primary-light">
                        {getCategoryLabel(img.category)}
                      </p>
                      <h3 className="text-sm font-semibold mt-1">
                        {language === "bn"
                          ? img.titleBn || img.title
                          : img.title || img.titleBn}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.03 }}
                  key={img._id}
                  className="break-inside-avoid group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
                  onClick={() => setSelectedImg(img)}
                >
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={img.url}
                      alt={getAltText(img)}
                      width={500}
                      height={700}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white">
                      <p className="text-secondary font-bold text-[10px] uppercase tracking-widest">
                        {getCategoryLabel(img.category)}
                      </p>
                      <h3 className="text-lg font-bold mt-1">
                        {language === "bn"
                          ? img.titleBn || img.title
                          : img.title || img.titleBn}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* খালি স্টেট */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              {t("gallery.notFound") || "কোনো ছবি পাওয়া যায়নি"}
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter(filterAll);
              }}
              className="mt-4 text-primary font-medium hover:underline"
            >
              {language === "bn" ? "ফিল্টার করুন" : "Clear all filters"}
            </button>
          </div>
        )}
      </div>

      {/* লাইটবক্স মোডাল */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImg(null)}
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-60"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-60"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-60"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <motion.div
              key={selectedImg._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-6xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] md:h-[75vh]">
                <Image
                  src={selectedImg.url}
                  alt={getAltText(selectedImg)}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
              <div className="mt-6 text-center">
                <span className="text-primary-light font-semibold text-xs uppercase tracking-wider">
                  {getCategoryLabel(selectedImg.category)}
                </span>
                <h2 className="text-white text-xl md:text-2xl font-bold mt-2">
                  {language === "bn"
                    ? selectedImg.titleBn || selectedImg.title
                    : selectedImg.title || selectedImg.titleBn}
                </h2>
                {selectedImg.description && (
                  <p className="text-gray-300 text-sm mt-2 max-w-md">
                    {language === "bn"
                      ? selectedImg.descriptionBn
                      : selectedImg.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
