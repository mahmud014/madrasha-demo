"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  Send,
  User,
  Phone,
  MapPin,
  Book,
  Calendar,
  Home,
  Mail,
  Image as ImageIcon,
  School,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Image from "next/image";

interface AdmissionFormData {
  studentNameEn: string;
  studentNameBn: string;
  email: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  birthRegNo: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  admissionClass: string;
  department: string;
  previousSchool: string;
  presentAddress: string;
  permanentAddress: string;
  studentPhoto: FileList;
}

export default function Admission() {
  const { t, language } = useLanguage();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AdmissionFormData>();

  const studentPhoto = watch("studentPhoto");

  // ফটো প্রিভিউ
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // সব ফিল্ড ফরমডাটায় যোগ করা
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof AdmissionFormData];
        if (key === "studentPhoto" && value instanceof FileList) {
          if (value[0]) formData.append(key, value[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      formData.append("status", "pending");
      formData.append("language", language);

      const response = await fetch("/api/admission", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      toast.success(t("admission.formSubmitSuccess"));
      reset();
      setPhotoPreview(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      console.error("Submission error:", errorMessage);
      toast.error(t("admission.formSubmitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all";
  const labelClass =
    "text-sm font-bold text-primary flex items-center gap-1 mb-1";
  const errorText = "text-red-500 text-xs mt-1 ml-1";

  // ক্লাস অপশন
  const classOptions = [
    "Play",
    "Nursery",
    "KG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  // রক্তের গ্রুপ অপশন
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="pb-20 bg-gray-50/50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
            opacity: 0.2,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 space-y-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("admission.title")}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("admission.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* --- Section 1: Personal Info --- */}
            <div>
              <h3 className="text-lg font-bold text-secondary mb-6 flex items-center border-b pb-2">
                <User className="mr-2 w-5 h-5" /> {t("admission.personalInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.studentNameEn")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("studentNameEn", { required: true })}
                    className={inputClass}
                    placeholder={t("admission.placeholderNameEn")}
                  />
                  {errors.studentNameEn && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.studentNameBn")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("studentNameBn", { required: true })}
                    className={inputClass}
                    placeholder={t("admission.placeholderNameBn")}
                  />
                  {errors.studentNameBn && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    <Mail className="w-4 h-4" /> {t("admission.email")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                    className={inputClass}
                    placeholder={t("admission.placeholderEmail")}
                  />
                  {errors.email && (
                    <p className={errorText}>
                      {errors.email.type === "pattern"
                        ? t("admission.invalidEmail")
                        : t("admission.required")}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    <ImageIcon className="w-4 h-4" />{" "}
                    {t("admission.studentPhoto")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("studentPhoto", { required: true })}
                    onChange={(e) => {
                      register("studentPhoto").onChange(e);
                      handlePhotoChange(e);
                    }}
                    className={inputClass}
                  />
                  {photoPreview && (
                    <div className="mt-2 relative w-20 h-20">
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  {errors.studentPhoto && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    <Calendar className="w-4 h-4" /> {t("admission.dob")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("dob", { required: true })}
                    className={inputClass}
                  />
                  {errors.dob && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.birthRegNo")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("birthRegNo", { required: true })}
                    className={inputClass}
                    placeholder={
                      language === "bn"
                        ? "জন্ম নিবন্ধন নম্বর"
                        : "Birth registration number"
                    }
                  />
                  {errors.birthRegNo && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>{t("admission.gender")}</label>
                  <select
                    {...register("gender", { required: true })}
                    className={inputClass}
                  >
                    <option value="">{t("admission.select")}</option>
                    <option value="male">{t("admission.male")}</option>
                    <option value="female">{t("admission.female")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.bloodGroup")}
                  </label>
                  <select {...register("bloodGroup")} className={inputClass}>
                    <option value="">{t("admission.select")}</option>
                    {bloodGroupOptions.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* --- Section 2: Parental Info --- */}
            <div>
              <h3 className="text-lg font-bold text-secondary mb-6 flex items-center border-b pb-2">
                <Home className="mr-2 w-5 h-5" /> {t("admission.parentalInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.fatherName")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fatherName", { required: true })}
                    className={inputClass}
                  />
                  {errors.fatherName && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.motherName")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("motherName", { required: true })}
                    className={inputClass}
                  />
                  {errors.motherName && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>
                    <Phone className="w-4 h-4" /> {t("admission.guardianPhone")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("guardianPhone", {
                      required: true,
                      pattern: /^01[3-9]\d{8}$/,
                    })}
                    className={inputClass}
                    placeholder={t("admission.placeholderPhone")}
                  />
                  {errors.guardianPhone && (
                    <p className={errorText}>
                      {errors.guardianPhone.type === "pattern"
                        ? t("admission.invalidPhone")
                        : t("admission.required")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Section 3: Academic --- */}
            <div>
              <h3 className="text-lg font-bold text-secondary mb-6 flex items-center border-b pb-2">
                <Book className="mr-2 w-5 h-5" /> {t("admission.academicInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>
                    <School className="w-4 h-4" />{" "}
                    {t("admission.admissionClass")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("admissionClass", { required: true })}
                    className={inputClass}
                  >
                    <option value="">{t("admission.select")}</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  {errors.admissionClass && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.department")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("department", { required: true })}
                    className={inputClass}
                  >
                    <option value="">{t("admission.select")}</option>
                    <option value="noorani">
                      {t("admission.deptNoorani")}
                    </option>
                    <option value="hifz">{t("admission.deptHifz")}</option>
                    <option value="kitab">{t("admission.deptKitab")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.previousSchool")}
                  </label>
                  <input
                    {...register("previousSchool")}
                    className={inputClass}
                    placeholder={t("admission.placeholderSchool")}
                  />
                </div>
              </div>
            </div>

            {/* --- Section 4: Address --- */}
            <div>
              <h3 className="text-lg font-bold text-secondary mb-6 flex items-center border-b pb-2">
                <MapPin className="mr-2 w-5 h-5" /> {t("admission.addressInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.presentAddress")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("presentAddress", { required: true })}
                    rows={3}
                    className={inputClass}
                    placeholder={t("admission.placeholderAddress")}
                  />
                  {errors.presentAddress && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.permanentAddress")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("permanentAddress", { required: true })}
                    rows={3}
                    className={inputClass}
                    placeholder={t("admission.placeholderAddress")}
                  />
                  {errors.permanentAddress && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("admission.submitting")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t("admission.submit")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
