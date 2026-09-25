/**
 * Carrousel de secteurs (accueil).
 *
 *  – le rail est un conteneur défilant natif (doigt, pavé tactile, clavier) ;
 *    ce script ajoute les flèches, le glisser à la souris, le compteur, la
 *    barre de progression et deux effets liés au défilement :
 *      · parallaxe horizontale de l'image dans chaque carte ;
 *      · légère inclinaison du rail proportionnelle à la vitesse ;
 *  – `prefers-reduced-motion` coupe les effets, pas la navigation ;
 *  – sans JavaScript, le rail reste défilable et les flèches sont masquées.
 */

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function setup(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]');
  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  if (!viewport || !track) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-item]'));
  const layers = items.map((item) => item.querySelector<HTMLElement>('[data-carousel-parallax]'));
  const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const bar = root.querySelector<HTMLElement>('[data-carousel-bar]');
  const current = root.querySelector<HTMLElement>('[data-carousel-current]');

  /** Distance entre deux cartes consécutives (largeur + écart). */
  const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : viewport.clientWidth);
  const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

  // ——— Compteur, flèches, progression, parallaxe ———
  const render = () => {
    const max = maxScroll();
    const left = viewport.scrollLeft;
    const progress = max ? left / max : 0;

    if (bar) {
      const thumb = clamp(viewport.clientWidth / viewport.scrollWidth, 0.08, 1);
      bar.style.setProperty('--thumb', `${(thumb * 100).toFixed(2)}%`);
      bar.style.setProperty('--shift', `${((progress * (1 - thumb)) / thumb) * 100}%`);
    }
    if (current) {
      const index = left >= max - 2 ? items.length - 1 : Math.round(left / step());
      current.textContent = String(clamp(index, 0, items.length - 1) + 1).padStart(2, '0');
    }
    if (prev) prev.disabled = left <= 2;
    if (next) next.disabled = left >= max - 2;

    if (REDUCED) return;
    const vw = window.innerWidth;
    items.forEach((item, i) => {
      const layer = layers[i];
      if (!layer) return;
      const rect = item.getBoundingClientRect();
      if (rect.right < -vw * 0.2 || rect.left > vw * 1.2) return;
      const offset = clamp((rect.left + rect.width / 2 - vw / 2) / vw, -1, 1);
      layer.style.setProperty('--px', `${(offset * -7).toFixed(2)}%`);
    });
  };

  // ——— Inclinaison selon la vitesse, qui revient doucement à zéro ———
  let lastLeft = viewport.scrollLeft;
  let skew = 0;
  let skewFrame = 0;
  const settle = () => {
    skew *= 0.86;
    if (Math.abs(skew) < 0.05) skew = 0;
    track.style.transform = skew ? `skewX(${skew.toFixed(2)}deg)` : '';
    skewFrame = skew ? requestAnimationFrame(settle) : 0;
  };

  let ticking = false;
  viewport.addEventListener(
    'scroll',
    () => {
      if (!REDUCED) {
        const velocity = viewport.scrollLeft - lastLeft;
        lastLeft = viewport.scrollLeft;
        skew = clamp(skew + velocity * -0.06, -4, 4);
        if (!skewFrame) skewFrame = requestAnimationFrame(settle);
      }
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        render();
      });
    },
    { passive: true }
  );

  // ——— Flèches ———
  const go = (direction: 1 | -1) => {
    const target = clamp(Math.round(viewport.scrollLeft / step()) + direction, 0, items.length - 1);
    viewport.scrollTo({ left: target * step(), behavior: REDUCED ? 'auto' : 'smooth' });
  };
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));

  // ——— Glisser à la souris (le tactile défile déjà nativement) ———
  let pointer: number | null = null;
  let startX = 0;
  let startLeft = 0;
  let dragged = false;

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    pointer = event.pointerId;
    startX = event.clientX;
    startLeft = viewport.scrollLeft;
    dragged = false;
  });
  window.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointer) return;
    const dx = event.clientX - startX;
    if (!dragged && Math.abs(dx) > 6) {
      dragged = true;
      viewport.classList.add('is-dragging');
    }
    if (dragged) viewport.scrollLeft = startLeft - dx;
  });
  const release = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    if (!dragged) return;
    viewport.classList.remove('is-dragging');
    const target = clamp(Math.round(viewport.scrollLeft / step()), 0, items.length - 1);
    viewport.scrollTo({ left: target * step(), behavior: REDUCED ? 'auto' : 'smooth' });
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  // Un glisser ne doit jamais ouvrir la carte sous le curseur.
  viewport.addEventListener(
    'click',
    (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    },
    true
  );
  viewport.addEventListener('dragstart', (event) => event.preventDefault());

  window.addEventListener('resize', render, { passive: true });
  window.addEventListener('load', render, { once: true });
  render();
}

export function initCarousel() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(setup);
}
