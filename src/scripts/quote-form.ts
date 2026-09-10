/**
 * Formulaire de devis — envoi vers Basin.
 *
 * Fonctionnement
 * ──────────────
 * • Sans JavaScript : le formulaire est un `<form action="https://usebasin.com/f/…"
 *   method="post" enctype="multipart/form-data">` classique. Le navigateur
 *   l'envoie lui-même et Basin affiche sa page de confirmation.
 * • Avec JavaScript : envoi en `fetch` avec le même corps `multipart/form-data`
 *   (indispensable pour les fichiers) et l'en-tête `Accept: application/json`
 *   pour obtenir une réponse JSON. On ne fixe JAMAIS `Content-Type` à la main :
 *   c'est le navigateur qui écrit la limite (« boundary ») multipart.
 *
 * Le succès n'est annoncé QUE lorsque Basin a répondu positivement.
 * En cas d'échec, aucune saisie n'est perdue.
 */

interface Limits {
  maxFiles: number;
  maxFileBytes: number;
  maxTotalBytes: number;
  accept: string[];
  acceptLabel: string;
}

const MESSAGES = {
  required: 'Ce champ est obligatoire.',
  email: 'Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.',
  consent: 'Merci de cocher cette case pour que nous puissions traiter votre demande.',
  message: 'Décrivez votre projet en quelques mots (au moins 10 caractères).',
  network:
    'L’envoi n’a pas abouti : votre connexion semble interrompue. Vos réponses sont conservées, réessayez dans un instant.',
  server:
    'L’envoi n’a pas abouti. Vos réponses sont conservées : réessayez dans quelques minutes, ou écrivez-nous directement.',
  quota:
    'Le formulaire n’accepte plus de nouvelles demandes pour le moment (limite du service de réception atteinte). Écrivez-nous directement par e-mail ou sur WhatsApp — nous répondons sous 48 h.',
  tooLarge:
    'Les fichiers joints sont trop lourds pour le service de réception. Retirez une photo ou envoyez-la nous ensuite par e-mail ou WhatsApp.',
  spam: 'Votre demande a été refusée par le filtre anti-spam. Écrivez-nous directement, nous la traiterons manuellement.',
  success:
    'Merci, votre demande est bien arrivée. Nous revenons vers vous sous 48 h avec un premier retour et un devis gratuit.',
};

