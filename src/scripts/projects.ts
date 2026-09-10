/**
 * Filtres par secteur + « voir plus » sur la page Réalisations.
 *
 * – le filtre parcourt TOUT le jeu de données, pas seulement les cartes déjà
 *   affichées, et remet la limite d'affichage à la première page ;
 *   – le compteur, l'état vide et le bouton « voir plus » suivent ;
 * – sans JavaScript, ce script n'est jamais exécuté et toutes les cartes (donc
 *   tous les liens) restent visibles.
 */
const COLUMNS_WITH_OFFSET = 3;

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

  const pageSize = Math.max(1, parseInt(grid.dataset.pageSize || '6', 10));
  grid.dataset.jsFlow = '';

  let filter = 'tous';
  let visibleLimit = pageSize;

  const matching = () => cards.filter((card) => filter === 'tous' || card.dataset.sector === filter);

  const plural = (n: number) => `${n} projet${n > 1 ? 's' : ''}`;

  const render = () => {
    const matched = matching();
    const shown = matched.slice(0, visibleLimit);
    const shownSet = new Set(shown);

    cards.forEach((card) => {
      card.hidden = !shownSet.has(card);
      card.classList.remove('is-offset');
    });

    // Rétablit le décalage vertical de la maquette sur les cartes visibles.
    shown
      .filter((card) => !card.classList.contains('card--wide'))
      .forEach((card, index) => {
        if (index % COLUMNS_WITH_OFFSET === 1) card.classList.add('is-offset');
      });

    if (countEl) countEl.textContent = plural(matched.length);
    if (emptyEl) emptyEl.hidden = matched.length > 0;

    const remaining = matched.length - shown.length;
    if (moreEl) moreEl.hidden = remaining <= 0;
    if (remainingEl) {
      remainingEl.textContent =
        remaining > 0 ? `${shown.length} sur ${matched.length} projets affichés` : '';
    }
  };

  const setFilter = (next: string, { focusGrid = false } = {}) => {
    filter = next;
    // Un changement de filtre repart toujours de la première page.
    visibleLimit = pageSize;
    buttons.forEach((button) => {
      const active = button.dataset.filter === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();

    // Garde l'URL partageable sans recharger la page.
    const url = new URL(window.location.href);
    if (next === 'tous') url.searchParams.delete('secteur');
    else url.searchParams.set('secteur', next);
    window.history.replaceState({}, '', url);

    if (focusGrid) grid.querySelector<HTMLElement>('[data-project]:not([hidden]) a')?.focus();
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter || 'tous'));
  });

  resetButton?.addEventListener('click', () => setFilter('tous'));

  moreButton?.addEventListener('click', () => {
    const before = matching().slice(0, visibleLimit).length;
    visibleLimit += pageSize;
    render();
    // Le focus part sur la première carte nouvellement révélée.
    const revealed = matching().slice(0, visibleLimit);
    revealed[before]?.querySelector<HTMLElement>('a')?.focus();
  });

  // Filtre initial issu de l'URL (?secteur=sante), pour des liens partageables.
  const requested = new URLSearchParams(window.location.search).get('secteur');
  if (requested && buttons.some((b) => b.dataset.filter === requested)) setFilter(requested);
  else render();
}
