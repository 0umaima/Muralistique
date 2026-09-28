/**
 * Outils de traduction.
 *
 * La langue d'une page se lit dans son adresse : tout ce qui commence par
 * /en est en anglais, le reste en français. Chaque composant l'obtient donc
 * lui-même avec `getLang(Astro.url)`, sans qu'on ait à la transmettre.
 */
import { fr, type UI } from './fr';
import { en } from './en';
import { langFromPath, localizePath, type Lang } from './routes.mjs';

export type { Lang, UI };
export { LANGS, LOCALES, DEFAULT_LANG, langFromPath, localizePath } from './routes.mjs';
export { localize } from './localize.mjs';

const dictionaries: Record<Lang, UI> = { fr, en };

/** Langue de la page en cours (`Astro.url`). */
export const getLang = (url: URL): Lang => langFromPath(url.pathname);

/** Textes de l'interface dans la langue demandée. */
export const useTranslations = (lang: Lang): UI => dictionaries[lang];

/** Raccourci pour les liens internes : `href('/devis', lang)` → '/en/quote' en anglais. */
export const href = (path: string, lang: Lang) => localizePath(path, lang);
