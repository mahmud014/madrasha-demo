import React from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';

const AttendancePage = () => {
  const daysInMonth = 31;
  // মক ডাটা: ১-১০ তারিখের হাজিরা
  const attendanceRecord: Record<number, string> = {
    1: 'present', 2: 'present', 3: 'absent', 4: 'present', 5: 'present',
    8: 'present', 9: 'absent', 10: 'present'
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <CalendarIcon className="text-blue-600" /> এ্যাটেন্ডেন্স রিপোর্ট
        </h2>
        <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold">
          মার্চ ২০২৬
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'].map(day => (
          <div key={day} className="text-center font-bold text-gray-400 py-2">{day}</div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const status = attendanceRecord[date];
          return (
            <div 
              key={date}
              className={`h-20 flex flex-col items-center justify-center rounded-xl border transition-all
                ${status === 'present' ? 'bg-green-50 border-green-200 text-green-700' : 
                  status === 'absent' ? 'bg-red-50 border-red-200 text-red-700' : 
                  'bg-gray-50 border-gray-100 text-gray-400 opacity-50'}`}
            >
              <span className="text-lg font-bold">{date}</span>
              {status === 'present' && <CheckCircle size={14} />}
              {status === 'absent' && <XCircle size={14} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePage;