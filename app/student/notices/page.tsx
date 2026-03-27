'use client';
import { Bell, Calendar, ChevronRight } from 'lucide-react';

const NoticePage = () => {
  const notices = [
    { title: 'পবিত্র রমজান উপলক্ষে মাদ্রাসা বন্ধের নোটিশ', date: '২৫ মার্চ, ২০২৬', type: 'ছুটি' },
    { title: 'আগামী ১০ই এপ্রিল থেকে দ্বিতীয় সাময়িক পরীক্ষা শুরু', date: '২০ মার্চ, ২০২৬', type: 'পরীক্ষা' },
    { title: 'পরিষ্কার-পরিচ্ছন্নতা দিবস পালন সংক্রান্ত', date: '১৫ মার্চ, ২০২৬', type: 'সাধারণ' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Bell className="text-red-500" /> নোটিশ বোর্ড
      </h2>
      
      {notices.map((notice, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-300 transition-all group cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                notice.type === 'ছুটি' ? 'bg-orange-100 text-orange-600' : 
                notice.type === 'পরীক্ষা' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {notice.type}
              </span>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600">{notice.title}</h3>
              <p className="flex items-center gap-1 text-sm text-gray-400">
                <Calendar size={14} /> {notice.date}
              </p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-indigo-500 transition-all" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticePage;