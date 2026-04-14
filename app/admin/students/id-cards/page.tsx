"use client";

import React, { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Printer, Download } from "lucide-react";
import { IDCard } from "@/components/IDCard";

const demoStudent = {
  id: "STU-101",
  name: "Afsar Mahmud",
  nameBn: "আফসার মাহমুদ",
  roll: "105",
  department: "Kitab",
  departmentBn: "কিতাব বিভাগ",
  phone: "+880 1700-000000",
  email: "afsar@student.com",
  bloodGroup: "O+",
  image: "",
};

export default function StudentIdCardsPage() {
  const { language } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card - ${demoStudent.name}</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
              @media print {
                body { background: white; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = printRef.current;
      if (!element) return;

      const canvas = await html2canvas(element);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`ID_Card_${demoStudent.roll}.pdf`);

      alert(
        language === "bn" ? "PDF ডাউনলোড সফল" : "PDF downloaded successfully",
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(
        language === "bn"
          ? "PDF তৈরি করতে সমস্যা হয়েছে"
          : "Failed to generate PDF",
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "শিক্ষার্থীর আইডি কার্ড" : "Student ID Cards"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {language === "bn"
              ? "প্রিন্ট ও ডাউনলোডযোগ্য আইডি কার্ড"
              : "Printable and downloadable ID cards"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
          >
            <Printer size={18} />
            {language === "bn" ? "প্রিন্ট করুন" : "Print"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            <Download size={18} />
            {language === "bn" ? "ডাউনলোড PDF" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* আইডি কার্ড প্রিভিউ */}
      <div className="flex flex-col items-center justify-center py-8">
        <div ref={printRef}>
          <IDCard student={demoStudent} />
        </div>
      </div>

      {/* নির্দেশনা */}
      <div className="bg-blue-50 rounded-xl p-4 mt-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          {language === "bn" ? "নির্দেশনা" : "Instructions"}
        </h3>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>
            {language === "bn"
              ? "প্রিন্ট বাটনে ক্লিক করে কার্ডটি প্রিন্ট করুন"
              : "Click print button to print the card"}
          </li>
          <li>
            {language === "bn"
              ? "লেমিনেট করে ব্যবহার করুন"
              : "Laminate for durability"}
          </li>
          <li>
            {language === "bn"
              ? "QR কোড স্ক্যান করে শিক্ষার্থীর তথ্য পাওয়া যাবে"
              : "Scan QR code to get student information"}
          </li>
        </ul>
      </div>
    </div>
  );
}
