"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Download,
  Plus,
  Calculator,
  History,
  Trash2,
  Eye,
  X,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const { t, language } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(true);

  // ক্যালকুলেটর স্টেট
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

  // মাসের তালিকা
  const months = [
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
  ];

  useEffect(() => {
    const savedData = localStorage.getItem("madrasa_payments");
    if (savedData) {
      setPayments(JSON.parse(savedData));
    }
  }, []);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.studentName ||
      !formData.studentRoll ||
      !formData.month ||
      totalAmount <= 0
    ) {
      return toast.error(
        language === "bn" ? "সব ঘর পূরণ করুন" : "Please fill all fields",
      );
    }

    setLoading(true);
    try {
      const newPayment: Payment = {
        id: Date.now().toString(),
        ...formData,
        totalAmount,
        createdAt: new Date().toISOString(),
      };

      const updatedPayments = [newPayment, ...payments];
      setPayments(updatedPayments);
      localStorage.setItem("madrasa_payments", JSON.stringify(updatedPayments));

      toast.success(
        language === "bn"
          ? "পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!"
          : "Payment successful!",
      );
      setFormData({
        studentName: "",
        studentRoll: "",
        month: "",
        tuitionFee: 0,
        examFee: 0,
        otherFee: 0,
      });
    } catch (error) {
      toast.error(
        language === "bn" ? "সেভ করতে সমস্যা হয়েছে" : "Failed to save",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    const updatedPayments = payments.filter((p) => p.id !== id);
    setPayments(updatedPayments);
    localStorage.setItem("madrasa_payments", JSON.stringify(updatedPayments));
    toast.success(
      language === "bn" ? "পেমেন্ট ডিলিট হয়েছে" : "Payment deleted",
    );
    setDeleteConfirm(null);
  };

  const downloadInvoice = async (payment: Payment) => {
    const element = document.getElementById(`invoice-${payment.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${payment.studentRoll}_${payment.month}.pdf`);
      toast.success(
        language === "bn"
          ? "ইনভয়েস ডাউনলোড হচ্ছে..."
          : "Downloading invoice...",
      );
    } catch (error) {
      toast.error(
        language === "bn"
          ? "PDF তৈরি করতে সমস্যা হয়েছে"
          : "Failed to create PDF",
      );
    }
  };

  // ফিল্টার করা পেমেন্ট
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentRoll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth =
      selectedMonth === "all" || payment.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
  const monthlyRevenue = payments.reduce((sum, p) => {
    if (p.month === new Date().toLocaleString("default", { month: "long" })) {
      return sum + p.totalAmount;
    }
    return sum;
  }, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8" />
            {language === "bn" ? "ফিন্যান্স ও পেমেন্ট" : "Finance & Payment"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === "bn"
              ? "পেমেন্ট ম্যানেজমেন্ট সিস্টেম"
              : "Payment Management System"}
          </p>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="btn btn-outline btn-sm gap-2"
        >
          {showCalculator ? <X size={16} /> : <Plus size={16} />}
          {showCalculator
            ? language === "bn"
              ? "ফর্ম বন্ধ করুন"
              : "Close Form"
            : language === "bn"
              ? "নতুন পেমেন্ট"
              : "New Payment"}
        </button>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-xs text-gray-500">
              {language === "bn" ? "মোট পেমেন্ট" : "Total Payments"}
            </p>
            <p className="text-2xl font-bold text-primary">{payments.length}</p>
          </div>
        </div>
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-xs text-gray-500">
              {language === "bn" ? "মোট সংগ্রহ" : "Total Revenue"}
            </p>
            <p className="text-2xl font-bold text-green-600">
              ৳ {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-xs text-gray-500">
              {language === "bn" ? "চলতি মাসের সংগ্রহ" : "This Month"}
            </p>
            <p className="text-2xl font-bold text-orange-600">
              ৳ {monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-xs text-gray-500">
              {language === "bn" ? "গড় পেমেন্ট" : "Average Payment"}
            </p>
            <p className="text-2xl font-bold text-blue-600">
              ৳{" "}
              {payments.length
                ? Math.round(totalRevenue / payments.length).toLocaleString()
                : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* পেমেন্ট ফর্ম */}
        {showCalculator && (
          <div className="lg:col-span-1 card bg-white shadow-sm border border-gray-100">
            <div className="card-body p-5">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-secondary" />
                {language === "bn" ? "নতুন পেমেন্ট" : "New Payment"}
              </h3>
              <form onSubmit={handleAddPayment} className="space-y-3">
                <input
                  type="text"
                  placeholder={
                    language === "bn" ? "শিক্ষার্থীর নাম" : "Student Name"
                  }
                  className="input w-full text-sm"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder={language === "bn" ? "রোল নম্বর" : "Roll Number"}
                  className="input input-bordered w-full text-sm"
                  value={formData.studentRoll}
                  onChange={(e) =>
                    setFormData({ ...formData, studentRoll: e.target.value })
                  }
                />
                <select
                  className="select select-bordered w-full text-sm"
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: e.target.value })
                  }
                >
                  <option value="">
                    {language === "bn" ? "মাস নির্বাচন করুন" : "Select Month"}
                  </option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder={language === "bn" ? "টিউশন ফি" : "Tuition Fee"}
                    className="input input-bordered w-full text-sm"
                    value={formData.tuitionFee || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tuitionFee: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder={language === "bn" ? "পরীক্ষা ফি" : "Exam Fee"}
                    className="input input-bordered w-full text-sm"
                    value={formData.examFee || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        examFee: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <input
                  type="number"
                  placeholder={language === "bn" ? "অন্যান্য ফি" : "Other Fee"}
                  className="input input-bordered w-full text-sm"
                  value={formData.otherFee || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherFee: Number(e.target.value),
                    })
                  }
                />

                <div className="p-3 bg-primary/5 rounded-xl text-center">
                  <p className="text-xs text-gray-500">
                    {language === "bn" ? "মোট পরিমাণ" : "Total Amount"}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ৳ {totalAmount}
                  </p>
                </div>

                <button
                  disabled={loading}
                  className="btn bg-primary text-white w-full"
                >
                  {loading
                    ? language === "bn"
                      ? "প্রসেসিং..."
                      : "Processing..."
                    : language === "bn"
                      ? "পেমেন্ট নিশ্চিত করুন"
                      : "Confirm Payment"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* পেমেন্ট হিস্ট্রি */}
        <div
          className={`${showCalculator ? "lg:col-span-2" : "lg:col-span-3"} card bg-white shadow-sm border border-gray-100`}
        >
          <div className="card-body p-0">
            <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                {language === "bn" ? "পেমেন্ট হিস্ট্রি" : "Payment History"}
              </h3>

              {/* সার্চ ও ফিল্টার */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === "bn" ? "খুঁজুন..." : "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered input-sm pl-9 w-full sm:w-40"
                  />
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="select select-bordered select-sm w-full sm:w-32"
                >
                  <option value="all">
                    {language === "bn" ? "সব মাস" : "All Months"}
                  </option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[550px]">
                <thead className="bg-gray-50 text-xs sm:text-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      {language === "bn" ? "শিক্ষার্থী" : "Student"}
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700">
                      {language === "bn" ? "মাস" : "Month"}
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                      {language === "bn" ? "টাকা" : "Amount"}
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                      {language === "bn" ? "অ্যাকশন" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-10 text-gray-400"
                      >
                        {language === "bn"
                          ? "কোনো পেমেন্ট রেকর্ড নেই"
                          : "No payment records found"}
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold">{p.studentName}</div>
                          <div className="text-xs text-gray-400">
                            Roll: {p.studentRoll}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.month}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          ৳ {p.totalAmount}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => downloadInvoice(p)}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title={
                                language === "bn"
                                  ? "ইনভয়েস ডাউনলোড"
                                  : "Download Invoice"
                              }
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              title={language === "bn" ? "ডিলিট" : "Delete"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredPayments.length > 0 && (
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 font-semibold">
                        {language === "bn" ? "মোট" : "Total"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary">
                        ৳{" "}
                        {filteredPayments
                          .reduce((sum, p) => sum + p.totalAmount, 0)
                          .toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ডিলিট কনফার্মেশন */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {language === "bn"
                  ? "পেমেন্ট ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? "আপনি কি নিশ্চিত যে এই পেমেন্ট ডিলিট করতে চান?"
                  : "Are you sure you want to delete this payment?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={() => handleDeletePayment(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  {language === "bn" ? "ডিলিট" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ইনভয়েস টেমপ্লেট (হিডেন) */}
      {payments.map((p) => (
        <div key={p.id} className="fixed left-[-9999px] top-0">
          <div
            id={`invoice-${p.id}`}
            className="p-8 bg-white text-black w-[800px] font-sans"
          >
            <div className="text-center border-b-2 border-primary pb-4 mb-6">
              <h1 className="text-3xl font-bold text-primary">
                Payment Receipt
              </h1>
              <p className="text-sm text-gray-500">Madrasa Management System</p>
            </div>
            <div className="flex justify-between mb-8">
              <div>
                <p>
                  <strong>Student Name:</strong> {p.studentName}
                </p>
                <p>
                  <strong>Roll Number:</strong> {p.studentRoll}
                </p>
              </div>
              <div className="text-right">
                <p>
                  <strong>Billing Month:</strong> {p.month}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">
                    Description
                  </th>
                  <th className="border border-gray-300 p-3 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Tuition Fee</td>
                  <td className="border border-gray-300 p-3 text-right">
                    ৳ {p.tuitionFee}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Exam Fee</td>
                  <td className="border border-gray-300 p-3 text-right">
                    ৳ {p.examFee}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Other Fee</td>
                  <td className="border border-gray-300 p-3 text-right">
                    ৳ {p.otherFee}
                  </td>
                </tr>
                <tr className="font-bold bg-primary/5">
                  <td className="border border-gray-300 p-3">Total Paid</td>
                  <td className="border border-gray-300 p-3 text-right text-primary">
                    ৳ {p.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 flex justify-between">
              <div className="text-center w-40 border-t border-black pt-2">
                Accountant
              </div>
              <div className="text-center w-40 border-t border-black pt-2">
                Principal
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-gray-400">
              Automatically generated by Madrasa Management System
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
