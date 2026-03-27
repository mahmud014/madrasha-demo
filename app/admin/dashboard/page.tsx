'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { 
  Users, Megaphone, MessageSquare, TrendingUp, 
  Wallet, CheckCircle, Clock, GraduationCap 
} from 'lucide-react';

// ডামি ডাটা
const performanceData = [
  { name: 'Jan', marks: 75 }, { name: 'Feb', marks: 82 },
  { name: 'Mar', marks: 80 }, { name: 'Apr', marks: 95 },
  { name: 'May', marks: 88 }, { name: 'Jun', marks: 92 },
];

const deptData = [
  { name: 'নুরানি', value: 150, color: '#10b981' },
  { name: 'হিফজ', value: 120, color: '#3b82f6' },
  { name: 'কিতাব', value: 180, color: '#f59e0b' },
];

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header with Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('nav.dashboard')}</h1>
          <p className="text-slate-500 mt-1">মাদ্রাসার আজকের সার্বিক পরিস্থিতি একনজরে দেখুন</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-accent px-4 py-2 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
             <Clock size={16} /> রিপোর্ট ডাউনলোড
           </button>
        </div>
      </div>

      {/* 1. Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('home.stats.students')} value="৪৫০" icon={<Users className="text-blue-500" />} trend="+১২ জন নতুন" />
        <StatCard title="আজকের উপস্থিতি" value="৯২%" icon={<CheckCircle className="text-emerald-500" />} trend="৮ জন অনুপস্থিত" />
        <StatCard title="মোট সংগ্রহ (মাসিক)" value="৳৮৫,০০০" icon={<Wallet className="text-orange-500" />} trend="১০% বৃদ্ধি" />
        <StatCard title="নতুন আবেদন" value="১২" icon={<GraduationCap className="text-purple-500" />} trend="বিগত ৭ দিন" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Performance Graph (Takes 2/3 space) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <TrendingUp size={20} /> একাডেমিক ইমপ্রুভমেন্ট
            </h2>
            <select className="text-xs bg-slate-50 border-none rounded-lg p-1 outline-none">
              <option>২০২৬ শিক্ষাবর্ষ</option>
              <option>২০২৫ শিক্ষাবর্ষ</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="marks" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMarks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Department Wise Distribution (Pie Chart) */}
        <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <h2 className="text-xl font-semibold mb-6 text-primary">বিভাগীয় বণ্টন</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {deptData.map((dept) => (
              <div key={dept.name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></span>
                  {dept.name}
                </span>
                <span className="font-bold text-slate-700">{dept.value} জন</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 4. Recent Activity/Events */}
        <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <h2 className="text-xl font-semibold mb-6 text-primary flex items-center gap-2">
            <Megaphone size={20} /> সাম্প্রতিক কার্যক্রম
          </h2>
          <div className="space-y-4">
            <ActivityItem icon="📩" title={t('admin.navAdmissions')} desc="৫টি নতুন ভর্তির আবেদন জমা পড়েছে" time="১০ মিনিট আগে" />
            <ActivityItem icon="📢" title={t('admin.navNotices')} desc="রমজানের ছুটির নোটিশ প্রকাশিত হয়েছে" time="২ ঘণ্টা আগে" />
            <ActivityItem icon="💬" title={t('admin.navMessages')} desc="অভিভাবকের পক্ষ থেকে ৩টি নতুন বার্তা" time="৫ ঘণ্টা আগে" />
          </div>
        </div>

        {/* 5. Quick Actions/Finance Overview */}
        <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50">
          <h2 className="text-xl font-semibold mb-6 text-primary">কুইক অ্যাকশন</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl transition-all text-left group">
              <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Users size={20} className="text-primary" />
              </div>
              <span className="font-bold text-sm">উপস্থিতি নিন</span>
            </button>
            <button className="p-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl transition-all text-left group">
              <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Wallet size={20} className="text-primary" />
              </div>
              <span className="font-bold text-sm">ফি সংগ্রহ</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-accent/50 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      </div>
      <div className="mt-4">
        <h2 className="text-sm text-slate-400 font-medium">{title}</h2>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
          {trend}
        </p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, desc, time }: any) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-700 text-sm">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <span className="text-[10px] text-slate-400 italic">{time}</span>
    </div>
  );
}