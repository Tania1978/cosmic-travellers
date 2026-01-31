import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./EN.json";
import el from "./EL.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      el: { translation: el },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "el"],

    keySeparator: false,
    nsSeparator: false,

    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
