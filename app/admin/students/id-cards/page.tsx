import { QRCodeSVG } from 'qrcode.react';

export function IDCard({ student }: { student: any }) {
  return (
    <div className="w-[300px] h-[450px] bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col items-center relative overflow-hidden print:shadow-none print:border-slate-300">
      {/* Background Pattern */}
      <div className="absolute top-0 w-full h-32 bg-primary -skew-y-12 -translate-y-10" />
      
      <div className="z-10 mt-6 text-center">
        <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden mx-auto shadow-md">
           <img src="/placeholder-avatar.png" className="w-full h-full object-cover" alt="Student" />
        </div>
        <h2 className="mt-4 font-bold text-xl text-slate-800">আফসার মাহমুদ</h2>
        <p className="text-primary font-bold tracking-widest text-sm uppercase">রোল: ১০৫</p>
      </div>

      <div className="w-full mt-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
          <span>বিভাগ</span> <span className="font-bold text-slate-800 text-right">কিতাব বিভাগ</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
          <span>ফোন</span> <span className="font-bold text-slate-800 text-right">০১৭XXXXXXXX</span>
        </div>
      </div>

      <div className="mt-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
        <QRCodeSVG value="student-105" size={60} />
      </div>
      <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-tighter text-center">মাদরাসা ম্যানেজমেন্ট সিস্টেম</p>
    </div>
  );
}