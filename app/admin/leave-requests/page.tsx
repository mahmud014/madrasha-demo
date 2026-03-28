'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';

const AdminLeaveRequests = () => {
  // মক ডাটা (পরবর্তীতে ডাটাবেস থেকে আসবে)
  const requests = [
    { id: 1, name: 'হাফিজুর রহমান', roll: '১০১', type: 'অসুস্থতা', duration: '২৮ মার - ৩০ মার', status: 'pending', reason: 'জ্বর ও ঠান্ডার কারণে আসতে পারছি না।' },
    { id: 2, name: 'আব্দুল্লাহ আল মামুন', roll: '১০৫', type: 'জরুরি', duration: '২৯ মার - ২৯ মার', status: 'approved', reason: 'পারিবারিক অনুষ্ঠান।' },
    { id: 3, name: 'সাকিব হাসান', roll: '১১২', type: 'অন্যান্য', duration: '২৫ মার - ২৭ মার', status: 'rejected', reason: 'ব্যক্তিগত কাজ।' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ছুটির আবেদনসমূহ</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="রোল দিয়ে খুঁজুন..." className="pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-gray-600 font-medium">
            <Filter size={18} /> ফিল্টার
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="p-4">শিক্ষার্থীর নাম ও রোল</th>
              <th className="p-4">ছুটির ধরণ</th>
              <th className="p-4">সময়কাল</th>
              <th className="p-4">কারণ</th>
              <th className="p-4">স্ট্যাটাস</th>
              <th className="p-4 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <p className="font-bold text-gray-800">{req.name}</p>
                  <p className="text-xs text-gray-500">রোল: {req.roll}</p>
                </td>
                <td className="p-4 text-sm">{req.type}</td>
                <td className="p-4 text-sm font-medium text-indigo-600">{req.duration}</td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{req.reason}</td>
                <td className="p-4">
                  {req.status === 'pending' && (
                    <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-lg text-xs font-bold">
                      <Clock size={14} /> পেন্ডিং
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                      <CheckCircle size={14} /> অনুমোদিত
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg text-xs font-bold">
                      <XCircle size={14} /> বাতিল
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve">
                      <CheckCircle size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject">
                      <XCircle size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaveRequests;