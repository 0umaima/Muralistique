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
   * Proportion d'origine de la couverture (largeur / hauteur). Indicatif :
   * la grille Réalisations recadre toutes les tuiles au même format.
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
  /** Mis en avant dans le comparateur avant/après de l'accueil. */
  featuredOnHome?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'robotique-en-mouvement',

title: 'Robotique en mouvement',
 sector: 'bureaux',
  city: 'Casablanca',

  excerpt:
    'Bureaux CB Robotics : création d’une fresque murale futuriste inspirée de la robotique, de l’automatisation et des technologies RPA.',

  body: [
    'Pour habiller ses bureaux, CB Robotics souhaitait une fresque forte et cohérente avec son univers : la robotique, l’automatisation et les technologies tournées vers le futur.',
    'La composition met en scène une créature mécanique panoramique, déployée sur plusieurs murs comme une machine en mouvement. Les lignes noires, les volumes gris et les touches de bleu technologique créent une fresque immersive, dynamique et parfaitement liée à l’identité de CB Robotics.',
  ],

  cover: {
    src: 'projects/robotique-en-mouvement/apres.jpeg',
    alt: 'Fresque murale robotique futuriste dans les bureaux de CB Robotics',
  },

  ratio: '33 / 16',

  beforeAfter: {
    before: {
      src: 'projects/robotique-en-mouvement/avant.jpeg',
      alt: 'Mur des bureaux CB Robotics avant la réalisation de la fresque',
    },
    after: {
      src: 'projects/robotique-en-mouvement/apres.jpeg',
      alt: 'Fresque robotique futuriste réalisée dans les bureaux de CB Robotics',
    },
    label: 'Robotique en mouvement',
    meta: 'Bureaux CB Robotics',
  },

  gallery: [
    {
      src: 'projects/robotique-en-mouvement/avant.jpeg',
      alt: 'Mur avant la fresque dans les bureaux CB Robotics',
      caption: 'Avant intervention',
    },
    {
      src: 'projects/robotique-en-mouvement/apres.jpeg',
      alt: 'Vue panoramique de la fresque robotique CB Robotics',
      caption: 'Fresque panoramique',
    },
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: 'CB Robotics',
  },

  featuredOnHome: true,
},
{
  slug: 'harmonie-verte',

  title: 'Harmonie Verte',

  sector: 'bureaux',

  city: '',

  excerpt:
    'Fresque murale aux tons de verts doux, imaginée pour créer une atmosphère calme, naturelle et inspirante.',

  body: [
    'Pour habiller son espace intérieur, KOON souhaitait une fresque végétale capable d’apporter douceur, équilibre et sérénité à l’environnement.',
    'La composition associe différentes nuances de vert, des formes organiques et des silhouettes méditatives. Les feuillages enveloppants créent une atmosphère apaisante tout en renforçant l’identité visuelle du lieu.',
  ],

  cover: {
    src: 'projects/harmonie-verte/cover.jpeg',
    alt: 'Fresque murale végétale aux tons de verts doux dans un espace intérieur KOON',
  },

  ratio: '33 / 16',

  beforeAfter: {
    before: {
      src: 'projects/harmonie-verte/avant.jpeg',
      alt: 'Espace intérieur avant la réalisation de la fresque murale',
    },
    after: {
      src: 'projects/harmonie-verte/apres.jpeg',
      alt: 'Fresque végétale Harmonie Verte réalisée dans l’espace KOON',
    },
    label: 'Harmonie Verte',
    meta: 'Fresque murale végétale · KOON',
  },

  gallery: [
    {
      src: 'projects/harmonie-verte/apres.jpeg',
      alt: 'Détail des feuillages et des tons verts de la fresque',
      caption: 'Détail végétal',
    },
    {
      src: 'projects/harmonie-verte/cover.jpeg',
      alt: 'Vue d’ensemble de la fresque murale Harmonie Verte',
      caption: 'Vue d’ensemble',
    },
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: 'KOON',
  },

},
 {
  slug: 'ecole-les-tilleuls',

  title: 'École Les Tilleuls',

  sector: 'ecoles-enfants',

  city: 'Casablanca',

  excerpt:
    'École pour enfants : création d’une fresque murale colorée inspirée de la nature et du monde animal.',

  body: [
    'Pour transformer les espaces de jeux en un environnement vivant et stimulant, l’équipe pédagogique souhaitait une fresque joyeuse, accessible aux enfants et propice à l’imaginaire.',
    'La composition met en scène des animaux comme l’éléphant, la girafe et le paresseux au cœur d’une végétation luxuriante. Les teintes de vert, les couleurs vives et les formes arrondies créent un univers ludique, chaleureux et rassurant dans la cour et les espaces de l’école.',
  ],

  cover: {
    src: 'projects/ecole-les-tilleuls/cover.jpeg',
    alt: 'Fresque murale colorée représentant des animaux et une végétation luxuriante dans une école',
  },

  ratio: '3 / 4',

  gallery: [
    {
      src: 'projects/ecole-les-tilleuls/1.jpeg',
      alt: 'Détail de la fresque avec un paresseux entouré de feuillages',
      caption: 'Le paresseux dans la jungle',
    },
    {
      src: 'projects/ecole-les-tilleuls/2.jpeg',
      alt: 'Fresque murale représentant un éléphant dans un espace de jeux pour enfants',
      caption: 'Les animaux de la jungle',
    },
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: 'École Les Tilleuls',
  },
},
{
  slug: 'cafe-nord',

  title: 'Café Nord',

  sector: 'restaurants-commerces',

  city: 'Bordeaux',

  excerpt:
    'Café de quartier : création d’une fresque murale chaleureuse et inspirante autour de l’univers du café.',

  body: [
    'Pour créer une atmosphère accueillante et mémorable, le Café Nord souhaitait habiller ses murs avec une fresque originale, pensée pour accompagner les moments de pause autour d’un bon café.',
    'Le dessin mural mêle fleurs, feuillages, tasses et formes organiques dans une palette de noir, de blanc et de tons dorés. Une composition expressive qui apporte caractère, chaleur et identité à l’espace.',
  ],

  cover: {
    src: 'projects/cafe-nord/cover.jpeg',
    alt: 'Fresque murale inspirée de l’univers du café dans le Café Nord à Bordeaux',
  },

  ratio: '4 / 5',

  gallery: [
    {
      src: 'projects/cafe-nord/1.jpeg',
      alt: 'Détail de la fresque murale avec motifs floraux et tasse de café',
      caption: 'Détail de la fresque',
    },
    {
      src: 'projects/cafe-nord/cover.jpeg',
      alt: 'Vue d’ensemble de la fresque murale dans le Café Nord',
      caption: 'Vue d’ensemble',
    },
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: 'Café Nord',
  },
},
{
  slug: 'cabine-gynecologique',

  title: 'Cabine de gynécologie',

  sector: 'sante',

  city: '',

  excerpt:
    'Cabine gynécologique : une fresque en ligne art pensée comme un espace de sérénité, de confiance et de bien-être.',

  body: [
    'Pour cette cabine gynécologique, l’objectif était de créer un environnement doux, rassurant et élégant, afin d’accompagner les patientes dans un moment intime avec davantage de sérénité.',
    'La fresque associe des silhouettes féminines, des fleurs et des lignes continues dans un style épuré et délicat. Une composition artistique qui évoque la féminité, la bienveillance et le bien-être tout en s’intégrant harmonieusement à l’architecture du cabinet.',
  ],

  cover: {
    src: 'projects/cabine-gynecologique/cover.jpeg',
    alt: 'Fresque murale en ligne art dans une cabine gynécologique',
  },

  ratio: '3 / 4',

  gallery: [
    {
      src: 'projects/cabine-gynecologique/1.jpeg',
      alt: 'Fresque murale représentant une silhouette féminine et des fleurs',
      caption: 'Ligne art et féminité',
    },
    {
      src: 'projects/cabine-gynecologique/2.jpeg',
      alt: 'Détail d’une fresque florale dans le cabinet gynécologique',
      caption: 'Détail floral',
    }
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: '',
  },
},

 
{
  slug: 'hotel-kaan-misti',

  title: 'Hôtel Kaan · Misti Rooftop',

  sector: 'hotellerie',

  city: 'Casablanca',

  excerpt:
    'Rooftop Misti : une fresque abstraite en bleu mêlant formes, lignes dynamiques et lettrage inspiré du street art.',

  body: [
    'Pour le rooftop Misti de l’Hôtel Kaan, l’objectif était de créer une identité visuelle forte, contemporaine et immédiatement reconnaissable, à la hauteur de l’atmosphère urbaine du lieu.',
    'Cette explosion de formes et de lettres capte l’essence du street art à travers des lignes dynamiques, des compositions abstraites et un lettrage énergique. Les nuances de bleu contrastent avec l’architecture claire du bâtiment et transforment le rooftop en un espace artistique, vivant et immersif.',
  ],

  cover: {
    src: 'projects/hotel-kaan-misti/cover.png',
    alt: 'Fresque street art abstraite sur le rooftop Misti de l’Hôtel Kaan à Casablanca',
  },

  ratio: '4 / 5',

  gallery: [
  
    {
      src: 'projects/hotel-kaan-misti/1.png',
      alt: 'Fresque murale contemporaine dans l’espace intérieur de l’Hôtel Kaan',
      caption: 'Le street art s’invite chez Kaan',
    },
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: 'Hôtel Kaan · Misti Rooftop',
  },
},
{
  slug: 'tsarine-beauty-house',

  title: 'Tsarine Beauty House',

  sector: 'beaute-bien-etre',

  city: '',

  excerpt:
    'Spa et espace beauté : une fresque élégante inspirée de la Renaissance, entre figures féminines, raffinement et bien-être.',

  body: [
    'Pour Tsarine Beauty House, l’objectif était de créer un univers visuel élégant, apaisant et raffiné, à l’image d’un lieu dédié à la beauté et au bien-être.',
    'Inspiré de l’œuvre emblématique de Michel-Ange, ce dessin mural évoque la force et la beauté du corps humain. Les figures délicates, les lignes majestueuses et les détails inspirés de la Renaissance s’intègrent harmonieusement à l’ambiance du spa.',
    'D’autres espaces adoptent une approche plus contemporaine et graphique, avec des compositions colorées, des formes géométriques et des motifs dynamiques qui donnent à Tsarine Beauty House une identité artistique unique.',
  ],

  cover: {
    src: 'projects/tsarine-beauty-house/cover.png',
    alt: 'Fresque murale inspirée de la Renaissance dans le Tsarine Beauty House',
  },

  ratio: '4 / 5',

  gallery: [
    {
      src: 'projects/tsarine-beauty-house/1.png',
      alt: 'Fresque murale inspirée de Michel-Ange dans un espace beauté',
      caption: 'Détail de la fresque',
    }
  ],

  facts: {
    surface: '',
    duration: '',
    year: '',
    client: 'Tsarine Beauty House',
  },
},
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const projectsInSector = (sectorSlug: string) => projects.filter((p) => p.sector === sectorSlug);
export const homeBeforeAfter = () => projects.find((p) => p.featuredOnHome && p.beforeAfter);
