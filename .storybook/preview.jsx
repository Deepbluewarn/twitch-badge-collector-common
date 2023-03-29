
import i18n from './i18next.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCustomTheme } from "../src/lib/hooks/useCustomTheme";
import { ThemeProvider } from '@mui/material/styles';

export const decorators = [
  (Story) => {
    const queryClient = new QueryClient();

    return (
      <ThemeProvider theme={useCustomTheme('on')}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </ThemeProvider>
    )
  }
]
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