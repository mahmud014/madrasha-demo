"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  User,
  FileText,
  LayoutGrid,
  List,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

// ল্যাঙ্গুয়েজ অবজেক্ট (এটি পরে আপনি আপনার Context থেকে নিতে পারেন)
const content = {
  bn: {
    title: "শিক্ষার্থী ব্যবস্থাপনা (SIS)",
    subtitle: "নতুন ভর্তি, রোল নম্বর ও কিউআর কোড ম্যানেজমেন্ট",
    addBtn: "নতুন শিক্ষার্থী ভর্তি",
    searchPlaceholder: "নাম বা রোল নম্বর দিয়ে খুঁজুন...",
    classSelect: "ক্লাস নির্বাচন",
    sectionSelect: "সেকশন",
    thStudent: "শিক্ষার্থী",
    thClass: "ক্লাস ও সেকশন",
    thRoll: "রোল",
    thQr: "QR Code",
    thAction: "অ্যাকশন",
    total: "মোট শিক্ষার্থী",
    prev: "পূর্ববর্তী",
    next: "পরবর্তী",
    empty: "কোনো শিক্ষার্থী পাওয়া যায়নি",
  },
  en: {
    title: "Student Information System (SIS)",
    subtitle: "New admission, roll number & QR code management",
    addBtn: "Add New Student",
    searchPlaceholder: "Search by name or roll...",
    classSelect: "Select Class",
    sectionSelect: "Section",
    thStudent: "Student",
    thClass: "Class & Section",
    thRoll: "Roll",
    thQr: "QR Code",
    thAction: "Action",
    total: "Total Students",
    prev: "Previous",
    next: "Next",
    empty: "No students found",
  },
};

export default function StudentsPage() {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const t = content[lang];

  // ডামি ডাটা
  const students = [
    {
      id: "1",
      name: "আব্দুর রহমান",
      nameEn: "Abdur Rahman",
      roll: 101,
      class: "হিফজ",
      classEn: "Hifz",
      section: "ক",
      phone: "01712345678",
      photo: null,
    },
    {
      id: "2",
      name: "মোঃ করিম",
      nameEn: "Md. Karim",
      roll: 102,
      class: "নুরানি",
      classEn: "Noorani",
      section: "খ",
      phone: "01812345678",
      photo: null,
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-primary hover:bg-slate-50 transition-all"
          >
            {lang === "bn" ? "English" : "বাংলা"}
          </button>

          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all font-medium">
            <UserPlus className="w-5 h-5" /> {t.addBtn}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:w-40 bg-slate-50 border-none rounded-xl py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-600">
            <option value="">{t.classSelect}</option>
            <option value="noorani">নুরানি / Noorani</option>
            <option value="hifz">হিফজ / Hifz</option>
          </select>

          <div className="flex border border-slate-100 rounded-xl p-1 bg-slate-50">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-400"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-400"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Students List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-sm font-medium border-b border-slate-100">
              <th className="px-6 py-4">{t.thStudent}</th>
              <th className="px-6 py-4">{t.thClass}</th>
              <th className="px-6 py-4 text-center">{t.thRoll}</th>
              <th className="px-6 py-4 text-center">{t.thQr}</th>
              <th className="px-6 py-4 text-right">{t.thAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden relative">
                      {student.photo ? (
                        <Image
                          src={student.photo}
                          alt={student.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">
                        {lang === "bn" ? student.name : student.nameEn}
                      </p>
                      <p className="text-xs text-slate-400">{student.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    {lang === "bn" ? student.class : student.classEn}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {lang === "bn"
                      ? `সেকশন: ${student.section}`
                      : `Section: ${student.section}`}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-mono font-bold text-sm">
                    {student.roll}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className="p-1 bg-white border rounded-md shadow-sm group-hover:scale-110 transition-transform cursor-pointer">
                      <QRCodeSVG value={`STUDENT_${student.id}`} size={32} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {students.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-slate-500 font-medium">{t.empty}</h3>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <p>
            {t.total}: {students.length} {lang === "bn" ? "জন" : "Persons"}
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all font-medium">
              {t.prev}
            </button>
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium">
              {t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
