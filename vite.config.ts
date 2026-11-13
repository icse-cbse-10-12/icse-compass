import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/icse-compass/',
  plugins: [tailwindcss(), sveltekit(), VitePWA({
    registerType: 'prompt', injectRegister: 'script',
    includeAssets: ['robots.txt', 'sitemap.xml', 'llms.txt'],
    manifest: { name: 'ICSE Compass', short_name: 'ICSE Compass', theme_color: '#356B58', background_color: '#F5F1E8', display: 'standalone', scope: '/icse-compass/', start_url: '/icse-compass/', icons: [] },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,ico}'], cleanupOutdatedCaches: true,
      navigateFallback: '/icse-compass/index.html', navigateFallbackDenylist: [/^\\/icse-compass\\/data\\//],
      runtimeCaching: [{ urlPattern: /\\/icse-compass\\/data\\/.*\\.json$/, handler: 'StaleWhileRevalidate', options: { cacheName: 'icse-compass-catalogue-v1', cacheableResponse: { statuses: [0, 200] }, expiration: { maxEntries: 50, maxAgeSeconds: 604800 } } }]
    }
  })],
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
