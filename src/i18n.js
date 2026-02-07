import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import la from "./locales/la.json";
import ko from "./locales/ko.json";


// ⬇️ Load language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem("lang") || "ko";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    la: { translation: la },
    ko: { translation: ko },
  },
   lng: savedLanguage,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
