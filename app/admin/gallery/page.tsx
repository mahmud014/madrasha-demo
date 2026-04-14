"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Grid3x3,
  LayoutGrid,
  Search,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
  _id: string;
  url: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: string;
  createdAt: string;
  size: number;
}

export default function AdminGalleryPage() {
  const { language } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    description: "",
    descriptionBn: "",
    category: "general",
    file: null as File | null,
  });

  const categories = [
    { value: "all", labelBn: "সব", labelEn: "All" },
    { value: "events", labelBn: "অনুষ্ঠান", labelEn: "Events" },
    { value: "classes", labelBn: "ক্লাস", labelEn: "Classes" },
    { value: "ceremony", labelBn: "অনুষ্ঠান", labelEn: "Ceremony" },
    { value: "general", labelBn: "সাধারণ", labelEn: "General" },
  ];

  // গ্যালারির ছবি লোড করা
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (res.ok && data.success) {
        setImages(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ইমেজ আপলোড করা
  const handleImageUpload = async () => {
    if (!formData.file) {
      toast.error(
        language === "bn" ? "একটি ছবি নির্বাচন করুন" : "Please select an image",
      );
      return;
    }

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", formData.file);
    uploadFormData.append("title", formData.title);
    uploadFormData.append("titleBn", formData.titleBn);
    uploadFormData.append("description", formData.description);
    uploadFormData.append("descriptionBn", formData.descriptionBn);
    uploadFormData.append("category", formData.category);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          language === "bn" ? "ছবি যোগ করা হয়েছে" : "Image added successfully",
        );
        fetchImages();
        setShowAddModal(false);
        setFormData({
          title: "",
          titleBn: "",
          description: "",
          descriptionBn: "",
          category: "general",
          file: null,
        });
        setPreviewUrl(null);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(
        language === "bn" ? "ছবি আপলোড ব্যর্থ" : "Image upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ইমেজ ডিলিট করা
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch(`/api/gallery?id=${deleteConfirm._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setImages((prev) =>
          prev.filter((img) => img._id !== deleteConfirm._id),
        );
        toast.success(
          language === "bn"
            ? "ছবি ডিলিট করা হয়েছে"
            : "Image deleted successfully",
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(language === "bn" ? "ডিলিট ব্যর্থ" : "Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ✅ ফিল্টার করা ছবি - সেফটি চেক সহ
  const filteredImages = images.filter((img) => {
    // সেফটি চেক: title বা titleBn undefined হলে খালি স্ট্রিং ব্যবহার করুন
    const titleText = language === "bn" ? img.titleBn || "" : img.title || "";
    const matchesSearch = titleText
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || img.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          language === "bn"
            ? "ফাইল সাইজ ৫MB এর কম হতে হবে"
            : "File size must be less than 5MB",
        );
        return;
      }
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "গ্যালারি ম্যানেজমেন্ট" : "Gallery Management"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? `মোট ছবি: ${images.length} টি`
              : `Total Images: ${images.length}`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          {language === "bn" ? "নতুন ছবি যোগ করুন" : "Add New Image"}
        </motion.button>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={
                language === "bn"
                  ? "ছবির টাইটেল খুঁজুন..."
                  : "Search by title..."
              }
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {language === "bn" ? cat.labelBn : cat.labelEn}
                </option>
              ))}
            </select>

            {/* ভিউ টগল */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ছবি গ্রিড/লিস্ট ভিউ */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-500 font-medium">
            {language === "bn" ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {language === "bn"
              ? "নতুন ছবি যোগ করতে উপরের বাটনে ক্লিক করুন"
              : "Click the button above to add new images"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredImages.map((img, idx) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={
                      language === "bn"
                        ? img.titleBn || img.title || "গ্যালারির ছবি"
                        : img.title || img.titleBn || "Gallery image"
                    }
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setDeleteConfirm(img)}
                      className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {language === "bn"
                      ? img.titleBn || img.title
                      : img.title || img.titleBn}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {img.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                    প্রিভিউ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                    {language === "bn" ? "টাইটেল" : "Title"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                    {language === "bn" ? "ক্যাটাগরি" : "Category"}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
                    {language === "bn" ? "অ্যাকশন" : "Action"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredImages.map((img) => (
                  <tr
                    key={img._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 text-sm">
                        {language === "bn"
                          ? img.titleBn || img.title
                          : img.title || img.titleBn}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {img.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteConfirm(img)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* অ্যাড মোডাল */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {language === "bn" ? "নতুন ছবি যোগ করুন" : "Add New Image"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* ইমেজ আপলোড */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "bn" ? "ছবি" : "Image"}
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/50 transition-all">
                  {previewUrl ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        onClick={() => {
                          setFormData({ ...formData, file: null });
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        {language === "bn"
                          ? "ছবি নির্বাচন করতে ক্লিক করুন"
                          : "Click to select image"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* টাইটেল */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === "bn" ? "টাইটেল (ইংরেজি)" : "Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter title in English"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === "bn" ? "টাইটেল (বাংলা)" : "Title (Bengali)"}
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleBn: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="বাংলায় টাইটেল লিখুন"
                  />
                </div>
              </div>

              {/* ক্যাটাগরি */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === "bn" ? "ক্যাটাগরি" : "Category"}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories
                    .filter((c) => c.value !== "all")
                    .map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {language === "bn" ? cat.labelBn : cat.labelEn}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={handleImageUpload}
                disabled={isUploading || !formData.file}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                {isUploading
                  ? language === "bn"
                    ? "আপলোড হচ্ছে..."
                    : "Uploading..."
                  : language === "bn"
                    ? "ছবি আপলোড করুন"
                    : "Upload Image"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ডিলিট কনফার্মেশন মোডাল */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {language === "bn"
                  ? "ছবি ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? `"${language === "bn" ? deleteConfirm.titleBn || deleteConfirm.title : deleteConfirm.title || deleteConfirm.titleBn}" ডিলিট করতে চান?`
                  : `Are you sure you want to delete this image?`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  {language === "bn" ? "ডিলিট" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
