'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        toast.success('পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!');
        router.push('/login');
      } else {
        toast.error('লিঙ্কটি ভুল বা মেয়াদ শেষ হয়ে গেছে');
      }
    } catch (error) {
      toast.error('কিছু সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Set New Password</h2>
          <p className="text-slate-500 mt-2">আপনার নতুন শক্তিশালী পাসওয়ার্ডটি লিখুন</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              required
              className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-primary"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2"
          >
            {loading ? "Updating..." : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Reset Password</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}