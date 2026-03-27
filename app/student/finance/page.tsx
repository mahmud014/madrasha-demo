import React from 'react';
import { Download, CreditCard, CheckCircle2 } from 'lucide-react';

const FeesPage = () => {
  const history = [
    { id: '#102', month: 'ফেব্রুয়ারি ২০২৬', amount: '১২০০', status: 'Paid', date: '05 Feb' },
    { id: '#101', month: 'জানুয়ারি ২০২৬', amount: '১২০০', status: 'Paid', date: '02 Jan' },
  ];

  return (
    <div className="space-y-6">
      {/* ব্যালেন্স কার্ড */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-lg">
        <p className="opacity-80">মোট বকেয়া (Total Due)</p>
        <h2 className="text-4xl font-black mt-2">৳ ২৫০০</h2>
        <button className="mt-6 bg-white text-indigo-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition">
          <CreditCard size={18} /> অনলাইনে পেমেন্ট করুন
        </button>
      </div>

      {/* পেমেন্ট হিস্ট্রি টেবিল */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-xl font-bold mb-6">পেমেন্ট হিস্ট্রি</h3>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-full"><CheckCircle2 /></div>
                <div>
                  <p className="font-bold text-gray-800">{item.month}</p>
                  <p className="text-sm text-gray-500">ID: {item.id} • {item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-bold text-gray-700">৳ {item.amount}</span>
                <button title="Download Receipt" className="p-2 hover:bg-gray-200 rounded-lg text-blue-600">
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeesPage;