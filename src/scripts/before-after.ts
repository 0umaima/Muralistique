/**
 * Comparateur avant / après : glisser au pointeur + curseur natif (clavier).
 * Les deux restent synchronisés sur la variable CSS `--ba-pos`.
 *
 * Le suivi du glissement est branché sur `window` (et non sur le cadre) :
 * le pointeur peut sortir du cadre, être capturé par un autre élément ou
 * relâché en dehors de la page, le geste continue et se termine proprement.
 *
 * Fluidité sur tous les téléphones :
 *  – la position du cadre est mesurée une fois au début du geste, jamais
 *    pendant (pas de recalcul de mise en page à chaque mouvement) ;
 *  – les mouvements sont regroupés : au plus une mise à jour par image
 *    affichée (requestAnimationFrame), quel que soit le nombre d'événements
 *    envoyés par l'écran tactile ;
 *  – la découpe et la poignée ne bougent que par `transform` (voir
 *    BeforeAfter.astro) : la carte graphique déplace des calques déjà
 *    peints, rien n'est repeint pendant le glissement ;
 *  – le curseur natif n'est resynchronisé qu'à la fin du geste.
 */
export function initBeforeAfter() {
  document.querySelectorAll<HTMLElement>('[data-ba]').forEach((frame) => {
    if (frame.dataset.baReady) return;
    frame.dataset.baReady = '1';

    const range =
      frame.parentElement?.querySelector<HTMLInputElement>('[data-ba-range]') ?? null;

    let position = range ? Number(range.value) : 50;

    const apply = (percent: number) => {
      position = Math.max(2, Math.min(98, percent));
      frame.style.setProperty('--ba-pos', `${position}%`);
    };

    const syncRange = () => {
      if (range && Number(range.value) !== Math.round(position)) range.value = String(Math.round(position));
    };

    let dragging = false;
    let left = 0;
    let width = 0;
    let pendingX: number | null = null;
    let frameRequest = 0;

    const flush = () => {
      frameRequest = 0;
      if (pendingX === null || !width) return;
      apply(((pendingX - left) / width) * 100);
      pendingX = null;
    };

    const queue = (clientX: number) => {
      pendingX = clientX;
      if (!frameRequest) frameRequest = requestAnimationFrame(flush);
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      event.preventDefault();
      queue(event.clientX);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (frameRequest) cancelAnimationFrame(frameRequest);
      flush();
      syncRange();
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
      const rect = frame.getBoundingClientRect();
      left = rect.left;
      width = rect.width;
      dragging = true;
      frame.setAttribute('data-dragging', '');
      queue(event.clientX);
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });

    range?.addEventListener('input', () => apply(Number(range.value)));
    apply(position);
  });
}
