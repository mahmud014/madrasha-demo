'use client';

import React, { useState, useEffect } from 'react';
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

  // LocalStorage থেকে ডাটা লোড করা (Firebase এর বিকল্প হিসেবে)
  useEffect(() => {
    const savedData = localStorage.getItem('madrasa_payments');
    if (savedData) {
      setPayments(JSON.parse(savedData));
    }
  }, []);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || totalAmount <= 0) {
      return toast.error("অনুগ্রহ করে সব ঘর পূরণ করুন");
    }

    setLoading(true);
    try {
      // নতুন পেমেন্ট অবজেক্ট তৈরি
      const newPayment = {
        id: Date.now().toString(), // ইউনিক আইডি
        ...formData,
        totalAmount,
        createdAt: new Date().toISOString(), // টাইমস্ট্যাম্প
      };

      const updatedPayments = [newPayment, ...payments];
      setPayments(updatedPayments);
      
      // LocalStorage এ সেভ করা
      localStorage.setItem('madrasa_payments', JSON.stringify(updatedPayments));

      toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
      setFormData({ studentName: '', studentRoll: '', month: '', tuitionFee: 0, examFee: 0, otherFee: 0 });
    } catch (error) {
      toast.error("সেভ করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (payment: any) => {
    const element = document.getElementById(`invoice-${payment.id}`);
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${payment.studentRoll}_${payment.month}.pdf`);
      toast.success("ইনভয়েস ডাউনলোড হচ্ছে...");
    } catch (error) {
      toast.error("PDF তৈরি করতে সমস্যা হয়েছে");
    }
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
              className="w-full p-3 rounded-xl border bg-accent/5 focus:outline-primary"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            />
            <input 
              type="text" placeholder="রোল নম্বর" 
              className="w-full p-3 rounded-xl border bg-accent/5 focus:outline-primary"
              value={formData.studentRoll}
              onChange={(e) => setFormData({...formData, studentRoll: e.target.value})}
            />
            <select 
              className="w-full p-3 rounded-xl border bg-accent/5 focus:outline-primary"
              value={formData.month}
              onChange={(e) => setFormData({...formData, month: e.target.value})}
            >
              <option value="">মাস নির্বাচন করুন</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" placeholder="টিউশন ফি" className="p-3 rounded-xl border focus:outline-primary" 
                value={formData.tuitionFee || ''}
                onChange={(e)=>setFormData({...formData, tuitionFee: Number(e.target.value)})}
              />
              <input 
                type="number" placeholder="পরীক্ষা ফি" className="p-3 rounded-xl border focus:outline-primary" 
                value={formData.examFee || ''}
                onChange={(e)=>setFormData({...formData, examFee: Number(e.target.value)})}
              />
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-sm text-ink/60 text-center">মোট পরিমাণ</p>
              <p className="text-3xl font-bold text-primary text-center">৳ {totalAmount}</p>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-secondary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-secondary/90 transition-all disabled:opacity-50"
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
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-ink/40">কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।</td>
                  </tr>
                ) : (
                  payments.map((p) => (
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

                        {/* ইনভয়েস টেমপ্লেট (হিডেন) */}
                        <div className="fixed left-[-9999px] top-0">
                          <div id={`invoice-${p.id}`} className="p-10 bg-white text-black w-[800px] font-sans">
                            <h1 className="text-3xl font-bold text-center border-b-2 border-primary pb-4 mb-6 text-primary">Payment Receipt</h1>
                            <div className="flex justify-between mb-8 text-lg">
                              <div>
                                <p><strong>Student Name:</strong> {p.studentName}</p>
                                <p><strong>Roll Number:</strong> {p.studentRoll}</p>
                              </div>
                              <div className="text-right">
                                <p><strong>Billing Month:</strong> {p.month}</p>
                                <p><strong>Payment Date:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 p-4 text-left">Description</th>
                                  <th className="border border-gray-300 p-4 text-right">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="text-lg">
                                <tr><td className="border border-gray-300 p-4">Tuition Fee</td><td className="border border-gray-300 p-4 text-right">৳ {p.tuitionFee}</td></tr>
                                <tr><td className="border border-gray-300 p-4">Exam Fee</td><td className="border border-gray-300 p-4 text-right">৳ {p.examFee}</td></tr>
                                <tr><td className="border border-gray-300 p-4">Other Fee</td><td className="border border-gray-300 p-4 text-right">৳ {p.otherFee}</td></tr>
                                <tr className="font-bold bg-primary/5 text-primary text-xl">
                                  <td className="border border-gray-300 p-4">Total Paid</td>
                                  <td className="border border-gray-300 p-4 text-right">৳ {p.totalAmount}</td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="mt-12 flex justify-between">
                              <div className="text-center w-40 border-t border-black pt-2">Accountant</div>
                              <div className="text-center w-40 border-t border-black pt-2">Principal</div>
                            </div>
                            <p className="mt-10 text-center text-sm text-gray-400 font-mono italic">Automatically generated by Madrasa Management System</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}