/**
 * Effets liés au défilement (page Studio) :
 *  – `[data-scrub]`      : phrase révélée mot à mot pendant la traversée ;
 *  – `[data-parallax]`   : image qui glisse plus lentement que la page ;
 *  – `[data-hscroll]`    : défilé horizontal épinglé, piloté par le
 *                          défilement vertical (grands écrans uniquement).
 *
 * Principes, comme reveal.ts :
 *  – `prefers-reduced-motion` désactive tout, le contenu reste lisible ;
 *  – sans JavaScript, la phrase est entière et le défilé se parcourt au
 *    doigt ou à la molette (voir les styles de repli de la page) ;
 *  – un seul écouteur de défilement, calé sur requestAnimationFrame.
 */

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

type Updater = () => void;

function headerOffset() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  return header ? Math.round(header.getBoundingClientRect().height) : 0;
}

/** Mots allumés un à un, de l'entrée de la phrase au milieu de l'écran. */
function scrub(el: HTMLElement): Updater {
  const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'));
  el.classList.add('is-scrubbing');
  let lit = -1;
  return () => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 quand le haut de la phrase touche 85 % de l'écran, 1 quand son bas atteint 45 %.
    const start = vh * 0.85;
    const end = vh * 0.45;
    const progress = clamp((start - rect.top) / (start - end + rect.height));
    const count = Math.round(progress * words.length);
    if (count === lit) return;
    lit = count;
    words.forEach((word, i) => word.classList.toggle('is-lit', i < count));
  };
}

/** Décalage vertical proportionnel à la distance au centre de l'écran. */
function parallax(el: HTMLElement): Updater {
  const speed = parseFloat(el.dataset.parallax || '0.1') || 0.1;
  const frame = el.parentElement ?? el;
  return () => {
    const rect = frame.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.15)`;
  };
}

/**
 * Défilé horizontal : la section prend la hauteur nécessaire, son contenu
 * reste épinglé sous l'en-tête et la piste glisse vers la gauche au rythme
 * du défilement vertical.
 */
function hscroll(section: HTMLElement): { update: Updater; measure: Updater } | null {
  const sticky = section.querySelector<HTMLElement>('[data-hscroll-sticky]');
  const track = section.querySelector<HTMLElement>('[data-hscroll-track]');
  if (!sticky || !track) return null;

  const wide = window.matchMedia('(min-width: 901px)');
  let distance = 0;
  let active = false;

  const measure = () => {
    active = wide.matches;
    section.classList.toggle('is-pinned', active);
    if (!active) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }
    distance = Math.max(0, track.scrollWidth - sticky.clientWidth);
    section.style.height = `${sticky.offsetHeight + distance}px`;
  };

  const update = () => {
    if (!active) return;
    const progress = distance ? clamp((headerOffset() - section.getBoundingClientRect().top) / distance) : 0;
    track.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
  };

  // Navigation au clavier : amener la carte ciblée à l'écran en faisant
  // défiler la page, jamais le conteneur épinglé lui-même.
  track.addEventListener('focusin', (event) => {
    if (!active) return;
    sticky.scrollLeft = 0;
    const item = (event.target as HTMLElement).closest<HTMLElement>('[data-hscroll-item]');
    if (!item) return;
    // Carte alignée sur la gouttière de gauche (le retrait de la piste).
    const inset = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const progress = distance ? clamp((item.offsetLeft - inset) / distance) : 0;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top: sectionTop + progress * distance, behavior: 'auto' });
  });

  wide.addEventListener?.('change', () => {
    measure();
    update();
  });

  return { update, measure };
}

export function initScrollFx() {
  if (REDUCED) return;

  const updaters: Updater[] = [];
  const measures: Updater[] = [];

  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => updaters.push(scrub(el)));
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => updaters.push(parallax(el)));
  document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((el) => {
    const fx = hscroll(el);
    if (!fx) return;
    measures.push(fx.measure);
    updaters.push(fx.update);
  });

  if (!updaters.length) return;

  const run = () => updaters.forEach((update) => update());
  const remeasure = () => {
    measures.forEach((measure) => measure());
    run();
  };

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        run();
      });
    },
    { passive: true }
  );

  let resizeTimer: number | undefined;
  window.addEventListener(
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(remeasure, 120);
    },
    { passive: true }
  );

  // Les largeurs de la piste dépendent des images et des polices.
  window.addEventListener('load', remeasure, { once: true });
  document.fonts?.ready.then(remeasure).catch(() => {});
  remeasure();
}
