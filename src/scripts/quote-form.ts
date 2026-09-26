/**
 * Formulaire de devis — envoi vers Basin.
 *
 * Fonctionnement
 * ──────────────
 * • Sans JavaScript : le formulaire est un `<form action="https://usebasin.com/f/…"
 *   method="post">` classique (encodage `application/x-www-form-urlencoded`,
 *   celui par défaut des formulaires). Le navigateur exige le téléphone
 *   (attribut `required`), envoie lui-même et Basin affiche sa page de
 *   confirmation.
 * • Avec JavaScript : envoi en `fetch` avec le même corps et l'en-tête
 *   `Accept: application/json` pour obtenir une réponse JSON.
 *
 * Seul le téléphone est obligatoire : chaque champ exigé en plus est une
 * occasion de plus d'abandonner la demande.
 *
 * Ne jamais perdre une demande
 * ────────────────────────────
 * • Le succès n'est annoncé QUE lorsque Basin a répondu positivement.
 * • En cas d'échec (réseau coupé, hors ligne, délai dépassé, refus du
 *   service), aucune saisie n'est perdue ET la demande peut partir tout de
 *   suite par WhatsApp ou par e-mail, message pré-rempli avec les réponses.
 * • Sans réponse au bout de REQUEST_TIMEOUT_MS, on arrête d'attendre au lieu
 *   de laisser tourner « Envoi en cours… » indéfiniment sur un réseau mobile
 *   instable.
 * • Les réponses sont gardées le temps de l'onglet (sessionStorage) : si le
 *   téléphone recharge la page pendant que le visiteur passe sur une autre
 *   application (mesurer le mur, vérifier une date…), il retrouve sa saisie.
 *   Le brouillon est effacé dès que la demande est bien arrivée.
 */

const REQUEST_TIMEOUT_MS = 20000;
const DRAFT_KEY = 'muralistique:devis';
/** Champs recopiés dans le brouillon et dans le message de secours. */
const FIELDS: [name: string, label: string][] = [
  ['name', 'Nom'],
  ['phone', 'Téléphone'],
  ['email', 'E-mail'],
  ['city', 'Ville'],
  ['space_type', 'Type d’espace'],
  ['budget', 'Budget'],
  ['start_date', 'Date de début'],
  ['message', 'Projet'],
];

const MESSAGES = {
  required: 'Indiquez votre numéro de téléphone pour que nous puissions vous rappeler.',
  phone: 'Ce numéro semble incomplet. Exemple : 06 12 34 56 78 ou +212 6 12 34 56 78.',
  email: 'Cette adresse e-mail semble incomplète (exemple : nom@exemple.ma). Corrigez-la ou laissez le champ vide.',
  invalid: 'Un champ est à corriger avant l’envoi.',
  offline:
    'Vous semblez hors connexion : la demande n’est pas partie. Vos réponses sont conservées, réessayez une fois reconnecté.',
  network:
    'L’envoi n’a pas abouti : votre connexion semble interrompue. Vos réponses sont conservées, réessayez dans un instant.',
  timeout:
    'Le service de réception ne répond pas. Vos réponses sont conservées : réessayez dans un instant.',
  server:
    'L’envoi n’a pas abouti. Vos réponses sont conservées : réessayez dans quelques minutes.',
  quota:
    'Le formulaire n’accepte plus de nouvelles demandes pour le moment (limite du service de réception atteinte).',
  fallback: 'Pour être sûr que votre demande nous parvienne, envoyez-la directement :',
  success:
    'Merci, votre demande est bien arrivée. Nous revenons vers vous sous 48 h avec un premier retour et un devis gratuit.',
};

function icon(name: 'check' | 'alert'): SVGSVGElement {
  const path =
    name === 'check'
      ? '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>'
      : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = path;
  return svg;
}

/** Un numéro plausible, d'ici ou d'ailleurs : 8 à 15 chiffres, séparateurs libres. */
const isPhone = (value: string) => {
  if (!/^[\d\s+().\/-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '').length;
  return digits >= 8 && digits <= 15;
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

const storage = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null; // navigation privée stricte, stockage bloqué
  }
};

