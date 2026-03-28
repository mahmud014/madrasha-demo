'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('আপনার ইমেইলে রিসেট লিঙ্ক পাঠানো হয়েছে!');
      } else {
        toast.error(data.message || 'কিছু সমস্যা হয়েছে');
      }
    } catch (error) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Forgot Password?</h2>
          <p className="text-slate-500 mt-2">আপনার ইমেইল দিন, আমরা রিসেট লিঙ্ক পাঠিয়ে দিচ্ছি</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 transition-all hover:bg-primary/90"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}