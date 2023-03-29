import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../src/lib/translates/en/en.json';
import ko from '../src/lib/translates/ko/ko.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',

        resources: {
            ko: {
                translation: ko
            },
            en: {
                translation: en
            }
        },
    });

export default i18n;