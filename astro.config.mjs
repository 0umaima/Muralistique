// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'node:fs';
import { rename, rm } from 'node:fs/promises';
import { site } from './src/data/site.mjs';
import { DEFAULT_LANG, LANGS, LOCALES, localizePath } from './src/i18n/routes.mjs';

// Pages absentes du sitemap, dans les deux langues : les mentions légales
// (rien à faire dans les résultats de recherche, et noindex tant qu'elles
// sont incomplètes) et les pages 404.
const excluded = ['/mentions-legales', '/404'].flatMap((path) => LANGS.map((lang) => localizePath(path, lang)));

// Page 404 anglaise. Cloudflare sert le fichier 404.html le plus proche de
// l'adresse demandée (/en/inconnue → en/404.html, sinon 404.html) ; Astro,
// lui, n'écrit en « 404.html » que la page 404 racine. On déplace donc
// en/404/index.html vers en/404.html une fois le site construit.
/** @type {import('astro').AstroIntegration} */
const englishNotFound = {
  name: 'muralistique:english-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const built = new URL('en/404/index.html', dir);
      if (!existsSync(built)) return;
      await rename(built, new URL('en/404.html', dir));
      await rm(new URL('en/404/', dir), { recursive: true });
    },
  },
};

// Static output only — no SSR adapter, no CMS, no database.
// The canonical domain lives in src/data/site.mjs (`site.url`); change it there
// and the sitemap, robots.txt and every <link rel="canonical"> follow.
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    englishNotFound,
    sitemap({
      // Mêmes adresses que les liens internes et les balises canonical :
      // sans barre finale (Cloudflare sert /devis et redirige /devis/, voir
      // wrangler.jsonc).
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
        item.url = url.href;
        // Version française et version anglaise de chaque page (hreflang),
        // comme dans le <head> : /realisations ↔ /en/projects…
        /** @param {'fr' | 'en'} lang */
        const alternate = (lang) => new URL(localizePath(url.pathname, lang), site.url).href;
        item.links = [
          ...LANGS.map((lang) => ({ lang: LOCALES[lang].hreflang, url: alternate(lang) })),
          { lang: 'x-default', url: alternate(DEFAULT_LANG) },
        ];
        return item;
      },
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/+$/, '') || '/';
        return !excluded.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
      },
    }),
  ],
  image: {
    // Astro's built-in sharp pipeline: responsive sizes + modern formats.
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
