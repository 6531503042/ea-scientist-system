import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from '@/locales/en/translation.json';
import th from '@/locales/th/translation.json';

const fallbackLng = 'en';

// Get language from localStorage or default to 'th'
const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') return 'th';
  const saved = localStorage.getItem('ea-language');
  return saved === 'en' ? 'en' : 'th';
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      th: { translation: th },
    },
    lng: getInitialLanguage(),
    fallbackLng,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
