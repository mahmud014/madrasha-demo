'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Eye, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MongoDB থেকে মেসেজ ফেচ করার ফাংশন
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      const result = await res.json();

      if (res.ok && result.success) {
        // API থেকে আসা result.data কে সেট করা হচ্ছে
        setMessages(result.data || []);
      } else {
        toast.error(result.message || "ডেটা লোড করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("সার্ভারের সাথে সংযোগ করা যাচ্ছে না");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // মেসেজ ডিলিট করার ফাংশন
  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই মেসেজটি ডিলিট করতে চান?")) return;

    try {
      // এখানে আপনার API রুটে ডিলিট হ্যান্ডলার থাকতে হবে
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok && result.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        toast.success("মেসেজটি ডিলিট করা হয়েছে");
      } else {
        toast.error(result.message || "ডিলিট করা সম্ভব হয়নি");
      }
    } catch (error) {
      toast.error("ডিলিট করার সময় একটি ত্রুটি ঘটেছে");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Messages</h2>
          <p className="text-sm text-slate-500">মাদরাসার ইনবক্স এবং যোগাযোগসমূহ</p>
        </div>
        <button 
          onClick={fetchMessages} 
          disabled={loading}
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Sender</th>
              <th className="p-4 font-semibold text-slate-700">Subject</th>
              <th className="p-4 font-semibold text-slate-700">Date</th>
              <th className="p-4 text-right font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-16">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-slate-500">মেসেজ লোড হচ্ছে...</p>
                  </div>
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-16 text-slate-400">
                  ইনবক্সে কোনো মেসেজ পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{msg.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{msg.contact || msg.email || 'No Contact'}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-600 line-clamp-1">{msg.subject}</span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('bn-BD') : 'N/A'}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button 
                      onClick={() => alert(`Name: ${msg.name}\nSubject: ${msg.subject}\n\nMessage:\n${msg.message}`)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-all"
                      title="View Message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(msg._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}