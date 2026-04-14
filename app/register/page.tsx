"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  IdCard,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          language === "bn"
            ? "রেজিস্ট্রেশন সফল হয়েছে! লগইন করুন।"
            : "Registration successful! Please login.",
        );
        router.push("/login");
      } else {
        toast.error(
          data.message ||
            (language === "bn"
              ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে"
              : "Registration failed"),
        );
      }
    } catch (error) {
      toast.error(
        language === "bn" ? "কিছু একটা ভুল হয়েছে!" : "Something went wrong!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === "bn" ? "নিবন্ধন" : "Create Account"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {language === "bn"
              ? "মাদরাসা ম্যানেজমেন্ট সিস্টেমে যোগ দিন"
              : "Join Madrasa Management System"}
          </p>
        </div>

        {/* Role Selection */}
        <div className="relative flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <motion.div
            className="absolute inset-y-1.5 bg-white rounded-xl shadow-sm z-0"
            initial={false}
            animate={{
              x: formData.role === "student" ? "0%" : "100%",
              width: "calc(50% - 6px)",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "student" })}
            className={cn(
              "relative z-10 w-1/2 py-2.5 text-sm font-bold flex items-center justify-center space-x-2 rounded-xl transition-all",
              formData.role === "student" ? "text-primary" : "text-slate-500",
            )}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{language === "bn" ? "শিক্ষার্থী" : "Student"}</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "teacher" })}
            className={cn(
              "relative z-10 w-1/2 py-2.5 text-sm font-bold flex items-center justify-center space-x-2 rounded-xl transition-all",
              formData.role === "teacher" ? "text-primary" : "text-slate-500",
            )}
          >
            <Briefcase className="w-4 h-4" />
            <span>{language === "bn" ? "শিক্ষক" : "Teacher"}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID */}
          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={
                formData.role === "student"
                  ? language === "bn"
                    ? "শিক্ষার্থী আইডি"
                    : "Student ID"
                  : language === "bn"
                    ? "শিক্ষক আইডি"
                    : "Teacher ID"
              }
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          </div>

          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={language === "bn" ? "পূর্ণ নাম" : "Full Name"}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password with Show/Hide */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={language === "bn" ? "পাসওয়ার্ড" : "Password"}
              required
              className="w-full pl-12 pr-12 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {language === "bn" ? "নিবন্ধন করুন" : "Register Now"}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          {language === "bn"
            ? "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?"
            : "Already have an account?"}{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:text-primary/80 transition-colors"
          >
            {language === "bn" ? "লগইন করুন" : "Login here"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
