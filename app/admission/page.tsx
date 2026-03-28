'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion'; // motion/react এর বদলে framer-motion ব্যবহার করা ভালো
import { Send, User, Phone, MapPin, Book, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AdmissionFormData {
  studentName: string; fatherName: string; motherName: string;
  dob: string; gender: string; department: string; phone: string; address: string;
}

export default function Admission() {
  const { t } = useLanguage();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AdmissionFormData>();

  const onSubmit = async (data: AdmissionFormData) => {
    try {
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(t('admission.formSubmitSuccess'));
        reset();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(t('admission.formSubmitError'));
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('admission.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('admission.subtitle')}</p>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Student Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><User className="w-4 h-4 mr-2" />{t('admission.studentName')}</label>
              <input {...register('studentName', { required: t('admission.requiredName') })} className={inputClass} placeholder={t('admission.placeholderName')} />
              {errors.studentName && <p className="text-red-500 text-xs">{errors.studentName.message as string}</p>}
            </div>

            {/* Father's Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><User className="w-4 h-4 mr-2" />{t('admission.fatherName')}</label>
              <input {...register('fatherName', { required: t('admission.requiredFatherName') })} className={inputClass} placeholder={t('admission.placeholderFatherName')} />
              {errors.fatherName && <p className="text-red-500 text-xs">{errors.fatherName.message as string}</p>}
            </div>

            {/* Mother's Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><User className="w-4 h-4 mr-2" />{t('admission.motherName')}</label>
              <input {...register('motherName', { required: t('admission.requiredMotherName') })} className={inputClass} placeholder={t('admission.placeholderMotherName')} />
              {errors.motherName && <p className="text-red-500 text-xs">{errors.motherName.message as string}</p>}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><Calendar className="w-4 h-4 mr-2" />{t('admission.dob')}</label>
              <input type="date" {...register('dob', { required: t('admission.requiredDob') })} className={inputClass} />
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message as string}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">{t('admission.gender')}</label>
              <select {...register('gender', { required: t('admission.requiredGender') })} className={inputClass}>
                <option value="">{t('admission.select')}</option>
                <option value="male">{t('admission.male')}</option>
                <option value="female">{t('admission.female')}</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message as string}</p>}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><Book className="w-4 h-4 mr-2" />{t('admission.department')}</label>
              <select {...register('department', { required: t('admission.requiredDepartment') })} className={inputClass}>
                <option value="">{t('admission.select')}</option>
                <option value="noorani">{t('admission.deptNoorani')}</option>
                <option value="hifz">{t('admission.deptHifz')}</option>
                <option value="kitab">{t('admission.deptKitab')}</option>
              </select>
              {errors.department && <p className="text-red-500 text-xs">{errors.department.message as string}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><Phone className="w-4 h-4 mr-2" />{t('admission.phone')}</label>
              <input {...register('phone', { required: t('admission.requiredPhone') })} className={inputClass} placeholder={t('admission.placeholderPhone')} />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message as string}</p>}
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-primary flex items-center"><MapPin className="w-4 h-4 mr-2" />{t('admission.address')}</label>
              <textarea {...register('address', { required: t('admission.requiredAddress') })} rows={3} className={inputClass} placeholder={t('admission.placeholderAddress')} />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message as string}</p>}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20">
                <span>{isSubmitting ? t('admission.submitting') : t('admission.submit')}</span>
                {!isSubmitting && <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}