"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit,
  Calendar,
  X,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Eye,
  Bell,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Notice {
  id: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  date: string;
  dateEn: string;
  priority: "high" | "medium" | "low";
  type: "general" | "exam" | "holiday" | "event";
}

export default function NoticeBoardPage() {
  const { language } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<Notice | null>(null);

  // মক ডাটা
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      titleBn: "রমজানের পবিত্রতা রক্ষা ও মাদরাসা ছুটি",
      titleEn: "Ramadan Holiday Notice",
      contentBn:
        "পবিত্র রমজান উপলক্ষে মাদরাসা ১লা মার্চ থেকে ৫ই এপ্রিল পর্যন্ত বন্ধ থাকবে।",
      contentEn:
        "Madrasa will remain closed from March 1 to April 5 on the occasion of Holy Ramadan.",
      date: "২০ মার্চ, ২০২৬",
      dateEn: "March 20, 2026",
      priority: "high",
      type: "holiday",
    },
    {
      id: "2",
      titleBn: "বার্ষিক পরীক্ষার সময়সূচী",
      titleEn: "Annual Exam Schedule",
      contentBn:
        "বার্ষিক পরীক্ষা ১০ এপ্রিল থেকে শুরু হবে। বিস্তারিত সময়সূচী নোটিশ বোর্ডে দেখুন।",
      contentEn:
        "Annual exam will start from April 10. Detailed schedule is available on notice board.",
      date: "১৫ মার্চ, ২০২৬",
      dateEn: "March 15, 2026",
      priority: "high",
      type: "exam",
    },
    {
      id: "3",
      titleBn: "নতুন ভর্তি বিজ্ঞপ্তি ২০২৬",
      titleEn: "New Admission Notice 2026",
      contentBn:
        "২০২৬ শিক্ষাবর্ষের জন্য ভর্তি শুরু হয়েছে। আগামী ৩০ এপ্রিল পর্যন্ত আবেদন করা যাবে।",
      contentEn:
        "Admission for the academic year 2026 has started. Applications can be submitted until April 30.",
      date: "১০ মার্চ, ২০২৬",
      dateEn: "March 10, 2026",
      priority: "medium",
      type: "general",
    },
  ]);

  type Priority = "high" | "medium" | "low";
  type NoticeType = "general" | "exam" | "holiday" | "event";

  const [formData, setFormData] = useState<{
    titleBn: string;
    titleEn: string;
    contentBn: string;
    contentEn: string;
    date: string;
    dateEn: string;
    priority: Priority;
    type: NoticeType;
  }>({
    titleBn: "",
    titleEn: "",
    contentBn: "",
    contentEn: "",
    date: "",
    dateEn: "",
    priority: "medium",
    type: "general",
  });

  const priorityOptions = [
    {
      value: "high",
      labelBn: "জরুরি",
      labelEn: "High",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "medium",
      labelBn: "মাঝারি",
      labelEn: "Medium",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "low",
      labelBn: "সাধারণ",
      labelEn: "Low",
      color: "bg-green-100 text-green-700",
    },
  ];

  const typeOptions = [
    { value: "general", labelBn: "সাধারণ", labelEn: "General", icon: "📢" },
    { value: "exam", labelBn: "পরীক্ষা", labelEn: "Exam", icon: "📝" },
    { value: "holiday", labelBn: "ছুটি", labelEn: "Holiday", icon: "🎉" },
    { value: "event", labelBn: "ইভেন্ট", labelEn: "Event", icon: "🎪" },
  ];

  // নোটিশ যোগ করা
  const handleAddNotice = () => {
    if (
      !formData.titleBn ||
      !formData.titleEn ||
      !formData.contentBn ||
      !formData.date
    ) {
      toast.error(
        language === "bn" ? "সব তথ্য পূরণ করুন" : "Please fill all fields",
      );
      return;
    }

    const newNotice: Notice = {
      id: Date.now().toString(),
      ...formData,
    };
    setNotices([newNotice, ...notices]);
    toast.success(
      language === "bn" ? "নোটিশ যোগ করা হয়েছে" : "Notice added successfully",
    );
    setShowAddForm(false);
    setFormData({
      titleBn: "",
      titleEn: "",
      contentBn: "",
      contentEn: "",
      date: "",
      dateEn: "",
      priority: "medium",
      type: "general",
    });
  };

  // নোটিশ এডিট করা
  const handleEditNotice = () => {
    if (!editingNotice) return;

    setNotices(
      notices.map((notice) =>
        notice.id === editingNotice.id
          ? { ...editingNotice, ...formData }
          : notice,
      ),
    );
    toast.success(
      language === "bn"
        ? "নোটিশ আপডেট করা হয়েছে"
        : "Notice updated successfully",
    );
    setEditingNotice(null);
    setShowAddForm(false);
  };

  // নোটিশ ডিলিট করা
  const handleDeleteNotice = () => {
    if (deleteConfirm) {
      setNotices(notices.filter((notice) => notice.id !== deleteConfirm.id));
      toast.success(
        language === "bn"
          ? "নোটিশ ডিলিট করা হয়েছে"
          : "Notice deleted successfully",
      );
      setDeleteConfirm(null);
    }
  };

  // ফিল্টার করা নোটিশ
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      (language === "bn" ? notice.titleBn : notice.titleEn)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (language === "bn" ? notice.contentBn : notice.contentEn)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || notice.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      titleBn: notice.titleBn,
      titleEn: notice.titleEn,
      contentBn: notice.contentBn,
      contentEn: notice.contentEn,
      date: notice.date,
      dateEn: notice.dateEn,
      priority: notice.priority,
      type: notice.type,
    });
    setShowAddForm(true);
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option?.color || "bg-gray-100 text-gray-700";
  };

  const getPriorityText = (priority: string) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return language === "bn" ? option?.labelBn : option?.labelEn;
  };

  const getTypeIcon = (type: string) => {
    const option = typeOptions.find((opt) => opt.value === type);
    return option?.icon || "📢";
  };

  const getTypeText = (type: string) => {
    const option = typeOptions.find((opt) => opt.value === type);
    return language === "bn" ? option?.labelBn : option?.labelEn;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "নোটিশ বোর্ড" : "Notice Board"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? "সকল নোটিশ এখান থেকে ম্যানেজ করুন"
              : "Manage all notices from here"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingNotice(null);
            setFormData({
              titleBn: "",
              titleEn: "",
              contentBn: "",
              contentEn: "",
              date: "",
              dateEn: "",
              priority: "medium",
              type: "general",
            });
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          {language === "bn" ? "নতুন নোটিশ" : "New Notice"}
        </motion.button>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                language === "bn" ? "নোটিশ খুঁজুন..." : "Search notices..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-gray-600"
            >
              <option value="all">
                {language === "bn" ? "সব নোটিশ" : "All Notices"}
              </option>
              <option value="high">
                {language === "bn" ? "জরুরি" : "High Priority"}
              </option>
              <option value="medium">
                {language === "bn" ? "মাঝারি" : "Medium Priority"}
              </option>
              <option value="low">
                {language === "bn" ? "সাধারণ" : "Low Priority"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* নোটিশ লিস্ট */}
      {filteredNotices.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-500 font-medium">
            {language === "bn" ? "কোনো নোটিশ পাওয়া যায়নি" : "No notices found"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {language === "bn"
              ? "নতুন নোটিশ যোগ করতে উপরের বাটনে ক্লিক করুন"
              : "Click the button above to add a new notice"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotices.map((notice, idx) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* বাম পাশে - কন্টেন্ট */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-2xl">
                          {getTypeIcon(notice.type)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}
                        >
                          {getPriorityText(notice.priority)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {getTypeText(notice.type)}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">
                        {language === "bn" ? notice.titleBn : notice.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {language === "bn"
                          ? notice.contentBn
                          : notice.contentEn}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {language === "bn" ? notice.date : notice.dateEn}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {language === "bn" ? "প্রকাশিত" : "Published"}
                        </span>
                      </div>
                    </div>

                    {/* ডান পাশে - অ্যাকশন বাটন */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(notice)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={language === "bn" ? "এডিট" : "Edit"}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(notice)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title={language === "bn" ? "ডিলিট" : "Delete"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* অ্যাড/এডিট মোডাল */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingNotice
                  ? language === "bn"
                    ? "নোটিশ এডিট করুন"
                    : "Edit Notice"
                  : language === "bn"
                    ? "নতুন নোটিশ যোগ করুন"
                    : "Add New Notice"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingNotice(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "শিরোনাম (বাংলা)" : "Title (Bengali)"}
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleBn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder={
                      language === "bn" ? "নোটিশের শিরোনাম" : "Notice Title"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "শিরোনাম (ইংরেজি)" : "Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleEn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="Notice Title"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn"
                      ? "বিস্তারিত (বাংলা)"
                      : "Content (Bengali)"}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.contentBn}
                    onChange={(e) =>
                      setFormData({ ...formData, contentBn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder={
                      language === "bn"
                        ? "নোটিশের বিস্তারিত বিবরণ"
                        : "Notice Details"
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn"
                      ? "বিস্তারিত (ইংরেজি)"
                      : "Content (English)"}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.contentEn}
                    onChange={(e) =>
                      setFormData({ ...formData, contentEn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="Notice Details"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "তারিখ (বাংলা)" : "Date (Bengali)"}
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder={
                      language === "bn" ? "২০ মার্চ, ২০২৬" : "March 20, 2026"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "তারিখ (ইংরেজি)" : "Date (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.dateEn}
                    onChange={(e) =>
                      setFormData({ ...formData, dateEn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="March 20, 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "প্রাধান্য" : "Priority"}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {language === "bn" ? opt.labelBn : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "ধরণ" : "Type"}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as NoticeType,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.icon}{" "}
                        {language === "bn" ? opt.labelBn : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingNotice(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={editingNotice ? handleEditNotice : handleAddNotice}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Megaphone size={18} />
                {editingNotice
                  ? language === "bn"
                    ? "আপডেট করুন"
                    : "Update"
                  : language === "bn"
                    ? "নোটিশ পাবলিশ করুন"
                    : "Publish Notice"}
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
                  ? "নোটিশ ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? `${language === "bn" ? deleteConfirm.titleBn : deleteConfirm.titleEn} নোটিশটি ডিলিট করতে চান?`
                  : `Are you sure you want to delete "${deleteConfirm.titleEn}"?`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={handleDeleteNotice}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
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
