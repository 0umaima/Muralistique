/**
 * Comparateur avant / après : glisser au pointeur + curseur natif (clavier).
 * Les deux restent synchronisés sur la variable CSS `--ba-pos`.
 *
 * Le suivi du glissement est branché sur `window` (et non sur le cadre) :
 * le pointeur peut sortir du cadre, être capturé par un autre élément ou
 * relâché en dehors de la page, le geste continue et se termine proprement.
 */
export function initBeforeAfter() {
  document.querySelectorAll<HTMLElement>('[data-ba]').forEach((frame) => {
    if (frame.dataset.baReady) return;
    frame.dataset.baReady = '1';

    const range =
      frame.parentElement?.querySelector<HTMLInputElement>('[data-ba-range]') ?? null;

    const set = (percent: number) => {
      const clamped = Math.max(2, Math.min(98, percent));
      frame.style.setProperty('--ba-pos', `${clamped}%`);
      if (range && Number(range.value) !== Math.round(clamped)) range.value = String(Math.round(clamped));
    };

    const fromClientX = (clientX: number) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width) return;
      set(((clientX - rect.left) / rect.width) * 100);
    };

    let dragging = false;

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      event.preventDefault();
      fromClientX(event.clientX);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      frame.removeAttribute('data-dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    // Sans cela, appuyer sur une image démarre le glisser-déposer natif du
    // navigateur, qui envoie aussitôt un `pointercancel` et interrompt le geste.
    frame.addEventListener('dragstart', (event) => event.preventDefault());

    frame.addEventListener('pointerdown', (event) => {
      // Bouton principal uniquement ; le clavier passe par le champ `range`.
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      event.preventDefault();
      dragging = true;
      frame.setAttribute('data-dragging', '');
      fromClientX(event.clientX);
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });

    range?.addEventListener('input', () => set(Number(range.value)));
    set(range ? Number(range.value) : 50);
  });
}
