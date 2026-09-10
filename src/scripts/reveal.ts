/**
 * Apparitions au défilement, compteurs de statistiques et tracés SVG.
 *
 * Principes :
 *  – une seule fois par chargement de page ;
 *  – `prefers-reduced-motion` désactive tout, le contenu reste visible ;
 *  – si IntersectionObserver manque ou n'émet jamais, un filet de sécurité
 *    révèle tout au bout de 3 s : rien ne peut rester invisible.
 */

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealNow(el: HTMLElement) {
  if (el.dataset.revealed) return;
  el.dataset.revealed = '1';
  const delay = Math.min(400, parseInt(el.dataset.revealDelay || '0', 10) || 0);
  el.style.setProperty('--reveal-delay', `${delay}ms`);
  el.classList.add('is-revealed');
}

/** Compte jusqu'à la valeur cible en conservant préfixe et suffixe. */
function runCounter(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const raw = el.dataset.count ?? el.textContent ?? '';
  const match = raw.match(/^(\D*)(\d[\d\s.,]*)(.*)$/s);
  if (!match) return;
  const [, prefix, digits, suffix] = match;
  const target = parseFloat(digits.replace(/[\s,]/g, ''));
  if (!Number.isFinite(target)) return;

  if (REDUCED) {
    el.textContent = raw;
    return;
  }

  const duration = 1400;
  const start = performance.now();
  const format = (n: number) => `${prefix}${Math.round(n).toLocaleString('fr-FR')}${suffix}`;

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutExpo : démarrage rapide, arrivée douce sur la valeur exacte
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = format(target * eased);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = raw;
  };
  el.textContent = format(0);
  requestAnimationFrame(tick);
}

/** Anime le tracé des dessins au trait (`data-draw`). */
function drawPaths(wrapper: HTMLElement) {
  if (wrapper.dataset.drawn) return;
  wrapper.dataset.drawn = '1';
  const paths = Array.from(wrapper.querySelectorAll<SVGPathElement>('path'));
  paths.forEach((path, i) => {
    if (REDUCED) {
      path.style.strokeDashoffset = '0';
      return;
    }
    path.style.transition = `stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1) ${i * 90}ms`;
    path.style.strokeDashoffset = '0';
  });
}

export function initReveal() {
  const reveals = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-rotate]')
  );
  const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  const draws = Array.from(document.querySelectorAll<HTMLElement>('[data-draw]'));

  // Préparer les tracés (longueur du chemin -> pointillé complet).
  draws.forEach((wrapper) => {
    wrapper.querySelectorAll<SVGPathElement>('path').forEach((path) => {
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = REDUCED ? '0' : String(length);
      } catch {
        /* navigateur sans getTotalLength : on laisse le trait visible */
      }
    });
  });

  if (REDUCED) {
    reveals.forEach(revealNow);
    counters.forEach(runCounter);
    draws.forEach(drawPaths);
    return;
  }

  const hasIO = typeof IntersectionObserver === 'function';
  let fired = false;

  if (hasIO) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          fired = true;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute('data-count')) runCounter(el);
          else if (el.hasAttribute('data-draw')) drawPaths(el);
          else revealNow(el);
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    [...reveals, ...counters, ...draws].forEach((el) => observer.observe(el));
  }

  // Filet de sécurité : rien ne reste masqué si l'observateur n'émet jamais.
  window.setTimeout(() => {
    if (hasIO && fired) return;
    reveals.forEach(revealNow);
    counters.forEach(runCounter);
    draws.forEach(drawPaths);
  }, 3000);
}
