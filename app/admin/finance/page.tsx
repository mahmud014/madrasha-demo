'use client';

import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Download, Plus, Calculator, History } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function FinancePage() {
  const { t, language } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ক্যালকুলেটর স্টেট
  const [formData, setFormData] = useState({
    studentName: '',
    studentRoll: '',
    month: '',
    tuitionFee: 0,
    examFee: 0,
    otherFee: 0,
  });

  // টোটাল ক্যালকুলেশন
  const totalAmount = Number(formData.tuitionFee) + Number(formData.examFee) + Number(formData.otherFee);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'payments'), orderBy('createdAt', 'desc')),
      (s) => setPayments(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || totalAmount <= 0) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      await addDoc(collection(db, 'payments'), {
        ...formData,
        totalAmount,
        createdAt: serverTimestamp(),
      });
      toast.success("Payment Successful!");
      setFormData({ studentName: '', studentRoll: '', month: '', tuitionFee: 0, examFee: 0, otherFee: 0 });
    } catch (error) {
      toast.error("Error saving payment");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (payment: any) => {
    const element = document.getElementById(`invoice-${payment.id}`);
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`Invoice_${payment.studentRoll}_${payment.month}.pdf`);
  };

  return (
    <div className="p-8 space-y-8 bg-accent/10 min-h-screen">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
        <Calculator className="w-8 h-8" /> ফিন্যান্স ও পেমেন্ট ম্যানেজমেন্ট
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* পেমেন্ট ক্যালকুলেটর ও এন্ট্রি ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-accent">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-secondary" /> নতুন পেমেন্ট এন্ট্রি
          </h3>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <input 
              type="text" placeholder="ছাত্রের নাম" 
              className="w-full p-3 rounded-xl border bg-accent/5"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            />
            <input 
              type="text" placeholder="রোল নম্বর" 
              className="w-full p-3 rounded-xl border bg-accent/5"
              value={formData.studentRoll}
              onChange={(e) => setFormData({...formData, studentRoll: e.target.value})}
            />
            <select 
              className="w-full p-3 rounded-xl border bg-accent/5"
              value={formData.month}
              onChange={(e) => setFormData({...formData, month: e.target.value})}
            >
              <option value="">মাস নির্বাচন করুন</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="টিউশন ফি" className="p-3 rounded-xl border" onChange={(e)=>setFormData({...formData, tuitionFee: Number(e.target.value)})}/>
              <input type="number" placeholder="পরীক্ষা ফি" className="p-3 rounded-xl border" onChange={(e)=>setFormData({...formData, examFee: Number(e.target.value)})}/>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-sm text-ink/60 text-center">মোট পরিমাণ</p>
              <p className="text-3xl font-bold text-primary text-center">৳ {totalAmount}</p>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-secondary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-secondary/90 transition-all"
            >
              {loading ? "প্রসেসিং..." : "পেমেন্ট নিশ্চিত করুন"}
            </button>
          </form>
        </div>

        {/* পেমেন্ট হিস্ট্রি টেবিল */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-accent overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> পেমেন্ট হিস্ট্রি
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-primary/5 text-primary text-sm">
                <tr>
                  <th className="px-6 py-4">ছাত্র ও রোল</th>
                  <th className="px-6 py-4">মাস</th>
                  <th className="px-6 py-4">মোট টাকা</th>
                  <th className="px-6 py-4 text-right">ইনভয়েস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">{p.studentName}</div>
                      <div className="text-xs text-ink/50">Roll: {p.studentRoll}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{p.month}</td>
                    <td className="px-6 py-4 font-bold text-primary">৳ {p.totalAmount}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadInvoice(p)}
                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                      >
                        <Download className="w-5 h-5" />
                      </button>

                      {/* ইনভয়েস টেমপ্লেট (এটি স্ক্রিনের বাইরে থাকবে বা হিডেন থাকবে) */}
                      <div className="hidden">
                        <div id={`invoice-${p.id}`} className="p-10 bg-white text-black w-[800px]">
                          <h1 className="text-2xl font-bold text-center border-b pb-4 mb-4">Payment Receipt</h1>
                          <div className="flex justify-between mb-8">
                            <div>
                              <p><strong>Name:</strong> {p.studentName}</p>
                              <p><strong>Roll:</strong> {p.studentRoll}</p>
                            </div>
                            <div className="text-right">
                              <p><strong>Month:</strong> {p.month}</p>
                              <p><strong>Date:</strong> {p.createdAt?.toDate().toLocaleDateString()}</p>
                            </div>
                          </div>
                          <table className="w-full border-collapse border border-gray-200">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr><td className="border p-2">Tuition Fee</td><td className="border p-2">৳ {p.tuitionFee}</td></tr>
                              <tr><td className="border p-2">Exam Fee</td><td className="border p-2">৳ {p.examFee}</td></tr>
                              <tr><td className="border p-2">Other Fee</td><td className="border p-2">৳ {p.otherFee}</td></tr>
                              <tr className="font-bold bg-gray-50"><td className="border p-2">Total Paid</td><td className="border p-2 text-primary">৳ {p.totalAmount}</td></tr>
                            </tbody>
                          </table>
                          <p className="mt-10 text-center text-xs text-gray-400 font-mono italic">Generated by Student Management System</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}