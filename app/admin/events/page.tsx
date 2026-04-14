"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Save,
  X,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  tag: string;
  date: string;
  dateEn: string;
  titleBn: string;
  titleEn: string;
  timeBn: string;
  timeEn: string;
  status: "upcoming" | "ongoing" | "completed";
  createdAt?: string;
}

// ✅ টাইপ ডিফাইন করুন
type EventStatus = "upcoming" | "ongoing" | "completed";

export default function AdminEventsPage() {
  const { language } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);

  // মক ডাটা
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      tag: "📅",
      date: "১০ এপ্রিল",
      dateEn: "10 April",
      titleBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা",
      titleEn: "Annual Sports Day",
      timeBn: "সকাল ৯:০০",
      timeEn: "9:00 AM",
      status: "upcoming",
    },
    {
      id: "2",
      tag: "🌙",
      date: "১৫ এপ্রিল",
      dateEn: "15 April",
      titleBn: "ইফতার মাহফিল",
      titleEn: "Iftar Mahfil",
      timeBn: "বিকাল ৫:৩০",
      timeEn: "5:30 PM",
      status: "upcoming",
    },
    {
      id: "3",
      tag: "📖",
      date: "২০ এপ্রিল",
      dateEn: "20 April",
      titleBn: "কুরআন তেলাওয়াত প্রতিযোগিতা",
      titleEn: "Quran Recitation Competition",
      timeBn: "সকাল ১০:০০",
      timeEn: "10:00 AM",
      status: "upcoming",
    },
  ]);

  // ✅ ফর্ম ডাটার টাইপ স্পেসিফিক
  const [formData, setFormData] = useState<{
    tag: string;
    date: string;
    dateEn: string;
    titleBn: string;
    titleEn: string;
    timeBn: string;
    timeEn: string;
    status: EventStatus;
  }>({
    tag: "📅",
    date: "",
    dateEn: "",
    titleBn: "",
    titleEn: "",
    timeBn: "",
    timeEn: "",
    status: "upcoming",
  });

  const tagOptions = [
    "📅",
    "🌙",
    "📖",
    "🎓",
    "🏆",
    "🎉",
    "💡",
    "🤝",
    "🎨",
    "🏃",
  ];

  // ইভেন্ট যোগ করা
  const handleAddEvent = () => {
    if (!formData.titleBn || !formData.titleEn || !formData.date) {
      toast.error(
        language === "bn" ? "সব তথ্য পূরণ করুন" : "Please fill all fields",
      );
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData,
    };
    setEvents([newEvent, ...events]);
    toast.success(
      language === "bn" ? "ইভেন্ট যোগ করা হয়েছে" : "Event added successfully",
    );
    setShowAddForm(false);
    setFormData({
      tag: "📅",
      date: "",
      dateEn: "",
      titleBn: "",
      titleEn: "",
      timeBn: "",
      timeEn: "",
      status: "upcoming",
    });
  };

  // ✅ ইভেন্ট এডিট করার সময় টাইপ ঠিক করা
  const handleEditEvent = () => {
    if (!editingEvent) return;

    const updatedEvent: Event = {
      ...editingEvent,
      tag: formData.tag,
      date: formData.date,
      dateEn: formData.dateEn,
      titleBn: formData.titleBn,
      titleEn: formData.titleEn,
      timeBn: formData.timeBn,
      timeEn: formData.timeEn,
      status: formData.status,
    };

    setEvents(
      events.map((event) =>
        event.id === editingEvent.id ? updatedEvent : event,
      ),
    );
    toast.success(
      language === "bn"
        ? "ইভেন্ট আপডেট করা হয়েছে"
        : "Event updated successfully",
    );
    setEditingEvent(null);
    setShowAddForm(false);
  };

  // ইভেন্ট ডিলিট করা
  const handleDeleteEvent = () => {
    if (deleteConfirm) {
      setEvents(events.filter((event) => event.id !== deleteConfirm.id));
      toast.success(
        language === "bn"
          ? "ইভেন্ট ডিলিট করা হয়েছে"
          : "Event deleted successfully",
      );
      setDeleteConfirm(null);
    }
  };

  // ফিল্টার করা ইভেন্ট
  const filteredEvents = events.filter((event) => {
    const matchesSearch = (language === "bn" ? event.titleBn : event.titleEn)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ✅ এডিট মোডাল খোলার সময় টাইপ ঠিক করা
  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      tag: event.tag,
      date: event.date,
      dateEn: event.dateEn,
      titleBn: event.titleBn,
      titleEn: event.titleEn,
      timeBn: event.timeBn,
      timeEn: event.timeEn,
      status: event.status,
    });
    setShowAddForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    if (language === "bn") {
      switch (status) {
        case "upcoming":
          return "আসন্ন";
        case "ongoing":
          return "চলমান";
        case "completed":
          return "সমাপ্ত";
        default:
          return "";
      }
    }
    return status;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "ইভেন্ট ম্যানেজমেন্ট" : "Event Management"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? "হোম পেজের ইভেন্ট এখান থেকে ম্যানেজ করুন"
              : "Manage homepage events from here"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingEvent(null);
            setFormData({
              tag: "📅",
              date: "",
              dateEn: "",
              titleBn: "",
              titleEn: "",
              timeBn: "",
              timeEn: "",
              status: "upcoming",
            });
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          {language === "bn" ? "নতুন ইভেন্ট" : "New Event"}
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
                language === "bn" ? "ইভেন্ট খুঁজুন..." : "Search events..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-gray-600"
            >
              <option value="all">
                {language === "bn" ? "সব ইভেন্ট" : "All Events"}
              </option>
              <option value="upcoming">
                {language === "bn" ? "আসন্ন" : "Upcoming"}
              </option>
              <option value="ongoing">
                {language === "bn" ? "চলমান" : "Ongoing"}
              </option>
              <option value="completed">
                {language === "bn" ? "সমাপ্ত" : "Completed"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* ইভেন্ট গ্রিড */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-500 font-medium">
            {language === "bn" ? "কোনো ইভেন্ট পাওয়া যায়নি" : "No events found"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {language === "bn"
              ? "নতুন ইভেন্ট যোগ করতে উপরের বাটনে ক্লিক করুন"
              : "Click the button above to add a new event"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
              >
                {/* হেডার */}
                <div className="relative bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl">{event.tag}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 bg-white rounded-lg text-blue-600 shadow-sm hover:bg-blue-50 transition-all"
                        title={language === "bn" ? "এডিট" : "Edit"}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event)}
                        className="p-2 bg-white rounded-lg text-red-600 shadow-sm hover:bg-red-50 transition-all"
                        title={language === "bn" ? "ডিলিট" : "Delete"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(event.status)}`}
                    >
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>

                {/* বডি */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {language === "bn" ? event.titleBn : event.titleEn}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "bn" ? event.titleEn : event.titleBn}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-primary" />
                      {language === "bn" ? event.date : event.dateEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-primary" />
                      {language === "bn" ? event.timeBn : event.timeEn}
                    </span>
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
                {editingEvent
                  ? language === "bn"
                    ? "ইভেন্ট এডিট করুন"
                    : "Edit Event"
                  : language === "bn"
                    ? "নতুন ইভেন্ট যোগ করুন"
                    : "Add New Event"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEvent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* ট্যাগ সিলেক্ট */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "bn" ? "ইমোজি/ট্যাগ" : "Emoji/Tag"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFormData({ ...formData, tag })}
                      className={`text-2xl p-2 rounded-lg transition-all ${formData.tag === tag ? "bg-primary/10 ring-2 ring-primary" : "bg-gray-50 hover:bg-gray-100"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder={language === "bn" ? "১০ এপ্রিল" : "10 April"}
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
                    placeholder="10 April"
                  />
                </div>
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
                      language === "bn" ? "ইভেন্টের নাম" : "Event Name"
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
                    placeholder="Event Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "সময় (বাংলা)" : "Time (Bengali)"}
                  </label>
                  <input
                    type="text"
                    value={formData.timeBn}
                    onChange={(e) =>
                      setFormData({ ...formData, timeBn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder={language === "bn" ? "সকাল ১০:০০" : "10:00 AM"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "সময় (ইংরেজি)" : "Time (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.timeEn}
                    onChange={(e) =>
                      setFormData({ ...formData, timeEn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="10:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "bn" ? "স্ট্যাটাস" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as EventStatus,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="upcoming">
                      {language === "bn" ? "আসন্ন" : "Upcoming"}
                    </option>
                    <option value="ongoing">
                      {language === "bn" ? "চলমান" : "Ongoing"}
                    </option>
                    <option value="completed">
                      {language === "bn" ? "সমাপ্ত" : "Completed"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEvent(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={editingEvent ? handleEditEvent : handleAddEvent}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {editingEvent
                  ? language === "bn"
                    ? "আপডেট করুন"
                    : "Update"
                  : language === "bn"
                    ? "ইভেন্ট পাবলিশ করুন"
                    : "Publish Event"}
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
                  ? "ইভেন্ট ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? `${language === "bn" ? deleteConfirm.titleBn : deleteConfirm.titleEn} ইভেন্টটি ডিলিট করতে চান?`
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
                  onClick={handleDeleteEvent}
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
