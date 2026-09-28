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
 *
 *  VERSION ANGLAISE : le bloc `en` de chaque projet contient sa traduction
 *  (titre, résumé, paragraphes, textes alternatifs, légendes). Les images de
 *  la galerie se traduisent dans le même ordre que la galerie française. Un
 *  champ absent du bloc `en` s'affiche en français sur le site anglais.
 * ============================================================================
 */
import { localize, type Lang } from '../i18n';

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
  /** Traduction anglaise des textes ci-dessus (version /en du site). */
  en?: ProjectTranslation;
}

type ImageText = { alt?: string; caption?: string };

export interface ProjectTranslation {
  title?: string;
  city?: string;
  excerpt?: string;
  body?: string[];
  cover?: ImageText;
  beforeAfter?: { before?: ImageText; after?: ImageText; label?: string; meta?: string };
  gallery?: ImageText[];
  facts?: Partial<Project['facts']>;
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

  en: {
    title: 'Robotics in Motion',
    excerpt:
      'CB Robotics offices: a futuristic mural inspired by robotics, automation and RPA technology.',
    body: [
      'To dress its offices, CB Robotics wanted a bold mural in tune with its world: robotics, automation and forward-looking technology.',
      'The composition stages a panoramic mechanical creature that unfolds across several walls like a machine in motion. Black lines, grey volumes and touches of tech blue create an immersive, dynamic mural closely tied to the CB Robotics identity.',
    ],
    cover: { alt: 'Futuristic robotics mural in the CB Robotics offices' },
    beforeAfter: {
      before: { alt: 'CB Robotics office wall before the mural was painted' },
      after: { alt: 'Futuristic robotics mural painted in the CB Robotics offices' },
      label: 'Robotics in Motion',
      meta: 'CB Robotics offices',
    },
    gallery: [
      { alt: 'Wall before the mural in the CB Robotics offices', caption: 'Before' },
      { alt: 'Panoramic view of the CB Robotics mural', caption: 'Panoramic mural' },
    ],
  },
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

  en: {
    title: 'Green Harmony',
    excerpt: 'A mural in soft shades of green, designed to create a calm, natural and inspiring atmosphere.',
    body: [
      'To dress its interior, KOON wanted a botanical mural that would bring softness, balance and serenity to the space.',
      'The composition combines shades of green, organic shapes and meditative silhouettes. Enveloping foliage creates a soothing atmosphere while strengthening the visual identity of the place.',
    ],
    cover: { alt: 'Botanical mural in soft shades of green in a KOON interior' },
    beforeAfter: {
      before: { alt: 'Interior space before the mural was painted' },
      after: { alt: 'Green Harmony botanical mural painted in the KOON space' },
      label: 'Green Harmony',
      meta: 'Botanical mural · KOON',
    },
    gallery: [
      { alt: 'Detail of the foliage and green tones of the mural', caption: 'Botanical detail' },
      { alt: 'Overall view of the Green Harmony mural', caption: 'Overall view' },
    ],
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

  en: {
    excerpt: 'Children’s school: a colorful mural inspired by nature and the animal kingdom.',
    body: [
      'To turn its play areas into a lively, stimulating environment, the teaching team wanted a joyful mural that children could relate to and that would spark their imagination.',
      'The composition features animals such as an elephant, a giraffe and a sloth amid lush vegetation. Shades of green, bright colors and rounded shapes create a playful, warm and reassuring world in the school’s courtyard and spaces.',
    ],
    cover: { alt: 'Colorful mural of animals and lush vegetation in a school' },
    gallery: [
      { alt: 'Detail of the mural with a sloth surrounded by foliage', caption: 'The sloth in the jungle' },
      { alt: 'Mural of an elephant in a children’s play area', caption: 'Jungle animals' },
    ],
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

  en: {
    excerpt: 'Neighborhood café: a warm, inspiring mural built around the world of coffee.',
    body: [
      'To create a welcoming and memorable atmosphere, Café Nord wanted an original mural on its walls, designed to accompany those coffee breaks.',
      'The mural blends flowers, foliage, cups and organic shapes in a palette of black, white and golden tones. An expressive composition that brings character, warmth and identity to the space.',
    ],
    cover: { alt: 'Coffee-themed mural in Café Nord, Bordeaux' },
    gallery: [
      { alt: 'Detail of the mural with floral patterns and a coffee cup', caption: 'Mural detail' },
      { alt: 'Overall view of the mural in Café Nord', caption: 'Overall view' },
    ],
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

  en: {
    title: 'Gynecology Practice',
    excerpt: 'Gynecology practice: a line-art mural designed as a space of serenity, trust and well-being.',
    body: [
      'For this gynecology practice, the goal was a soft, reassuring and elegant environment that helps patients approach an intimate moment with more serenity.',
      'The mural combines female silhouettes, flowers and continuous lines in a clean, delicate style. An artistic composition that evokes femininity, care and well-being while blending harmoniously with the architecture of the practice.',
    ],
    cover: { alt: 'Line-art mural in a gynecology practice' },
    gallery: [
      { alt: 'Mural of a female silhouette and flowers', caption: 'Line art and femininity' },
      { alt: 'Detail of a floral mural in the gynecology practice', caption: 'Floral detail' },
    ],
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

  en: {
    excerpt: 'Misti Rooftop: an abstract mural in blue, mixing shapes, dynamic lines and street-art-inspired lettering.',
    body: [
      'For the Misti rooftop at Hôtel Kaan, the goal was a strong, contemporary and instantly recognizable visual identity, matching the urban atmosphere of the venue.',
      'This explosion of shapes and letters captures the essence of street art through dynamic lines, abstract compositions and energetic lettering. Shades of blue contrast with the building’s light architecture and turn the rooftop into a lively, immersive art space.',
    ],
    cover: { alt: 'Abstract street-art mural on the Misti rooftop at Hôtel Kaan in Casablanca' },
    gallery: [{ alt: 'Contemporary mural inside Hôtel Kaan', caption: 'Street art moves into Kaan' }],
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

  en: {
    excerpt: 'Spa and beauty space: an elegant Renaissance-inspired mural of female figures, refinement and well-being.',
    body: [
      'For Tsarine Beauty House, the goal was an elegant, soothing and refined visual world, true to a place dedicated to beauty and well-being.',
      'Inspired by Michelangelo’s iconic work, this mural celebrates the strength and beauty of the human body. Delicate figures, majestic lines and Renaissance-inspired details blend harmoniously into the spa’s atmosphere.',
      'Other rooms take a more contemporary, graphic approach, with colorful compositions, geometric shapes and dynamic patterns that give Tsarine Beauty House a unique artistic identity.',
    ],
    cover: { alt: 'Renaissance-inspired mural at Tsarine Beauty House' },
    gallery: [{ alt: 'Michelangelo-inspired mural in a beauty space', caption: 'Mural detail' }],
  },
},
];

/** Projets dans la langue de la page (même ordre, mêmes slugs). */
export const getProjects = (lang: Lang = 'fr'): Project[] => projects.map((project) => localize(project, lang));

export const projectBySlug = (slug: string, lang: Lang = 'fr') => getProjects(lang).find((p) => p.slug === slug);
export const projectsInSector = (sectorSlug: string, lang: Lang = 'fr') =>
  getProjects(lang).filter((p) => p.sector === sectorSlug);
export const homeBeforeAfter = (lang: Lang = 'fr') => getProjects(lang).find((p) => p.featuredOnHome && p.beforeAfter);
