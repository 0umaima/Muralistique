/**
 * ============================================================================
 *  TEXTES DU SITE — chiffres clés, processus, services, témoignage, studio.
 * ============================================================================
 *  Tous les textes proviennent de la maquette. Modifiez-les librement ici :
 *  ils sont utilisés tels quels par les composants.
 *  ⚠ Les chiffres du bloc « statistiques » et le témoignage sont des exemples
 *    de maquette — À VÉRIFIER / REMPLACER par vos données réelles.
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

/** Les cinq étapes de la section #processus (accueil). */
export const processSteps = [
  {
    number: '01',
    title: 'Visite & brief',
    text: 'Relevé du mur, contraintes du lieu, attentes du public.',
    /** Ambiance de la carte : 'ivory' | 'ink' | 'accent' (jaune du logo). */
    tone: 'ivory' as const,
    icon: 'map' as const,
    /** Rotation de départ de l'animation d'entrée. */
    rotate: -5,
    translate: 34,
  },
  {
    number: '02',
    title: 'Esquisse',
    text: 'Croquis au trait, mise à l’échelle et palette proposée.',
    tone: 'ink' as const,
    icon: 'pen-tool' as const,
    rotate: 2.5,
    translate: 18,
  },
  {
    number: '03',
    title: 'Validation',
    text: 'Simulation sur photo du lieu, ajustements, devis signé.',
    tone: 'ivory' as const,
    icon: 'check' as const,
    rotate: 5,
    translate: 42,
  },
  {
    number: '04',
    title: 'Peinture',
    text: 'Exécution sur site, en horaires compatibles avec l’activité.',
    tone: 'ink' as const,
    icon: 'paintbrush' as const,
    rotate: -3,
    translate: 22,
  },
  {
    number: '05',
    title: 'Livraison',
    text: 'Vernis de protection, reportage photo et vidéo du résultat.',
    tone: 'accent' as const,
    icon: 'house' as const,
    rotate: 4,
    translate: 38,
  },
];

/** Images d'illustration sous les cinq étapes. */
export const processImages = [
  { src: 'process/croquis.jpg', alt: 'Croquis préparatoire sur papier — photo à remplacer', caption: 'Croquis sur papier' },
  { src: 'process/trace.jpg', alt: 'Tracé de la composition sur le mur — photo à remplacer', caption: 'Tracé au mur' },
  { src: 'process/couleur.jpg', alt: 'Mise en couleur de la fresque — photo à remplacer', caption: 'Mise en couleur' },
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
    image: { src: 'services/fresque.jpg', alt: 'Fresque murale en cours de réalisation — photo à remplacer' },
  },
  {
    number: '02',
    title: 'Toile',
    tags: ['Pièce originale', 'Atelier', 'Sur mesure'],
    heading: 'Œuvres peintes en atelier, pensées pour un mur précis.',
    text: 'Format, palette et sujet définis avec vous, puis livrées prêtes à accrocher. La solution pour les murs qu’on ne peut pas peindre.',
    shortText: 'Œuvres peintes en atelier, livrées prêtes à accrocher.',
    image: { src: 'services/toile.jpg', alt: 'Toile peinte en atelier — photo à remplacer' },
  },
  {
    number: '03',
    title: 'Performance',
    tags: ['Live painting', 'Événement', 'Public'],
    heading: 'Peinture en direct, devant votre public.',
    text: 'Pour une ouverture, une inauguration ou un événement : l’œuvre se construit sous les yeux des invités et reste sur place.',
    shortText: 'Peinture en direct devant votre public, l’œuvre reste sur place.',
    image: { src: 'services/performance.jpg', alt: 'Séance de live painting devant un public — photo à remplacer' },
  },
];

/**
 * Témoignage de l'accueil.
 * ⚠ EXEMPLE DE MAQUETTE — À VALIDER auprès de la personne citée, ou à
 *   remplacer par un témoignage réel. Mettez `enabled: false` pour masquer
 *   entièrement le bloc tant que vous n'avez pas de témoignage validé.
 */
export const testimonial = {
  enabled: true,
  quote: 'Les patients parlent du mur avant de parler de l’attente. La salle a changé de nature.',
  author: 'Camille Roux',
  role: 'Directrice, Clinique Vision Sud — témoignage à valider',
  portrait: { src: 'people/temoignage.jpg', alt: 'Portrait de la personne citée — photo à remplacer' },
};

/** Phrase de positionnement (accueil). Le fragment `highlight` est surligné. */
export const positioning = {
  before: 'Muralistique transforme les espaces professionnels et privés grâce à des ',
  highlight: 'fresques murales uniques',
  after: ', imaginées pour chaque lieu.',
};

/**
 * Page Studio — volontairement peu de texte : des images et des titres.
 * Les photos se remplacent dans src/assets/images/ (même nom de fichier).
 */
export const studio = {
  founderName: 'Amine Houmam',
  founderRole: 'Fondateur & artiste muraliste',
  /** Phrase d'introduction, révélée mot à mot au défilement. */
  intro: 'Un atelier, une ligne continue, quelques couleurs — et des murs pensés pour l’identité de chaque lieu.',

  /** Défilé horizontal « Quelques murs signés ». `slug` renvoie à src/data/projects.ts ;
   *  `image` permet de choisir une autre photo que la couverture du projet. */
  works: [
    { slug: 'cafe-nord' },
    { slug: 'harmonie-verte' },
    { slug: 'robotique-en-mouvement', image: 'projects/robotique-en-mouvement/apres.jpeg' },
    { slug: 'ecole-les-tilleuls' },
    { slug: 'cabine-gynecologique' },
  ],

  /** Les étapes, réduites à des titres qui défilent. */
  steps: ['Écouter le lieu', 'Dessiner', 'Tester les couleurs', 'Peindre sur place', 'Protéger'],

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
    '2 000 Dh – 5 000 Dh',
    '5 000 Dh – 10 000 Dh',
    'Plus de 10 000 Dh',
    'Pas sûr / à discuter',
  ],
};
