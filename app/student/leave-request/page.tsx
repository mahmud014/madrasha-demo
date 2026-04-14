"use client";

import React, { useState } from "react";
import {
  Send,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LeaveRequestPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "sick",
    reason: "",
  });

  const leaveTypes = [
    { value: "sick", labelBn: "অসুস্থতা জনিত ছুটি", labelEn: "Sick Leave" },
    {
      value: "personal",
      labelBn: "ব্যক্তিগত জরুরি কারণ",
      labelEn: "Personal Emergency",
    },
    { value: "urgent", labelBn: "জরুরি কাজ", labelEn: "Urgent Work" },
    { value: "other", labelBn: "অন্যান্য", labelEn: "Other" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ভ্যালিডেশন
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      toast.error(
        language === "bn"
          ? "দয়া করে সব তথ্য পূরণ করুন"
          : "Please fill all required fields",
      );
      setIsSubmitting(false);
      return;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast.error(
        language === "bn"
          ? "শেষ তারিখ শুরু তারিখের পরে হতে হবে"
          : "End date must be after start date",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/leave-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentId: user?.id,
          studentName: user?.name,
          status: "pending",
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          language === "bn"
            ? "আপনার আবেদন সফলভাবে জমা হয়েছে"
            : "Your application has been submitted successfully",
        );
        setFormData({
          fromDate: "",
          toDate: "",
          leaveType: "sick",
          reason: "",
        });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(
        language === "bn"
          ? "আবেদন জমা দিতে সমস্যা হয়েছে"
          : "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // আজকের তারিখ (min date)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-0">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border">
        {/* হেডার */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FileText className="text-orange-500 w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {language === "bn" ? "ছুটির আবেদন" : "Leave Application"}
          </h2>
        </div>

        {/* ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* তারিখ রেঞ্জ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                {language === "bn" ? "কবে থেকে" : "From Date"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                {language === "bn" ? "কবে পর্যন্ত" : "To Date"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  min={formData.fromDate || today}
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* ছুটির ধরণ */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              {language === "bn" ? "ছুটির ধরণ" : "Leave Type"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm bg-white"
            >
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {language === "bn" ? type.labelBn : type.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* বিস্তারিত কারণ */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              {language === "bn" ? "বিস্তারিত কারণ" : "Reason"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              placeholder={
                language === "bn"
                  ? "আপনার কারণ লিখুন..."
                  : "Write your reason here..."
              }
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm resize-none"
            />
          </div>

          {/* নোট */}
          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-600">
              {language === "bn"
                ? "নোট: আপনার আবেদন অনুমোদনের জন্য শিক্ষক/অধ্যক্ষের কাছে পাঠানো হবে। অনুমোদন সাপেক্ষে আপনার ছুটি মঞ্জুর হবে।"
                : "Note: Your application will be sent to the teacher/principal for approval. Leave will be granted upon approval."}
            </p>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {language === "bn" ? "পাঠানো হচ্ছে..." : "Submitting..."}
                </span>
              </>
            ) : (
              <>
                <Send size={16} className="sm:w-4 sm:h-4" />
                <span>
                  {language === "bn" ? "আবেদন জমা দিন" : "Submit Application"}
                </span>
              </>
            )}
          </button>
        </form>

        {/* ইতিমধ্যে আবেদন করা থাকলে দেখানোর জন্য */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {language === "bn"
                ? "পূর্ববর্তী আবেদন দেখতে"
                : "View previous applications"}
            </p>
            <button className="text-orange-500 text-xs font-medium hover:underline">
              {language === "bn" ? "আমার আবেদনসমূহ" : "My Applications"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
