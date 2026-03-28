"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Send, User, Phone, MapPin, Book, Calendar, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AdmissionFormData {
  studentNameEn: string;
  studentNameBn: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  birthRegNo: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  department: string;
  previousSchool: string;
  presentAddress: string;
  permanentAddress: string;
}

export default function Admission() {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AdmissionFormData>();

  const onSubmit = async (data: AdmissionFormData) => {
    try {
      const response = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "pending" }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Submission failed");
      }

      toast.success(t("admission.formSubmitSuccess"));
      reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      console.error("Submission error:", errorMessage);
      toast.error(`${t("admission.formSubmitError")}`);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-accent bg-accent/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass = "text-sm font-bold text-primary flex items-center mb-1";
  const errorText = "text-red-500 text-xs mt-1 ml-1";

  return (
    <div className="pb-20 bg-gray-50/50">
      <section className="bg-primary text-white py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("admission.title")}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("admission.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-accent/20"
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
                    {t("admission.studentNameEn")}
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
                    {t("admission.studentNameBn")}
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
                    <Calendar className="w-4 h-4 mr-2" /> {t("admission.dob")}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>
                      {t("admission.gender")}
                    </label>
                    <select
                      {...register("gender", { required: true })}
                      className={inputClass}
                    >
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
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                    </select>
                  </div>
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
                    {t("admission.fatherName")}
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
                    {t("admission.motherName")}
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
                    <Phone className="w-4 h-4 mr-2" />{" "}
                    {t("admission.guardianPhone")}
                  </label>
                  <input
                    {...register("guardianPhone", { required: true })}
                    className={inputClass}
                    placeholder={t("admission.placeholderPhone")}
                  />
                  {errors.guardianPhone && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Section 3: Academic --- */}
            <div>
              <h3 className="text-lg font-bold text-secondary mb-6 flex items-center border-b pb-2">
                <Book className="mr-2 w-5 h-5" /> {t("admission.academicInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.department")}
                  </label>
                  <select
                    {...register("department", { required: true })}
                    className={inputClass}
                  >
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
                    {t("admission.presentAddress")}
                  </label>
                  <textarea
                    {...register("presentAddress", { required: true })}
                    rows={2}
                    className={inputClass}
                  />
                  {errors.presentAddress && (
                    <p className={errorText}>{t("admission.required")}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>
                    {t("admission.permanentAddress")}
                  </label>
                  <textarea
                    {...register("permanentAddress", { required: true })}
                    rows={2}
                    className={inputClass}
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
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t("admission.submitting")}</span>
                ) : (
                  <>
                    <span>{t("admission.submit")}</span>{" "}
                    <Send className="w-5 h-5" />
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
