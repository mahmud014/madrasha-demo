'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { IdCard, Lock, LogIn, LayoutDashboard, Eye, EyeOff } from 'lucide-react'; // Eye আইকনগুলো ইমপোর্ট করা হয়েছে
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখানোর স্টেট
  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('লগইন সফল হয়েছে!');
        setUser(data.user); 
        
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student');
        }
      } else {
        toast.error(data.message || 'আইডি বা পাসওয়ার্ড ভুল!');
      }
    } catch (error) {
      toast.error('লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-10 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <LayoutDashboard className="w-10 h-10 text-primary -rotate-3" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Login</h2>
          <p className="text-slate-500 mt-2 font-medium">আপনার আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* ID Input Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IdCard className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Student / Teacher ID"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-semibold"
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          </div>

          {/* Password Input Field with Show/Hide */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"} // স্টেট অনুযায়ী টাইপ পরিবর্তন
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-semibold"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {/* Show/Hide Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end px-1">
            <Link 
              href="/forgot-password" 
              className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login Now</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-10">
          <p className="text-slate-500 font-medium">
            অ্যাকাউন্ট নেই?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">
              নতুন তৈরি করুন
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}