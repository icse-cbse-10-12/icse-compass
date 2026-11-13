import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', precompress: true, strict: true }),
    paths: { base: '/icse-compass' },
    trailingSlash: 'always',
    prerender: { entries: ['/', '/materials/', '/creators/', '/school-papers/'] }
  }
};
