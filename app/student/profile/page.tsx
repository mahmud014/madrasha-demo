"use client";

import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  BookOpen,
  Edit2,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { language } = useLanguage();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ইউজার ডাটা (সেটিংস থেকে নেওয়া হবে)
  const [profileData, setProfileData] = useState({
    name: user?.name || "হাফিজুর রহমান",
    nameEn: "Hafizur Rahman",
    roll: user?.id || "101",
    class: language === "bn" ? "১০ম" : "Class 10",
    phone: "+880 1700-000000",
    email: user?.email || "student@example.com",
    address: language === "bn" ? "বরিশাল, বাংলাদেশ" : "Barishal, Bangladesh",
    department:
      language === "bn" ? "হিফজ ও আধুনিক শিক্ষা" : "Hifz & Modern Education",
    fatherName: language === "bn" ? "মোঃ আব্দুল আলীম" : "Md. Abdul Alim",
    motherName:
      language === "bn" ? "মোসাম্মৎ ফাতেমা বেগম" : "Mosammat Fatema Begum",
    bloodGroup: "O+",
    birthDate: "2008-05-15",
    admissionDate: "2020-01-15",
    avatar: user?.image || "",
    coverImage: "",
  });

  // ✅ লোকাল স্টোরেজ থেকে কভার ইমেজ লোড করুন
  useEffect(() => {
    const storedCoverImage = localStorage.getItem("coverImage");
    if (storedCoverImage) {
      setProfileData((prev) => ({ ...prev, coverImage: storedCoverImage }));
    }
  }, []);

  // Avatar URL (ডিফল্ট DiceBear)
  const avatarUrl =
    profileData.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`;

  // কভার ইমেজ URL
  const coverUrl = profileData.coverImage || "";

  // ইমেজ আপলোড ফাংশন (ক্লাউডিনারি)
  const uploadImage = async (file: File, type: "avatar" | "cover") => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("userId", user?.id || "");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const imageUrl = data.url;

        // স্টেট আপডেট
        if (type === "avatar") {
          setProfileData((prev) => ({ ...prev, avatar: imageUrl }));
          if (user) setUser({ ...user, image: imageUrl });

          // ✅ লোকাল স্টোরেজ আপডেট
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.image = imageUrl;
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } else {
          setProfileData((prev) => ({ ...prev, coverImage: imageUrl }));
          // ✅ কভার ইমেজ localStorage এ সেভ করুন
          localStorage.setItem("coverImage", imageUrl);
        }

        toast.success(
          language === "bn" ? "ইমেজ আপলোড সফল" : "Image uploaded successfully",
        );
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error(
        language === "bn" ? "ইমেজ আপলোড ব্যর্থ" : "Image upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(
          language === "bn"
            ? "ফাইল সাইজ ২MB এর কম হতে হবে"
            : "File size must be less than 2MB",
        );
        return;
      }
      uploadImage(file, type);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-0">
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border shadow-sm overflow-hidden">
        {/* কভার ফটো - ডায়নামিক */}
        <div className="relative h-28 sm:h-32 md:h-40 bg-gradient-to-r from-primary to-primary/70 group">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70" />
          )}

          <button
            onClick={handleCoverClick}
            className="absolute bottom-2 right-2 bg-black/50 p-1.5 rounded-lg text-white hover:bg-black/70 transition z-10"
            disabled={isUploading}
          >
            <Camera size={16} />
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "cover")}
          />
        </div>

        {/* প্রোফাইল সেকশন */}
        <div className="px-4 sm:px-6 md:p-8 -mt-12 sm:-mt-14 md:-mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 border-b pb-4 sm:pb-6">
          <div className="relative group">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={avatarUrl}
                alt={profileData.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full text-white hover:bg-primary/80 transition shadow-md"
              disabled={isUploading}
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "avatar")}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-2xl font-black text-gray-800">
              {language === "bn" ? profileData.name : profileData.nameEn}
            </h2>
            <p className="text-primary font-bold uppercase tracking-wider text-xs sm:text-sm">
              {language === "bn"
                ? `রোল: ${profileData.roll} | ${profileData.class}`
                : `Roll: ${profileData.roll} | ${profileData.class}`}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2 text-sm sm:text-base"
          >
            <Edit2 size={14} className="sm:w-4 sm:h-4" />
            {language === "bn" ? "প্রোফাইল এডিট করুন" : "Edit Profile"}
          </button>
        </div>

        {/* প্রোফাইল তথ্য */}
        <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ব্যক্তিগত তথ্য */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold border-b pb-2 text-gray-700">
              {language === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information"}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <Phone className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{profileData.phone}</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <Mail className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{profileData.email}</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <MapPin className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">
                  {profileData.address}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <User className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {language === "bn" ? "রক্তের গ্রুপ" : "Blood Group"}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {profileData.bloodGroup}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <Calendar className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {language === "bn" ? "জন্ম তারিখ" : "Date of Birth"}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {profileData.birthDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* একাডেমিক তথ্য */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold border-b pb-2 text-gray-700">
              {language === "bn" ? "একাডেমিক তথ্য" : "Academic Information"}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <GraduationCap className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {language === "bn" ? "বিভাগ" : "Department"}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {profileData.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <User className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {language === "bn" ? "পিতার নাম" : "Father's Name"}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {profileData.fatherName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <User className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {language === "bn" ? "মাতার নাম" : "Mother's Name"}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {profileData.motherName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600">
                <BookOpen className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {language === "bn" ? "ভর্তির তারিখ" : "Admission Date"}
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {profileData.admissionDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t">
          <p className="text-center text-xs text-gray-400">
            {isUploading && (
              <span className="text-primary">
                {language === "bn"
                  ? "ইমেজ আপলোড হচ্ছে..."
                  : "Uploading image..."}
              </span>
            )}
            {!isUploading &&
              (language === "bn"
                ? "শেষ আপডেট: ১৫ মার্চ, ২০২৬"
                : "Last updated: March 15, 2026")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
