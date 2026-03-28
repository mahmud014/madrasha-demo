'use client';

import React, { useEffect, useState } from 'react';
import { UserCog, ShieldCheck, Trash2, Loader2, Mail, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ইউজার লিস্ট নিয়ে আসা
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users'); // এই API-টি নিচে তৈরি করা হয়েছে
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      toast.error("ইউজার লিস্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // রোল আপডেট করার ফাংশন
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success("রোল আপডেট সফল হয়েছে");
        fetchUsers(); // লিস্ট রিফ্রেশ করা
      }
    } catch (error) {
      toast.error("আপডেট করা সম্ভব হয়নি");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
        <p className="text-slate-500">সিস্টেমের সকল ব্যবহারকারী এবং তাদের এক্সেস কন্ট্রোল করুন</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-5 font-semibold text-slate-700">User Details</th>
              <th className="p-5 font-semibold text-slate-700">Role</th>
              <th className="p-5 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td>
              </tr>
            ) : users.map((user) => (
              <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                    user.role === 'teacher' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-5 text-right space-x-2">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg p-1 outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="parent">Student/Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}