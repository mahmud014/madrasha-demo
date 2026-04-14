"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {language === "bn" ? "পেজ পাওয়া যায়নি" : "Page Not Found"}
        </h2>
        <p className="text-gray-500 mt-2">
          {language === "bn"
            ? "আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই।"
            : "The page you are looking for does not exist."}
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {language === "bn" ? "হোম পেজে ফিরুন" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
