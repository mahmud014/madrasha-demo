"use client";

import { QRCodeSVG } from "qrcode.react";
import React from "react";
import Image from "next/image";

// ১. স্টুডেন্ট ডাটার জন্য ইন্টারফেস তৈরি (any এর পরিবর্তে)
interface Student {
  id: string;
  name: string;
  roll: string;
  department: string;
  phone: string;
  image?: string; // অপশনাল
}

// ২. প্রপস টাইপ ডিফাইন করা
interface IDCardProps {
  student: Student;
}

export function IDCard({ student }: IDCardProps) {
  return (
    <div className="w-[300px] h-[450px] bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col items-center relative overflow-hidden print:shadow-none print:border-slate-300">
      {/* Background Pattern */}
      <div className="absolute top-0 w-full h-32 bg-primary -skew-y-12 -translate-y-10" />

      <div className="z-10 mt-6 text-center">
        {/* প্রোফাইল ইমেজ সেকশন */}
        <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden mx-auto shadow-md relative bg-slate-100">
          <Image
            src={student.image || "/placeholder-avatar.png"}
            alt={student.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h2 className="mt-4 font-bold text-xl text-slate-800">
          {student.name}
        </h2>
        <p className="text-primary font-bold tracking-widest text-sm uppercase">
          রোল: {student.roll}
        </p>
      </div>

      <div className="w-full mt-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
          <span>বিভাগ</span>
          <span className="font-bold text-slate-800 text-right">
            {student.department}
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
          <span>ফোন</span>
          <span className="font-bold text-slate-800 text-right">
            {student.phone}
          </span>
        </div>
      </div>

      <div className="mt-auto bg-white p-2 rounded-2xl border border-slate-100">
        <QRCodeSVG value={`student-${student.roll}`} size={60} />
      </div>

      <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-tighter text-center">
        মাদরাসা ম্যানেজমেন্ট সিস্টেম
      </p>
    </div>
  );
}

// ৩. মেইন পেজ এক্সপোর্ট (টাইপ সহ)
export default function IDCardsPage() {
  const dummyStudent: Student = {
    id: "1",
    name: "আফসার মাহমুদ",
    roll: "১০৫",
    department: "কিতাব বিভাগ",
    phone: "০১৭XXXXXXXX",
    image: "",
  };

  return (
    <div className="p-10 flex flex-wrap gap-6 justify-center bg-slate-50 min-h-screen">
      <IDCard student={dummyStudent} />
    </div>
  );
}
