/**
 * Filtres par secteur + « voir plus » sur la page Réalisations.
 *
 * – le filtre parcourt TOUT le jeu de données, pas seulement les tuiles déjà
 *   affichées, et remet la limite d'affichage à la première page ;
 *   – le compteur, l'état vide et le bouton « voir plus » suivent ;
 * – la grille compte deux colonnes : si le nombre de projets affichés est
 *   impair, le premier passe en pleine largeur (`.is-wide`), sans trou ;
 * – à chaque filtre, les tuiles se redécouvrent en cascade ;
 * – sans JavaScript, ce script n'est jamais exécuté et toutes les tuiles
 *   (donc tous les liens) restent visibles.
 */
import { revealNow } from './reveal';

export function initProjectFilters() {
  const grid = document.querySelector<HTMLElement>('[data-project-grid]');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-project]'));
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const countEl = document.querySelector<HTMLElement>('[data-project-count]');
  const emptyEl = document.querySelector<HTMLElement>('[data-project-empty]');
  const moreEl = document.querySelector<HTMLElement>('[data-project-more]');
  const moreButton = document.querySelector<HTMLButtonElement>('[data-project-more-button]');
  const remainingEl = document.querySelector<HTMLElement>('[data-project-remaining]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-filter-reset]');

  const pageSize = Math.max(2, parseInt(grid.dataset.pageSize || '8', 10));
  grid.dataset.jsFlow = '';

  let filter = 'tous';
  let visibleLimit = pageSize;

  const matching = () => cards.filter((card) => filter === 'tous' || card.dataset.sector === filter);

  const plural = (n: number) => `${n} projet${n > 1 ? 's' : ''}`;

  // Tuiles remises à zéro sous la ligne de flottaison : elles s'ouvriront
  // quand elles entreront à l'écran, comme au premier chargement.
  const later =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              later?.unobserve(entry.target);
              revealNow(entry.target as HTMLElement);
            }),
          { threshold: 0.1 }
        )
      : null;

  /** Rejoue l'ouverture de l'image d'une tuile, avec un décalage donné. */
  const replay = (card: HTMLElement, delay: number) => {
    const frame = card.querySelector<HTMLElement>('[data-reveal-clip]');
    if (!frame) return;
    later?.unobserve(frame);
    frame.classList.remove('is-revealed');
    delete frame.dataset.revealed;
    void frame.offsetWidth; // repart de l'état fermé
    frame.dataset.revealDelay = String(delay);
    if (later && frame.getBoundingClientRect().top > window.innerHeight) later.observe(frame);
    else revealNow(frame);
  };

  const render = ({ animate = [] as HTMLElement[] } = {}) => {
    const matched = matching();
    // Une tuile pleine largeur en tête quand le total est impair : la page
    // affiche alors une tuile de plus, pour garder des rangées complètes.
    const wide = matched.length % 2 === 1;
    const shown = matched.slice(0, visibleLimit + (wide ? 1 : 0));
    const shownSet = new Set(shown);

    cards.forEach((card) => {
      card.hidden = !shownSet.has(card);
      card.classList.toggle('is-wide', wide && card === shown[0]);
    });

    animate
      .filter((card) => shownSet.has(card))
      .forEach((card, i) => replay(card, Math.min(i, 5) * 80));

    if (countEl) countEl.textContent = plural(matched.length);
    if (emptyEl) emptyEl.hidden = matched.length > 0;

    const remaining = matched.length - shown.length;
    if (moreEl) moreEl.hidden = remaining <= 0;
    if (remainingEl) {
      remainingEl.textContent =
        remaining > 0 ? `${shown.length} sur ${matched.length} projets affichés` : '';
    }
  };

  const setFilter = (next: string, { initial = false } = {}) => {
    filter = next;
    // Un changement de filtre repart toujours de la première page.
    visibleLimit = pageSize;
    buttons.forEach((button) => {
      const active = button.dataset.filter === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render({ animate: initial ? [] : cards });

    // Garde l'URL partageable sans recharger la page.
    const url = new URL(window.location.href);
    if (next === 'tous') url.searchParams.delete('secteur');
    else url.searchParams.set('secteur', next);
    window.history.replaceState({}, '', url);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.filter === filter) return;
      setFilter(button.dataset.filter || 'tous');
    });
  });

  resetButton?.addEventListener('click', () => setFilter('tous'));

  moreButton?.addEventListener('click', () => {
    const before = cards.filter((card) => !card.hidden);
    visibleLimit += pageSize;
    const fresh = matching().filter((card) => !before.includes(card));
    render({ animate: fresh });
    // Le focus part sur la première tuile nouvellement révélée.
    fresh.find((card) => !card.hidden)?.querySelector<HTMLElement>('a')?.focus();
  });

  // Au survol, l'image suit légèrement le pointeur (souris uniquement).
  const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (fine && !reduced) {
    grid.addEventListener('pointermove', (event) => {
      const link = (event.target as HTMLElement).closest<HTMLElement>('[data-tile]');
      if (!link) return;
      const rect = link.getBoundingClientRect();
      link.style.setProperty('--mx', (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
      link.style.setProperty('--my', (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
    });
  }

  // Filtre initial issu de l'URL (?secteur=sante), pour des liens partageables.
  const requested = new URLSearchParams(window.location.search).get('secteur');
  if (requested && buttons.some((b) => b.dataset.filter === requested)) setFilter(requested, { initial: true });
  else render();
}
