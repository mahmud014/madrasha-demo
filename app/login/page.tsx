"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  IdCard,
  Lock,
  LogIn,
  LayoutDashboard,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const { language, t } = useLanguage(); // setLanguage দরকার নেই
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          language === "bn" ? "লগইন সফল হয়েছে!" : "Login successful!",
        );

        if (data.user && data.token) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
        }

        setUser(data.user);

        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/student");
        }
      } else {
        toast.error(
          data.message ||
            (language === "bn"
              ? "আইডি বা পাসওয়ার্ড ভুল!"
              : "Invalid ID or password!"),
        );
      }
    } catch (error) {
      toast.error(
        language === "bn"
          ? "লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।"
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 md:p-10 border border-slate-100"
      >
        {/* লোগো ও হেডার */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <LayoutDashboard className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {language === "bn" ? "লগইন" : "Login"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {language === "bn"
              ? "আপনার আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন"
              : "Enter your ID and password to login"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* ID Input Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IdCard className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder={
                language === "bn"
                  ? "শিক্ষার্থী / শিক্ষক আইডি"
                  : "Student / Teacher ID"
              }
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          </div>

          {/* Password Input Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={language === "bn" ? "পাসওয়ার্ড" : "Password"}
              required
              className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end px-1">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {language === "bn"
                ? "পাসওয়ার্ড ভুলে গেছেন?"
                : "Forgot Password?"}
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{language === "bn" ? "লগইন করুন" : "Login Now"}</span>
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-slate-500 font-medium">
            {language === "bn" ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline underline-offset-4 transition-colors"
            >
              {language === "bn" ? "নতুন তৈরি করুন" : "Create new"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
