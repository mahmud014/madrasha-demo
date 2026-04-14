"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Megaphone,
  TrendingUp,
  Wallet,
  CheckCircle,
  GraduationCap,
  Download,
  Calendar,
  Clock,
  Eye,
  UserPlus,
  Bell,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

// Types
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendType?: "up" | "down";
  iconBg: string;
  iconColor: string;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  bgColor: string;
}

// Dummy Data
const performanceData = [
  { name: "Jan", marks: 75 },
  { name: "Feb", marks: 82 },
  { name: "Mar", marks: 80 },
  { name: "Apr", marks: 95 },
  { name: "May", marks: 88 },
  { name: "Jun", marks: 92 },
];

const deptData = [
  { name: "নুরানি", value: 150, color: "#1a4d2e" },
  { name: "হিফজ", value: 120, color: "#ff9f29" },
  { name: "কিতাব", value: 180, color: "#10b981" },
];

const recentActivities = [
  {
    icon: <UserPlus size={18} />,
    title: "নতুন ভর্তি",
    desc: "৫টি নতুন আবেদন জমা পড়েছে",
    time: "১০ মিনিট আগে",
    bgColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Bell size={18} />,
    title: "নোটিশ প্রকাশিত",
    desc: "রমজানের ছুটির নোটিশ জারি",
    time: "২ ঘণ্টা আগে",
    bgColor: "bg-orange-100 text-orange-600",
  },
  {
    icon: <FileText size={18} />,
    title: "পরীক্ষার ফলাফল",
    desc: "বার্ষিক পরীক্ষার ফলাফল প্রকাশ",
    time: "৫ ঘণ্টা আগে",
    bgColor: "bg-green-100 text-green-600",
  },
  {
    icon: <Eye size={18} />,
    title: "প্রোফাইল ভিজিট",
    desc: "অভিভাবক থেকে ১২টি ভিজিট",
    time: "গতকাল",
    bgColor: "bg-purple-100 text-purple-600",
  },
];

export default function DashboardPage() {
  const { language, t } = useLanguage();

  // পরিসংখ্যান কার্ডের ডাটা
  const statsData = [
    {
      title: language === "bn" ? "মোট শিক্ষার্থী" : "Total Students",
      value: "৪৫০",
      icon: <Users size={22} />,
      trend: "+১২ জন",
      trendType: "up" as const,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: language === "bn" ? "উপস্থিতি" : "Attendance",
      value: "৯২%",
      icon: <CheckCircle size={22} />,
      trend: "৮ জন অনুপস্থিত",
      trendType: "down" as const,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: language === "bn" ? "মোট সংগ্রহ" : "Revenue",
      value: "৳৮৫,০০০",
      icon: <Wallet size={22} />,
      trend: "+১০%",
      trendType: "up" as const,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: language === "bn" ? "নতুন আবেদন" : "New Applications",
      value: "১২",
      icon: <GraduationCap size={22} />,
      trend: language === "bn" ? "এই সপ্তাহে" : "This week",
      trendType: "up" as const,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-10">
      {/* হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            {t("nav.dashboard")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === "bn"
              ? "মাদ্রাসার আজকের সার্বিক পরিস্থিতি একনজরে দেখুন"
              : "View overall madrasa statistics at a glance"}
          </p>
        </div>
        <button className="btn btn-outline btn-sm gap-2">
          <Download size={16} />
          {language === "bn" ? "রিপোর্ট ডাউনলোড" : "Download Report"}
        </button>
      </div>

      {/* স্ট্যাটিস্টিকস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="card bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="card-body p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${stat.trendType === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trendType === "up" ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* পারফরম্যান্স চার্ট */}
        <div className="lg:col-span-2 card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                {language === "bn"
                  ? "একাডেমিক ইমপ্রুভমেন্ট"
                  : "Academic Improvement"}
              </h2>
              <select className="select select-sm select-bordered w-full sm:w-32">
                <option>
                  {language === "bn" ? "২০২৬ শিক্ষাবর্ষ" : "2026 Academic Year"}
                </option>
                <option>
                  {language === "bn" ? "২০২৫ শিক্ষাবর্ষ" : "2025 Academic Year"}
                </option>
              </select>
            </div>
            <div className="h-56 sm:h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#1a4d2e"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#1a4d2e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="marks"
                    stroke="#1a4d2e"
                    strokeWidth={2.5}
                    fill="url(#colorMarks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* পাই চার্ট - বিভাগীয় বণ্টন */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
              {language === "bn" ? "বিভাগীয় বণ্টন" : "Department Distribution"}
            </h2>
            <div className="h-48 sm:h-52 md:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {deptData.map((dept) => (
                <div
                  key={dept.name}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></span>
                    {dept.name}
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {dept.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* সাম্প্রতিক কার্যক্রম ও দ্রুত অ্যাকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* সাম্প্রতিক কার্যক্রম */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <Megaphone size={18} className="text-primary" />
                {language === "bn"
                  ? "সাম্প্রতিক কার্যক্রম"
                  : "Recent Activities"}
              </h2>
              <button className="text-xs text-primary font-medium hover:underline">
                {language === "bn" ? "সব দেখুন" : "View All"}
              </button>
            </div>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${activity.bgColor}`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {activity.desc}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* দ্রুত অ্যাকশন */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
              {language === "bn" ? "কুইক অ্যাকশন" : "Quick Actions"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn bg-gray-50 hover:bg-primary hover:text-white border-none normal-case h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300">
                <Users
                  size={20}
                  className="text-primary group-hover:text-white"
                />
                <span className="text-xs font-medium">
                  {language === "bn" ? "উপস্থিতি নিন" : "Take Attendance"}
                </span>
              </button>
              <button className="btn bg-gray-50 hover:bg-primary hover:text-white border-none normal-case h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300">
                <Wallet
                  size={20}
                  className="text-orange-500 group-hover:text-white"
                />
                <span className="text-xs font-medium">
                  {language === "bn" ? "ফি সংগ্রহ" : "Collect Fee"}
                </span>
              </button>
              <button className="btn bg-gray-50 hover:bg-primary hover:text-white border-none normal-case h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300">
                <UserPlus
                  size={20}
                  className="text-blue-500 group-hover:text-white"
                />
                <span className="text-xs font-medium">
                  {language === "bn" ? "নতুন ভর্তি" : "New Admission"}
                </span>
              </button>
              <button className="btn bg-gray-50 hover:bg-primary hover:text-white border-none normal-case h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300">
                <FileText
                  size={20}
                  className="text-purple-500 group-hover:text-white"
                />
                <span className="text-xs font-medium">
                  {language === "bn" ? "নোটিশ দিন" : "Post Notice"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ফুটার তথ্য */}
      <div className="card bg-primary/5 border-none">
        <div className="card-body p-3 sm:p-4 text-center">
          <p className="text-xs text-gray-500">
            {language === "bn"
              ? "শেষ আপডেট: আজ, ১০:৩০ AM"
              : "Last updated: Today, 10:30 AM"}
          </p>
        </div>
      </div>
    </div>
  );
}
