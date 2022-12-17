import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Twitch Badge Collector Common Components',
      fileName: (format) => `twitch-badge-collector-cc.${format}.js`
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom',
        /\@emotion\/*/,
        /\@mui\/*/,
        /\@fortawesome\/*/,
        "@tanstack/react-query",
        "axios",
        "broadcast-channel",
        "html-to-image",
        "i18next",
        'webextension-polyfill',
        "i18next-browser-languagedetector",
        "react-ga4",
        "react-i18next",
        "react-router-dom",
        "tmi.js"
      ],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [
    dts(),
    react(),
  ]
})
