"use client";

import React, { useState, useEffect } from "react";
import {
  Fingerprint,
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  Search,
  Download,
  RefreshCw,
  Phone,
  Clock,
  Calendar,
  Settings,
  Bell,
  BellOff,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// টাইপ ডিফিনেশন
interface Student {
  id: number;
  name: string;
  nameBn: string;
  roll: string;
  department: string;
  departmentBn: string;
  time: string;
  status: "present" | "absent";
  smsSent: boolean;
  parentPhone: string;
  image?: string;
}

interface SmsSettings {
  enabled: boolean;
  messageTemplate: string;
  sendToBothParents: boolean;
}

export default function AttendancePage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [syncing, setSyncing] = useState(false);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [smsSettings, setSmsSettings] = useState<SmsSettings>({
    enabled: true,
    messageTemplate: "",
    sendToBothParents: false,
  });

  // localStorage থেকে ডাটা লোড - সরাসরি useState এ
  useEffect(() => {
    const savedSettings = localStorage.getItem("smsSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSmsSettings(parsed);
      setAutoSmsEnabled(parsed.enabled);
    }
  }, []);

  const saveSmsSettings = (settings: SmsSettings) => {
    setSmsSettings(settings);
    setAutoSmsEnabled(settings.enabled);
    localStorage.setItem("smsSettings", JSON.stringify(settings));
    toast.success(
      language === "bn" ? "SMS সেটিংস সংরক্ষিত" : "SMS settings saved",
    );
  };

  const toggleAutoSms = () => {
    const newState = !autoSmsEnabled;
    setAutoSmsEnabled(newState);
    const newSettings = { ...smsSettings, enabled: newState };
    setSmsSettings(newSettings);
    localStorage.setItem("smsSettings", JSON.stringify(newSettings));
    toast.success(
      newState
        ? language === "bn"
          ? "অটো SMS চালু করা হয়েছে"
          : "Auto SMS enabled"
        : language === "bn"
          ? "অটো SMS বন্ধ করা হয়েছে"
          : "Auto SMS disabled",
      { duration: 2000 },
    );
  };

  // ডেমো ডাটা
  const students: Student[] = [
    {
      id: 1,
      name: "Abdur Rahman",
      nameBn: "আব্দুর রহমান",
      roll: "40523",
      department: "Hifz",
      departmentBn: "হিফজ",
      time: "08:15 AM",
      status: "present",
      smsSent: true,
      parentPhone: "+8801700000001",
    },
    {
      id: 2,
      name: "Muhammad Ali",
      nameBn: "মুহাম্মদ আলী",
      roll: "40524",
      department: "Hifz",
      departmentBn: "হিফজ",
      time: "08:20 AM",
      status: "present",
      smsSent: true,
      parentPhone: "+8801700000002",
    },
    {
      id: 3,
      name: "Karim Ullah",
      nameBn: "করিম উল্লাহ",
      roll: "40525",
      department: "Noorani",
      departmentBn: "নুরানি",
      time: "-",
      status: "absent",
      smsSent: false,
      parentPhone: "+8801700000003",
    },
    {
      id: 4,
      name: "Rahim Uddin",
      nameBn: "রহিম উদ্দিন",
      roll: "40526",
      department: "Kitab",
      departmentBn: "কিতাব",
      time: "08:10 AM",
      status: "present",
      smsSent: true,
      parentPhone: "+8801700000004",
    },
    {
      id: 5,
      name: "Hafez Ahmad",
      nameBn: "হাফেজ আহমদ",
      roll: "40527",
      department: "Hifz",
      departmentBn: "হিফজ",
      time: "-",
      status: "absent",
      smsSent: false,
      parentPhone: "+8801700000005",
    },
  ];

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  const stats = [
    {
      titleBn: "মোট শিক্ষার্থী",
      titleEn: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      trend: "+12",
      trendUp: true,
    },
    {
      titleBn: "উপস্থিত",
      titleEn: "Present",
      value: presentCount,
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-50",
      trend: "+5",
      trendUp: true,
    },
    {
      titleBn: "অনুপস্থিত",
      titleEn: "Absent",
      value: absentCount,
      icon: UserX,
      color: "text-red-500",
      bg: "bg-red-50",
      trend: "-2",
      trendUp: false,
    },
    {
      titleBn: "উপস্থিতির হার",
      titleEn: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
      trend: "+8%",
      trendUp: true,
    },
  ];

  const departments = [
    {
      value: "all",
      labelBn: "সব বিভাগ",
      labelEn: "All Departments",
      color: "bg-gray-100",
    },
    {
      value: "Hifz",
      labelBn: "হিফজ",
      labelEn: "Hifz",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      value: "Noorani",
      labelBn: "নুরানি",
      labelEn: "Noorani",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Kitab",
      labelBn: "কিতাব",
      labelEn: "Kitab",
      color: "bg-amber-100 text-amber-700",
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (language === "bn" ? student.nameBn : student.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.roll.includes(searchTerm);
    const matchesDept =
      selectedDept === "all" || student.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const absentStudents = students.filter((s) => s.status === "absent");

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার সেকশন */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn"
              ? "উপস্থিতি ব্যবস্থাপনা"
              : "Attendance Management"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? "রিয়েল-টাইম উপস্থিতি ট্র্যাকিং সিস্টেম"
              : "Real-time attendance tracking system"}
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={16} />
            {language === "bn" ? "রিপোর্ট ডাউনলোড" : "Download Report"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSyncing(true)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            disabled={syncing}
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            {language === "bn" ? "সিঙ্ক্রোনাইজ" : "Sync Now"}
          </motion.button>
        </div>
      </div>

      {/* স্ট্যাটিস্টিকস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {stat.trendUp ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? stat.titleBn : stat.titleEn}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* চার্ট এবং কন্ট্রোল সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* প্রধান টেবিল */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* টেবিল হেডার */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {language === "bn"
                    ? "লাইভ উপস্থিতি ফিড"
                    : "Live Attendance Feed"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {language === "bn"
                    ? "সর্বশেষ আপডেট: আজ"
                    : "Last updated: Today"}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === "bn" ? "খুঁজুন..." : "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-48"
                  />
                </div>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {language === "bn" ? dept.labelBn : dept.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* টেবিল বডি */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "শিক্ষার্থী" : "Student"}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "বিভাগ" : "Department"}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "সময়" : "Time"}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "স্ট্যাটাস" : "Status"}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    SMS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredStudents.map((student, idx) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {language === "bn"
                                ? student.nameBn
                                : student.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {student.roll}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            departments.find(
                              (d) => d.value === student.department,
                            )?.color || "bg-gray-100"
                          }`}
                        >
                          {language === "bn"
                            ? student.departmentBn
                            : student.department}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 font-mono">
                        {student.time !== "-" ? (
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {student.time}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.status === "present"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {student.status === "present" ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {student.status === "present"
                            ? language === "bn"
                              ? "উপস্থিত"
                              : "Present"
                            : language === "bn"
                              ? "অনুপস্থিত"
                              : "Absent"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {student.smsSent ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle size={10} />
                            {language === "bn" ? "পাঠানো হয়েছে" : "Sent"}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* টেবিল ফুটার */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>
                {language === "bn" ? "মোট" : "Total"}: {filteredStudents.length}{" "}
                {language === "bn" ? "শিক্ষার্থী" : "students"}
              </span>
              <button className="text-primary hover:underline">
                {language === "bn" ? "সকল দেখুন" : "View All"} →
              </button>
            </div>
          </div>
        </div>

        {/* ডান পাশের প্যানেল */}
        <div className="space-y-6">
          {/* অটো SMS কার্ড */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-white shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <MessageSquare size={18} />
                  </div>
                  <h3 className="font-bold text-base">
                    {language === "bn"
                      ? "অটো SMS নোটিফিকেশন"
                      : "Auto SMS Notification"}
                  </h3>
                </div>
                <button
                  onClick={toggleAutoSms}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    autoSmsEnabled ? "bg-secondary" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                      autoSmsEnabled ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-white/80 mb-4">
                {autoSmsEnabled
                  ? language === "bn"
                    ? "শিক্ষার্থী উপস্থিত/অনুপস্থিত হলে অভিভাবককে স্বয়ংক্রিয় SMS যাবে"
                    : "Parents will receive automatic SMS when student is marked present/absent"
                  : language === "bn"
                    ? "অটো SMS বন্ধ আছে। কোনো SMS পাঠানো হবে না"
                    : "Auto SMS is disabled. No SMS will be sent"}
              </p>

              <button
                className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                onClick={() => {
                  const modal = document.getElementById(
                    "sms_modal",
                  ) as HTMLDialogElement;
                  modal?.showModal();
                }}
              >
                <Settings size={14} />
                {language === "bn"
                  ? "SMS সেটিংস কাস্টমাইজ করুন"
                  : "Customize SMS Settings"}
              </button>
            </div>
          </motion.div>

          {/* অনুপস্থিত শিক্ষার্থী */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <UserX size={18} className="text-red-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    {language === "bn"
                      ? "অনুপস্থিত শিক্ষার্থী"
                      : "Absent Students"}
                  </h3>
                </div>
                <span className="text-sm font-bold text-red-600">
                  {absentStudents.length}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
              {absentStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 hover:bg-red-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {language === "bn" ? student.nameBn : student.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Roll: {student.roll}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                      <Phone size={14} />
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {language === "bn" ? "অনুপস্থিত" : "Absent"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {student.departmentBn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* দ্রুত পরিসংখ্যান */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-primary" />
                <span className="text-xs text-gray-500">
                  {language === "bn" ? "আজকের উপস্থিতি" : "Today's Attendance"}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {attendanceRate}%
              </p>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-primary" />
                <span className="text-xs text-gray-500">
                  {language === "bn" ? "কাজের দিন" : "Working Days"}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">22</p>
              <p className="text-xs text-gray-400 mt-2">
                {language === "bn" ? "এপ্রিল ২০২৬" : "April 2026"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SMS সেটিংস মোডাল */}
      <dialog id="sms_modal" className="modal">
        <div className="modal-box rounded-2xl p-6">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            {language === "bn" ? "SMS সেটিংস" : "SMS Settings"}
          </h3>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                {language === "bn" ? "অটো SMS সক্রিয় করুন" : "Enable Auto SMS"}
              </span>
              <button
                onClick={toggleAutoSms}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  autoSmsEnabled ? "bg-secondary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                    autoSmsEnabled ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "bn" ? "SMS টেমপ্লেট" : "SMS Template"}
              </label>
              <textarea
                rows={4}
                value={smsSettings.messageTemplate}
                onChange={(e) =>
                  setSmsSettings({
                    ...smsSettings,
                    messageTemplate: e.target.value,
                  })
                }
                className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder={
                  language === "bn"
                    ? "উদাহরণ: {name} ({roll}) মাদ্রাসায় {status} হয়েছে। সময়: {time}"
                    : "Example: {name} ({roll}) is {status} at madrasa. Time: {time}"
                }
              />
              <p className="text-xs text-gray-400 mt-2">
                💡{" "}
                {language === "bn"
                  ? "ভেরিয়েবল: {name}, {roll}, {status}, {time} ব্যবহার করতে পারেন"
                  : "You can use: {name}, {roll}, {status}, {time} variables"}
              </p>
            </div>
          </div>

          <div className="modal-action mt-6">
            <form method="dialog" className="flex gap-3">
              <button className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                onClick={() => saveSmsSettings(smsSettings)}
              >
                {language === "bn" ? "সংরক্ষণ করুন" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
