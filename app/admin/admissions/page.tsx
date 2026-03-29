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
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

// ১. টাইপ-সেফটি ইন্টারফেস
interface Admission {
  _id: string;
  studentNameEn: string;
  studentNameBn: string;
  department: string;
  guardianPhone: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "unpaid" | "paid" | "partial";
  createdAt: string;
}

export default function AdminAdmissions() {
  const { t } = useLanguage();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ২. ডাটা ফেচ করার ফাংশন
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admissions", { cache: "no-store" });
      const result = await res.json();

      if (result.success) {
        setAdmissions(result.data || []);
      } else {
        toast.error("ডাটা পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("সার্ভারের সাথে যোগাযোগ করা সম্ভব হচ্ছে না");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // ৩. ডিলিট ফাংশন
  const handleDelete = async (id: string) => {
    // window.confirm এর বদলে আপনি চাইলে সুন্দর মোডাল ব্যবহার করতে পারেন
    if (window.confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) {
      try {
        const res = await fetch(`/api/admissions/${id}`, { method: "DELETE" });
        const result = await res.json();

        if (result.success) {
          setAdmissions((prev) => prev.filter((item) => item._id !== id));
          toast.success("আবেদনটি সফলভাবে ডিলিট করা হয়েছে");
        } else {
          toast.error(result.error || "ডিলিট করা সম্ভব হয়নি");
        }
      } catch (err) {
        toast.error("ডিলিট করার সময় টেকনিক্যাল সমস্যা হয়েছে");
      }
    }
  };

  // ৪. সার্চ ফিল্টারিং (সেফ চেক সহ)
  const filteredAdmissions = admissions.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      (item.studentNameEn || "").toLowerCase().includes(search) ||
      (item.guardianPhone || "").includes(search) ||
      (item.department || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {t("admin.navAdmissions") || "ভর্তি আবেদনসমূহ"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              মোট আবেদন: {admissions.length} টি
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="নাম, ফোন বা বিভাগ দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    শিক্ষার্থীর নাম
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    বিভাগ
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    অভিভাবকের ফোন
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    স্ট্যাটাস
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                        <p className="text-slate-400 animate-pulse">
                          ডাটা লোড হচ্ছে...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredAdmissions.length > 0 ? (
                  filteredAdmissions.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {app.studentNameEn}
                            </p>
                            <p className="text-xs text-slate-400">
                              {app.studentNameBn}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <BookOpen className="w-4 h-4 text-slate-300" />
                          <span className="text-sm font-medium">
                            {app.department}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-mono text-sm">
                          <Phone className="w-4 h-4 text-slate-300" />
                          {app.guardianPhone}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {app.status || "pending"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right space-x-2">
                        <button
                          className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                          onClick={() => console.log("Details of:", app)}
                          title="বিস্তারিত"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-24 text-center text-slate-400 italic"
                    >
                      কোনো আবেদন পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
