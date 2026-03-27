import React from 'react';
import { Send, FileText } from 'lucide-react';

const LeaveRequestPage = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="text-orange-500" /> ছুটির আবেদন
      </h2>
      <form className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">কবে থেকে</label>
            <input type="date" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">কবে পর্যন্ত</label>
            <input type="date" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">ছুটির ধরণ</label>
          <select className="w-full p-3 border rounded-xl outline-none">
            <option>অসুস্থতা জনিত ছুটি</option>
            <option>ব্যক্তিগত জরুরি কারণ</option>
            <option>অন্যান্য</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">বিস্তারিত কারণ</label>
          <textarea rows={4} className="w-full p-3 border rounded-xl outline-none" placeholder="আপনার কারণ লিখুন..."></textarea>
        </div>
        <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2">
          <Send size={18} /> আবেদন জমা দিন
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestPage;