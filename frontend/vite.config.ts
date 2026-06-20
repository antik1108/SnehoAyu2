import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'SnehoAyu — Preterm Infant Care Companion',
        short_name: 'SnehoAyu',
        description: "Your baby's care companion after NICU discharge.",
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#0f766e',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/locales\/.*\.json$/,
            handler: 'CacheFirst',
            options: { cacheName: 'translations-cache' },
          },
          {
            urlPattern: /\/api\/checklist\/.*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'checklist-cache', networkTimeoutSeconds: 5 },
          },
          {
            urlPattern: /\/api\/danger-signs.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'danger-signs-cache' },
          },
        ],
      },
    }),
  ],
})
