"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Search,
  Edit,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// ইন্টারফেস টাইপগুলো নির্দিষ্ট করা
interface IResult {
  _id: string;
  studentName: string;
  roll: string;
  gpa: string;
  year: string;
  exam: string;
}

// এক্সেল ডাটার জন্য ইন্টারফেস
interface IExcelRow {
  studentName: string;
  roll: string | number;
  gpa: string | number;
  year: string | number;
  exam: string;
}

export default function ResultsPage() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [results, setResults] = useState<IResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  // Modal & Pagination States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<Partial<IResult> | null>(
    null,
  );
  const [viewData, setViewData] = useState<IResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/results");
      const data = await res.json();
      if (data.success) setResults(data.data || []);
    } catch (err) {
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // --- Sample Excel Download Logic ---
  const downloadSampleExcel = () => {
    const sampleData = [
      {
        studentName: "Abdur Rahman",
        roll: "101",
        gpa: "5.00",
        year: "2026",
        exam: "Six",
      },
      {
        studentName: "Sumaiya Akter",
        roll: "102",
        gpa: "4.80",
        year: "2026",
        exam: "Seven",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "result_format_sample.xlsx");
    toast.info("স্যাম্পল ফরম্যাট ডাউনলোড হয়েছে");
  };

  // --- Excel Bulk Upload Logic ---
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt: ProgressEvent<FileReader>) => {
      try {
        const bstr = evt.target?.result;
        if (!bstr) return;

        const wb = XLSX.read(bstr, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<IExcelRow>(ws);

        if (jsonData.length === 0) {
          toast.error("ফাইলে কোনো ডাটা পাওয়া যায়নি!");
          return;
        }

        const res = await fetch("/api/results/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results: jsonData }),
        });

        const resData = await res.json();
        if (resData.success) {
          toast.success(`${jsonData.length} টি রেজাল্ট সফলভাবে আপলোড হয়েছে!`);
          fetchResults();
        } else {
          toast.error(resData.message || "আপলোড ব্যর্থ হয়েছে");
        }
      } catch (err) {
        toast.error("ফাইল ফরম্যাট সঠিক নয়!");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- Single Save/Update Logic ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentResult?._id ? "PATCH" : "POST";
    const url = currentResult?._id
      ? `/api/results/${currentResult._id}`
      : "/api/results";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentResult),
      });
      if (res.ok) {
        toast.success(currentResult?._id ? "আপডেট হয়েছে" : "যোগ হয়েছে");
        setIsModalOpen(false);
        fetchResults();
      }
    } catch (err) {
      toast.error("ব্যর্থ হয়েছে!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করবেন?")) return;
    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResults((prev) => prev.filter((r) => r._id !== id));
        toast.success("ডিলিট হয়েছে");
      }
    } catch (err) {
      toast.error("ভুল হয়েছে");
    }
  };

  // Filter & Pagination Logic
  const filteredResults = results.filter((res) => {
    const matchesSearch =
      res.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.roll?.toString().includes(searchQuery);
    const matchesClass = classFilter === "All" || res.exam === classFilter;
    return matchesSearch && matchesClass;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentItems = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 p-4 md:p-8 bg-slate-50/50 min-h-screen font-sans">
      {/* --- Top Navbar/Header --- */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-5 justify-between items-center">
        <div className="text-center xl:text-left">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 justify-center xl:justify-start">
            <FileSpreadsheet className="text-indigo-600 w-7 h-7" /> ফলাফল
            ব্যবস্থাপনা
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            মোট{" "}
            <span className="text-indigo-600 font-bold">
              {filteredResults.length}
            </span>{" "}
            টি রেজাল্ট
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto">
          {/* Class Filter */}
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/10"
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">সকল ক্লাস</option>
              <option value="Six">Class 6</option>
              <option value="Seven">Class 7</option>
              <option value="Eight">Class 8</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="নাম বা রোল..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full outline-none focus:ring-2 focus:ring-indigo-500/20"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Format Download */}
            <button
              onClick={downloadSampleExcel}
              className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="font-semibold text-sm">স্যাম্পল</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span className="font-semibold">আপলোড</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
            />

            <button
              onClick={() => {
                setCurrentResult({});
                setIsModalOpen(true);
              }}
              className="flex-1 md:flex-none bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus className="w-5 h-5" />{" "}
              <span className="font-semibold">নতুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Table Container --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  শিক্ষার্থী
                </th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  রোল
                </th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  ক্লাস
                </th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  GPA
                </th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500/50" />
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((res) => (
                  <tr
                    key={res._id}
                    className="hover:bg-indigo-50/30 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-700">
                        {res.studentName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {res.year} শিক্ষাবর্ষ
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-mono font-medium text-slate-600">
                      {res.roll}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase">
                        {res.exam}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-xl font-black text-sm">
                        {res.gpa}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setViewData(res)}
                        className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentResult(res);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(res._id)}
                        className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-slate-400 italic"
                  >
                    কোনো রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center px-8">
            <span className="text-sm font-medium text-slate-500">
              পেজ {currentPage} / {totalPages}
            </span>
            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800">
                {currentResult?._id ? "এডিট করুন" : "নতুন তথ্য"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2 uppercase">
                  শিক্ষার্থীর নাম
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  value={currentResult?.studentName || ""}
                  onChange={(e) =>
                    setCurrentResult({
                      ...currentResult,
                      studentName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">
                    রোল
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    value={currentResult?.roll || ""}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        roll: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">
                    GPA
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    value={currentResult?.gpa || ""}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        gpa: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">
                    ক্লাস
                  </label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    value={currentResult?.exam || ""}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        exam: e.target.value,
                      })
                    }
                  >
                    <option value="">সিলেক্ট</option>
                    <option value="Six">Class 6</option>
                    <option value="Seven">Class 7</option>
                    <option value="Eight">Class 8</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">
                    সাল
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={currentResult?.year || ""}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        year: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 transition-all active:scale-[0.98]">
                {currentResult?._id ? "আপডেট নিশ্চিত করুন" : "সেভ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
