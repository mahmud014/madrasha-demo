'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight, IdCard, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
  name: '', 
  email: '', 
  password: '', 
  role: 'student', // 'parent' এর বদলে 'student' দিন
  id: '' 
});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখানোর স্টেট
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('রেজিস্ট্রেশন সফল হয়েছে! লগইন করুন।');
        router.push('/login');
      } else {
        toast.error(data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      toast.error('কিছু একটা ভুল হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">মাদরাসা ম্যানেজমেন্ট সিস্টেমে যোগ দিন</p>
        </div>

        {/* Role Selection */}
        <div className="relative flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <motion.div
            className="absolute inset-y-1.5 bg-white rounded-xl shadow-sm z-0"
            initial={false}
            animate={{
              x: formData.role === 'parent' ? 0 : '100%',
              width: 'calc(50% - 6px)'
            }}
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'parent' })}
            className={cn(
              "relative z-10 w-1/2 py-2.5 text-sm font-bold flex items-center justify-center space-x-2",
              formData.role === 'parent' ? "text-primary" : "text-slate-500"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'admin' })}
            className={cn(
              "relative z-10 w-1/2 py-2.5 text-sm font-bold flex items-center justify-center space-x-2",
              formData.role === 'admin' ? "text-primary" : "text-slate-500"
            )}
          >
            <Briefcase className="w-4 h-4" />
            <span>Teacher</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID */}
          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={formData.role === 'parent' ? "Student ID" : "Teacher ID"}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          </div>

          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password with Show/Hide */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-3.5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}