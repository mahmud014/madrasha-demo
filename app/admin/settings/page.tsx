'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Settings, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Save, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // এখানে Firebase Update লজিক বসবে
    setTimeout(() => {
      setIsSaving(false);
      alert(t('admin.settingsSuccess'));
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Settings size={32} /> {t('admin.navSettings')}
          </h1>
          <p className="text-slate-500 mt-1">মাদ্রাসার সিস্টেম কনফিগারেশন পরিবর্তন করুন</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? t('admin.loading') : t('admin.settingsSave')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Sidebar - Navigation Tabs (Mockup) */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-4 bg-primary text-white rounded-2xl shadow-md">
            <Globe size={20} /> জেনারেল সেটিংস
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-white text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
            <Bell size={20} /> নোটিফিকেশন
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-white text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
            <ShieldCheck size={20} /> সিকিউরিটি
          </button>
        </div>

        {/* Right Side - Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Institution Info */}
          <div className="bg-white p-8 rounded-3xl card-shadow border border-accent/50 space-y-6">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b pb-4">
              <ImageIcon size={20} /> প্রতিষ্ঠানের তথ্য
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  {t('admin.settingsMadrasaNameBn')}
                </label>
                <input 
                  type="text" 
                  defaultValue="মাদ্রাসা ওয়েবসাইট"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  {t('admin.settingsMadrasaNameEn')}
                </label>
                <input 
                  type="text" 
                  defaultValue="Madrasa Website"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block flex items-center gap-2">
                  <Phone size={14} /> {t('admin.settingsPhone')}
                </label>
                <input 
                  type="text" 
                  placeholder="+৮৮০ ১২৩৪ ৫৬৭৮৯০"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block flex items-center gap-2">
                  <Mail size={14} /> {t('admin.settingsEmail')}
                </label>
                <input 
                  type="email" 
                  placeholder="info@madrasa.com"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block flex items-center gap-2">
                <MapPin size={14} /> {t('admin.settingsAddressBn')}
              </label>
              <textarea 
                rows={3}
                className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="মাদ্রাসার পূর্ণ ঠিকানা লিখুন..."
              />
            </div>
          </div>

          {/* Language & Regional Settings */}
          <div className="bg-white p-8 rounded-3xl card-shadow border border-accent/50 space-y-6">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b pb-4">
              <Globe size={20} /> ভাষা ও অঞ্চল
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">ডিফল্ট ভাষা নির্বাচন করুন</p>
                <p className="text-xs text-slate-400 italic">সিস্টেম কোন ভাষায় প্রদর্শিত হবে</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'bn' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  বাংলা
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Dangerous Zone */}
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
              <ShieldCheck size={20} /> গুরুত্বপূর্ণ এলাকা
            </h3>
            <p className="text-xs text-red-400 mb-4">নিচের অপশনগুলো পরিবর্তন করলে সিস্টেমের ডেটাবেস রিসেট হয়ে যেতে পারে।</p>
            <button className="bg-red-500 text-white text-xs px-4 py-2 rounded-xl hover:bg-red-600 transition-all">
              সিস্টেম ক্যাশ ক্লিয়ার করুন
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}