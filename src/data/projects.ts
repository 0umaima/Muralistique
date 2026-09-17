/**
 * ============================================================================
 *  PROJETS — source unique de vérité pour la page Réalisations, les pages
 *  projet individuelles et le bloc « Avant / après » de l'accueil.
 * ============================================================================
 *  POUR AJOUTER UN PROJET : copiez un bloc, changez `slug` (il devient l'URL
 *  /realisations/<slug>), déposez vos images dans src/assets/images/projects/
 *  et renseignez les chemins. Rien d'autre à modifier.
 *
 *  ⚠ Les textes ci-dessous proviennent de la maquette : ce sont des exemples.
 *    Remplacez-les par vos vrais projets. Les champs laissés vides ('') ne
 *    sont tout simplement pas affichés — n'inventez pas de chiffres.
 * ============================================================================
 */

export interface ProjectImage {
  /** Chemin relatif dans src/assets/images/ */
  src: string;
  alt: string;
  /** Légende affichée sous l'image sur la page projet (facultatif). */
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** slug du secteur — doit exister dans src/data/sectors.ts */
  sector: string;
  city: string;
  /** Résumé affiché sur la carte de la grille Réalisations. */
  excerpt: string;
  /** Paragraphes de la page projet. */
  body: string[];
  /** Image de couverture (carte + haut de la page projet). */
  cover: ProjectImage;
  /**
   * Proportion de la carte dans la grille (largeur / hauteur), reprise de la
   * maquette pour conserver le rythme vertical de la grille.
   */
  ratio: string;
  /** Couple avant / après. Laissez `undefined` s'il n'y en a pas. */
  beforeAfter?: {
    before: ProjectImage;
    after: ProjectImage;
    /** Titre affiché sous le comparateur de l'accueil. */
    label?: string;
    /** Sous-titre affiché sous le comparateur de l'accueil. */
    meta?: string;
  };
  /** Galerie de la page projet. */
  gallery: ProjectImage[];
  /**
   * Faits vérifiables — laissez '' tant que la donnée réelle n'est pas connue :
   * les lignes vides ne sont pas affichées.
   */
  facts: { surface: string; duration: string; year: string; client: string };
  /** Carte pleine largeur dans la grille Réalisations (format panoramique). */
  wide?: boolean;
  /** Mis en avant dans le comparateur avant/après de l'accueil. */
  featuredOnHome?: boolean;
  /** Mis en avant dans les trois liens du hero de la page Réalisations. */
  featuredInHero?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'mecanique-en-mouvement',

title: 'Mécanique en mouvement',
      sector: 'bureaux',

  city: 'Casablanca',

  excerpt: 'Siège social — création d’une fresque panoramique inspirée d’un univers futuriste et technologique.',

  body: [
    'Pour personnaliser ses espaces de travail, Aurea souhaitait une œuvre forte, contemporaine et immédiatement identifiable, capable de refléter son univers innovant.',
    'La fresque déploie une créature mécanique monumentale sur plusieurs murs. Les nuances de gris, les contours noirs et les touches de bleu composent une scène immersive tout en s’intégrant à l’architecture épurée des bureaux.',
  ],

  cover: {
    src: 'projects/siege-aurea/cover.jpg',
    alt: 'Fresque panoramique futuriste dans les bureaux du siège Aurea à Casablanca',
  },

