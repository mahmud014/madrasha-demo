'use client';

import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { db, collection, addDoc, serverTimestamp, OperationType, handleFirestoreError } from '@/lib/firebase';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), { name: data.name, email: data.contact, subject: data.subject, message: data.message, createdAt: serverTimestamp() });
      toast.success(t('contact.formSubmitSuccess'));
      reset();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'messages');
      toast.error(t('contact.formSubmitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="pb-20">
      <section className="bg-primary text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{t('contact.title')}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl card-shadow border border-accent/50 space-y-8">
              <h3 className="text-2xl font-bold text-primary">{t('contact.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-ink">{t('contact.address')}</h4><p className="text-sm text-ink/60">{t('contact.addressText')}</p></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0"><Phone className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-ink">{t('contact.phone')}</h4><p className="text-sm text-ink/60">{t('contact.phoneText')}</p></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0"><Mail className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-ink">{t('contact.email')}</h4><p className="text-sm text-ink/60">{t('contact.emailText')}</p></div>
                </div>
              </div>
              <div className="h-48 bg-accent rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-ink/30 font-bold">Google Map Placeholder</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 md:p-12 rounded-3xl card-shadow border border-accent/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('contact.formName')}</label>
                    <input {...register('name', { required: true })} className={inputClass} placeholder={t('contact.placeholderName')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('contact.formContact')}</label>
                    <input {...register('contact', { required: true })} className={inputClass} placeholder={t('contact.placeholderContact')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">{t('contact.formSubject')}</label>
                  <input {...register('subject', { required: true })} className={inputClass} placeholder={t('contact.placeholderSubject')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">{t('contact.formMessage')}</label>
                  <textarea {...register('message', { required: true })} rows={5} className={inputClass} placeholder={t('contact.placeholderMessage')} />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold px-12 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20">
                  <span>{isSubmitting ? t('contact.formSubmitting') : t('contact.formSubmit')}</span>
                  {!isSubmitting && <Send className="w-5 h-5" />}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
