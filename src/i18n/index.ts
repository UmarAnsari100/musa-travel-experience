import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'
import ur from './locales/ur.json'

const savedLang = localStorage.getItem('musaLang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ur: { translation: ur },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

// Set initial direction and language
document.documentElement.dir = ['ar', 'ur'].includes(savedLang) ? 'rtl' : 'ltr'
document.documentElement.lang = savedLang

export default i18n
