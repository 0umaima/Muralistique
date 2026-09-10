// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site.mjs';

// Static output only — no SSR adapter, no CMS, no database.
// The canonical domain lives in src/data/site.mjs (`site.url`); change it there
// and the sitemap, robots.txt and every <link rel="canonical"> follow.
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  image: {
    // Astro's built-in sharp pipeline: responsive sizes + modern formats.
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
