/**
 * Visionneuse de la galerie (pages projet), sur un <dialog> natif :
 * piège du focus, touche Échap et retour du focus sont gérés par le
 * navigateur. Flèches ← → pour passer d'une image à l'autre, clic hors de
 * l'image pour fermer.
 *
 * Sans JavaScript (ou sans <dialog>), chaque vignette reste un lien direct
 * vers l'image en grand format.
 */
export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const items = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-lightbox-item]'));
  if (!dialog || !items.length || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  const count = dialog.querySelector<HTMLElement>('[data-lightbox-count]');
  if (!img) return;

  let index = 0;

  const show = (next: number) => {
    index = (next + items.length) % items.length;
    const item = items[index];
    img.src = item.href;
    img.alt = item.dataset.alt ?? '';
    // Relance la petite animation d'entrée de l'image.
    img.style.animation = 'none';
    void img.offsetWidth;
    img.style.animation = '';
    if (caption) caption.textContent = item.dataset.caption ?? '';
    if (count) count.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
  };

  items.forEach((item, i) => {
    item.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return; // ouvrir dans un onglet
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(index + 1));

  // Clic sur le fond (et non sur l'image ou un bouton) : fermeture.
  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target === dialog || target.classList.contains('lightbox__figure')) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (items.length < 2) return;
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'ArrowLeft') show(index - 1);
  });
}
