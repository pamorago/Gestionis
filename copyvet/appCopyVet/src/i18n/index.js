import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones en español
import esCommon from './locales/es/common.json';
import esTicket from './locales/es/ticket.json';
import esCategory from './locales/es/category.json';
import esAuth from './locales/es/auth.json';
import esVeterinary from './locales/es/veterinary.json';
import esPet from './locales/es/pet.json';

// Importar traducciones en inglés
import enCommon from './locales/en/common.json';
import enTicket from './locales/en/ticket.json';
import enCategory from './locales/en/category.json';
import enAuth from './locales/en/auth.json';
import enVeterinary from './locales/en/veterinary.json';
import enPet from './locales/en/pet.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: esCommon,
        ticket: esTicket,
        category: esCategory,
        auth: esAuth,
        veterinary: esVeterinary,
        pet: esPet
      },
      en: {
        common: enCommon,
        ticket: enTicket,
        category: enCategory,
        auth: enAuth,
        veterinary: enVeterinary,
        pet: enPet
      }
    },
    fallbackLng: 'es', // Español como idioma por defecto
    defaultNS: 'common', // Namespace por defecto
    ns: ['common', 'ticket', 'category', 'auth', 'veterinary', 'pet'],
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;