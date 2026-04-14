"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
// Lucide-react থেকে নেওয়া
import { Mail, Phone, MapPin } from "lucide-react";
// React Icons থেকে সোশ্যাল মিডিয়া আইকন
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

// Settings এর জন্য টাইপ ডিফাইন করুন
interface Settings {
  _id: string;
  madrasaNameBn: string;
  madrasaNameEn: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  email: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  whatsapp?: string;
}

// সোশ্যাল লিংকের জন্য টাইপ
interface SocialLink {
  icon: React.ElementType;
  href: string;
  color: string;
  name: string;
}

export default function Footer() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const madrasaName = settings?._id
    ? language === "bn"
      ? settings.madrasaNameBn
      : settings.madrasaNameEn
    : language === "bn"
      ? "মাদ্রাসা ওয়েবসাইট"
      : "Madrasa Website";

  const address = settings?._id
    ? language === "bn"
      ? settings.addressBn
      : settings.addressEn
    : language === "bn"
      ? "ঢাকা, বাংলাদেশ"
      : "Dhaka, Bangladesh";

  const phone = settings?.phone || "+880 1234 567890";
  const email = settings?.email || "info@madrasa.com";
  const whatsappNumber = settings?.whatsapp || "+8801234567890";

  // সোশ্যাল লিংক - সঠিক টাইপিং সহ
  const socialLinks: SocialLink[] = [
    {
      icon: FaFacebook,
      href: settings?.facebook || "#",
      color: "hover:bg-blue-600",
      name: "Facebook",
    },
    {
      icon: FaTwitter,
      href: settings?.twitter || "#",
      color: "hover:bg-sky-500",
      name: "Twitter",
    },
    {
      icon: FaYoutube,
      href: settings?.youtube || "#",
      color: "hover:bg-red-600",
      name: "YouTube",
    },
    {
      icon: FaLinkedin,
      href: settings?.linkedin || "#",
      color: "hover:bg-blue-700",
      name: "LinkedIn",
    },
  ];

  const quickLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/departments", label: t("nav.departments") },
    { href: "/admission", label: t("nav.admission") },
    { href: "/results", label: t("nav.results") },
  ];

  const importantLinks = [
    { href: "/contact", label: t("nav.contact") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/downloads", label: t("nav.downloads") },
    {
      href: "/notice-board",
      label: language === "bn" ? "নোটিশ বোর্ড" : "Notice Board",
    },
  ];

  if (isLoading) {
    return (
      <footer className="bg-primary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-white/20 rounded w-32"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg shadow-lg">
                {madrasaName.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-bold">{madrasaName}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t("footer.aboutDesc")}
            </p>

            {/* Social Links - React Icons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-white/10 rounded-lg ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
              {/* WhatsApp আলাদা */}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="WhatsApp"
              >
                <IoLogoWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b border-white/10 inline-block">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2 mt-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b border-white/10 inline-block">
              {t("footer.importantLinks")}
            </h3>
            <ul className="space-y-2 mt-4">
              {importantLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Lucide-react আইকন */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b border-white/10 inline-block">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/70 text-sm">{address}</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href={`tel:${phone}`}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href={`mailto:${email}`}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} {madrasaName}। {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
