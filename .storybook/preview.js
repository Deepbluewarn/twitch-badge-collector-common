
import i18n from './i18next.js';

export const parameters = {
  i18n,
  locale: 'ko',
  locales: {
    en: "English"
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}