export function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  // Le script prend la main sur la validation (messages en français, focus) ;
  // sans lui, la validation native du navigateur exige le téléphone.
  form.noValidate = true;

  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const whatsapp = form.dataset.whatsapp || '';
  const email = form.dataset.email || '';

  let sending = false;
  let done = false;

  // ————————————————————————————————————————— lecture des champs
  const value = (name: string) => {
    const checked = form.querySelector<HTMLInputElement>(`[name="${name}"]:checked`);
    if (checked) return checked.value.trim();
    const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${name}"]:not([type="radio"]):not([type="checkbox"])`
    );
    return (field?.value ?? '').trim();
  };

  // ————————————————————————————————————————— brouillon (le temps de l'onglet)
  const saveDraft = () => {
    if (done) return;
    const draft: Record<string, string> = {};
    FIELDS.forEach(([name]) => (draft[name] = value(name)));
    try {
      storage()?.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* quota ou stockage bloqué : sans conséquence */
    }
  };

  const clearDraft = () => {
    try {
      storage()?.removeItem(DRAFT_KEY);
    } catch {
      /* rien à faire */
    }
  };

  const restoreDraft = () => {
    let draft: Record<string, string> | null = null;
    try {
      draft = JSON.parse(storage()?.getItem(DRAFT_KEY) || 'null');
    } catch {
      draft = null;
    }
    if (!draft || typeof draft !== 'object') return;
    FIELDS.forEach(([name]) => {
      const saved = draft![name];
      if (typeof saved !== 'string' || !saved) return;
      const radio = Array.from(form.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`));
      if (radio.length) {
        const match = radio.find((input) => input.value === saved);
        if (match) match.checked = true;
        return;
      }
      const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
      // Ne jamais écraser ce que le navigateur (ou le visiteur) a déjà rempli.
      if (field && !field.value) field.value = saved;
    });
  };

  restoreDraft();

  // ————————————————————————————————————————— messages de champ
  const errorSlot = (name: string) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);

  const setFieldError = (name: string, message: string) => {
    const slot = errorSlot(name);
    if (slot) slot.textContent = message;
    const control = form.querySelector<HTMLElement>(`[name="${name}"]`);
    if (control) {
      if (message) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  };

  const clearErrors = () => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((slot) => (slot.textContent = ''));
    form.querySelectorAll<HTMLElement>('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  // ————————————————————————————————————————— message de secours
  const summary = () => {
    const lines = FIELDS.map(([name, label]) => [label, value(name)] as const)
      .filter(([, text]) => text)
      .map(([label, text]) => `${label} : ${text}`);
    return `Bonjour, voici ma demande de devis (le formulaire du site n’a pas pu l’envoyer).\n\n${lines.join('\n')}`;
  };

  const fallbackLinks = (): HTMLElement | null => {
    const links: HTMLAnchorElement[] = [];
    const text = summary();
    if (whatsapp) {
      const link = document.createElement('a');
      link.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Envoyer par WhatsApp';
      links.push(link);
    }
    if (email) {
      const link = document.createElement('a');
      link.href = `mailto:${email}?subject=${encodeURIComponent('Demande de devis — fresque murale')}&body=${encodeURIComponent(text)}`;
      link.textContent = 'Envoyer par e-mail';
      links.push(link);
    }
    if (!links.length) return null;
    const wrap = document.createElement('span');
    wrap.className = 'qf-status__fallback';
    wrap.append(...links);
    return wrap;
  };

  // ————————————————————————————————————————— bandeau d'état
  const showStatus = (tone: 'error' | 'success', message: string, offerFallback = false) => {
    if (!status) return;
    status.hidden = false;
    status.dataset.tone = tone;
    const body = document.createElement('span');
    body.textContent = message;
    const fallback = offerFallback ? fallbackLinks() : null;
    if (fallback) {
      body.append(' ', MESSAGES.fallback);
      body.append(fallback);
    }
    status.textContent = '';
    status.append(icon(tone === 'success' ? 'check' : 'alert'), body);
  };

  const hideStatus = () => {
    if (!status) return;
    status.hidden = true;
    status.textContent = '';
  };

  // ————————————————————————————————————————— validation
  const validate = (): string | null => {
    clearErrors();
    let firstInvalid: string | null = null;
    const fail = (name: string, message: string) => {
      setFieldError(name, message);
      if (!firstInvalid) firstInvalid = name;
    };

    const phone = value('phone');
    if (!phone) fail('phone', MESSAGES.required);
    else if (!isPhone(phone)) fail('phone', MESSAGES.phone);

    // Facultatif, mais une adresse mal tapée empêcherait de répondre par e-mail.
    const mail = value('email');
    if (mail && !isEmail(mail)) fail('email', MESSAGES.email);

    return firstInvalid;
  };

  // ————————————————————————————————————————— envoi
  const setSending = (isSending: boolean) => {
    sending = isSending;
    if (!submit) return;
    submit.disabled = isSending;
    submit.dataset.state = isSending ? 'sending' : '';
    submit.setAttribute('aria-busy', String(isSending));
    if (submitLabel) submitLabel.textContent = isSending ? 'Envoi en cours…' : 'Envoyer la demande';
  };

  const failSend = (message: string) => {
    showStatus('error', message, true);
    setSending(false);
    status?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  /** Traduit une réponse Basin en message affichable. */
  const describeFailure = async (response: Response): Promise<string> => {
    let payload: any = null;
    try {
      payload = await response.clone().json();
    } catch {
      /* réponse non JSON */
    }

    // Erreurs de validation renvoyées champ par champ.
    const errors = payload?.errors ?? payload?.error;
    if (response.status === 422 && errors) {
      if (Array.isArray(errors)) return errors.join(' ');
      if (typeof errors === 'object') {
        Object.entries(errors).forEach(([field, detail]) => {
          const text = Array.isArray(detail) ? detail.join(' ') : String(detail);
          if (errorSlot(field)) setFieldError(field, text);
        });
        return 'Certains champs n’ont pas été acceptés. Vérifiez les messages ci-dessus.';
      }
      return String(errors);
    }

    // Quota / limite de plan atteinte côté service, ou trop de requêtes.
    if (response.status === 429 || response.status === 402 || response.status === 403) return MESSAGES.quota;
    if (response.status === 400 && typeof errors === 'string') return errors;
    return MESSAGES.server;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Empêche tout second envoi tant que le premier n'a pas abouti,
    // et tout renvoi après un succès.
    if (sending || done) return;
    hideStatus();

    const firstInvalid = validate();
    if (firstInvalid) {
      showStatus('error', MESSAGES.invalid);
      const control = form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      control?.focus();
      control?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    saveDraft();

    // `false` est fiable (aucun réseau) ; `true` ne garantit rien, d'où le fetch.
    if (navigator.onLine === false) {
      showStatus('error', MESSAGES.offline, true);
      return;
    }

    setSending(true);

    // Encodage par défaut des formulaires : le plus simple et le mieux
    // accepté, sans requête préalable CORS.
    const body = new URLSearchParams();
    new FormData(form).forEach((entry, key) => {
      if (typeof entry === 'string') body.append(key, entry);
    });

    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : 0;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        signal: controller?.signal,
      });

      if (!response.ok) {
        failSend(await describeFailure(response));
        return;
      }

      // Certaines réponses renvoient un objet avec un indicateur d'échec
      // malgré un code 2xx : on ne confirme qu'un succès explicite.
      let payload: any = null;
      try {
        payload = await response.clone().json();
      } catch {
        /* réponse vide ou non JSON : le code 2xx fait foi */
      }
      if (payload && payload.success === false) {
        failSend(typeof payload.error === 'string' ? payload.error : MESSAGES.server);
        return;
      }

      done = true;
      clearDraft();
      setSending(false);
      form.reset();
      clearErrors();
      showStatus('success', MESSAGES.success);
      if (submit) {
        submit.disabled = true;
        submit.dataset.state = 'done';
        if (submitLabel) submitLabel.textContent = 'Demande envoyée';
      }
      status?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      status?.focus({ preventScroll: true });
    } catch (error) {
      // Réseau coupé, requête bloquée, délai dépassé : rien n'est perdu, on
      // peut réessayer ou passer par WhatsApp / e-mail.
      const timedOut = (error as DOMException | undefined)?.name === 'AbortError';
      failSend(timedOut ? MESSAGES.timeout : MESSAGES.network);
    } finally {
      window.clearTimeout(timer);
    }
  });

  // Garde le brouillon à jour et efface le message d'erreur d'un champ dès
  // qu'on le corrige.
  const onEdit = (event: Event) => {
    saveDraft();
    const target = event.target as HTMLInputElement;
    if (target?.name && errorSlot(target.name)?.textContent) setFieldError(target.name, '');
  };
  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);
}
