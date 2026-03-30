"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Download, Plus, Calculator, History, Search } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// পেমেন্ট ইন্টারফেস
interface Payment {
  id: string;
  studentName: string;
  studentRoll: string;
  month: string;
  tuitionFee: number;
  examFee: number;
  otherFee: number;
  totalAmount: number;
  createdAt: string;
}

export default function FinancePage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<Payment[]>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("madrasa_payments");
      return savedData ? JSON.parse(savedData) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState({
    studentName: "",
    studentRoll: "",
    month: "",
    tuitionFee: 0,
    examFee: 0,
    otherFee: 0,
  });

  const totalAmount =
    Number(formData.tuitionFee) +
    Number(formData.examFee) +
    Number(formData.otherFee);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.month || totalAmount <= 0) {
      return toast.error("অনুগ্রহ করে সব তথ্য সঠিক দিন");
    }

    setLoading(true);
    const newPayment: Payment = {
      id: `INV-${Date.now()}`,
      ...formData,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    localStorage.setItem("madrasa_payments", JSON.stringify(updatedPayments));

    toast.success("পেমেন্ট সফলভাবে সেভ হয়েছে");
    setFormData({
      studentName: "",
      studentRoll: "",
      month: "",
      tuitionFee: 0,
      examFee: 0,
      otherFee: 0,
    });
    setLoading(false);
  };

  const downloadInvoice = async (payment: Payment) => {
    const element = document.getElementById(`invoice-${payment.id}`);
    if (!element) return;

    toast.loading("ইনভয়েস জেনারেট হচ্ছে...");
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${payment.studentName}_${payment.month}.pdf`);
      toast.dismiss();
      toast.success("ডাউনলোড সম্পন্ন হয়েছে");
    } catch (error) {
      toast.dismiss();
      toast.error("PDF তৈরি করতে সমস্যা হয়েছে");
    }
  };

  // সার্চ ফিল্টারিং
  const filteredPayments = payments.filter(
    (p) =>
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentRoll.includes(searchTerm),
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-primary rounded-2xl text-white">
            <Calculator className="w-6 h-6" />
          </div>
          ফিন্যান্স ও পেমেন্ট
        </h2>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ছাত্রের নাম বা রোল খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ফর্ম সেকশন */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
            <Plus className="w-5 h-5 text-emerald-500" /> নতুন এন্ট্রি
          </h3>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <input
              type="text"
              placeholder="ছাত্রের নাম"
              required
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              value={formData.studentName}
              onChange={(e) =>
                setFormData({ ...formData, studentName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="রোল নম্বর"
              required
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              value={formData.studentRoll}
              onChange={(e) =>
                setFormData({ ...formData, studentRoll: e.target.value })
              }
            />
            <select
              required
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white outline-none"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
            >
              <option value="">মাস নির্বাচন করুন</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2">
                  টিউশন ফি
                </label>
                <input
                  type="number"
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none"
                  value={formData.tuitionFee || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tuitionFee: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-2">
                  পরীক্ষা ফি
                </label>
                <input
                  type="number"
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none"
                  value={formData.examFee || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      examFee: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/10 text-center">
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                মোট পরিমাণ
              </p>
              <p className="text-4xl font-black text-primary mt-1">
                ৳ {totalAmount}
              </p>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "প্রসেসিং..." : "পেমেন্ট নিশ্চিত করুন"}
            </button>
          </form>
        </div>

        {/* টেবিল সেকশন */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-700">
              <History className="w-5 h-5 text-primary" /> পেমেন্ট ইতিহাস
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">ছাত্র ও তথ্য</th>
                  <th className="px-6 py-4">মাস</th>
                  <th className="px-6 py-4">পরিমাণ</th>
                  <th className="px-6 py-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-20">
                      <div className="flex flex-col items-center opacity-20">
                        <History size={48} />
                        <p className="mt-2 font-bold">
                          কোনো রেকর্ড পাওয়া যায়নি
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr
                      key={p.id}
                      className="group hover:bg-slate-50/50 transition-all"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-700">
                          {p.studentName}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-tight">
                          ROLL: {p.studentRoll}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                          {p.month}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-slate-800 font-mono">
                          ৳{p.totalAmount}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => downloadInvoice(p)}
                          className="p-2.5 text-slate-400 hover:text-primary hover:bg-white hover:shadow-md rounded-xl transition-all"
                          title="Download Invoice"
                        >
                          <Download className="w-5 h-5" />
                        </button>

                        {/* Hidden Invoice Template */}
                        <div className="hidden">
                          <div
                            id={`invoice-${p.id}`}
                            className="p-16 bg-white w-[800px] text-slate-900"
                          >
                            <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-10">
                              <div>
                                <h1 className="text-4xl font-black text-primary tracking-tighter">
                                  PAYMENT RECEIPT
                                </h1>
                                <p className="text-slate-400 font-bold mt-1">
                                  ID: {p.id}
                                </p>
                              </div>
                              <div className="text-right">
                                <h2 className="text-2xl font-black">
                                  MADRASA NAME
                                </h2>
                                <p className="text-sm text-slate-500">
                                  Location, City, Bangladesh
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 mb-12">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                  Student Details
                                </p>
                                <p className="text-xl font-black">
                                  {p.studentName}
                                </p>
                                <p className="font-bold text-slate-600">
                                  Roll: {p.studentRoll}
                                </p>
                              </div>
                              <div className="text-right space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                  Payment Info
                                </p>
                                <p className="text-lg font-black">
                                  Month: {p.month}
                                </p>
                                <p className="font-bold text-slate-500">
                                  Date:{" "}
                                  {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <table className="w-full mb-12">
                              <thead>
                                <tr className="border-b-2 border-slate-100 text-left text-[10px] font-black text-slate-400 uppercase">
                                  <th className="py-4">Description</th>
                                  <th className="py-4 text-right">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="font-bold text-slate-700">
                                <tr className="border-b border-slate-50">
                                  <td className="py-4 text-lg">Tuition Fee</td>
                                  <td className="py-4 text-right text-lg">
                                    ৳{p.tuitionFee}
                                  </td>
                                </tr>
                                <tr className="border-b border-slate-50">
                                  <td className="py-4 text-lg">
                                    Examination Fee
                                  </td>
                                  <td className="py-4 text-right text-lg">
                                    ৳{p.examFee}
                                  </td>
                                </tr>
                                <tr className="border-b border-slate-50">
                                  <td className="py-4 text-lg">Others</td>
                                  <td className="py-4 text-right text-lg">
                                    ৳{p.otherFee}
                                  </td>
                                </tr>
                                <tr className="text-primary text-2xl font-black">
                                  <td className="py-6">Total Amount Paid</td>
                                  <td className="py-6 text-right">
                                    ৳{p.totalAmount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <div className="mt-20 flex justify-between gap-20">
                              <div className="flex-1 border-t-2 border-slate-100 pt-4 text-center text-sm font-bold text-slate-400">
                                Accountant Signature
                              </div>
                              <div className="flex-1 border-t-2 border-slate-100 pt-4 text-center text-sm font-bold text-slate-400">
                                Principal Signature
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
