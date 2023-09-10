import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
    proxy: {
      '/api': 'http://localhost:3000',
      '/forum': 'http://localhost:3000',
    },
  },
  define: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },
  build: {
    target: 'esnext',
  },
  esbuild: {
    // minify: false,
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
  },
  plugins: [
    react(),
    VitePWA({
      // использовать для отладки
      selfDestroying: true,

      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // по умолчанию 2 МБ, можно увеличить этой настройкой
      },
      injectRegister: false,
      manifest: false,
      devOptions: {
        enabled: true, //process.env.SW_DEV === 'true',
        type: 'module',
      },
      workbox: {
        sourcemap: true,
      },
      registerType: 'autoUpdate',
    }),
  ],
})
