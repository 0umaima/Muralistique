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
import { localize } from '../i18n/localize.mjs';

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
    hours: '7j/7 · 9 h à 19 h',

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

    /**
     * Villes d'intervention : affichées dans le pied de page de chaque page et
     * transmises à Google (données structurées de l'accueil). Ajoutez ou
     * retirez des villes ici.
     */
    serviceAreas: ['Casablanca', 'Rabat', 'Marrakech', 'Mohammedia', 'Témara', 'Tanger', 'Salé', 'Kénitra'],
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

  /**
   * VERSION ANGLAISE (/en) — traduction des textes ci-dessus. Un champ
   * absent de ce bloc garde sa valeur française sur les pages anglaises.
   */
  en: {
    locale: 'en-US',
    lang: 'en',
    tagline: 'Custom hand-painted murals for businesses and private spaces.',
    contact: {
      hours: '7 days a week · 9 am to 7 pm',
      whatsappMessage: 'Hello Amine, I would like a quote for a mural.',
      /** Mêmes villes, dans le même ordre, avec leur nom anglais. */
      serviceAreas: ['Casablanca', 'Rabat', 'Marrakech', 'Mohammedia', 'Temara', 'Tangier', 'Salé', 'Kenitra'],
    },
    form: {
      disabledMessage:
        'The form is temporarily closed. Email us or message us on WhatsApp directly: we reply within 48 hours.',
    },
  },
};

/** Réglages dans la langue demandée : textes du bloc `en` pour l'anglais. */
export function siteFor(lang = 'fr') {
  return localize(site, lang);
}

/**
 * Lien WhatsApp prêt à l'emploi (message pré-rempli dans la langue de la
 * page), ou `null` si le numéro n'est pas configuré.
 */
export function whatsappUrl(lang = 'fr') {
  const raw = (site.contact.whatsappNumber || '').replace(/[^\d]/g, '');
  // Un numéro international plausible fait au moins 8 chiffres.
  if (raw.length < 8) return null;
  return `https://wa.me/${raw}?text=${encodeURIComponent(siteFor(lang).contact.whatsappMessage)}`;
}

/** `true` si le numéro de téléphone affiché est encore l'espace réservé. */
export function phoneIsPlaceholder() {
  return /0 00 00 00 00|00000000/.test(site.contact.phoneHref || '');
}
