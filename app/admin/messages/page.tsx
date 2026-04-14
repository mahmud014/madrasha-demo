"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  Loader2,
  RefreshCw,
  Mail,
  User,
  Calendar,
  MessageSquare,
  X,
  Search,
  Filter,
  Inbox,
  Send,
  Star,
  Archive,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export default function MessagesPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Message | null>(null);

  // মেসেজ ফেচ করার ফাংশন
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const result = await res.json();

      if (res.ok && result.success) {
        setMessages(result.data || []);
      } else {
        toast.error(
          language === "bn"
            ? "ডেটা লোড করতে সমস্যা হয়েছে"
            : "Failed to load data",
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(
        language === "bn"
          ? "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
          : "Cannot connect to server",
      );
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // মেসেজ ডিলিট করার ফাংশন
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch(`/api/messages?id=${deleteConfirm._id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== deleteConfirm._id),
        );
        toast.success(
          language === "bn"
            ? "মেসেজটি ডিলিট করা হয়েছে"
            : "Message deleted successfully",
        );
      } else {
        toast.error(
          result.message || language === "bn"
            ? "ডিলিট করা সম্ভব হয়নি"
            : "Failed to delete",
        );
      }
    } catch (error) {
      toast.error(
        language === "bn" ? "ডিলিট করার সময় ত্রুটি" : "Error while deleting",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  // সার্চ ফিল্টার
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.contact || "").includes(searchTerm);
    return matchesSearch;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => !m.isRead).length,
    today: messages.filter((m) => {
      const today = new Date().toDateString();
      const msgDate = new Date(m.createdAt).toDateString();
      return msgDate === today;
    }).length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return language === "bn" ? "আজ" : "Today";
    if (diffDays === 1) return language === "bn" ? "গতকাল" : "Yesterday";
    if (diffDays < 7)
      return `${diffDays} ${language === "bn" ? "দিন আগে" : "days ago"}`;
    return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "বার্তা" : "Messages"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? "মাদরাসার ইনবক্স এবং যোগাযোগসমূহ"
              : "Madrasa inbox and communications"}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {language === "bn" ? "রিফ্রেশ" : "Refresh"}
        </button>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                {language === "bn" ? "মোট বার্তা" : "Total Messages"}
              </p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                {language === "bn" ? "অপঠিত" : "Unread"}
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.unread}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Inbox className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                {language === "bn" ? "আজকের" : "Today's"}
              </p>
              <p className="text-2xl font-bold text-green-600">{stats.today}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* সার্চ বার */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "নাম, ইমেইল বা সাবজেক্ট দিয়ে খুঁজুন..."
                : "Search by name, email or subject..."
            }
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* মেসেজ লিস্ট */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "প্রেরক" : "Sender"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "বিষয়" : "Subject"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "তারিখ" : "Date"}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "অ্যাকশন" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                      <p className="text-gray-400 animate-pulse text-sm">
                        {language === "bn"
                          ? "বার্তা লোড হচ্ছে..."
                          : "Loading messages..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-gray-500 font-medium">
                      {language === "bn"
                        ? "কোনো বার্তা পাওয়া যায়নি"
                        : "No messages found"}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {language === "bn" ? "ইনবক্স খালি আছে" : "Inbox is empty"}
                    </p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredMessages.map((msg, idx) => (
                    <motion.tr
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {msg.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {msg.name}
                            </p>
                            <p className="text-xs text-gray-400">{msg.email}</p>
                            {msg.contact && (
                              <p className="text-xs text-gray-400">
                                {msg.contact}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-700 text-sm line-clamp-1">
                            {msg.subject}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                            {msg.message.substring(0, 60)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {formatDate(msg.createdAt)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessage(msg);
                            }}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title={language === "bn" ? "দেখুন" : "View"}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(msg);
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title={language === "bn" ? "ডিলিট" : "Delete"}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* মেসেজ ডিটেইলস মোডাল */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {language === "bn" ? "বার্তার বিবরণ" : "Message Details"}
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* প্রেরকের তথ্য */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {selectedMessage.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">
                    {selectedMessage.name}
                  </h4>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <p className="text-sm text-gray-500">
                      {selectedMessage.email}
                    </p>
                    {selectedMessage.contact && (
                      <p className="text-sm text-gray-500">
                        {selectedMessage.contact}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(selectedMessage.createdAt).toLocaleString(
                      language === "bn" ? "bn-BD" : "en-US",
                    )}
                  </p>
                </div>
              </div>

              {/* সাবজেক্ট */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">
                  {language === "bn" ? "বিষয়" : "Subject"}
                </h5>
                <p className="text-gray-800 text-base">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* মেসেজ */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">
                  {language === "bn" ? "বার্তা" : "Message"}
                </h5>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* রিপ্লাই বাটন */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {language === "bn" ? "জবাব দিন" : "Reply"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(selectedMessage)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  {language === "bn" ? "ডিলিট" : "Delete"}
                </button>
              </div>
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
                  ? "বার্তা ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? `${deleteConfirm.name} এর পাঠানো বার্তাটি ডিলিট করতে চান?`
                  : `Are you sure you want to delete this message from ${deleteConfirm.name}?`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={handleDelete}
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
