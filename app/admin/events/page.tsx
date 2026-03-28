'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit3, Clock, Tag, Save, X } from 'lucide-react';

const AdminEventsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // মক ডাটা (এটি পরে আপনার MongoDB থেকে আসবে)
  const [events, setEvents] = useState([
    { id: 1, tag: '📅', date: '১০ এপ্রিল', dateEn: '10 April', titleBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', titleEn: 'Annual Sports Day', timeBn: 'সকাল ৯:০০', timeEn: '9:00 AM' },
    { id: 2, tag: '🌙', date: '১৫ এপ্রিল', dateEn: '15 April', titleBn: 'ইফতার মাহফিল', titleEn: 'Iftar Mahfil', timeBn: 'বিকাল ৫:৩০', timeEn: '5:30 PM' },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* হেডার সেকশন */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-secondary" /> ইভেন্ট ম্যানেজমেন্ট
          </h2>
          <p className="text-gray-500 text-sm">হোম পেজের "Upcoming Events" এখান থেকে আপডেট করুন</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-secondary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/90 transition"
        >
          <Plus size={20} /> নতুন ইভেন্ট
        </button>
      </div>

      {/* নতুন ইভেন্ট যোগ করার ফর্ম (Modal Style) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold">নতুন ইভেন্ট যোগ করুন</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">ইমোজি/ট্যাগ (যেমন: 📅)</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary/20" placeholder="📅" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">তারিখ (বাংলা)</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none" placeholder="১০ এপ্রিল" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">শিরোনাম (বাংলা)</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none" placeholder="ইভেন্টের নাম" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">শিরোনাম (English)</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none" placeholder="Event Title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">সময় (বাংলা)</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none" placeholder="সকাল ১০:০০" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">সময় (English)</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none" placeholder="10:00 AM" />
              </div>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-primary/90 transition">
              <Save size={18} /> ইভেন্ট পাবলিশ করুন
            </button>
          </div>
        </div>
      )}

      {/* বর্তমান ইভেন্ট তালিকা */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="bg-primary/5 p-4 flex justify-between items-center">
              <span className="text-2xl">{event.tag}</span>
              <div className="flex gap-2">
                <button className="p-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition"><Edit3 size={16} /></button>
                <button className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="font-bold text-gray-800">{event.titleBn}</h4>
              <p className="text-sm text-gray-500 font-medium">{event.titleEn}</p>
              <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {event.timeBn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsPage;