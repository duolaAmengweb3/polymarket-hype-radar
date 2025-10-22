'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../../messages/en.json';
import zh from '../../messages/zh.json';

type Locale = 'en' | 'zh';
type Messages = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
});

const messages: Record<Locale, Messages> = {
  en,
  zh,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取语言偏好
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferredLocale') as Locale;
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
        setLocaleState(savedLocale);
      }
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', newLocale);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: messages[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
