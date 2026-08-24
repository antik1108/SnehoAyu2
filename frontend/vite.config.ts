import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'favicon.png', 'favicon-192.png', 'favicon-512.png', 'icons.svg'],
      manifest: {
        name: 'SnehoAyu — Preterm Infant Care Companion',
        short_name: 'SnehoAyu',
        description: "Your baby's care companion after NICU discharge.",
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#0f766e',
        icons: [
          { src: '/favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/locales\/.*\.json$/,
            handler: 'CacheFirst',
            options: { cacheName: 'translations-cache' },
          },
        ],
      },
    }),
  ],
})
