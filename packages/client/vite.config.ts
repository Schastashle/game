import { defineConfig } from 'vite'
// import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },
  build: {
    target: 'esnext',
  },
  plugins: [
    react(),
    // VitePWA({
    //   strategies: 'injectManifest',
    //   srcDir: 'src',
    //   filename: 'sw.js',
    //   devOptions: {
    //     enabled: false,
    //   },
    // }),
  ],
})
