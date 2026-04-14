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
  Clock,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// টাইপ ডেফিনেশন
type AttendanceStatus = "present" | "absent";
interface AttendanceDay {
  day: number;
  status: AttendanceStatus;
}

const performanceData = [
  { name: "Term 1", score: 65 },
  { name: "Term 2", score: 78 },
  { name: "Mid Term", score: 72 },
  { name: "Final", score: 85 },
];

// ✅ সব ডাটা সরাসরি এখানে জেনারেট করুন - কোন useEffect নেই!
// সার্ভার এবং ক্লায়েন্টে একই ডাটা থাকবে (হাইড্রেশন মিসম্যাচ হবে না)
const generateStaticAttendanceData = (): AttendanceDay[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    // প্রতি ৩য় দিন অনুপস্থিত, বাকি সব দিন উপস্থিত (স্ট্যাটিক প্যাটার্ন)
    status: (i + 1) % 3 === 0 ? "absent" : "present",
  }));
};

const AttendanceDashboard = () => {
  const { language, t } = useLanguage();

  // ✅ সরাসরি স্টেটে ডাটা সেট করুন - Lazy initialization
  const [days] = React.useState<AttendanceDay[]>(generateStaticAttendanceData);

  // ✅ উপস্থিতির হার সরাসরি ক্যালকুলেট করুন - রেন্ডার টাইমে
  const attendancePercentage = React.useMemo(() => {
    const presentCount = days.filter((d) => d.status === "present").length;
    return Math.round((presentCount / days.length) * 100);
  }, [days]);

  // Language dependent week days
  const weekDays =
    language === "bn"
      ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("student.attendanceSummary") || "Attendance"}
              </p>
              <h3 className="text-xl font-bold">{attendancePercentage}%</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("student.dueFees") || "Due Fee"}
              </p>
              <h3 className="text-xl font-bold">৳ 2500</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("student.nextClass") || "Next Class"}
              </p>
              <h3 className="text-lg font-bold">10:30 AM</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <CalendarIcon size={20} className="text-indigo-500" />
                {t("student.attendanceCalendar") || "Attendance Calendar"}
              </h3>
              <div className="flex gap-3 text-[10px] md:text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>{" "}
                  {t("student.present") || "Present"}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>{" "}
                  {t("student.absent") || "Absent"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
              {weekDays.map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="text-gray-400 text-xs font-bold py-2"
                >
                  {day}
                </div>
              ))}
              {days.map((item) => (
                <div
                  key={item.day}
                  className={`py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all
                    ${
                      item.status === "present"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>

          {/* Performance Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-6 text-gray-700">
              {t("student.performanceTracker") || "Performance Tracker"}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
