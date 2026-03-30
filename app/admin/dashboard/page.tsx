"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Megaphone,
  TrendingUp,
  Wallet,
  CheckCircle,
  GraduationCap,
  Download,
} from "lucide-react";

// Types
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendType?: "positive" | "negative" | "neutral";
}

interface ActivityItemProps {
  icon: string;
  title: string;
  desc: string;
  time: string;
}

// Dummy Data
const performanceData = [
  { name: "Jan", marks: 75 },
  { name: "Feb", marks: 82 },
  { name: "Mar", marks: 80 },
  { name: "Apr", marks: 95 },
  { name: "May", marks: 88 },
  { name: "Jun", marks: 92 },
];

const deptData = [
  { name: "নুরানি", value: 150, color: "#10b981" },
  { name: "হিফজ", value: 120, color: "#3b82f6" },
  { name: "কিতাব", value: 180, color: "#f59e0b" },
];

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {t("nav.dashboard")}
          </h1>
          <p className="text-slate-500 mt-1">
            মাদ্রাসার আজকের সার্বিক পরিস্থিতি একনজরে দেখুন
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all">
          <Download size={18} className="text-primary" /> রিপোর্ট ডাউনলোড
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("home.stats.students")}
          value="৪৫০"
          icon={<Users size={24} className="text-blue-500" />}
          trend="+১২ জন নতুন"
        />
        <StatCard
          title="আজকের উপস্থিতি"
          value="৯২%"
          icon={<CheckCircle size={24} className="text-emerald-500" />}
          trend="৮ জন অনুপস্থিত"
          trendType="negative"
        />
        <StatCard
          title="মোট সংগ্রহ"
          value="৳৮৫,০০০"
          icon={<Wallet size={24} className="text-orange-500" />}
          trend="১০% বৃদ্ধি"
        />
        <StatCard
          title="নতুন আবেদন"
          value="১২"
          icon={<GraduationCap size={24} className="text-purple-500" />}
          trend="বিগত ৭ দিন"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" /> একাডেমিক
              ইমপ্রুভমেন্ট
            </h2>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none font-medium text-slate-600">
              <option>২০২৬ শিক্ষাবর্ষ</option>
              <option>২০২৫ শিক্ষাবর্ষ</option>
            </select>
          </div>
          <div className="h-[320px] w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="marks"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorMarks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            বিভাগীয় বণ্টন
          </h2>
          <div className="h-[250px] w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {deptData.map((dept) => (
              <div
                key={dept.name}
                className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  ></span>
                  {dept.name}
                </span>
                <span className="font-bold text-slate-800">
                  {dept.value} জন
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Megaphone size={20} className="text-primary" /> সাম্প্রতিক
            কার্যক্রম
          </h2>
          <div className="space-y-2">
            <ActivityItem
              icon="📩"
              title={t("admin.navAdmissions")}
              desc="৫টি নতুন ভর্তির আবেদন জমা পড়েছে"
              time="১০ মিনিট আগে"
            />
            <ActivityItem
              icon="📢"
              title={t("admin.navNotices")}
              desc="রমজানের ছুটির নোটিশ প্রকাশিত হয়েছে"
              time="২ ঘণ্টা আগে"
            />
            <ActivityItem
              icon="💬"
              title={t("admin.navMessages")}
              desc="অভিভাবকের পক্ষ থেকে ৩টি নতুন বার্তা"
              time="৫ ঘণ্টা আগে"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            কুইক অ্যাকশন
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionBtn
              icon={<Users className="text-blue-500" />}
              label="উপস্থিতি নিন"
            />
            <QuickActionBtn
              icon={<Wallet className="text-orange-500" />}
              label="ফি সংগ্রহ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed Components with Types
function StatCard({
  title,
  value,
  icon,
  trend,
  trendType = "positive",
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group overflow-hidden">
      <div className="p-3 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="mt-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
        <p
          className={`text-[11px] font-bold mt-2 flex items-center gap-1 ${trendType === "positive" ? "text-emerald-500" : "text-rose-500"}`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, desc, time }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100">
      <div className="text-2xl bg-white shadow-sm w-12 h-12 flex items-center justify-center rounded-xl">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-800 text-sm leading-none">
          {title}
        </h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <span className="text-[10px] text-slate-400 font-medium">{time}</span>
    </div>
  );
}

function QuickActionBtn({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="p-5 bg-slate-50 hover:bg-primary hover:text-white rounded-[1.5rem] transition-all text-left group border border-slate-100">
      <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-bold text-sm block">{label}</span>
    </button>
  );
}
