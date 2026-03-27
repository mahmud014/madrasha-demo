'use client';

import React from 'react';
import { 
  Fingerprint, 
  Users, 
  UserCheck, 
  UserX, 
  MessageSquare, 
  Search, 
  Download,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AttendancePage() {
  const { t } = useLanguage();

  return (
    <div className="p-8 space-y-8 bg-accent/10 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Fingerprint className="w-10 h-10" /> বায়োমেট্রিক ও অটো-অ্যাটেনডেন্স
          </h2>
          <p className="text-ink/50 mt-1">রিয়েল-টাইম উপস্থিতি এবং অভিভাবক নোটিফিকেশন সিস্টেম</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-accent shadow-sm hover:bg-accent/5">
                <Download className="w-4 h-4" /> রিপোর্ট ডাউনলোড
            </button>
            <button className="flex items-center gap-2 bg-secondary text-white px-6 py-2 rounded-xl shadow-lg hover:opacity-90">
                <RefreshCw className="w-4 h-4" /> সিঙ্ক করুন (API)
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-accent/50 shadow-sm">
          <div className="flex justify-between items-start">
            <Users className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">আজকের দিন</span>
          </div>
          <p className="text-sm text-ink/50 mt-4">মোট শিক্ষার্থী</p>
          <p className="text-3xl font-bold text-primary">৪৫০</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-accent/50 shadow-sm">
          <UserCheck className="w-8 h-8 text-green-500 bg-green-50 p-1.5 rounded-lg" />
          <p className="text-sm text-ink/50 mt-4">উপস্থিত</p>
          <p className="text-3xl font-bold text-green-600">৪১০</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-accent/50 shadow-sm">
          <UserX className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
          <p className="text-sm text-ink/50 mt-4">অনুপস্থিত</p>
          <p className="text-3xl font-bold text-red-600">৪০</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-accent/50 shadow-sm">
          <MessageSquare className="w-8 h-8 text-secondary bg-secondary/5 p-1.5 rounded-lg" />
          <p className="text-sm text-ink/50 mt-4">SMS পাঠানো হয়েছে</p>
          <p className="text-3xl font-bold text-secondary">৪১০</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance List (Live Feed) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-accent/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-primary/[0.02]">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" /> লাইভ উপস্থিতি ফিড
            </h3>
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-ink/30" />
                <input type="text" placeholder="খুঁজুন..." className="pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:border-primary" />
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-accent/10 text-primary text-sm uppercase">
              <tr>
                <th className="px-6 py-4">শিক্ষার্থী</th>
                <th className="px-6 py-4">বিভাগ</th>
                <th className="px-6 py-4">সময়</th>
                <th className="px-6 py-4">স্ট্যাটাস</th>
                <th className="px-6 py-4 text-right">SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-accent/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-ink">আব্দুর রহমান</div>
                    <div className="text-xs text-ink/40">ID: #40523</div>
                  </td>
                  <td className="px-6 py-4 text-sm">হিফজ বিভাগ</td>
                  <td className="px-6 py-4 text-sm font-mono text-ink/60">08:15 AM</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Present</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">Sent ✅</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center border-t">
              <button className="text-primary text-sm font-medium hover:underline">সকল রেকর্ড দেখুন</button>
          </div>
        </div>

        {/* Absent List / Settings Side Panel */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-accent/50 shadow-sm">
                <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                    <UserX className="w-5 h-5" /> আজকের অনুপস্থিত (৪০)
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-2xl border border-red-100">
                            <div>
                                <p className="text-sm font-bold text-ink">মোঃ করিম উল্লাহ</p>
                                <p className="text-xs text-ink/50">রোল: ১০৫</p>
                            </div>
                            <button className="text-[10px] bg-white text-red-500 px-2 py-1 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all">
                                Call Parent
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> অটো SMS সেটিংস
                    </h3>
                    <p className="text-xs text-white/70 mb-4">স্টুডেন্ট কার্ড পাঞ্চ করার সাথে সাথে অভিভাবকের ফোনে অটোমেটিক মেসেজ যাবে।</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                        </div>
                        <span className="text-sm font-medium italic">Active</span>
                    </div>
                </div>
                {/* Decorative shape */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
        </div>
      </div>
    </div>
  );
}