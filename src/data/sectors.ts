/**
 * SECTEURS — les six familles de lieux présentées sur l'accueil et utilisées
 * comme filtres sur la page Réalisations.
 *
 * `slug`  : identifiant stable (URL, filtres) — NE PAS traduire ni modifier
 *           sans mettre à jour `sector` dans src/data/projects.ts.
 * `label` : libellé affiché.
 * `count` : nombre de projets annoncé sur le carrousel de l'accueil.
 *           ⚠ CHIFFRES REPRIS DE LA MAQUETTE — À VÉRIFIER puis corriger avec
 *           vos chiffres réels avant la mise en ligne.
 * `image` : chemin relatif dans src/assets/images/ (placeholder à remplacer).
 */
export interface Sector {
  slug: string;
  label: string;
  /** Libellé court utilisé sur mobile quand la place manque. */
  shortLabel?: string;
  count: number;
  blurb: string;
  /** Version courte du blurb pour le carrousel mobile. */
  shortBlurb: string;
  image: string;
  imageAlt: string;
}

export const sectors: Sector[] = [
  {
    slug: 'hotellerie',
    label: 'Hôtellerie',
    count: 12,
    blurb: 'Halls, chambres, spas et façades intérieures.',
    shortBlurb: 'Halls, chambres, spas.',
    image: 'sectors/hotellerie.jpg',
    imageAlt: 'Fresque murale dans le hall d’un hôtel — photo à remplacer',
  },
  {
    slug: 'sante',
    label: 'Santé',
    count: 18,
    blurb: 'Cabinets, cliniques, opticiens, salles d’attente.',
    shortBlurb: 'Cabinets, cliniques.',
    image: 'sectors/sante.jpg',
    imageAlt: 'Fresque murale dans une salle d’attente — photo à remplacer',
  },
  {
    slug: 'ecoles-enfants',
    label: 'Écoles & enfants',
    shortLabel: 'Écoles',
    count: 22,
    blurb: 'Salles de classe, crèches, chambres d’enfants.',
    shortBlurb: 'Classes, crèches.',
    image: 'sectors/ecoles.jpg',
    imageAlt: 'Fresque murale dans une école — photo à remplacer',
  },
  {
    slug: 'restaurants-commerces',
    label: 'Restaurants & commerces',
    shortLabel: 'Restaurants',
    count: 16,
    blurb: 'Salles, terrasses, vitrines et enseignes peintes.',
    shortBlurb: 'Salles, vitrines.',
    image: 'sectors/restaurants.jpg',
    imageAlt: 'Fresque murale dans un restaurant — photo à remplacer',
  },
  {
    slug: 'bureaux',
    label: 'Bureaux',
    count: 14,
    blurb: 'Accueils, salles de réunion, espaces de pause.',
    shortBlurb: 'Accueils, réunions.',
    image: 'sectors/bureaux.jpg',
    imageAlt: 'Fresque murale dans des bureaux — photo à remplacer',
  },
  {
    slug: 'espaces-prives',
    label: 'Espaces privés',
    shortLabel: 'Privés',
    count: 20,
    blurb: 'Appartements, maisons, halls d’immeuble.',
    shortBlurb: 'Appartements, maisons.',
    image: 'sectors/prives.jpg',
    imageAlt: 'Fresque murale dans un appartement — photo à remplacer',
  },
];

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
