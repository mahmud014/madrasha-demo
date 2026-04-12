'use client'; // এটি অবশ্যই প্রথম লাইনে থাকতে হবে

import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

const performanceData = [
  { name: 'Term 1', score: 65 },
  { name: 'Term 2', score: 78 },
  { name: 'Mid Term', score: 72 },
  { name: 'Final', score: 85 },
];

const AttendanceDashboard = () => {
  // Hydration Error এড়াতে মাউন্ট চেক
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: Math.random() > 0.2 ? 'present' : 'absent',
  }));

  if (!isMounted) return null; // সার্ভার সাইড রেন্ডারিং এর সময় চার্ট লোড হবে না

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* সামারি কার্ডসমূহ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">উপস্থিতি</p>
              <h3 className="text-xl font-bold">৮৫%</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">বকেয়া ফি</p>
              <h3 className="text-xl font-bold">৳ ২৫০০</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">পরবর্তী ক্লাস</p>
              <h3 className="text-lg font-bold">১০:৩০ AM</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* এ্যাটেন্ডেন্স ক্যালেন্ডার */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <CalendarIcon size={20} className="text-indigo-500" />
                এ্যাটেন্ডেন্স ক্যালেন্ডার
              </h3>
              <div className="flex gap-3 text-[10px] md:text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> উপস্থিত</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> অনুপস্থিত</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-gray-400 text-xs font-bold py-2">{day}</div>
              ))}
              {days.map((item) => (
                <div 
                  key={item.day}
                  className={`py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all
                    ${item.status === 'present' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>

          {/* রেজাল্ট চার্ট */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-6 text-gray-700">পারফরম্যান্স ট্র্যাকার</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;