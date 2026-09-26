/**
 * ============================================================================
 *  TEXTES DU SITE : chiffres clés, services, retours clients, studio.
 * ============================================================================
 *  Tous les textes proviennent de la maquette. Modifiez-les librement ici :
 *  ils sont utilisés tels quels par les composants.
 *  ⚠ Les chiffres du bloc « statistiques » sont des exemples de maquette :
 *    À VÉRIFIER / REMPLACER par vos données réelles.
 * ============================================================================
 */

/** Chiffres clés sous le hero. `value` doit contenir un nombre : il est animé
 *  au défilement, le suffixe (« + », « % », « j ») est conservé tel quel. */
export const stats = [
  { value: '120+', label: 'Murs transformés', shortLabel: 'Murs transformés' },
  { value: '6', label: 'Secteurs d’activité', shortLabel: 'Secteurs' },
  { value: '100%', label: 'Peint à la main', shortLabel: 'Peint à la main' },
  { value: '15 j', label: 'Du croquis à la livraison', shortLabel: 'Croquis → livraison' },
];

/** Les trois services de l'accordéon (accueil). */
export const services = [
  {
    number: '01',
    title: 'Fresque',
    tags: ['Sur mesure', 'Peinture murale', 'Line art'],
    heading: 'Peinture murale sur mesure, réalisée directement sur vos murs.',
    text: 'Du croquis à la finition, sur site. Surface lessivable et protégée, chantier calé sur vos horaires d’ouverture.',
    shortText: 'Peinture murale sur mesure, du croquis à la finition, réalisée sur site.',
    image: { src: 'services/fresque.png', alt: 'Fresque murale en cours de réalisation (photo à remplacer)' },
  },
  {
    number: '02',
    title: 'Toile',
    tags: ['Pièce originale', 'Atelier', 'Sur mesure'],
    heading: 'Œuvres peintes en atelier, pensées pour un mur précis.',
    text: 'Format, palette et sujet définis avec vous, puis livrées prêtes à accrocher. La solution pour les murs qu’on ne peut pas peindre.',
    shortText: 'Œuvres peintes en atelier, livrées prêtes à accrocher.',
    image: { src: 'services/toile.png', alt: 'Toile peinte en atelier (photo à remplacer)' },
  },
  {
    number: '03',
    title: 'Performance',
    tags: ['Live painting', 'Événement', 'Public'],
    heading: 'Peinture en direct, devant votre public.',
    text: 'Pour une ouverture, une inauguration ou un événement : l’œuvre se construit sous les yeux des invités et reste sur place.',
    shortText: 'Peinture en direct devant votre public, l’œuvre reste sur place.',
    image: { src: 'services/performance.png', alt: 'Séance de live painting devant un public (photo à remplacer)' },
  },
];

/**
 * Retours clients (accueil, section « Vos retours »).
 * Recopiés mot pour mot depuis les commentaires Instagram laissés sous les
 * publications de @muralistique : on n'y corrige rien.
 *  - `highlight` : passages soulignés d'un trait jaune (recopiés à
 *    l'identique du texte, apostrophes typographiques comprises) ;
 *  - `verified` : badge « compte vérifié » d'Instagram ;
 *  - `reply` : réponse de l'atelier, affichée sous le commentaire.
 */
export interface Feedback {
  handle: string;
  text: string;
  highlight?: string[];
  verified?: boolean;
  reply?: { handle: string; text: string };
}

export const feedback: Feedback[] = [
  {
    handle: 'salwawakrim',
    text: 'Merci Amine pour ce chef-d’œuvre ! Ton talent a transformé mon mur en une vraie œuvre d’art. J’adore le résultat 🦅✨',
    highlight: ['chef-d’œuvre', 'une vraie œuvre d’art'],
  },
  {
    handle: 'guacate.casablanca',
    verified: true,
    text: 'Merci pour la super fresque !!! ❤️',
    highlight: ['super fresque'],
  },
  {
    handle: 'dr_sassi',
    text: 'Créativité frere tbarklah elek je recommande vivement ⭐⭐⭐⭐⭐',
    highlight: ['je recommande vivement'],
    reply: { handle: 'muralistique', text: '@dr_sassi Mercii beaucoup docteur 🙏🙏🙏' },
  },
  {
    handle: 'bouzerda.souad',
    text: 'Merci 😍 tu es un grand artiste',
    highlight: ['un grand artiste'],
  },
  {
    handle: 'dr.oukheirimane',
    text: 'Vraiment un grand bravo pour ton travail, ton dévouement et ton talent 🙌 et très bonne continuation 🌸',
    highlight: ['un grand bravo'],
  },
  {
    handle: 'touriameskini',
    text: 'très beau travail, est ce que je peux avoir une idée sur les prix',
    highlight: ['très beau travail'],
  },
];

/**
 * Page Studio — volontairement peu de texte : des images et des titres.
 * Les photos se remplacent dans src/assets/images/ (même nom de fichier).
 */
export const studio = {
  founderName: 'Amine Houmam',
  founderRole: 'Fondateur & artiste muraliste',
  /** Phrase d'introduction, révélée mot à mot au défilement. */
  intro: 'Un atelier, une ligne continue, quelques couleurs, et des murs pensés pour l’identité de chaque lieu.',

  /** Défilé horizontal « Quelques murs signés ». `slug` renvoie à src/data/projects.ts ;
   *  `image` permet de choisir une autre photo que la couverture du projet. */
  works: [
    { slug: 'cafe-nord' },
    { slug: 'harmonie-verte' },
    { slug: 'robotique-en-mouvement', image: 'projects/robotique-en-mouvement/apres.jpeg' },
    { slug: 'ecole-les-tilleuls' },
    { slug: 'cabine-gynecologique' },
  ],

  quote: 'Un mur ne devrait jamais être neutre. Il porte l’identité du lieu, ou il ne porte rien.',
  quoteAuthor: 'Amine Houmam',

  /** Mosaïque « Le geste, en détail » : une image, un titre. Les photos
   *  d'atelier (studio/croquis.jpg, studio/couleurs.jpg…) peuvent remplacer
   *  ces détails de murs dès qu'elles sont prêtes. */
  gallery: [
    { src: 'projects/cabine-gynecologique/2.jpeg', alt: 'Détail d’une fresque florale au trait dans un cabinet gynécologique', title: 'Le trait' },
    { src: 'projects/ecole-les-tilleuls/1.jpeg', alt: 'Détail de la fresque avec un paresseux entouré de feuillages', title: 'La couleur' },
    { src: 'projects/cafe-nord/1.jpeg', alt: 'Détail de la fresque murale avec motifs floraux et tasse de café', title: 'La lettre' },
    { src: 'projects/ecole-les-tilleuls/2.jpeg', alt: 'Fresque murale représentant un éléphant dans un espace de jeux pour enfants', title: 'L’échelle' },
    { src: 'projects/harmonie-verte/apres.jpeg', alt: 'Fresque végétale Harmonie Verte réalisée dans l’espace KOON', title: 'L’identité' },
  ],
};

/** Champs du formulaire de devis (page Devis). */
export const quoteOptions = {
  spaceTypes: ['Hôtel', 'Cabinet / clinique', 'École', 'Restaurant', 'Commerce', 'Bureau', 'Logement', 'Autre'],
  /** ⚠ Fourchettes reprises de la maquette (en dirhams) . */
  budgets: [
    'Moins de 2 000 Dh',
    '2 000 à 5 000 Dh',
    '5 000 à 10 000 Dh',
    'Plus de 10 000 Dh',
    'Pas sûr / à discuter',
  ],
};