  ratio: '33 / 16',
    beforeAfter: {
      before: { src: 'projects/hotel-rivage/avant.jpeg', alt: 'Le hall d’accueil avant la fresque — photo à remplacer' },
      after: { src: 'projects/hotel-rivage/apres.jpeg', alt: 'Le hall d’accueil après la fresque — photo à remplacer' },
      label: 'Mécanique en mouvement',
      meta: 'Bureaux à Casablanca',
    },
    gallery: [
      { src: 'projects/hotel-rivage/1.jpeg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail du tracé' },
      { src: 'projects/hotel-rivage/2.jpeg', alt: 'Vue d’ensemble du hall — photo à remplacer', caption: 'Vue d’ensemble' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
    featuredOnHome: true,
    featuredInHero: true,
  },
  {
    slug: 'clinique-vision-sud',
    title: 'Clinique Vision Sud',
    sector: 'sante',
    city: 'Aix-en-Provence',
    excerpt: 'Clinique ophtalmologique — salle d’attente.',
    body: [
      'TEXTE À REMPLACER — contexte du projet et attentes de l’équipe soignante.',
      'TEXTE À REMPLACER — parti pris graphique retenu pour la salle d’attente.',
    ],
    cover: {
      src: 'projects/clinique-vision-sud/cover.jpg',
      alt: 'Fresque murale dans la salle d’attente d’une clinique — photo à remplacer',
    },
    ratio: '7 / 8',
    beforeAfter: {
      before: { src: 'projects/clinique-vision-sud/avant.jpg', alt: 'La salle d’attente avant la fresque — photo à remplacer' },
      after: { src: 'projects/clinique-vision-sud/apres.jpg', alt: 'La salle d’attente après la fresque — photo à remplacer' },
      label: 'Clinique Vision Sud — Salle d’attente',
      meta: 'Aix-en-Provence · Clinique ophtalmologique',
    },
    gallery: [
      { src: 'projects/clinique-vision-sud/1.jpg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail' },
      { src: 'projects/clinique-vision-sud/2.jpg', alt: 'Vue de la salle d’attente — photo à remplacer', caption: 'Vue d’ensemble' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
    featuredInHero: true,
  },
  {
    slug: 'ecole-les-tilleuls',
    title: 'École Les Tilleuls',
    sector: 'ecoles-enfants',
    city: 'Lyon',
    excerpt: 'École primaire — préau et couloir principal.',
    body: [
      'TEXTE À REMPLACER — contexte du projet et attentes de l’équipe pédagogique.',
      'TEXTE À REMPLACER — parti pris graphique retenu pour le préau et le couloir.',
    ],
    cover: {
      src: 'projects/ecole-les-tilleuls/cover.jpg',
      alt: 'Fresque murale dans le préau d’une école — photo à remplacer',
    },
    ratio: '3 / 4',
    gallery: [
      { src: 'projects/ecole-les-tilleuls/1.jpg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail' },
      { src: 'projects/ecole-les-tilleuls/2.jpg', alt: 'Vue du couloir principal — photo à remplacer', caption: 'Couloir principal' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
  },
  {
    slug: 'cafe-nord',
    title: 'Café Nord',
    sector: 'restaurants-commerces',
    city: 'Bordeaux',
    excerpt: 'Café de quartier — salle et devanture intérieure.',
    body: [
      'TEXTE À REMPLACER — contexte du projet et attentes du gérant.',
      'TEXTE À REMPLACER — parti pris graphique retenu pour la salle et la devanture.',
    ],
    cover: {
      src: 'projects/cafe-nord/cover.jpg',
      alt: 'Fresque murale dans la salle d’un café — photo à remplacer',
    },
    ratio: '4 / 5',
    gallery: [
      { src: 'projects/cafe-nord/1.jpg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail' },
      { src: 'projects/cafe-nord/2.jpg', alt: 'Vue de la devanture intérieure — photo à remplacer', caption: 'Devanture intérieure' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
  },
  {
    slug: 'studio-habitat',
    title: 'Studio Habitat',
    sector: 'espaces-prives',
    city: 'Nantes',
    excerpt: 'Appartement privé — séjour et cage d’escalier.',
    body: [
      'TEXTE À REMPLACER — contexte du projet et attentes des propriétaires.',
      'TEXTE À REMPLACER — parti pris graphique retenu pour le séjour et la cage d’escalier.',
    ],
    cover: {
      src: 'projects/studio-habitat/cover.jpg',
      alt: 'Fresque murale dans le séjour d’un appartement — photo à remplacer',
    },
    ratio: '21 / 20',
    gallery: [
      { src: 'projects/studio-habitat/1.jpg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail' },
      { src: 'projects/studio-habitat/2.jpg', alt: 'Vue de la cage d’escalier — photo à remplacer', caption: 'Cage d’escalier' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
  },
  {
    slug: 'cabinet-dentaire-opale',
    title: 'Cabinet Dentaire Opale',
    sector: 'sante',
    city: 'Toulouse',
    excerpt: 'Cabinet dentaire — accueil et salle de soins.',
    body: [
      'TEXTE À REMPLACER — contexte du projet et attentes de l’équipe du cabinet.',
      'TEXTE À REMPLACER — parti pris graphique retenu pour l’accueil et la salle de soins.',
    ],
    cover: {
      src: 'projects/cabinet-dentaire-opale/cover.jpg',
      alt: 'Fresque murale à l’accueil d’un cabinet dentaire — photo à remplacer',
    },
    ratio: '4 / 5',
    gallery: [
      { src: 'projects/cabinet-dentaire-opale/1.jpg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail' },
      { src: 'projects/cabinet-dentaire-opale/2.jpg', alt: 'Vue de la salle de soins — photo à remplacer', caption: 'Salle de soins' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
  },
  {
    slug: 'siege-aurea',
    title: 'Siège Aurea',
    sector: 'bureaux',
    city: 'Paris',
    excerpt: 'Siège social — hall d’entrée et salles de réunion, fresque panoramique.',
    body: [
      'TEXTE À REMPLACER — contexte du projet et attentes de l’entreprise.',
      'TEXTE À REMPLACER — parti pris graphique retenu pour le hall et les salles de réunion.',
    ],
    cover: {
      src: 'projects/siege-aurea/cover.jpg',
      alt: 'Fresque panoramique dans le hall d’un siège social — photo à remplacer',
    },
    ratio: '33 / 16',
    wide: true,
    gallery: [
      { src: 'projects/siege-aurea/1.jpg', alt: 'Détail de la fresque — photo à remplacer', caption: 'Détail' },
      { src: 'projects/siege-aurea/2.jpg', alt: 'Vue des salles de réunion — photo à remplacer', caption: 'Salles de réunion' },
    ],
    facts: { surface: '', duration: '', year: '', client: '' },
    featuredInHero: true,
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const projectsInSector = (sectorSlug: string) => projects.filter((p) => p.sector === sectorSlug);
export const homeBeforeAfter = () => projects.find((p) => p.featuredOnHome && p.beforeAfter);
export const heroProjects = () => projects.filter((p) => p.featuredInHero).slice(0, 3);
