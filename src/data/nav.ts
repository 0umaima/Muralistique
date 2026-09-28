import { localize, localizePath, type Lang } from '../i18n';

/**
 * Menus. Les adresses s'écrivent en français (`/realisations`, `/#secteurs`) :
 * la version anglaise les convertit toute seule (`/en/projects`, `/en#secteurs`).
 * Seul le libellé se traduit, dans le bloc `en`.
 */

/** Navigation principale. */
export const mainNav = [
  { label: 'Réalisations', href: '/realisations', en: { label: 'Projects' } },
  { label: 'Secteurs', href: '/#secteurs', en: { label: 'Sectors' } },
  { label: 'Studio', href: '/studio', en: { label: 'Studio' } },
  { label: 'Contact', href: '/#contact', en: { label: 'Contact' } },
];

export const footerNav = [
  {
    title: 'Secteurs',
    en: { title: 'Sectors', links: [{ label: 'Hospitality' }, { label: 'Healthcare' }, { label: 'Schools & kids' }, { label: 'Restaurants' }] },
    links: [
      { label: 'Hôtellerie', href: '/realisations?secteur=hotellerie' },
      { label: 'Santé', href: '/realisations?secteur=sante' },
      { label: 'Écoles & enfants', href: '/realisations?secteur=ecoles-enfants' },
      { label: 'Restaurants', href: '/realisations?secteur=restaurants-commerces' },
    ],
  },
  {
    title: 'Studio',
    en: { title: 'Studio', links: [{ label: 'About' }, { label: 'Projects' }, { label: 'Press' }] },
    links: [
      { label: 'À propos', href: '/studio' },
      { label: 'Réalisations', href: '/realisations' },
      { label: 'Presse', href: '/studio#presse' },
    ],
  },
];

/**
 * Liens dans la langue de la page. `key` garde l'adresse française d'origine :
 * c'est elle que l'en-tête compare à la page courante.
 */
export const mainNavFor = (lang: Lang) =>
  mainNav.map((item) => {
    const { label, href } = localize(item, lang);
    return { label, key: href, href: localizePath(href, lang) };
  });

export const footerNavFor = (lang: Lang) =>
  footerNav.map((column) => {
    const { title, links } = localize(column, lang);
    return { title, links: links.map((link) => ({ ...link, href: localizePath(link.href, lang) })) };
  });
