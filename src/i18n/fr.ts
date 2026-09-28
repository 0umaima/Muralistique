/**
 * ============================================================================
 *  TEXTES DE L'INTERFACE — FRANÇAIS
 * ============================================================================
 *  Titres, boutons, libellés et messages communs à toutes les pages. Leur
 *  traduction anglaise est dans src/i18n/en.ts, avec exactement les mêmes
 *  clés (TypeScript signale toute clé oubliée d'un côté ou de l'autre).
 *
 *  Le contenu éditorial (projets, secteurs, services, retours clients,
 *  studio…) ne vit pas ici mais dans src/data/, avec son bloc `en`.
 * ============================================================================
 */

export const fr = {
  meta: {
    /** Titre de l'accueil : « Muralistique | … ». */
    homeTitle: 'Fresques murales à Casablanca et au Maroc',
    skipLink: 'Aller au contenu',
    country: 'Maroc',
  },

  langSwitch: {
    label: 'Choisir la langue',
    /** Infobulle du lien vers l'autre langue. */
    title: 'Read this page in English',
  },

  header: {
    home: 'accueil',
    mainNav: 'Navigation principale',
    mobileNav: 'Navigation mobile',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    cta: 'Demander un devis',
  },

  footer: {
    areas: (cities: string) => `Interventions à ${cities} et dans les grandes villes du Maroc.`,
    contact: 'Contact',
    toReplace: ' (à remplacer)',
    instagramMissing: 'Instagram : lien à renseigner',
    legal: 'Mentions légales',
    rights: 'Tous droits réservés.',
  },

  whatsapp: {
    open: 'Ouvrir WhatsApp',
    missingTitle: 'Numéro WhatsApp non configuré.',
    missingFill: 'Renseignez',
    missingIn: 'dans',
    missingEnd: 'pour activer ce bouton.',
  },

  contactCta: {
    eyebrow: 'Contact',
    quoteTitle: 'Demander un devis',
    quoteText: 'Décrivez votre mur, votre lieu et vos délais. Réponse sous 48 h, devis gratuit.',
    quoteButton: 'Remplir le formulaire',
    whatsappTitle: 'Écrire sur WhatsApp',
    whatsappText: 'Envoyez directement des photos de votre mur et échangez en temps réel avec l’atelier.',
    portfolioTitle: 'Voir les réalisations',
    portfolioText: 'Les transformations documentées, secteur par secteur.',
    portfolioButton: 'Ouvrir le portfolio',
  },

  beforeAfter: {
    before: 'Avant',
    after: 'Après',
    control: 'Curseur avant / après',
    range: 'Position du curseur entre l’image avant et l’image après',
  },

  /** « 1 projet », « 7 projets » */
  projectCount: (n: number) => `${n} projet${n > 1 ? 's' : ''}`,
  viewProject: 'Voir le projet',
  allProjects: 'Toutes les réalisations',
  seeProjects: 'Voir les réalisations',
  letsTalk: 'Parlons projet.',

  home: {
    description:
      'Fresques murales sur mesure à Casablanca, Rabat, Marrakech, Tanger et partout au Maroc : hôtels, cabinets, écoles, restaurants, bureaux. Devis gratuit sous 48 h.',
    hero: {
      line1: 'Fresques peintes',
      line2: 'à la main',
      altLeft: 'Fresque « Build Something » peinte dans un espace de travail',
      altCenter: 'Geste de peinture sur une fresque murale',
      altRight: 'Visage peint au trait noir sur des aplats jaune, rouge et bleu',
    },
    stats: 'Chiffres clés',
    transfo: {
      title: 'Avant / Après',
      aside: 'Glissez le curseur : le même mur, avant et après notre passage.',
    },
    services: {
      title: 'Nos services',
      aside: 'Sur le mur, sur toile ou en direct devant votre public.',
    },
    sectors: {
      title: 'Nos secteurs',
      prev: 'Secteur précédent',
      next: 'Secteur suivant',
      rail: 'Secteurs : faire défiler horizontalement',
      firstProject: 'Premier projet ?',
      beFirst: 'Votre lieu peut être le premier.',
    },
    feedback: {
      word: 'Merci',
      title: 'Vos retours',
      aside: 'Les mots que vous laissez sous nos fresques, sur Instagram. Merci à vous.',
      follow: 'Suivre',
      commentBy: 'Commentaire Instagram de ',
      verified: 'compte vérifié',
      liked: 'Aimé par l’atelier',
      author: 'Auteur',
    },
  },

  projects: {
    title: 'Réalisations',
    description:
      'Fresques murales réalisées au Maroc par Muralistique pour des hôtels, cliniques, écoles, commerces, bureaux et espaces privés. Avant / après, secteur par secteur.',
    countLabel: 'projets',
    lead: 'Nos murs, en grand. Survolez une image pour découvrir le projet.',
    filterLabel: 'Filtrer par secteur',
    all: 'Tous',
    empty: 'Aucun projet dans ce secteur pour l’instant.',
    reset: 'Voir tous les projets',
    more: 'Voir plus de projets',
  },

  project: {
    description: (title: string, excerpt: string, city: string) =>
      `${title}. ${excerpt} Fresque murale réalisée par Muralistique${city ? ` à ${city}` : ''}.`,
    breadcrumb: 'Fil d’Ariane',
    facts: {
      sector: 'Secteur',
      city: 'Ville',
      client: 'Client',
      surface: 'Surface',
      duration: 'Durée',
      year: 'Année',
    },
    cta: 'Un projet similaire ?',
    beforeAfter: 'Avant / Après',
    dragHint: 'Glissez pour comparer',
    gallery: 'En images',
    zoomHint: 'Cliquez pour agrandir',
    next: 'Projet suivant',
    lightbox: 'Visionneuse d’images',
    close: 'Fermer',
    prevImage: 'Image précédente',
    nextImage: 'Image suivante',
  },

  studio: {
    title: 'Studio',
    description:
      'Muralistique est l’atelier de fresques murales d’Amine Houmam, artiste muraliste au Maroc : concept, croquis et peinture sur site, du premier trait au vernis de protection.',
    scroll: 'Faire défiler',
    kicker: 'Hey, juste une intro',
    cta: 'Parler de votre projet',
    worksTitle: ['Quelques murs', 'signés.'],
    seeAll: 'Voir tous les murs',
    galleryTitle: ['Le geste,', 'en détail'],
    contactEyebrow: 'Travaillons ensemble',
    contactTitle: 'Votre mur commence par une conversation.',
  },

  quote: {
    title: 'Demander un devis',
    description:
      'Décrivez votre mur, votre lieu et vos délais : Muralistique vous répond sous 48 h avec un devis gratuit, à Casablanca, Rabat, Marrakech, Tanger et partout au Maroc.',
    eyebrow: 'Devis gratuit',
    heading: 'Parlez-nous de votre mur.',
    lead: 'Une idée, même minimale, suffit pour commencer. Décrivez-la, et nous construisons le projet avec vous à partir de là.',
    asideKicker: 'Une question avant de vous lancer ?',
    asideTitle: 'Vous préférez nous appeler ?',
    asideText: 'Certains projets se racontent plus facilement à l’oral. Nous sommes disponibles pour un premier échange.',
    phoneTodo: 'Numéro de téléphone à renseigner dans',
    email: 'Écrire un e-mail',
  },

  form: {
    closedTitle: 'Formulaire fermé',
    honeypot: 'Ne remplissez pas ce champ',
    required: 'obligatoire',
    name: 'Nom',
    namePlaceholder: 'Salma Bennani',
    phone: 'Téléphone',
    email: 'E-mail',
    emailPlaceholder: 'salma@exemple.ma',
    city: 'Ville',
    cityPlaceholder: 'Casablanca',
    spaceType: 'Type d’espace',
    budget: 'Budget estimé',
    startDate: 'Date de début idéale',
    message: 'Votre projet',
    messagePlaceholder:
      'Ex. : un mur de 4 × 3 m dans un café à Rabat, ambiance végétale, travaux possibles le soir, ouverture prévue avant l’été…',
    consent:
      'En envoyant ce formulaire, vous acceptez que vos coordonnées soient utilisées uniquement pour répondre à votre demande de devis.',
    submit: 'Envoyer la demande',
    requiredNote: 'Seul le téléphone est obligatoire',
    /** Champ caché ajouté à la demande : langue de la page d'envoi. Vide = non envoyé. */
    languageField: '',
  },

  legal: {
    title: 'Mentions légales',
    description: 'Mentions légales et informations sur le traitement des données du site Muralistique.',
    eyebrow: 'Informations légales',
    rows: {
      companyName: 'Éditeur du site',
      legalForm: 'Forme juridique',
      address: 'Adresse',
      siret: 'SIRET',
      vatNumber: 'N° de TVA intracommunautaire',
      publicationDirector: 'Directeur de la publication',
      hostingProvider: 'Hébergeur',
      contact: 'Contact',
    },
    missing: (n: number) => `${n} information${n > 1 ? 's' : ''} à compléter.`,
    missingFill: 'Renseignez l’objet',
    missingIn: 'dans',
    missingEnd:
      '. Tant que cette page est incomplète, elle est exclue de l’indexation par les moteurs de recherche.',
    toComplete: 'À compléter',
    dataTitle: 'Données personnelles',
    dataText1:
      'Les informations transmises via le formulaire de devis sont utilisées uniquement pour répondre à votre demande. Elles ne sont ni revendues ni utilisées à des fins publicitaires.',
    dataText2:
      'Conformément au Règlement général sur la protection des données, vous disposez d’un droit d’accès, de rectification et de suppression des données vous concernant. Pour l’exercer, écrivez à',
    ipTitle: 'Propriété intellectuelle',
    ipText:
      'Les fresques, croquis et photographies présentés sur ce site restent la propriété de leur auteur. Toute reproduction sans autorisation écrite est interdite.',
    cookiesTitle: 'Cookies',
    cookiesText:
      'Ce site ne dépose aucun cookie de mesure d’audience ni de publicité. Les polices de caractères sont hébergées avec le site : aucune requête n’est envoyée à un service tiers lors de la consultation des pages.',
  },

  notFound: {
    title: 'Page introuvable',
    description: 'Cette page n’existe pas ou a été déplacée.',
    eyebrow: 'Erreur 404',
    heading: 'Ce mur-là n’existe pas.',
    lead: 'La page que vous cherchez a été déplacée ou n’a jamais existé. Voici par où reprendre.',
    home: 'Retour à l’accueil',
  },
};

/** Forme commune aux deux langues : en.ts doit la respecter à l'identique. */
export type UI = typeof fr;
