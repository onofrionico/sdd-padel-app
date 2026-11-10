import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import es from './locales/es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    nonExplicitSupportedLngs: true,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

// Mantiene <html lang> al día: lo usan los lectores de pantalla y el formato de fechas
const syncHtmlLang = (lng?: string) => {
  if (typeof document !== 'undefined' && lng) document.documentElement.lang = lng
}
syncHtmlLang(i18n.resolvedLanguage || i18n.language)
i18n.on('languageChanged', syncHtmlLang)

export default i18n
