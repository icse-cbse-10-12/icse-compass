import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { withPwa } from '@vite-pwa/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tailwindcss(),
    withPwa(
      {
        adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', precompress: true, strict: true }),
        paths: { base: '/icse-compass' },
        prerender: { entries: ['/', '/materials/', '/creators/', '/school-papers/', '/privacy/'] },
        preprocess: vitePreprocess()
      },
      {
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
        generateSW: {
          globPatterns: ['client/**/*.{js,css,html,svg,png,webmanifest,ico,txt,xml}', 'prerendered/pages/**/*.html'],
          cleanupOutdatedCaches: true,
          runtimeCaching: [{
            urlPattern: new RegExp('^/icse-compass/data/.*[.]json$'),
            handler: 'NetworkFirst',
            options: {
              networkTimeoutSeconds: 3,
              cacheName: 'icse-compass-catalogue-v1',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 604800 }
            }
          }]
        }
      }
    )
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});