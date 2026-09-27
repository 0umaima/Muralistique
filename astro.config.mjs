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
  integrations: [
    sitemap({
      // Mêmes adresses que les liens internes et les balises canonical :
      // sans barre finale (Cloudflare sert /devis et redirige /devis/, voir
      // wrangler.jsonc).
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
        item.url = url.href;
        return item;
      },
      // Les mentions légales n'ont rien à faire dans les résultats de
      // recherche (et restent en noindex tant qu'elles sont incomplètes).
      filter: (page) => !new URL(page).pathname.startsWith('/mentions-legales'),
    }),
  ],
  image: {
    // Astro's built-in sharp pipeline: responsive sizes + modern formats.
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
