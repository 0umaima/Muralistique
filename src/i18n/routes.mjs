/**
 * ============================================================================
 *  ADRESSES DES DEUX LANGUES — français (par défaut) et anglais.
 * ============================================================================
 *  Le français reste à la racine (/realisations, /devis…). La version
 *  anglaise vit sous /en, avec des adresses traduites (/en/projects,
 *  /en/quote…). Ce tableau fait le lien entre les deux : c'est lui que lisent
 *  le sélecteur de langue de l'en-tête, les balises hreflang et le sitemap.
 *
 *  Pour ajouter une page : créez-la dans src/pages/ ET dans src/pages/en/,
 *  puis ajoutez ici la paire [adresse française, adresse anglaise].
 *  Les pages projet suivent seules (/realisations/<slug> ↔ /en/projects/<slug>).
 * ============================================================================
 */

/** @typedef {'fr' | 'en'} Lang */

/** @type {Lang[]} */
export const LANGS = ['fr', 'en'];
/** @type {Lang} */
export const DEFAULT_LANG = 'fr';

/** Langue et région, pour `og:locale`, hreflang et les données structurées. */
export const LOCALES = {
  fr: { lang: 'fr', hreflang: 'fr', og: 'fr_FR', name: 'Français', short: 'FR' },
  en: { lang: 'en', hreflang: 'en', og: 'en_US', name: 'English', short: 'EN' },
};

/** Paires [français, anglais]. L'accueil ('/' ↔ '/en') est géré à part. */
const PAIRS = [
  ['/realisations', '/en/projects'],
  ['/studio', '/en/studio'],
  ['/devis', '/en/quote'],
  ['/mentions-legales', '/en/legal-notice'],
  ['/404', '/en/404'],
];

const EN_ROOT = '/en';

/** Retire la barre finale (sauf pour la racine). */
const trim = (path) => (path.length > 1 ? path.replace(/\/+$/, '') || '/' : path);

/** @param {string} pathname @returns {Lang} */
export function langFromPath(pathname) {
  const path = trim(pathname);
  return path === EN_ROOT || path.startsWith(`${EN_ROOT}/`) ? 'en' : 'fr';
}

/** Traduit un chemin (sans ?requête ni #ancre) vers la langue voulue. */
function translatePathname(pathname, to) {
  const path = trim(pathname || '/');
  const from = langFromPath(path);
  if (from === to) return path;

  if (to === 'en') {
    if (path === '/') return EN_ROOT;
    const pair = PAIRS.find(([fr]) => path === fr || path.startsWith(`${fr}/`));
    return pair ? pair[1] + path.slice(pair[0].length) : EN_ROOT + path;
  }

  if (path === EN_ROOT) return '/';
  const pair = PAIRS.find(([, en]) => path === en || path.startsWith(`${en}/`));
  return pair ? pair[0] + path.slice(pair[1].length) : path.slice(EN_ROOT.length) || '/';
}

/**
 * Adresse de la même page dans une autre langue. Accepte un chemin interne
 * complet, requête et ancre comprises : `/realisations?secteur=sante` →
 * `/en/projects?secteur=sante`, `/#secteurs` → `/en#secteurs`. Les liens
 * externes (`https:`, `mailto:`, `tel:`…) sont renvoyés tels quels.
 *
 * @param {string} href
 * @param {Lang} to
 */
export function localizePath(href, to) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const [, pathname = '/', search = '', hash = ''] = match ?? [];
  return translatePathname(pathname, to) + search + hash;
}