const bytesToText = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo` : `${Math.round(bytes / 1024)} Ko`;

function icon(name: 'check' | 'alert'): string {
  const path =
    name === 'check'
      ? '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>'
      : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
  const fileList = form.querySelector<HTMLElement>('[data-file-list]');

  const limits: Limits = {
    maxFiles: parseInt(form.dataset.maxFiles || '2', 10),
    maxFileBytes: parseInt(form.dataset.maxFileBytes || String(750 * 1024), 10),
    maxTotalBytes: parseInt(form.dataset.maxTotalBytes || String(1536 * 1024), 10),
    accept: (form.dataset.accept || 'image/jpeg,image/png,image/webp').split(','),
    acceptLabel: form.dataset.acceptLabel || 'JPEG, PNG ou WebP',
  };

  let files: File[] = [];
  let sending = false;
  let done = false;

  // ————————————————————————————————————————— messages de champ
  const errorSlot = (name: string) =>
    form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);

  const setFieldError = (name: string, message: string) => {
    const slot = errorSlot(name);
    if (slot) slot.textContent = message;
    const control = form.querySelector<HTMLElement>(`[name="${name}"], [name="${name}[]"]`);
    if (control) {
      if (message) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  };

  const clearErrors = () => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((slot) => (slot.textContent = ''));
    form.querySelectorAll<HTMLElement>('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const showStatus = (tone: 'error' | 'success', html: string) => {
    if (!status) return;
    status.hidden = false;
    status.dataset.tone = tone;
    status.innerHTML = `${icon(tone === 'success' ? 'check' : 'alert')}<span>${html}</span>`;
  };

  const hideStatus = () => {
    if (!status) return;
    status.hidden = true;
    status.innerHTML = '';
  };

  // ————————————————————————————————————————— validation
  const value = (name: string) =>
    (form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)?.value ?? '').trim();

  const validate = (): string | null => {
    clearErrors();
    let firstInvalid: string | null = null;
    const fail = (name: string, message: string) => {
      setFieldError(name, message);
      if (!firstInvalid) firstInvalid = name;
    };

    if (!value('name')) fail('name', MESSAGES.required);
    const email = value('email');
    if (!email) fail('email', MESSAGES.required);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail('email', MESSAGES.email);
    if (!value('city')) fail('city', MESSAGES.required);
    const message = value('message');
    if (!message) fail('message', MESSAGES.required);
    else if (message.length < 10) fail('message', MESSAGES.message);

    const consent = form.querySelector<HTMLInputElement>('[name="consent"]');
    if (consent && !consent.checked) fail('consent', MESSAGES.consent);

    const fileError = validateFiles(files);
    if (fileError) fail('photos', fileError);

    return firstInvalid;
  };

  // ————————————————————————————————————————— fichiers
  function validateFiles(list: File[]): string {
    if (list.length > limits.maxFiles) {
      return `${limits.maxFiles} photos maximum. Retirez-en ${list.length - limits.maxFiles}.`;
    }
    const wrongType = list.find((file) => !limits.accept.includes(file.type));
    if (wrongType) {
      return `« ${wrongType.name} » n’est pas un format accepté. Envoyez des fichiers JPEG, PNG ou WebP.`;
    }
    const tooBig = list.find((file) => file.size > limits.maxFileBytes);
    if (tooBig) {
      return `« ${tooBig.name} » pèse ${bytesToText(tooBig.size)} : la limite est de ${bytesToText(
        limits.maxFileBytes
      )} par photo.`;
    }
    const total = list.reduce((sum, file) => sum + file.size, 0);
    if (total > limits.maxTotalBytes) {
      return `Les photos pèsent ${bytesToText(total)} au total : la limite est de ${bytesToText(
        limits.maxTotalBytes
      )}. Retirez-en une.`;
    }
    return '';
  }

  const syncInputFiles = () => {
    if (!fileInput) return;
    // Garde l'input natif synchronisé pour l'envoi sans JavaScript.
    try {
      const transfer = new DataTransfer();
      files.forEach((file) => transfer.items.add(file));
      fileInput.files = transfer.files;
    } catch {
      /* navigateur sans DataTransfer : le tableau `files` reste la source */
    }
  };

  const renderFiles = () => {
    if (!fileList) return;
    fileList.hidden = files.length === 0;
    fileList.innerHTML = '';
    const total = files.reduce((sum, file) => sum + file.size, 0);

    files.forEach((file, index) => {
      const item = document.createElement('li');
      item.className = 'qf-files__item';
      const name = document.createElement('span');
      name.className = 'qf-files__name';
      name.textContent = file.name;
      const size = document.createElement('span');
      size.className = 'qf-files__size';
      size.textContent = bytesToText(file.size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'qf-files__remove';
      remove.textContent = 'Retirer';
      remove.setAttribute('aria-label', `Retirer la photo ${file.name}`);
      remove.addEventListener('click', () => {
        files.splice(index, 1);
        syncInputFiles();
        renderFiles();
        setFieldError('photos', validateFiles(files));
      });
      item.append(name, size, remove);
      fileList.append(item);
    });

    if (files.length) {
      const summary = document.createElement('li');
      summary.className = 'qf-files__size';
      summary.textContent = `${files.length} photo${files.length > 1 ? 's' : ''} · ${bytesToText(
        total
      )} sur ${bytesToText(limits.maxTotalBytes)}`;
      fileList.append(summary);
    }
  };

  fileInput?.addEventListener('change', () => {
    const picked = Array.from(fileInput.files ?? []);
    if (!picked.length) {
      syncInputFiles();
      return;
    }

    // Chaque photo est acceptée ou refusée à l'ajout : rien d'invalide ne
    // reste dans la liste, l'utilisateur voit immédiatement pourquoi.
    const accepted = [...files];
    const rejected: string[] = [];
    let total = accepted.reduce((sum, file) => sum + file.size, 0);

    for (const file of picked) {
      const duplicate = accepted.some((existing) => existing.name === file.name && existing.size === file.size);
      if (duplicate) continue;

      if (!limits.accept.includes(file.type)) {
        rejected.push(`« ${file.name} » n’est pas au bon format (${limits.acceptLabel})`);
        continue;
      }
      if (file.size > limits.maxFileBytes) {
        rejected.push(`« ${file.name} » pèse ${bytesToText(file.size)} (maximum ${bytesToText(limits.maxFileBytes)})`);
        continue;
      }
      if (accepted.length >= limits.maxFiles) {
        rejected.push(`« ${file.name} » : ${limits.maxFiles} photos maximum`);
        continue;
      }
      if (total + file.size > limits.maxTotalBytes) {
        rejected.push(
          `« ${file.name} » dépasserait le total autorisé (${bytesToText(limits.maxTotalBytes)})`
        );
        continue;
      }
      accepted.push(file);
      total += file.size;
    }

    files = accepted;
    syncInputFiles();
    renderFiles();
    setFieldError('photos', rejected.length ? `Photo(s) non ajoutée(s) : ${rejected.join(' ; ')}.` : '');
  });

  // ————————————————————————————————————————— envoi
  const setSending = (isSending: boolean) => {
    sending = isSending;
    if (!submit) return;
    submit.disabled = isSending;
    submit.dataset.state = isSending ? 'sending' : '';
    submit.setAttribute('aria-busy', String(isSending));
    if (submitLabel) submitLabel.textContent = isSending ? 'Envoi en cours…' : 'Envoyer la demande';
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
    // Corps de requête trop volumineux (limite du service, pas du navigateur).
    if (response.status === 413) return MESSAGES.tooLarge;
    if (response.status === 400 && typeof errors === 'string') return errors;
    return MESSAGES.server;
  };

  form.addEventListener('submit', async (event) => {
    // Empêche tout second envoi tant que le premier n'a pas abouti,
    // et tout renvoi après un succès.
    if (sending || done) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    hideStatus();

    const firstInvalid = validate();
    if (firstInvalid) {
      showStatus('error', 'Quelques champs sont à compléter avant l’envoi.');
      const control = form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      control?.focus();
      control?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setSending(true);

    const data = new FormData(form);
    // Les fichiers sont repris du tableau maîtrisé (retraits compris).
    data.delete('photos[]');
    files.forEach((file) => data.append('photos[]', file, file.name));

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        // Pas de Content-Type manuel : le navigateur écrit la limite multipart.
        headers: { Accept: 'application/json' },
        body: data,
      });

      if (!response.ok) {
        showStatus('error', await describeFailure(response));
        setSending(false);
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
        showStatus('error', typeof payload.error === 'string' ? payload.error : MESSAGES.server);
        setSending(false);
        return;
      }

      done = true;
      setSending(false);
      form.reset();
      files = [];
      syncInputFiles();
      renderFiles();
      clearErrors();
      showStatus('success', MESSAGES.success);
      if (submit) {
        submit.disabled = true;
        submit.dataset.state = 'done';
        if (submitLabel) submitLabel.textContent = 'Demande envoyée';
      }
      status?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      status?.focus?.();
    } catch {
      // Réseau coupé, requête bloquée : rien n'est perdu, on peut réessayer.
      showStatus('error', MESSAGES.network);
      setSending(false);
    }
  });

  // Efface le message d'erreur d'un champ dès qu'on le corrige.
  form.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    if (!target?.name) return;
    const key = target.name.replace(/\[\]$/, '');
    if (errorSlot(key)?.textContent) setFieldError(key, '');
  });
}
