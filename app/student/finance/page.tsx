"use client";

import React from "react";
import {
  Download,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";

const FeesPage = () => {
  const { language, t } = useLanguage();

  // পেমেন্ট হিস্ট্রি ডাটা
  const history = [
    {
      id: "#102",
      month: "ফেব্রুয়ারি ২০২৬",
      amount: "১২০০",
      status: "Paid",
      date: "05 Feb",
    },
    {
      id: "#101",
      month: "জানুয়ারি ২০২৬",
      amount: "১২০০",
      status: "Paid",
      date: "02 Jan",
    },
    {
      id: "#100",
      month: "ডিসেম্বর ২০২৫",
      amount: "১২০০",
      status: "Paid",
      date: "05 Dec",
    },
    {
      id: "#099",
      month: "নভেম্বর ২০২৫",
      amount: "১২০০",
      status: "Paid",
      date: "03 Nov",
    },
  ];

  // চার্টের জন্য ডাটা (মাসিক ফি)
  const monthlyData = [
    { month: language === "bn" ? "জানু" : "Jan", amount: 1200 },
    { month: language === "bn" ? "ফেব" : "Feb", amount: 1200 },
    { month: language === "bn" ? "মার্চ" : "Mar", amount: 0 },
    { month: language === "bn" ? "এপ্রিল" : "Apr", amount: 0 },
    { month: language === "bn" ? "মে" : "May", amount: 0 },
  ];

  const totalDue = 2500;
  const totalPaid = 4800;
  const totalFees = 7300;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "মোট ফি" : "Total Fees"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            ৳ {totalFees.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "মোট প্রদান" : "Total Paid"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            ৳ {totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "বাকি থাকা" : "Due"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            ৳ {totalDue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ব্যালেন্স কার্ড + চার্ট */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ব্যালেন্স কার্ড */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="opacity-80 text-sm sm:text-base">
                {language === "bn" ? "মোট বকেয়া" : "Total Due"}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-1 sm:mt-2">
                ৳ {totalDue.toLocaleString()}
              </h2>
            </div>
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
          </div>
          <button className="mt-4 sm:mt-6 bg-white text-primary px-4 sm:px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition text-sm sm:text-base">
            <CreditCard size={16} className="sm:w-5 sm:h-5" />
            {language === "bn" ? "অনলাইনে পেমেন্ট করুন" : "Pay Online"}
          </button>
        </div>

        {/* চার্ট */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-primary" />
              {language === "bn" ? "মাসিক ফি জমা" : "Monthly Fee Collection"}
            </h3>
          </div>
          <div className="h-48 sm:h-56 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a4d2e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1a4d2e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `৳ ${value}`,
                    language === "bn" ? "জমা" : "Deposit",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#1a4d2e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#feeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* পেমেন্ট হিস্ট্রি টেবিল */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {language === "bn" ? "পেমেন্ট হিস্ট্রি" : "Payment History"}
          </h3>
          <button className="text-primary text-sm font-medium hover:underline">
            {language === "bn" ? "সব দেখুন" : "View All"}
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-xl hover:bg-gray-50 transition gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-full">
                  <CheckCircle2 size={14} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    {item.month}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {language === "bn" ? "আইডি" : "ID"}: {item.id} • {item.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6">
                <span className="font-bold text-gray-700 text-sm sm:text-base">
                  ৳ {item.amount}
                </span>
                <button
                  title={
                    language === "bn" ? "রসিদ ডাউনলোড" : "Download Receipt"
                  }
                  className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg text-blue-600 transition"
                >
                  <Download size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-sm sm:text-base">
              {language === "bn"
                ? "কোনো পেমেন্ট ইতিহাস নেই"
                : "No payment history found"}
            </p>
          </div>
        )}
      </div>

      {/* পেমেন্ট সামারি */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              {language === "bn" ? "শেষ পেমেন্টের তারিখ" : "Last Payment Date"}
            </p>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              ৫ ফেব্রুয়ারি, ২০২৬
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500">
              {language === "bn"
                ? "পরবর্তী পেমেন্টের তারিখ"
                : "Next Payment Date"}
            </p>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              ১ মার্চ, ২০২৬
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesPage;
