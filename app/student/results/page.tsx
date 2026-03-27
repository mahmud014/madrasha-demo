'use client';
import React from 'react';
import { FileText, Download, Award } from 'lucide-react';

const ResultsPage = () => {
  const subjects = [
    { name: 'কুরআন মজিদ', marks: 95, grade: 'A+', point: 5.00 },
    { name: 'হাদিস শরিফ', marks: 88, grade: 'A+', point: 5.00 },
    { name: 'আরবি সাহিত্য', marks: 78, grade: 'A', point: 4.00 },
    { name: 'গণিত', marks: 82, grade: 'A+', point: 5.00 },
    { name: 'ইংরেজি', marks: 72, grade: 'A-', point: 3.50 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
            <Award className="text-yellow-500" /> পরীক্ষার ফলাফল
          </h2>
          <p className="text-gray-500">বার্ষিক পরীক্ষা - ২০২৬</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition">
          <Download size={18} /> মার্কশিট ডাউনলোড
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-bold">
            <tr>
              <th className="p-4">বিষয়</th>
              <th className="p-4 text-center">প্রাপ্ত নম্বর</th>
              <th className="p-4 text-center">গ্রেড</th>
              <th className="p-4 text-center">পয়েন্ট</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {subjects.map((sub, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{sub.name}</td>
                <td className="p-4 text-center">{sub.marks}</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{sub.grade}</span>
                </td>
                <td className="p-4 text-center font-bold text-indigo-600">{sub.point.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-indigo-50 font-bold">
            <tr>
              <td className="p-4" colSpan={3}>জিপিএ (GPA)</td>
              <td className="p-4 text-center text-lg text-indigo-700">৪.৫০</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ResultsPage;