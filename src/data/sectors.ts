/**
 * SECTEURS — les familles de lieux présentées dans le carrousel de l'accueil
 * et utilisées comme filtres sur la page Réalisations.
 *
 * `slug`  : identifiant stable (URL, filtres) — NE PAS traduire ni modifier
 *           sans mettre à jour `sector` dans src/data/projects.ts.
 * `label` : libellé affiché.
 * `blurb` : une ligne pour situer le secteur.
 * `en`    : libellé et phrase en anglais (version /en du site).
 *
 * Aucune image ni aucun chiffre à saisir ici : le carrousel de l'accueil
 * montre la couverture du premier projet du secteur et compte les projets
 * réellement présents dans src/data/projects.ts. Un secteur sans projet
 * s'affiche en carte texte, avec un lien vers le devis.
 */
import { localize, type Lang } from '../i18n';

export interface Sector {
  slug: string;
  label: string;
  blurb: string;
  en?: { label?: string; blurb?: string };
}

export const sectors: Sector[] = [
  {
    slug: 'bureaux',
    label: 'Bureaux',
    blurb: 'Accueils, salles de réunion, espaces de pause.',
    en: { label: 'Offices', blurb: 'Receptions, meeting rooms, break areas.' },
  },
  {
    slug: 'hotellerie',
    label: 'Hôtellerie',
    blurb: 'Halls, chambres, rooftops et façades.',
    en: { label: 'Hospitality', blurb: 'Lobbies, rooms, rooftops and façades.' },
  },
  {
    slug: 'ecoles-enfants',
    label: 'Écoles & enfants',
    blurb: 'Salles de classe, crèches, cours de récréation.',
    en: { label: 'Schools & kids', blurb: 'Classrooms, nurseries, playgrounds.' },
  },
  {
    slug: 'restaurants-commerces',
    label: 'Restaurants & commerces',
    blurb: 'Salles, terrasses, vitrines et enseignes peintes.',
    en: { label: 'Restaurants & shops', blurb: 'Dining rooms, terraces, shopfronts and painted signs.' },
  },
  {
    slug: 'sante',
    label: 'Santé',
    blurb: 'Cabinets, cliniques, salles d’attente.',
    en: { label: 'Healthcare', blurb: 'Practices, clinics, waiting rooms.' },
  },
  {
    slug: 'beaute-bien-etre',
    label: 'Beauté & bien-être',
    blurb: 'Spas, instituts et salons de beauté.',
    en: { label: 'Beauty & wellness', blurb: 'Spas, beauty institutes and salons.' },
  },
  {
    slug: 'espaces-prives',
    label: 'Espaces privés',
    blurb: 'Appartements, maisons, halls d’immeuble.',
    en: { label: 'Private spaces', blurb: 'Apartments, houses, building lobbies.' },
  },
];

/** Secteurs dans la langue de la page. */
export const getSectors = (lang: Lang = 'fr'): Sector[] => sectors.map((sector) => localize(sector, lang));

export const sectorBySlug = (slug: string, lang: Lang = 'fr') => getSectors(lang).find((s) => s.slug === slug);
