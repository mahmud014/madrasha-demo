'use client';
import { User, Phone, Mail, MapPin, GraduationCap } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {/* কভার ফটো ডিজাইন */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="p-8 -mt-16 flex flex-col md:flex-row items-end gap-6 border-b">
          <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-gray-200">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hafiz" alt="Avatar" />
          </div>
          <div className="flex-1 pb-2">
            <h2 className="text-2xl font-black text-gray-800">হাফিজুর রহমান</h2>
            <p className="text-indigo-600 font-bold uppercase tracking-wider">রোল: ১০১ | ক্লাস: ১০ম</p>
          </div>
          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition mb-2">
            প্রোফাইল এডিট করুন
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">ব্যক্তিগত তথ্য</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <Phone className="text-indigo-500" size={20} />
                <span>+৮৮০ ১৭০০-০০০০০০</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <Mail className="text-indigo-500" size={20} />
                <span>hafiz@student.com</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <MapPin className="text-indigo-500" size={20} />
                <span>বরিশাল, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">একাডেমিক তথ্য</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <GraduationCap className="text-indigo-500" size={20} />
                <div>
                  <p className="text-xs text-gray-400">বিভাগ</p>
                  <p className="font-bold">হিফজ ও আধুনিক শিক্ষা</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <User className="text-indigo-500" size={20} />
                <div>
                  <p className="text-xs text-gray-400">পিতার নাম</p>
                  <p className="font-bold">মোঃ আব্দুল আলীম</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;