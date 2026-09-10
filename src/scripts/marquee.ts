/** Bouton pause / reprise du carrousel de secteurs. */
export function initMarquee() {
  const track = document.querySelector<HTMLElement>('[data-marquee]');
  const button = document.querySelector<HTMLButtonElement>('[data-marquee-toggle]');
  if (!track || !button) return;

  const label = button.querySelector<HTMLElement>('[data-marquee-label]');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const setPaused = (paused: boolean) => {
    track.dataset.paused = String(paused);
    button.setAttribute('aria-pressed', String(paused));
    if (label) label.textContent = paused ? 'Reprendre le défilement' : 'Mettre en pause';
  };

  if (reduced) {
    setPaused(true);
    button.hidden = true;
    return;
  }

  setPaused(false);
  button.addEventListener('click', () => setPaused(track.dataset.paused !== 'true'));
}
