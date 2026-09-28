/**
 * En-tête : bascule de thème (ivoire / encre) selon la section qui passe
 * dessous, navigation mobile accessible et sélecteur de langue.
 *
 * Les sections déclarent leur thème avec `data-section-theme="ink|ivory"`.
 * Rien n'est deviné : c'est toujours une valeur explicite, ce qui évite les
 * clignotements aux frontières.
 */

const MOBILE_BREAKPOINT = 900;

function headerHeight(header: HTMLElement) {
  return Math.round(header.getBoundingClientRect().height) || 82;
}

function initThemeSync(header: HTMLElement) {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('[data-section-theme]')
  );
  if (!sections.length) return;

  const initial = header.dataset.theme === 'ivory' ? 'ivory' : 'ink';
  let applied = initial;

  const apply = (theme: string) => {
    // N'écrit que si la valeur change : pas de reflow, pas de scintillement.
    if (theme === applied) return;
    applied = theme;
    header.dataset.theme = theme;
  };

  /** Section dont la bande traverse la ligne située juste sous l'en-tête. */
  const resolveFromGeometry = () => {
    const line = headerHeight(header) + 1;
    let current = initial;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) {
        current = section.dataset.sectionTheme === 'ink' ? 'ink' : 'ivory';
      }
    }
    // Au-dessus de la première section (rebond de défilement), garder l'état initial.
    if (sections[0] && sections[0].getBoundingClientRect().top > line) current = initial;
    apply(current);
  };

  let observer: IntersectionObserver | null = null;

  const build = () => {
    observer?.disconnect();
    if (typeof IntersectionObserver !== 'function') return;
    const h = headerHeight(header);
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const bottom = Math.max(0, vh - h - 1);
    observer = new IntersectionObserver(
      () => resolveFromGeometry(),
      { rootMargin: `-${h}px 0px -${bottom}px 0px`, threshold: [0, 1] }
    );
    sections.forEach((s) => observer!.observe(s));
  };

  build();
  resolveFromGeometry();

  // Filet de sécurité : le défilement recalcule aussi, au rythme de l'écran.
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      resolveFromGeometry();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  let resizeTimer: number | undefined;
  window.addEventListener(
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        resolveFromGeometry();
      }, 150);
    },
    { passive: true }
  );
}

function initMobileNav(header: HTMLElement) {
  const toggle = header.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = header.querySelector<HTMLElement>('[data-nav-panel]');
  if (!toggle || !panel) return;

  const label = toggle.querySelector<HTMLElement>('.visually-hidden');
  // Libellés dans la langue de la page, fournis par Header.astro.
  const openLabel = toggle.dataset.labelOpen || 'Ouvrir le menu';
  const closeLabel = toggle.dataset.labelClose || 'Fermer le menu';
  let lastFocused: HTMLElement | null = null;

  const focusables = () =>
    Array.from(
      panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    ).filter((el) => el.offsetParent !== null);

  const open = () => {
    lastFocused = document.activeElement as HTMLElement;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = closeLabel;
    document.body.style.overflow = 'hidden';
    focusables()[0]?.focus();
  };

  const close = (restoreFocus = true) => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = openLabel;
    document.body.style.overflow = '';
    if (restoreFocus) (lastFocused ?? toggle).focus();
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));

  // Un lien cliqué referme le panneau (les ancres restent utilisables).
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) close(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    // Piège de focus : le panneau et son bouton forment une boucle fermée.
    const items = [toggle, ...focusables()];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && isOpen()) close(false);
    },
    { passive: true }
  );
}

/**
 * Sélecteur de langue : le lien vers l'autre langue garde le filtre et
 * l'ancre de la page en cours (/realisations?secteur=sante →
 * /en/projects?secteur=sante), lus au moment du clic puisque les filtres
 * modifient l'adresse sans recharger. Au clic, le curseur glisse vers la
 * nouvelle langue pendant que la page se charge.
 */
function initLangSwitch(header: HTMLElement) {
  const nav = header.querySelector<HTMLElement>('[data-lang-switch]');
  if (!nav) return;
  nav.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((link) => {
    const base = link.getAttribute('href') || '/';
    const sync = () => {
      link.href = base + window.location.search + window.location.hash;
    };
    link.addEventListener('pointerenter', sync);
    link.addEventListener('focus', sync);
    link.addEventListener('click', (event) => {
      sync();
      // Ouverture dans un nouvel onglet : la page courante ne change pas.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      if (link.dataset.langOption) nav.dataset.active = link.dataset.langOption;
    });
  });
  // Retour arrière depuis l'autre langue (page restaurée du cache) : le
  // curseur revient sur la langue de cette page.
  const initial = nav.dataset.active;
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && initial) nav.dataset.active = initial;
  });
}

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  initThemeSync(header);
  initMobileNav(header);
  initLangSwitch(header);
}
