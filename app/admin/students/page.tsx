'use client';

import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  QrCode, 
  MoreVertical, 
  Download,
  User,
  FileText,
  Camera
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // npm install qrcode.react

export default function StudentsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // ডামি ডাটা (পরে ফায়ারবেস থেকে আসবে)
  const students = [
    { id: '1', name: 'আব্দুর রহমান', roll: 101, class: 'হিফজ', section: 'ক', phone: '01712345678', photo: null },
    { id: '2', name: 'মোঃ করিম', roll: 102, class: 'নুরানি', section: 'খ', phone: '01812345678', photo: null },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">শিক্ষার্থী ব্যবস্থাপনা (SIS)</h1>
          <p className="text-slate-500 text-sm">নতুন ভর্তি, রোল নম্বর ও কিউআর কোড ম্যানেজমেন্ট</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all font-medium">
          <UserPlus className="w-5 h-5" /> নতুন শিক্ষার্থী ভর্তি
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="নাম বা রোল নম্বর দিয়ে খুঁজুন..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:w-32 bg-slate-50 border-none rounded-xl py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-600">
            <option value="">ক্লাস নির্বাচন</option>
            <option value="noorani">নুরানি</option>
            <option value="hifz">হিফজ</option>
          </select>

          <select className="flex-1 md:w-32 bg-slate-50 border-none rounded-xl py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-600">
            <option value="">সেকশন</option>
            <option value="ka">ক</option>
            <option value="kha">খ</option>
          </select>

          <button className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Students List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-sm font-medium border-b border-slate-100">
              <th className="px-6 py-4">শিক্ষার্থী</th>
              <th className="px-6 py-4">ক্লাস ও সেকশন</th>
              <th className="px-6 py-4 text-center">রোল</th>
              <th className="px-6 py-4 text-center">QR Code</th>
              <th className="px-6 py-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                      {student.photo ? (
                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-600">{student.class}</span>
                  <p className="text-[10px] text-slate-400">সেকশন: {student.section}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-mono font-bold text-sm">
                    {student.roll}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex justify-center">
                      <div className="p-1 bg-white border rounded-md shadow-sm group-hover:scale-110 transition-transform cursor-pointer">
                        <QRCodeSVG value={student.id} size={32} />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg">
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

        {/* Empty State Mockup (যদি ডাটা না থাকে) */}
        {students.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-slate-500 font-medium">কোনো শিক্ষার্থী পাওয়া যায়নি</h3>
            <p className="text-slate-400 text-sm">নতুন শিক্ষার্থী যোগ করতে ওপরের বাটনে ক্লিক করুন</p>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
           <p>মোট শিক্ষার্থী: {students.length} জন</p>
           <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border rounded-md disabled:opacity-50">পূর্ববর্তী</button>
              <button className="px-3 py-1 bg-white border rounded-md">পরবর্তী</button>
           </div>
        </div>
      </div>
    </div>
  );
}