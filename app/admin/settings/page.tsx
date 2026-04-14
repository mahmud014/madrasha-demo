"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Settings,
  Globe,
  Bell,
  ShieldCheck,
  Save,
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  Moon,
  Sun,
  Database,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

interface SettingsData {
  madrasaNameBn: string;
  madrasaNameEn: string;
  phone: string;
  email: string;
  addressBn: string;
  addressEn: string;
  heroImageUrl: string;
  logoUrl: string;
  faviconUrl: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  autoSmsEnabled: boolean;
}

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData>({
    madrasaNameBn: "মাদ্রাসা ওয়েবসাইট",
    madrasaNameEn: "Madrasa Website",
    phone: "+880 1234 567890",
    email: "info@madrasa.com",
    addressBn: "ঢাকা, বাংলাদেশ",
    addressEn: "Dhaka, Bangladesh",
    heroImageUrl: "",
    logoUrl: "",
    faviconUrl: "",
    theme: "light",
    notificationsEnabled: true,
    autoSmsEnabled: true,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // সেটিংস লোড করা
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (res.ok && data) {
          setSettings((prev) => ({ ...prev, ...data }));
          if (data.logoUrl) setLogoPreview(data.logoUrl);
          if (data.heroImageUrl) setHeroPreview(data.heroImageUrl);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(
          language === "bn"
            ? "সেটিংস সংরক্ষিত হয়েছে"
            : "Settings saved successfully",
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(
        language === "bn"
          ? "সেটিংস সংরক্ষণে সমস্যা হয়েছে"
          : "Failed to save settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: "logo" | "hero") => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        const imageUrl = data.url;
        if (type === "logo") {
          setSettings((prev) => ({ ...prev, logoUrl: imageUrl }));
          setLogoPreview(imageUrl);
        } else {
          setSettings((prev) => ({ ...prev, heroImageUrl: imageUrl }));
          setHeroPreview(imageUrl);
        }
        toast.success(
          language === "bn" ? "ইমেজ আপলোড সফল" : "Image uploaded successfully",
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(
        language === "bn" ? "ইমেজ আপলোড ব্যর্থ" : "Image upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const tabs = [
    {
      id: "general",
      labelBn: "সাধারণ সেটিংস",
      labelEn: "General Settings",
      icon: Settings,
    },
    {
      id: "appearance",
      labelBn: "চেহারা",
      labelEn: "Appearance",
      icon: ImageIcon,
    },
    {
      id: "notifications",
      labelBn: "নোটিফিকেশন",
      labelEn: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      labelBn: "সুরক্ষা",
      labelEn: "Security",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "bn" ? "সেটিংস" : "Settings"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {language === "bn"
              ? "মাদ্রাসার সিস্টেম কনফিগারেশন পরিবর্তন করুন"
              : "Configure madrasa system settings"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {isSaving
            ? language === "bn"
              ? "সংরক্ষণ হচ্ছে..."
              : "Saving..."
            : language === "bn"
              ? "সংরক্ষণ করুন"
              : "Save Changes"}
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* সাইডবার ট্যাব */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">
                  {language === "bn" ? tab.labelBn : tab.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* কন্টেন্ট এলাকা */}
        <div className="flex-1 space-y-6">
          {/* জেনারেল সেটিংস */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Settings size={18} className="text-primary" />
                  {language === "bn"
                    ? "প্রতিষ্ঠানের তথ্য"
                    : "Institution Information"}
                </h3>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("admin.settingsMadrasaNameBn")}
                    </label>
                    <input
                      type="text"
                      value={settings.madrasaNameBn}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          madrasaNameBn: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("admin.settingsMadrasaNameEn")}
                    </label>
                    <input
                      type="text"
                      value={settings.madrasaNameEn}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          madrasaNameEn: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Phone size={14} /> {t("admin.settingsPhone")}
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Mail size={14} /> {t("admin.settingsEmail")}
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin size={14} /> {t("admin.settingsAddressBn")}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.addressBn}
                    onChange={(e) =>
                      setSettings({ ...settings, addressBn: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin size={14} /> {t("admin.settingsAddressEn")}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.addressEn}
                    onChange={(e) =>
                      setSettings({ ...settings, addressEn: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* চেহারা সেটিংস */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* লোগো আপলোড */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" />
                    {language === "bn" ? "লোগো ও চিত্র" : "Logo & Images"}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* লোগো */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "bn" ? "লোগো" : "Logo"}
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {logoPreview ? (
                            <Image
                              src={logoPreview}
                              alt="Logo"
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                            {isUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                              <Upload size={14} className="inline mr-1" />
                            )}
                            {language === "bn" ? "ছবি আপলোড" : "Upload Image"}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "logo");
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* হিরো ইমেজ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "bn" ? "হিরো ইমেজ" : "Hero Image"}
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {heroPreview ? (
                            <Image
                              src={heroPreview}
                              alt="Hero"
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                            {isUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                              <Upload size={14} className="inline mr-1" />
                            )}
                            {language === "bn" ? "ছবি আপলোড" : "Upload Image"}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "hero");
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* থিম সেটিংস */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    {language === "bn" ? "থিম" : "Theme"}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        setSettings({ ...settings, theme: "light" })
                      }
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        settings.theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm font-medium">
                        {language === "bn" ? "হালকা" : "Light"}
                      </p>
                    </button>
                    <button
                      onClick={() =>
                        setSettings({ ...settings, theme: "dark" })
                      }
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        settings.theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                      <p className="text-sm font-medium">
                        {language === "bn" ? "গাঢ়" : "Dark"}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* নোটিফিকেশন সেটিংস */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Bell size={18} className="text-primary" />
                  {language === "bn"
                    ? "নোটিফিকেশন সেটিংস"
                    : "Notification Settings"}
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {language === "bn" ? "অটো SMS" : "Auto SMS"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "উপস্থিতি ও ফি সংক্রান্ত SMS স্বয়ংক্রিয়ভাবে পাঠানো হোক"
                        : "Automatically send attendance and fee related SMS"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        autoSmsEnabled: !settings.autoSmsEnabled,
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      settings.autoSmsEnabled ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                        settings.autoSmsEnabled ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">
                      {language === "bn"
                        ? "ইমেইল নোটিফিকেশন"
                        : "Email Notifications"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "bn"
                        ? "নতুন মেসেজ ও আবেদনের ইমেইল নোটিফিকেশন"
                        : "Email notifications for new messages and applications"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notificationsEnabled: !settings.notificationsEnabled,
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      settings.notificationsEnabled
                        ? "bg-primary"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                        settings.notificationsEnabled ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* নিরাপত্তা সেটিংস */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary" />
                    {language === "bn"
                      ? "নিরাপত্তা সেটিংস"
                      : "Security Settings"}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "bn"
                        ? "বর্তমান পাসওয়ার্ড"
                        : "Current Password"}
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "bn" ? "নতুন পাসওয়ার্ড" : "New Password"}
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "bn"
                        ? "নতুন পাসওয়ার্ড নিশ্চিত করুন"
                        : "Confirm New Password"}
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    {language === "bn"
                      ? "পাসওয়ার্ড পরিবর্তন করুন"
                      : "Change Password"}
                  </button>
                </div>
              </div>

              {/* বিপদজনক এলাকা */}
              <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {language === "bn" ? "বিপদজনক এলাকা" : "Danger Zone"}
                </h3>
                <p className="text-xs text-red-400 mb-4">
                  {language === "bn"
                    ? "নিচের অপশনগুলো পরিবর্তন করলে সিস্টেমের ডেটা প্রভাবিত হতে পারে।"
                    : "These actions may affect system data."}
                </p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                    <Database size={14} />
                    {language === "bn" ? "ক্যাশ ক্লিয়ার করুন" : "Clear Cache"}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                    {language === "bn" ? "ব্যাকআপ নিন" : "Backup Data"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
