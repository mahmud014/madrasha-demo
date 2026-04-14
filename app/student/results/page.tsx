"use client";

import React from "react";
import { FileText, Download, Award, TrendingUp, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";

const ResultsPage = () => {
  const { language, t } = useLanguage();

  // বিষয় ও নম্বর
  const subjects = [
    {
      name: language === "bn" ? "কুরআন মজিদ" : "Al-Quran",
      marks: 95,
      grade: "A+",
      point: 5.0,
      color: "#1a4d2e",
    },
    {
      name: language === "bn" ? "হাদিস শরিফ" : "Hadith",
      marks: 88,
      grade: "A+",
      point: 5.0,
      color: "#2d6a4f",
    },
    {
      name: language === "bn" ? "আরবি সাহিত্য" : "Arabic Literature",
      marks: 78,
      grade: "A",
      point: 4.0,
      color: "#40916c",
    },
    {
      name: language === "bn" ? "গণিত" : "Mathematics",
      marks: 82,
      grade: "A+",
      point: 5.0,
      color: "#52b788",
    },
    {
      name: language === "bn" ? "ইংরেজি" : "English",
      marks: 72,
      grade: "A-",
      point: 3.5,
      color: "#74c69d",
    },
  ];

  // চার্টের জন্য ডাটা
  const chartData = subjects.map((sub) => ({
    name: sub.name,
    marks: sub.marks,
    grade: sub.grade,
  }));

  const totalGPA = 4.5;
  const totalMarks = subjects.reduce((sum, sub) => sum + sub.marks, 0);
  const averageMarks = Math.round(totalMarks / subjects.length);

  // গ্রেড অনুযায়ী রঙ
  const getGradeColor = (grade: string) => {
    if (grade === "A+") return "text-green-600 bg-green-100";
    if (grade === "A") return "text-blue-600 bg-blue-100";
    if (grade === "A-") return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
            <Award className="text-secondary w-5 h-5 sm:w-6 sm:h-6" />
            {language === "bn" ? "পরীক্ষার ফলাফল" : "Exam Results"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === "bn"
              ? "বার্ষিক পরীক্ষা - ২০২৬"
              : "Annual Exam - 2026"}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold hover:bg-primary/90 transition text-xs sm:text-sm">
          <Download size={14} className="sm:w-4 sm:h-4" />
          {language === "bn" ? "মার্কশিট ডাউনলোড" : "Download Marksheet"}
        </button>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "মোট নম্বর" : "Total Marks"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            {totalMarks}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "গড় নম্বর" : "Average Marks"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {averageMarks}%
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            {language === "bn" ? "জিপিএ (GPA)" : "GPA"}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {totalGPA.toFixed(2)}
          </p>
        </div>
      </div>

      {/* চার্ট সেকশন */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            {language === "bn" ? "বিষয়ভিত্তিক নম্বর" : "Subject-wise Marks"}
          </h3>
        </div>
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 40, right: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e2e8f0"
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 10 }}
                tickLine={false}
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
                  language === "bn" ? "নম্বর" : "Marks",
                ]}
              />
              <Bar dataKey="marks" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={subjects[index].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* মার্কশিট টেবিল */}
      <div className="bg-white rounded-xl sm:rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-primary text-white text-xs sm:text-sm font-bold">
              <tr>
                <th className="p-3 sm:p-4">
                  {language === "bn" ? "বিষয়" : "Subject"}
                </th>
                <th className="p-3 sm:p-4 text-center">
                  {language === "bn" ? "নম্বর" : "Marks"}
                </th>
                <th className="p-3 sm:p-4 text-center">
                  {language === "bn" ? "গ্রেড" : "Grade"}
                </th>
                <th className="p-3 sm:p-4 text-center">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700 text-sm sm:text-base">
              {subjects.map((sub, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="p-3 sm:p-4 font-medium">{sub.name}</td>
                  <td className="p-3 sm:p-4 text-center">{sub.marks}</td>
                  <td className="p-3 sm:p-4 text-center">
                    <span
                      className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold ${getGradeColor(sub.grade)}`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-center font-bold text-primary">
                    {sub.point.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-primary/5 font-bold">
              <tr>
                <td className="p-3 sm:p-4" colSpan={3}>
                  {language === "bn" ? "জিপিএ (GPA)" : "GPA"}
                </td>
                <td className="p-3 sm:p-4 text-center text-lg text-primary">
                  {totalGPA.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* রেজাল্ট সামারি */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <p className="text-xs sm:text-sm text-green-700">
            {language === "bn"
              ? "সর্বোচ্চ নম্বর প্রাপ্ত বিষয়"
              : "Highest Scored Subject"}
          </p>
          <p className="font-bold text-green-800 text-base sm:text-lg mt-1">
            {
              subjects.reduce(
                (max, sub) => (sub.marks > max.marks ? sub : max),
                subjects[0],
              ).name
            }
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <p className="text-xs sm:text-sm text-blue-700">
            {language === "bn"
              ? "A+ প্রাপ্ত বিষয়ের সংখ্যা"
              : "Number of A+ Subjects"}
          </p>
          <p className="font-bold text-blue-800 text-base sm:text-lg mt-1">
            {subjects.filter((sub) => sub.grade === "A+").length}{" "}
            {language === "bn" ? "টি" : "subjects"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
