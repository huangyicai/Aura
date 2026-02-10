"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Locale } from "./locales";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLocale = "en",
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从 localStorage 读取保存的语言设置
    const savedLocale = localStorage.getItem("aura-locale") as Locale | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "zh")) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (mounted) {
      localStorage.setItem("aura-locale", newLocale);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
      }
    }
  };

  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // 如果当前语言找不到，尝试使用英文作为后备
        value = translations.en;
        for (const k2 of keys) {
          value = value?.[k2];
          if (value === undefined) return key;
        }
        return value;
      }
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
