import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getStoredLanguage } from '../lib/authStorage';
import bn from '../locales/bn.json';
import hi from '../locales/hi.json';
import en from '../locales/en.json';

const resources = {
  bn: { translation: bn },
  hi: { translation: hi },
  en: { translation: en },
};

const initialLanguage = getStoredLanguage() || 'bn';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'bn',
    supportedLngs: ['bn', 'hi', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

// Initialize document language tag
document.documentElement.lang = initialLanguage;

export default i18n;
