"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Printer,
  Download,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface StudentResult {
  studentName: string;
  roll: string;
  gpa: string;
  year: string;
  exam?: string;
  status?: string;
}

type ResultState = StudentResult | "not_found" | null;

export default function Results() {
  const { t } = useLanguage();
  const [roll, setRoll] = useState<string>("");
  const [result, setResult] = useState<ResultState>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim()) {
      toast.error("অনুগ্রহ করে রোল নম্বর দিন");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/results?roll=${encodeURIComponent(roll)}`);
      const data = await res.json();

      if (res.status === 404) {
        setResult("not_found");
      } else if (!res.ok) {
        throw new Error("Search failed");
      } else {
        setResult(data.data as StudentResult);
        toast.success("রেজাল্ট পাওয়া গেছে!");
      }
    } catch (error: unknown) {
      toast.error(t("results.error") || "সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 bg-[#F8FAFC] min-h-screen font-sans">
      {/* --- Hero Section with Background Image --- */}
      <section className="bg-primary pt-24 pb-32 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
            opacity: 0.2,
          }}
        />

        {/* Gradient Overlay for Text Clarity */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 mb-4"
          >
            <GraduationCap className="w-10 h-10 text-secondary-light" />
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight"
            >
              {t("results.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm md:text-xl max-w-2xl mx-auto font-light"
            >
              {t("results.subtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* --- Search Container --- */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-30">
        <div className="bg-white/70 backdrop-blur-2xl p-3 rounded-2xl shadow-2xl border border-white/50">
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-inner">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  type="text"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder={t("results.placeholder")}
                  className="w-full pl-16 pr-8 py-6 rounded-3xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] text-white font-black px-12 py-6 rounded-3xl transition-all shadow-xl shadow-secondary/30 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
              >
                {loading ? (
                  <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t("results.button")}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Results Rendering */}
            <AnimatePresence mode="wait">
              {result && result !== "not_found" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-12"
                >
                  <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="p-8 md:p-12">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                          <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                            <FileText className="w-12 h-12" />
                          </div>
                          <div className="space-y-2">
                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                              Academic Record
                            </span>
                            <h3 className="text-4xl font-black text-slate-800 leading-tight">
                              {result.studentName}
                            </h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                              <span className="bg-slate-100 px-4 py-1.5 rounded-xl text-sm font-bold text-slate-600">
                                Roll: {result.roll}
                              </span>
                              <span className="bg-slate-100 px-4 py-1.5 rounded-xl text-sm font-bold text-slate-600">
                                Year: {result.year}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-auto bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 text-center min-w-[200px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            GPA Score
                          </p>
                          <div className="text-6xl font-black text-secondary mb-2 tracking-tighter">
                            {result.gpa}
                          </div>
                          <div className="inline-flex items-center gap-2 text-green-600 font-black text-xs bg-green-50 px-4 py-2 rounded-full uppercase">
                            <CheckCircle className="w-4 h-4" /> Passed
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 group flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl transition-all font-bold shadow-lg">
                          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                          Download Transcript
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-5 rounded-2xl transition-all font-bold"
                        >
                          <Printer className="w-5 h-5" /> Print
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Not Found View */}
              {result === "not_found" && (
                <motion.div
                  key="not-found"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 text-center py-20 px-8 bg-red-50/30 rounded-[3rem] border border-red-100/50"
                >
                  <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-200/50">
                    <XCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-3">
                    {t("results.notFoundTitle")}
                  </h3>
                  <p className="text-slate-500 text-lg max-w-sm mx-auto font-light">
                    {t("results.notFoundSubtitle")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
