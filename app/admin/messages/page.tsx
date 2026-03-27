'use client';

import React from 'react';
import { db, collection, query, orderBy, onSnapshot } from '@/lib/firebase';
import { Trash2, Eye } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'messages'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
    );

    return () => unsub();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-4">Sender</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-t">
                <td className="p-4">
                  <div>{msg.name}</div>
                  <div className="text-sm text-gray-500">{msg.email}</div>
                </td>

                <td className="p-4">{msg.subject}</td>

                <td className="p-4">
                  {msg.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                </td>

                <td className="p-4 text-right space-x-2">
                  <button onClick={() => alert(msg.message)}>
                    <Eye className="w-4 h-4" />
                  </button>

                  <button>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}

            {messages.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">
                  No messages
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}