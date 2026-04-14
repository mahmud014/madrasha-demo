"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Search,
  Filter,
  QrCode,
  MoreVertical,
  Download,
  User,
  FileText,
  Camera,
  GraduationCap,
  Phone,
  Mail,
  X,
  Eye,
  Edit,
  Trash2,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  id: string;
  name: string;
  nameBn: string;
  roll: number;
  class: string;
  classBn: string;
  section: string;
  sectionBn: string;
  phone: string;
  email: string;
  photo: string | null;
  parentName: string;
  parentPhone: string;
  address: string;
}

export default function StudentsPage() {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrStudent, setQrStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ডেমো ডাটা
  const students: Student[] = [
    {
      id: "1",
      name: "Abdur Rahman",
      nameBn: "আব্দুর রহমান",
      roll: 101,
      class: "Hifz",
      classBn: "হিফজ",
      section: "A",
      sectionBn: "ক",
      phone: "+880 1700-000001",
      email: "rahman@madrasa.com",
      photo: null,
      parentName: "Md. Karim Uddin",
      parentPhone: "+880 1700-000011",
      address: "ঢাকা, বাংলাদেশ",
    },
    {
      id: "2",
      name: "Muhammad Ali",
      nameBn: "মুহাম্মদ আলী",
      roll: 102,
      class: "Noorani",
      classBn: "নুরানি",
      section: "B",
      sectionBn: "খ",
      phone: "+880 1700-000002",
      email: "ali@madrasa.com",
      photo: null,
      parentName: "Md. Jamal Uddin",
      parentPhone: "+880 1700-000012",
      address: "চট্টগ্রাম, বাংলাদেশ",
    },
    {
      id: "3",
      name: "Hafez Ahmad",
      nameBn: "হাফেজ আহমদ",
      roll: 103,
      class: "Hifz",
      classBn: "হিফজ",
      section: "A",
      sectionBn: "ক",
      phone: "+880 1700-000003",
      email: "ahmad@madrasa.com",
      photo: null,
      parentName: "Md. Rafiq Uddin",
      parentPhone: "+880 1700-000013",
      address: "সিলেট, বাংলাদেশ",
    },
  ];

  const classOptions = [
    { value: "", labelBn: "সব ক্লাস", labelEn: "All Classes" },
    { value: "Hifz", labelBn: "হিফজ", labelEn: "Hifz" },
    { value: "Noorani", labelBn: "নুরানি", labelEn: "Noorani" },
    { value: "Kitab", labelBn: "কিতাব", labelEn: "Kitab" },
  ];

  const sectionOptions = [
    { value: "", labelBn: "সব সেকশন", labelEn: "All Sections" },
    { value: "A", labelBn: "ক", labelEn: "A" },
    { value: "B", labelBn: "খ", labelEn: "B" },
    { value: "C", labelBn: "গ", labelEn: "C" },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (language === "bn" ? student.nameBn : student.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.roll.toString().includes(searchTerm);
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSection =
      !selectedSection || student.section === selectedSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / 10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewQR = (student: Student) => {
    setQrStudent(student);
    setShowQRModal(true);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn"
              ? "শিক্ষার্থী ব্যবস্থাপনা"
              : "Student Management"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? "সকল শিক্ষার্থীর তথ্য ও QR কোড ম্যানেজমেন্ট সিস্টেম"
              : "Complete student information and QR code management system"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
        >
          <UserPlus className="w-5 h-5" />
          {language === "bn" ? "নতুন শিক্ষার্থী ভর্তি" : "New Admission"}
        </motion.button>
      </div>

      {/* ফিল্টার ও সার্চ বার */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                language === "bn"
                  ? "নাম বা রোল নম্বর দিয়ে খুঁজুন..."
                  : "Search by name or roll number..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-gray-600"
            >
              {classOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {language === "bn" ? opt.labelBn : opt.labelEn}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-gray-600"
            >
              {sectionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {language === "bn" ? opt.labelBn : opt.labelEn}
                </option>
              ))}
            </select>

            <button className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-600 transition-colors">
              <Filter className="w-5 h-5" />
            </button>

            {/* ভিউ টগল */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* লিস্ট ভিউ */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "শিক্ষার্থী" : "Student"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "ক্লাস ও সেকশন" : "Class & Section"}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "রোল" : "Roll"}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === "bn" ? "অ্যাকশন" : "Actions"}
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
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {language === "bn"
                                ? student.nameBn
                                : student.name}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone size={10} /> {student.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600">
                          {language === "bn" ? student.classBn : student.class}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {language === "bn" ? "সেকশন" : "Section"}:{" "}
                          {language === "bn"
                            ? student.sectionBn
                            : student.section}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary font-mono font-bold text-sm">
                          {student.roll}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewQR(student);
                          }}
                          className="p-2 bg-gray-50 rounded-lg hover:bg-primary/10 transition-all group-hover:scale-110"
                        >
                          <QrCode size={18} className="text-primary" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                          <button
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            onClick={() => handleViewDetails(student)}
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* পেজিনেশন */}
          <div className="p-4 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>
              {language === "bn" ? "মোট শিক্ষার্থী" : "Total Students"}:{" "}
              {totalStudents} {language === "bn" ? "জন" : ""}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* গ্রিড ভিউ */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredStudents.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleViewDetails(student)}
              >
                <div className="p-5 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    {language === "bn" ? student.nameBn : student.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">ID: {student.id}</p>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600">
                      {language === "bn" ? student.classBn : student.class}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {language === "bn" ? "রোল" : "Roll"}: {student.roll}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewQR(student);
                      }}
                      className="p-2 bg-gray-50 rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <QrCode size={18} className="text-primary" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* খালি স্টেট */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-500 font-medium">
            {language === "bn"
              ? "কোনো শিক্ষার্থী পাওয়া যায়নি"
              : "No students found"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {language === "bn"
              ? "নতুন শিক্ষার্থী যোগ করতে উপরের বাটনে ক্লিক করুন"
              : "Click the button above to add a new student"}
          </p>
        </div>
      )}

      {/* QR কোড মোডাল */}
      {showQRModal && qrStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {language === "bn" ? "শিক্ষার্থীর QR কোড" : "Student QR Code"}
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                <QRCodeSVG value={qrStudent.id} size={180} />
              </div>
              <p className="font-semibold text-gray-800 mt-4">
                {language === "bn" ? qrStudent.nameBn : qrStudent.name}
              </p>
              <p className="text-sm text-gray-500">
                {language === "bn" ? "রোল" : "Roll"}: {qrStudent.roll}
              </p>
              <button
                onClick={() => {
                  const canvas = document.querySelector("canvas");
                  if (canvas) {
                    const link = document.createElement("a");
                    link.download = `qrcode_${qrStudent.roll}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                  }
                }}
                className="mt-4 w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Download size={16} className="inline mr-2" />
                {language === "bn" ? "QR কোড ডাউনলোড" : "Download QR Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* শিক্ষার্থীর বিস্তারিত মোডাল */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {language === "bn"
                  ? "শিক্ষার্থীর বিস্তারিত"
                  : "Student Details"}
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedStudent.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === "bn"
                      ? selectedStudent.nameBn
                      : selectedStudent.name}
                  </h2>
                  <p className="text-gray-500">ID: {selectedStudent.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap size={16} className="text-primary" />
                    <span className="text-sm">
                      {language === "bn" ? "ক্লাস" : "Class"}:{" "}
                      {language === "bn"
                        ? selectedStudent.classBn
                        : selectedStudent.class}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">
                      {language === "bn" ? "সেকশন" : "Section"}:{" "}
                      {language === "bn"
                        ? selectedStudent.sectionBn
                        : selectedStudent.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">
                      {language === "bn" ? "রোল" : "Roll"}:{" "}
                      {selectedStudent.roll}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-primary" />
                    <span className="text-sm">{selectedStudent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-primary" />
                    <span className="text-sm">{selectedStudent.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">
                  {language === "bn" ? "অভিভাবকের তথ্য" : "Parent Information"}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {language === "bn" ? "পিতার নাম" : "Father's Name"}:{" "}
                    {selectedStudent.parentName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === "bn" ? "মোবাইল" : "Mobile"}:{" "}
                    {selectedStudent.parentPhone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === "bn" ? "ঠিকানা" : "Address"}:{" "}
                    {selectedStudent.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
