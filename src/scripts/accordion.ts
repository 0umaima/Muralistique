/**
 * Accordéon des services : un seul panneau ouvert à la fois, comme dans la
 * maquette. Sans JavaScript, tous les panneaux restent ouverts (CSS).
 */
export function initAccordion() {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((root) => {
    if (root.dataset.accordionReady) return;
    root.dataset.accordionReady = '1';

    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'));

    const setOpen = (trigger: HTMLButtonElement, open: boolean) => {
      trigger.setAttribute('aria-expanded', String(open));
      const panel = document.getElementById(trigger.getAttribute('aria-controls') || '');
      if (panel) panel.dataset.open = String(open);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach((other) => setOpen(other, other === trigger && willOpen));
      });
    });
  });
}
