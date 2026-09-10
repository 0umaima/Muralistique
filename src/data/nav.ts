/** Navigation principale. « Processus » pointe vers la section #processus de l'accueil. */
export const mainNav = [
  { label: 'Réalisations', href: '/realisations' },
  { label: 'Secteurs', href: '/#secteurs' },
  { label: 'Processus', href: '/#processus' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/#contact' },
];

export const footerNav = [
  {
    title: 'Secteurs',
    links: [
      { label: 'Hôtellerie', href: '/realisations?secteur=hotellerie' },
      { label: 'Santé', href: '/realisations?secteur=sante' },
      { label: 'Écoles & enfants', href: '/realisations?secteur=ecoles-enfants' },
      { label: 'Restaurants', href: '/realisations?secteur=restaurants-commerces' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'À propos', href: '/studio' },
      { label: 'Processus', href: '/#processus' },
      { label: 'Réalisations', href: '/realisations' },
      { label: 'Presse', href: '/studio#presse' },
    ],
  },
];
