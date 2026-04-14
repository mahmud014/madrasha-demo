"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  Loader2,
  Search,
  User,
  Phone,
  BookOpen,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Mail,
  MapPin,
  GraduationCap,
  CreditCard,
  AlertCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// টাইপ ডিফাইন করুন
type AdmissionStatus = "pending" | "approved" | "rejected";
type PaymentStatus = "unpaid" | "paid" | "partial";

interface Admission {
  _id: string;
  studentNameEn: string;
  studentNameBn: string;
  email: string;
  department: string;
  guardianPhone: string;
  status: AdmissionStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  studentPhoto?: string;
  fatherName?: string;
  motherName?: string;
  presentAddress?: string;
  permanentAddress?: string;
  previousSchool?: string;
  birthRegNo?: string;
  bloodGroup?: string;
}

export default function AdminAdmissions() {
  const { language } = useLanguage();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<Admission | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // ডাটা ফেচ করার ফাংশন
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admissions", { cache: "no-store" });
      const result = await res.json();

      if (result.success) {
        setAdmissions(result.data || []);
      } else {
        toast.error(language === "bn" ? "ডাটা পাওয়া যায়নি" : "Data not found");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error(
        language === "bn"
          ? "সার্ভারের সাথে যোগাযোগ করা সম্ভব হচ্ছে না"
          : "Cannot connect to server",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // স্ট্যাটাস আপডেট ফাংশন
  const handleStatusUpdate = async (id: string, newStatus: AdmissionStatus) => {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();

      if (result.success) {
        setAdmissions((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item,
          ),
        );
        toast.success(
          language === "bn"
            ? `স্ট্যাটাস আপডেট করা হয়েছে`
            : `Status updated successfully`,
        );
      } else {
        toast.error(result.error || "আপডেট করা সম্ভব হয়নি");
      }
    } catch (err) {
      toast.error(
        language === "bn"
          ? "আপডেট করার সময় সমস্যা হয়েছে"
          : "Failed to update status",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ডিলিট ফাংশন
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch(`/api/admissions/${deleteConfirm._id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setAdmissions((prev) =>
          prev.filter((item) => item._id !== deleteConfirm._id),
        );
        toast.success(
          language === "bn"
            ? "আবেদনটি ডিলিট করা হয়েছে"
            : "Application deleted successfully",
        );
      } else {
        toast.error(result.error || "ডিলিট করা সম্ভব হয়নি");
      }
    } catch (err) {
      toast.error(
        language === "bn" ? "ডিলিট করার সময় সমস্যা হয়েছে" : "Failed to delete",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ফিল্টার এবং সার্চ
  const filteredAdmissions = admissions.filter((item) => {
    const matchesSearch =
      (item.studentNameEn || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.studentNameBn || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.guardianPhone || "").includes(searchQuery) ||
      (item.department || "").toLowerCase().includes(searchQuery);
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: AdmissionStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusText = (status: AdmissionStatus) => {
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

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "partial":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getPaymentStatusText = (status: PaymentStatus) => {
    if (language === "bn") {
      switch (status) {
        case "paid":
          return "পরিশোধিত";
        case "partial":
          return "আংশিক";
        default:
          return "অপরিশোধিত";
      }
    }
    return status;
  };

  const statusOptions = [
    { value: "all", labelBn: "সব", labelEn: "All" },
    { value: "pending", labelBn: "বিচারাধীন", labelEn: "Pending" },
    { value: "approved", labelBn: "অনুমোদিত", labelEn: "Approved" },
    { value: "rejected", labelBn: "বাতিল", labelEn: "Rejected" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "ভর্তি আবেদনসমূহ" : "Admission Applications"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? `মোট আবেদন: ${admissions.length} টি`
              : `Total Applications: ${admissions.length}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={
                language === "bn"
                  ? "নাম, ফোন বা বিভাগ দিয়ে খুঁজুন..."
                  : "Search by name, phone or department..."
              }
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* টেবিল */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "শিক্ষার্থীর নাম" : "Student Name"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "বিভাগ" : "Department"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "ফোন" : "Phone"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "স্ট্যাটাস" : "Status"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "পেমেন্ট" : "Payment"}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === "bn" ? "অ্যাকশন" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                      <p className="text-gray-400 animate-pulse text-sm">
                        {language === "bn"
                          ? "ডাটা লোড হচ্ছে..."
                          : "Loading data..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmissions.length > 0 ? (
                <AnimatePresence>
                  {filteredAdmissions.map((app, idx) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {app.studentNameEn.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {app.studentNameEn}
                            </p>
                            <p className="text-xs text-gray-400">
                              {app.studentNameBn}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600">
                          {app.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Phone size={12} className="text-gray-400" />
                          {app.guardianPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              app._id,
                              e.target.value as AdmissionStatus,
                            )
                          }
                          disabled={updatingStatus === app._id}
                          className={`px-2 py-1 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-primary/20 cursor-pointer ${getStatusColor(app.status)}`}
                        >
                          <option value="pending">
                            {language === "bn" ? "বিচারাধীন" : "Pending"}
                          </option>
                          <option value="approved">
                            {language === "bn" ? "অনুমোদিত" : "Approved"}
                          </option>
                          <option value="rejected">
                            {language === "bn" ? "বাতিল" : "Rejected"}
                          </option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(app.paymentStatus)}`}
                        >
                          {getPaymentStatusText(app.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedAdmission(app)}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title={language === "bn" ? "বিস্তারিত" : "Details"}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(app)}
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
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-24 text-center text-gray-400 text-sm"
                  >
                    {language === "bn"
                      ? "কোনো আবেদন পাওয়া যায়নি"
                      : "No applications found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ডিটেইলস মোডাল */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {language === "bn"
                  ? "আবেদনের বিস্তারিত"
                  : "Application Details"}
              </h3>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ব্যক্তিগত তথ্য */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <User size={16} />
                  {language === "bn"
                    ? "ব্যক্তিগত তথ্য"
                    : "Personal Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "নাম (ইংরেজি)" : "Name (English)"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.studentNameEn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "নাম (বাংলা)" : "Name (Bengali)"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.studentNameBn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "জন্ম নিবন্ধন নম্বর"
                        : "Birth Registration No"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.birthRegNo || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "রক্তের গ্রুপ" : "Blood Group"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.bloodGroup || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* অভিভাবকের তথ্য */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <Phone size={16} />
                  {language === "bn" ? "অভিভাবকের তথ্য" : "Parent Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "পিতার নাম" : "Father's Name"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.fatherName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "মাতার নাম" : "Mother's Name"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.motherName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.guardianPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* একাডেমিক তথ্য */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <BookOpen size={16} />
                  {language === "bn" ? "একাডেমিক তথ্য" : "Academic Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "বিভাগ" : "Department"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "পূর্ববর্তী শিক্ষাপ্রতিষ্ঠান"
                        : "Previous School"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.previousSchool || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ঠিকানা */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  {language === "bn" ? "ঠিকানা" : "Address"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn" ? "বর্তমান ঠিকানা" : "Present Address"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.presentAddress || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "স্থায়ী ঠিকানা"
                        : "Permanent Address"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAdmission.permanentAddress || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* স্ট্যাটাস ও পেমেন্ট */}
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <CreditCard size={16} />
                  {language === "bn"
                    ? "স্ট্যাটাস ও পেমেন্ট"
                    : "Status & Payment"}
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "আবেদনের স্ট্যাটাস"
                        : "Application Status"}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(selectedAdmission.status)}`}
                    >
                      {getStatusText(selectedAdmission.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "পেমেন্ট স্ট্যাটাস"
                        : "Payment Status"}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(selectedAdmission.paymentStatus)}`}
                    >
                      {getPaymentStatusText(selectedAdmission.paymentStatus)}
                    </span>
                  </div>
                </div>
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
                  ? "আবেদন ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? `${deleteConfirm.studentNameEn} এর আবেদনটি ডিলিট করতে চান?`
                  : `Are you sure you want to delete application for ${deleteConfirm.studentNameEn}?`}
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
