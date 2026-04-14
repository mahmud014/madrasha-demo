// components/IDCard.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface Student {
  id: string;
  name: string;
  nameBn: string;
  roll: string;
  department: string;
  departmentBn: string;
  phone: string;
  email: string;
  image?: string;
  fatherName?: string;
  motherName?: string;
  bloodGroup?: string;
}

interface IDCardProps {
  student: Student;
  onPrint?: () => void;
}

export function IDCard({ student, onPrint }: IDCardProps) {
  const { language } = useLanguage();

  const qrData = JSON.stringify({
    id: student.id,
    roll: student.roll,
    name: student.name,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="w-[320px] h-[480px] bg-white rounded-2xl shadow-xl flex flex-col relative overflow-hidden print:shadow-none print:border print:border-gray-200">
      {/* হেডার গ্রেডিয়েন্ট */}
      <div className="relative h-28 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
            {student.image ? (
              <Image
                src={student.image}
                alt={student.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {student.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* কন্টেন্ট */}
      <div className="flex-1 px-5 pt-8 pb-5">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">
            {language === "bn" ? student.nameBn : student.name}
          </h2>
          <p className="text-primary font-bold text-sm mt-0.5">
            {language === "bn"
              ? `রোল: ${student.roll}`
              : `Roll: ${student.roll}`}
          </p>
          <p className="text-xs text-gray-400">ID: {student.id}</p>
        </div>

        {/* তথ্য */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {language === "bn" ? "বিভাগ" : "Department"}
            </span>
            <span className="font-medium text-gray-700">
              {language === "bn" ? student.departmentBn : student.department}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {language === "bn" ? "ফোন" : "Phone"}
            </span>
            <span className="font-medium text-gray-700">{student.phone}</span>
          </div>
          {student.bloodGroup && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">
                {language === "bn" ? "রক্তের গ্রুপ" : "Blood Group"}
              </span>
              <span className="font-medium text-gray-700">
                {student.bloodGroup}
              </span>
            </div>
          )}
        </div>

        {/* QR কোড */}
        <div className="flex justify-center mt-4">
          <div className="bg-white p-1.5 rounded-lg border border-gray-200">
            <QRCodeSVG value={qrData} size={70} level="H" />
          </div>
        </div>

        {/* ফুটার */}
        <div className="text-center mt-3">
          <p className="text-[8px] text-gray-400 uppercase tracking-wider">
            Madrasa Management System
          </p>
        </div>
      </div>

      {/* প্রিন্ট বাটন */}
      {onPrint && (
        <button
          onClick={onPrint}
          className="absolute bottom-2 right-2 text-gray-400 hover:text-primary transition-colors print:hidden"
        >
          🖨️
        </button>
      )}
    </div>
  );
}
