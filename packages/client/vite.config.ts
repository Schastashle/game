import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.NODE_ENV, process.env.SW_DEV)

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VITE_BUILD_DATE__: String(new Date().getTime()),
  },
  build: {
    target: 'esnext',
  },
  plugins: [
    react(),
    VitePWA({
      // использовать для отладки
      //selfDestroying: true,

      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest',
      injectManifest: {
        injectionPoint: undefined,
        rollupFormat: 'iife',
      },
      injectRegister: false,
      manifest: false,
      devOptions: {
        enabled: true, //process.env.SW_DEV === 'true',
        type: 'module',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        sourcemap: true,
      },
      registerType: 'autoUpdate',
    }),
  ],
})
