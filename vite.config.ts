import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    SvelteKitPWA({
      registerType: 'prompt',
      includeAssets: ['robots.txt', 'sitemap.xml', 'llms.txt', 'favicon.svg'],
      manifest: {
        name: 'ICSE Compass',
        short_name: 'ICSE Compass',
        description: 'An independent academic workspace for ICSE learners.',
        theme_color: '#356B58',
        background_color: '#F5F1E8',
        display: 'standalone',
        scope: '/icse-compass/',
        start_url: '/icse-compass/',
        icons: [{ src: '/icse-compass/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,html,svg,png,webmanifest,ico,txt,xml}', 'prerendered/pages/**/*.html'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [{
          urlPattern: new RegExp('^/icse-compass/data/.*[.]json$'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'icse-compass-catalogue-v1',
            cacheableResponse: { statuses: [0, 200] },
            expiration: { maxEntries: 50, maxAgeSeconds: 604800 }
          }
        }]
      }
    })
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
