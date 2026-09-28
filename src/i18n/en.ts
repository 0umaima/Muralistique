/**
 * ============================================================================
 *  TEXTES DE L'INTERFACE — ANGLAIS (version /en du site)
 * ============================================================================
 *  Traduction de src/i18n/fr.ts, clé pour clé. Modifiez les textes, jamais
 *  les clés : le type `UI` refuse la construction s'il en manque une.
 * ============================================================================
 */
import type { UI } from './fr';

export const en: UI = {
  meta: {
    homeTitle: 'Custom murals in Casablanca and Morocco',
    skipLink: 'Skip to content',
    country: 'Morocco',
  },

  langSwitch: {
    label: 'Choose language',
    title: 'Lire cette page en français',
  },

  header: {
    home: 'home',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    cta: 'Request a quote',
  },

  footer: {
    areas: (cities: string) => `Working in ${cities} and major cities across Morocco.`,
    contact: 'Contact',
    toReplace: ' (to replace)',
    instagramMissing: 'Instagram: link to add',
    legal: 'Legal notice',
    rights: 'All rights reserved.',
  },

  whatsapp: {
    open: 'Open WhatsApp',
    missingTitle: 'WhatsApp number not set.',
    missingFill: 'Fill in',
    missingIn: 'in',
    missingEnd: 'to enable this button.',
  },

  contactCta: {
    eyebrow: 'Contact',
    quoteTitle: 'Request a quote',
    quoteText: 'Describe your wall, your space and your timeline. Reply within 48 hours, free quote.',
    quoteButton: 'Fill in the form',
    whatsappTitle: 'Message us on WhatsApp',
    whatsappText: 'Send photos of your wall straight away and chat with the studio in real time.',
    portfolioTitle: 'See our projects',
    portfolioText: 'Documented transformations, sector by sector.',
    portfolioButton: 'Open the portfolio',
  },

  beforeAfter: {
    before: 'Before',
    after: 'After',
    control: 'Before / after slider',
    range: 'Slider position between the before and after images',
  },

  projectCount: (n: number) => `${n} project${n === 1 ? '' : 's'}`,
  viewProject: 'View project',
  allProjects: 'All projects',
  seeProjects: 'See our projects',
  letsTalk: 'Let’s talk.',

  home: {
    description:
      'Custom hand-painted murals in Casablanca, Rabat, Marrakech, Tangier and across Morocco for hotels, clinics, schools, restaurants and offices. Free quote within 48 hours.',
    hero: {
      line1: 'Murals painted',
      line2: 'by hand',
      altLeft: '“Build Something” mural painted in a workspace',
      altCenter: 'Brushwork on a mural',
      altRight: 'Face drawn in black line over flat yellow, red and blue',
    },
    stats: 'Key figures',
    transfo: {
      title: 'Before / After',
      aside: 'Drag the slider: the same wall, before and after we painted it.',
    },
    services: {
      title: 'Our services',
      aside: 'On the wall, on canvas, or live in front of your audience.',
    },
    sectors: {
      title: 'Our sectors',
      prev: 'Previous sector',
      next: 'Next sector',
      rail: 'Sectors: scroll horizontally',
      firstProject: 'First project?',
      beFirst: 'Your space could be the first.',
    },
    feedback: {
      word: 'Thanks',
      title: 'Kind words',
      aside: 'What you write under our murals on Instagram, translated from French. Thank you.',
      follow: 'Follow',
      commentBy: 'Instagram comment from ',
      verified: 'verified account',
      liked: 'Liked by the studio',
      author: 'Author',
    },
  },

  projects: {
    title: 'Projects',
    description:
      'Murals painted across Morocco by Muralistique for hotels, clinics, schools, shops, offices and private spaces. Before and after, sector by sector.',
    countLabel: 'projects',
    lead: 'Our walls, up close. Hover over an image to discover the project.',
    filterLabel: 'Filter by sector',
    all: 'All',
    empty: 'No projects in this sector yet.',
    reset: 'See all projects',
    more: 'Show more projects',
  },

  project: {
    description: (title: string, excerpt: string, city: string) =>
      `${title}. ${excerpt} Mural painted by Muralistique${city ? ` in ${city}` : ''}.`,
    breadcrumb: 'Breadcrumb',
    facts: {
      sector: 'Sector',
      city: 'City',
      client: 'Client',
      surface: 'Area',
      duration: 'Duration',
      year: 'Year',
    },
    cta: 'Planning something similar?',
    beforeAfter: 'Before / After',
    dragHint: 'Drag to compare',
    gallery: 'In pictures',
    zoomHint: 'Click to enlarge',
    next: 'Next project',
    lightbox: 'Image viewer',
    close: 'Close',
    prevImage: 'Previous image',
    nextImage: 'Next image',
  },

  studio: {
    title: 'Studio',
    description:
      'Muralistique is the mural studio of Amine Houmam, a muralist based in Morocco: concept, sketches and on-site painting, from the first line to the protective varnish.',
    scroll: 'Scroll',
    kicker: 'Hey, just a quick intro',
    cta: 'Tell us about your project',
    worksTitle: ['A few walls', 'we signed.'],
    seeAll: 'See all the walls',
    galleryTitle: ['The craft,', 'up close'],
    contactEyebrow: 'Let’s work together',
    contactTitle: 'Your wall starts with a conversation.',
  },

  quote: {
    title: 'Request a quote',
    description:
      'Describe your wall, your space and your timeline: Muralistique replies within 48 hours with a free quote, in Casablanca, Rabat, Marrakech, Tangier and across Morocco.',
    eyebrow: 'Free quote',
    heading: 'Tell us about your wall.',
    lead: 'Even the smallest idea is enough to get started. Describe it, and we will shape the project with you from there.',
    asideKicker: 'A question before you start?',
    asideTitle: 'Rather give us a call?',
    asideText: 'Some projects are easier to explain out loud. We are happy to have a first conversation.',
    phoneTodo: 'Phone number to fill in, in',
    email: 'Send an email',
  },

  form: {
    closedTitle: 'Form closed',
    honeypot: 'Do not fill in this field',
    required: 'required',
    name: 'Name',
    namePlaceholder: 'Salma Bennani',
    phone: 'Phone',
    email: 'Email',
    emailPlaceholder: 'salma@example.com',
    city: 'City',
    cityPlaceholder: 'Casablanca',
    spaceType: 'Type of space',
    budget: 'Estimated budget',
    startDate: 'Ideal start date',
    message: 'Your project',
    messagePlaceholder:
      'E.g. a 4 × 3 m wall in a café in Rabat, botanical mood, work possible in the evenings, opening planned before summer…',
    consent:
      'By sending this form, you agree that your contact details will only be used to reply to your quote request.',
    submit: 'Send request',
    requiredNote: 'Only the phone number is required',
    /** Tells the studio that the request came from the English site. */
    languageField: 'English',
  },

  legal: {
    title: 'Legal notice',
    description: 'Legal notice and information on how the Muralistique website handles personal data.',
    eyebrow: 'Legal information',
    rows: {
      companyName: 'Site publisher',
      legalForm: 'Legal form',
      address: 'Address',
      siret: 'SIRET number',
      vatNumber: 'EU VAT number',
      publicationDirector: 'Publication director',
      hostingProvider: 'Hosting provider',
      contact: 'Contact',
    },
    missing: (n: number) => `${n} item${n === 1 ? '' : 's'} to complete.`,
    missingFill: 'Fill in the',
    missingIn: 'object in',
    missingEnd: '. Until this page is complete, it is excluded from search engine indexing.',
    toComplete: 'To be completed',
    dataTitle: 'Personal data',
    dataText1:
      'Information sent through the quote form is used only to reply to your request. It is never sold or used for advertising.',
    dataText2:
      'Under the General Data Protection Regulation (GDPR), you have the right to access, correct and delete your personal data. To exercise it, write to',
    ipTitle: 'Intellectual property',
    ipText:
      'The murals, sketches and photographs shown on this site remain the property of their author. Any reproduction without written permission is prohibited.',
    cookiesTitle: 'Cookies',
    cookiesText:
      'This site sets no analytics or advertising cookies. The fonts are hosted with the site: no request is sent to a third-party service while you browse.',
  },

  notFound: {
    title: 'Page not found',
    description: 'This page does not exist or has been moved.',
    eyebrow: 'Error 404',
    heading: 'This wall doesn’t exist.',
    lead: 'The page you are looking for has moved or never existed. Here is where to pick things up.',
    home: 'Back to home',
  },
};
