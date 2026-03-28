'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MongoDB থেকে মেসেজ লোড করা
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (error) {
      toast.error("মেসেজ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Messages</h2>
        <button onClick={fetchMessages} className="text-sm text-primary font-medium">Refresh</button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Sender</th>
              <th className="p-4 font-semibold text-slate-700">Subject</th>
              <th className="p-4 font-semibold text-slate-700">Date</th>
              <th className="p-4 text-right font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-10">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-10 text-gray-400">No messages found</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{msg.name}</div>
                    <div className="text-sm text-gray-500">{msg.email}</div>
                  </td>
                  <td className="p-4 text-slate-600">{msg.subject}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(msg.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => alert(`Message from ${msg.name}:\n\n${msg.message}`)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
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