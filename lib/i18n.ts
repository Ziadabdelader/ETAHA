'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '@/public/locales/en/translation.json';
import arTranslation from '@/public/locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lang',
    },
  });

// Update HTML attributes when language changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('lang', lng);
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    localStorage.setItem('lang', lng);
    document.cookie = `lang=${lng}; path=/; max-age=31536000`;
  }
});

export default i18n;
