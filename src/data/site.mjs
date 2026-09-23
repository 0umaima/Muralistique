/**
 * ============================================================================
 *  RÉGLAGES DU SITE — c'est ICI que vous modifiez vos coordonnées.
 *  SITE SETTINGS — this is the ONE file to edit for contact details.
 * ============================================================================
 *  Chaque valeur marquée « À REMPLACER » est un espace réservé : elle ne
 *  correspond à aucune donnée réelle et doit être remplacée avant la mise en
 *  ligne. Rien d'autre dans le code n'a besoin d'être touché.
 * ============================================================================
 */

export const site = {
  name: 'Muralistique',
  /** Baseline affichée dans le pied de page et les métadonnées. */
  tagline: 'Fresques murales sur mesure pour les espaces professionnels et privés.',

  /**
   * À REMPLACER — domaine définitif du site (sans slash final).
   * Utilisé pour le sitemap, robots.txt et les URL canoniques.
   */
  url: 'https://www.muralistique.com',

  /** Langue du document. */
  locale: 'fr-FR',
  lang: 'fr',

  contact: {
    /** À REMPLACER — adresse e-mail réelle de l'atelier. */
    email: 'aminehoumam0@gmail.com',

    /**
     * À REMPLACER — numéro de téléphone affiché (format lisible).
     * Laissez la chaîne vide pour masquer complètement le bloc téléphone.
     */
    phoneDisplay: '+212 6 81 93 2646 ',
    /** À REMPLACER — même numéro au format composable (tel:). */
    phoneHref: '+212681932646',

    /** Horaires affichés à côté du numéro. À REMPLACER si besoin. */
    hours: '7j/7 · 9 h – 19 h',

    /**
     * WhatsApp — À REMPLACER par le vrai numéro, au format international
     * SANS "+", sans espaces ni tirets (ex. '33612345678' ou '212612345678').
     *
     * IMPORTANT : tant que cette valeur reste vide ou égale à un des
     * exemples ci-dessous, le site affiche un avertissement visible à la
     * place du bouton WhatsApp (voir src/components/WhatsAppLink.astro).
     */
    whatsappNumber: '+212681932646',
    /** Message pré-rempli à l'ouverture de WhatsApp. */
    whatsappMessage: 'Bonjour Amine, je souhaite un devis pour une fresque murale.',

    /** Ville / zone d'intervention affichée. À REMPLACER. */
    city: '',
  },

  social: {
    /** À REMPLACER — URL complète du profil, ou chaîne vide pour masquer le lien. */
    instagram: 'https://www.instagram.com/muralistique/',
    facebook: '',
    linkedin: '',
    youtube: '',
  },

  form: {
    /** Point de terminaison Basin fourni pour ce projet. */
    endpoint: 'https://usebasin.com/f/ba3ae17d310d',

    /**
     * Interrupteur manuel. Passez à `false` pour fermer le formulaire
     * (quota atteint, congés, maintenance…) : le formulaire est alors
     * remplacé par le message ci-dessous + les contacts directs.
     */
    formEnabled: true,
    /** Message affiché quand formEnabled = false. */
    disabledMessage:
      'Le formulaire est momentanément fermé. Écrivez-nous directement par e-mail ou sur WhatsApp, nous répondons sous 48 h.',

    /**
     * Limites appliquées DANS LE NAVIGATEUR avant l'envoi.
     * Elles évitent les envois trop lourds ; elles ne remplacent PAS et ne
     * garantissent PAS les limites de stockage du compte Basin, qui restent
     * définies côté Basin (voir README).
     */
    uploads: {
      maxFiles: 2,
      maxFileBytes: 750 * 1024, // 750 Ko par fichier
      maxTotalBytes: 1536 * 1024, // 1,5 Mo au total
      accept: ['image/jpeg', 'image/png', 'image/webp'],
      acceptLabel: 'JPEG, PNG ou WebP',
    },
  },

  /** À REMPLACER — mentions légales (voir src/pages/mentions-legales.astro). */
  legal: {
    companyName: '',
    legalForm: '',
    address: '',
    siret: '',
    vatNumber: '',
    publicationDirector: '',
    hostingProvider: '',
  },
};

/** Lien WhatsApp prêt à l'emploi, ou `null` si le numéro n'est pas configuré. */
export function whatsappUrl() {
  const raw = (site.contact.whatsappNumber || '').replace(/[^\d]/g, '');
  // Un numéro international plausible fait au moins 8 chiffres.
  if (raw.length < 8) return null;
  return `https://wa.me/${raw}?text=${encodeURIComponent(site.contact.whatsappMessage)}`;
}

/** `true` si le numéro de téléphone affiché est encore l'espace réservé. */
export function phoneIsPlaceholder() {
  return /0 00 00 00 00|00000000/.test(site.contact.phoneHref || '');
}
