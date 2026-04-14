"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const AttendancePage = () => {
  const { language, t } = useLanguage();
  const daysInMonth = 31;

  // মক ডাটা: ১-৩১ তারিখের হাজিরা
  const attendanceRecord: Record<number, string> = {
    1: "present",
    2: "present",
    3: "absent",
    4: "present",
    5: "present",
    6: "present",
    7: "absent",
    8: "present",
    9: "absent",
    10: "present",
    11: "present",
    12: "present",
    13: "present",
    14: "absent",
    15: "present",
    16: "present",
    17: "absent",
    18: "present",
    19: "present",
    20: "present",
    21: "present",
    22: "present",
    23: "absent",
    24: "present",
    25: "present",
    26: "present",
    27: "absent",
    28: "present",
    29: "present",
    30: "present",
    31: "present",
  };

  // চার্টের জন্য ডাটা (সাপ্তাহিক উপস্থিতির হার)
  const weeklyData = [
    { week: language === "bn" ? "সপ্তাহ ১" : "Week 1", attendance: 85 },
    { week: language === "bn" ? "সপ্তাহ ২" : "Week 2", attendance: 78 },
    { week: language === "bn" ? "সপ্তাহ ৩" : "Week 3", attendance: 92 },
    { week: language === "bn" ? "সপ্তাহ ৪" : "Week 4", attendance: 88 },
    { week: language === "bn" ? "সপ্তাহ ৫" : "Week 5", attendance: 90 },
  ];

  // পরিসংখ্যান ক্যালকুলেশন
  const totalDays = daysInMonth;
  const presentDays = Object.values(attendanceRecord).filter(
    (status) => status === "present",
  ).length;
  const absentDays = Object.values(attendanceRecord).filter(
    (status) => status === "absent",
  ).length;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  // সপ্তাহের নাম (ভাষা অনুযায়ী)
  const weekDays =
    language === "bn"
      ? ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"]
      : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "মোট কর্মদিবস" : "Total Working Days"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            {totalDays}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "উপস্থিতি" : "Present"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {presentDays}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "অনুপস্থিতি" : "Absent"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            {absentDays}
          </p>
        </div>
      </div>

      {/* চার্ট সেকশন */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-700">
            <TrendingUp className="w-5 h-5 text-primary" />
            {language === "bn"
              ? "সাপ্তাহিক উপস্থিতির হার"
              : "Weekly Attendance Rate"}
          </h3>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-primary font-semibold text-sm">
              {language === "bn" ? "মাসিক গড়" : "Monthly Average"}:{" "}
              {attendancePercentage}%
            </span>
          </div>
        </div>
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient
                  id="attendanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  `${value}%`,
                  language === "bn" ? "উপস্থিতি" : "Attendance",
                ]}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#1a4d2e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ক্যালেন্ডার সেকশন */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
            {language === "bn"
              ? "এ্যাটেন্ডেন্স ক্যালেন্ডার"
              : "Attendance Calendar"}
          </h2>
          <div className="bg-primary/10 px-3 sm:px-4 py-1.5 rounded-lg text-primary font-semibold text-xs sm:text-sm">
            {language === "bn" ? "মার্চ ২০২৬" : "March 2026"}
          </div>
        </div>

        {/* ক্যালেন্ডার গ্রিড */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-bold text-gray-400 py-1 sm:py-2 text-[10px] sm:text-xs md:text-sm"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const status = attendanceRecord[date];
            return (
              <div
                key={date}
                className={`
                  flex flex-col items-center justify-center 
                  rounded-lg sm:rounded-xl 
                  border transition-all
                  min-h-[45px] sm:min-h-[60px] md:min-h-[75px] lg:min-h-[85px]
                  p-0.5 sm:p-1 md:p-2
                  ${
                    status === "present"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : status === "absent"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-gray-50 border-gray-100 text-gray-400 opacity-50"
                  }
                `}
              >
                <span className="text-xs sm:text-sm md:text-base font-bold">
                  {date}
                </span>
                <div className="mt-0.5 sm:mt-1">
                  {status === "present" && (
                    <CheckCircle
                      size={10}
                      className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                    />
                  )}
                  {status === "absent" && (
                    <XCircle
                      size={10}
                      className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* লেজেন্ড */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            <span className="text-[10px] sm:text-xs text-gray-600">
              {language === "bn" ? "উপস্থিত" : "Present"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <span className="text-[10px] sm:text-xs text-gray-600">
              {language === "bn" ? "অনুপস্থিত" : "Absent"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></div>
            <span className="text-[10px] sm:text-xs text-gray-600">
              {language === "bn" ? "ছুটি/ছিল না" : "Holiday/No Class"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
