"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Loader2,
  Search,
  Image as ImageIcon,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  title: string;
  url: string;
  category: string;
}

export default function Gallery() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // ১. ডাটা ফেচিং
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success) setImages(data.data);
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

  // ২. ক্যাটাগরি ফিল্টার তৈরি
  const categories = useMemo(
    () => [
      filterAll,
      ...Array.from(new Set(images.map((img) => img.category))),
    ],
    [images, filterAll],
  );

  // ৩. সার্চ এবং ফিল্টার লজিক
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesFilter =
        activeFilter === filterAll || img.category === activeFilter;
      const matchesSearch =
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [images, activeFilter, searchQuery, filterAll]);

  // ৪. নেভিগেশন ফাংশন (Next/Prev)
  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!selectedImg) return;
      const currentIndex = filteredImages.findIndex(
        (img) => img._id === selectedImg._id,
      );
      const nextIndex = (currentIndex + 1) % filteredImages.length;
      setSelectedImg(filteredImages[nextIndex]);
    },
    [selectedImg, filteredImages],
  );

  const handlePrev = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!selectedImg) return;
      const currentIndex = filteredImages.findIndex(
        (img) => img._id === selectedImg._id,
      );
      const prevIndex =
        (currentIndex - 1 + filteredImages.length) % filteredImages.length;
      setSelectedImg(filteredImages[prevIndex]);
    },
    [selectedImg, filteredImages],
  );

  // ৫. কিবোর্ড কন্ট্রোল
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          {t("gallery.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#F8FAFC] min-h-screen">
      {/* Header & Search Section */}
      <section className="bg-primary pt-24 pb-32 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
            opacity: 0.2,
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
              {t("gallery.title")}
            </motion.h1>
            <p className="text-white/70 text-lg font-light">
              {t("gallery.subtitle")}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all text-slate-800 text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-3xl shadow-xl border border-white/50 flex flex-wrap gap-2">
            <div className="px-4 py-2 text-slate-400 border-r border-slate-100 hidden md:block">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  activeFilter === cat
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={img._id}
                className="break-inside-avoid group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer"
                onClick={() => setSelectedImg(img)}
              >
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-white">
                    <p className="text-secondary-light font-black text-[10px] uppercase tracking-widest">
                      {img.category}
                    </p>
                    <h3 className="text-xl font-bold">{img.title}</h3>
                    <div className="mt-4 flex items-center text-sm gap-2">
                      <Maximize2 className="w-4 h-4" /> View Fullscreen
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-40">
            <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-800">
              {t("gallery.notFound")}
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter(filterAll);
              }}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Modal with Navigation */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/98 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImg(null)}
          >
            {/* Control Buttons */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white z-60"
            >
              <X className="w-10 h-10" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 z-60"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 md:right-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 z-60"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image & Caption */}
            <motion.div
              key={selectedImg._id} // স্লাইড এনিমেশনের জন্য key দরকার
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] md:h-[75vh]">
                <Image
                  src={selectedImg.url}
                  alt={selectedImg.title}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
              <div className="mt-8 text-center">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest">
                  {selectedImg.category}
                </span>
                <h2 className="text-white text-3xl font-black mt-2">
                  {selectedImg.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
