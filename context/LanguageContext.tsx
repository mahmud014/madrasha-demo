"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language, translations } from "@/lib/translations";

type TranslationPath = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: TranslationPath) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("bn");

  const t = (path: string): string => {
    const keys = path.split(".");
    let result: Record<string, unknown> = translations[language] as Record<
      string,
      unknown
    >;

    for (const key of keys) {
      const value = result[key];
      if (value !== undefined && typeof value === "object") {
        result = value as Record<string, unknown>;
      } else if (typeof value === "string") {
        return value;
      } else {
        return path;
      }
    }

    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
