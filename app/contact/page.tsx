"use client";

import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

// ১. টাইপ ডিফাইন
interface ContactFormData {
  name: string;
  contact: string;
  subject: string;
  message: string;
}

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

export default function Contact() {
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // ২. সাবমিট ফাংশন (MongoDB API কল)
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(t("contact.formSubmitSuccess") || "Message sent!");
        reset();
      } else {
        // সার্ভার থেকে আসা আসল এরর মেসেজটি থ্রো করবে
        throw new Error(result.message || "Failed to save message");
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Something went wrong!";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl border bg-accent/20 focus:outline-none focus:ring-2 transition-all
    ${
      hasError
        ? "border-red-500 focus:ring-red-500/20"
        : "border-accent focus:ring-primary/20 focus:border-primary"
    }
  `;

  return (
    <div className="pb-20 bg-gray-50/30 min-h-screen">
      {/* --- Hero Section --- */}
      <section className="bg-primary text-white py-24 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://i.postimg.cc/vHL75kH0/moon.jpg')`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold"
          >
            {t("contact.title")}
          </motion.h1>
          <motion.p className="text-white/70 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* --- Sidebar Info --- */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-accent/50 space-y-8">
              <h3 className="text-2xl font-bold text-primary">
                {t("contact.title") || "Contact Details"}
              </h3>
              <div className="space-y-6">
                <InfoItem
                  icon={<MapPin className="w-5 h-5" />}
                  title={t("contact.address")}
                  desc={t("contact.addressText")}
                  color="text-primary"
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5" />}
                  title={t("contact.phone")}
                  desc={t("contact.phoneText")}
                  color="text-secondary"
                />
                <InfoItem
                  icon={<Mail className="w-5 h-5" />}
                  title={t("contact.email")}
                  desc={t("contact.emailText")}
                  color="text-blue-500"
                />
              </div>
            </div>
          </div>

          {/* --- Contact Form --- */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-accent/50"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">
                      {t("contact.formName")}
                    </label>
                    <input
                      {...register("name", { required: true })}
                      className={getInputClass(!!errors.name)}
                      placeholder={t("contact.placeholderName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">
                      {t("contact.formContact")}
                    </label>
                    <input
                      {...register("contact", { required: true })}
                      className={getInputClass(!!errors.contact)}
                      placeholder={t("contact.placeholderContact")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">
                    {t("contact.formSubject")}
                  </label>
                  <input
                    {...register("subject", { required: true })}
                    className={getInputClass(!!errors.subject)}
                    placeholder={t("contact.placeholderSubject")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">
                    {t("contact.formMessage")}
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={5}
                    className={getInputClass(!!errors.message)}
                    placeholder={t("contact.placeholderMessage")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold px-12 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>
                    {isSubmitting
                      ? t("contact.formSubmitting") || "Sending..."
                      : t("contact.formSubmit") || "Send Message"}
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ৩. Helper Component
function InfoItem({ icon, title, desc, color }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-4 group">
      <div
        className={`w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
