/**
 * SECTEURS — les familles de lieux présentées dans le carrousel de l'accueil
 * et utilisées comme filtres sur la page Réalisations.
 *
 * `slug`  : identifiant stable (URL, filtres) — NE PAS traduire ni modifier
 *           sans mettre à jour `sector` dans src/data/projects.ts.
 * `label` : libellé affiché.
 * `blurb` : une ligne pour situer le secteur.
 *
 * Aucune image ni aucun chiffre à saisir ici : le carrousel de l'accueil
 * montre la couverture du premier projet du secteur et compte les projets
 * réellement présents dans src/data/projects.ts. Un secteur sans projet
 * s'affiche en carte texte, avec un lien vers le devis.
 */
export interface Sector {
  slug: string;
  label: string;
  blurb: string;
}

export const sectors: Sector[] = [
  {
    slug: 'bureaux',
    label: 'Bureaux',
    blurb: 'Accueils, salles de réunion, espaces de pause.',
  },
  {
    slug: 'hotellerie',
    label: 'Hôtellerie',
    blurb: 'Halls, chambres, rooftops et façades.',
  },
  {
    slug: 'ecoles-enfants',
    label: 'Écoles & enfants',
    blurb: 'Salles de classe, crèches, cours de récréation.',
  },
  {
    slug: 'restaurants-commerces',
    label: 'Restaurants & commerces',
    blurb: 'Salles, terrasses, vitrines et enseignes peintes.',
  },
  {
    slug: 'sante',
    label: 'Santé',
    blurb: 'Cabinets, cliniques, salles d’attente.',
  },
  {
    slug: 'beaute-bien-etre',
    label: 'Beauté & bien-être',
    blurb: 'Spas, instituts et salons de beauté.',
  },
  {
    slug: 'espaces-prives',
    label: 'Espaces privés',
    blurb: 'Appartements, maisons, halls d’immeuble.',
  },
];

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
