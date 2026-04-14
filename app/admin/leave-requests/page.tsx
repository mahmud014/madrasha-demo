"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type RequestStatus = "pending" | "approved" | "rejected";

interface LeaveRequest {
  id: number;
  name: string;
  nameBn: string;
  roll: string;
  type: string;
  typeEn: string;
  fromDate: string;
  toDate: string;
  duration: string;
  status: RequestStatus;
  reason: string;
  reasonEn: string;
  createdAt: string;
}

export default function AdminLeaveRequests() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // মক ডাটা
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      name: "Hafizur Rahman",
      nameBn: "হাফিজুর রহমান",
      roll: "101",
      type: "Sick",
      typeEn: "Sick",
      fromDate: "2026-03-28",
      toDate: "2026-03-30",
      duration: "২৮ মার্চ - ৩০ মার্চ",
      status: "pending",
      reason: "জ্বর ও ঠান্ডার কারণে আসতে পারছি না।",
      reasonEn: "Unable to attend due to fever and cold.",
      createdAt: "2026-03-27",
    },
    {
      id: 2,
      name: "Abdullah Al Mamun",
      nameBn: "আব্দুল্লাহ আল মামুন",
      roll: "105",
      type: "Emergency",
      typeEn: "Emergency",
      fromDate: "2026-03-29",
      toDate: "2026-03-29",
      duration: "২৯ মার্চ - ২৯ মার্চ",
      status: "approved",
      reason: "পারিবারিক অনুষ্ঠান।",
      reasonEn: "Family event.",
      createdAt: "2026-03-26",
    },
    {
      id: 3,
      name: "Sakib Hasan",
      nameBn: "সাকিব হাসান",
      roll: "112",
      type: "Other",
      typeEn: "Other",
      fromDate: "2026-03-25",
      toDate: "2026-03-27",
      duration: "২৫ মার্চ - ২৭ মার্চ",
      status: "rejected",
      reason: "ব্যক্তিগত কাজ।",
      reasonEn: "Personal work.",
      createdAt: "2026-03-24",
    },
  ]);

  // স্ট্যাটাস আপডেট ফাংশন
  const handleStatusUpdate = async (id: number, newStatus: RequestStatus) => {
    setUpdatingId(id);
    // এখানে API কল হবে
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)),
    );

    toast.success(
      language === "bn"
        ? `আবেদনটি ${newStatus === "approved" ? "অনুমোদিত" : newStatus === "rejected" ? "বাতিল" : "পেন্ডিং"} করা হয়েছে`
        : `Request ${newStatus}`,
    );
    setUpdatingId(null);
  };

  // ফিল্টার এবং সার্চ
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      (language === "bn" ? req.nameBn : req.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || req.roll.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusText = (status: RequestStatus) => {
    if (language === "bn") {
      switch (status) {
        case "approved":
          return "অনুমোদিত";
        case "rejected":
          return "বাতিল";
        default:
          return "বিচারাধীন";
      }
    }
    return status;
  };

  const getTypeText = (type: string) => {
    if (language === "bn") {
      switch (type) {
        case "Sick":
          return "অসুস্থতা";
        case "Emergency":
          return "জরুরি";
        default:
          return "অন্যান্য";
      }
    }
    return type;
  };

  const statusOptions = [
    { value: "all", labelBn: "সব", labelEn: "All" },
    { value: "pending", labelBn: "বিচারাধীন", labelEn: "Pending" },
    { value: "approved", labelBn: "অনুমোদিত", labelEn: "Approved" },
    { value: "rejected", labelBn: "বাতিল", labelEn: "Rejected" },
  ];

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "ছুটির আবেদনসমূহ" : "Leave Requests"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? `মোট আবেদন: ${stats.total} টি`
              : `Total Requests: ${stats.total}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={
                language === "bn"
                  ? "নাম বা রোল দিয়ে খুঁজুন..."
                  : "Search by name or roll..."
              }
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {language === "bn" ? opt.labelBn : opt.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">
            {language === "bn" ? "মোট" : "Total"}
          </p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">
            {language === "bn" ? "বিচারাধীন" : "Pending"}
          </p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">
            {language === "bn" ? "অনুমোদিত" : "Approved"}
          </p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">
            {language === "bn" ? "বাতিল" : "Rejected"}
          </p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* আবেদন লিস্ট */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "শিক্ষার্থী" : "Student"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "ছুটির ধরণ" : "Leave Type"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "সময়কাল" : "Duration"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "কারণ" : "Reason"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "স্ট্যাটাস" : "Status"}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "অ্যাকশন" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredRequests.map((req, idx) => (
                  <React.Fragment key={req.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === req.id ? null : req.id)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {req.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {language === "bn" ? req.nameBn : req.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              রোল: {req.roll}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600">
                          {getTypeText(req.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {req.duration}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-[200px] truncate">
                          {language === "bn" ? req.reason : req.reasonEn}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(req.status)}`}
                        >
                          {getStatusIcon(req.status)}
                          {getStatusText(req.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(req.id, "approved");
                            }}
                            disabled={
                              updatingId === req.id || req.status === "approved"
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title={language === "bn" ? "অনুমোদন" : "Approve"}
                          >
                            {updatingId === req.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <CheckCircle size={18} />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(req.id, "rejected");
                            }}
                            disabled={
                              updatingId === req.id || req.status === "rejected"
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title={language === "bn" ? "বাতিল" : "Reject"}
                          >
                            <XCircle size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(
                                expandedId === req.id ? null : req.id,
                              );
                            }}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            {expandedId === req.id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* বিস্তারিত রো */}
                    {expandedId === req.id && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gray-50/50"
                      >
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                {language === "bn"
                                  ? "আবেদনের তারিখ"
                                  : "Request Date"}
                              </p>
                              <p className="text-sm text-gray-700">
                                {req.createdAt}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                {language === "bn"
                                  ? "ছুটির সময়কাল"
                                  : "Leave Period"}
                              </p>
                              <p className="text-sm text-gray-700">
                                {req.fromDate} - {req.toDate}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500 mb-1">
                                {language === "bn"
                                  ? "বিস্তারিত কারণ"
                                  : "Detailed Reason"}
                              </p>
                              <p className="text-sm text-gray-700">
                                {language === "bn" ? req.reason : req.reasonEn}
                              </p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-gray-500 font-medium">
              {language === "bn"
                ? "কোনো আবেদন পাওয়া যায়নি"
                : "No requests found"}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {language === "bn"
                ? "নতুন আবেদন আসলে এখানে দেখাবে"
                : "New requests will appear here"}
            </p>
          </div>
        )}
      </div>

      {/* ফুটার তথ্য */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>
          {language === "bn" ? "শেষ আপডেট: আজ" : "Last updated: Today"}
        </span>
        <span>
          {language === "bn"
            ? "সর্বশেষ ৩০ দিনের আবেদন"
            : "Last 30 days requests"}
        </span>
      </div>
    </div>
  );
}
