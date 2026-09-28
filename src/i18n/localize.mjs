/**
 * Traduction des données de src/data/.
 *
 * Chaque entrée garde son texte français et peut porter un bloc `en` avec
 * la version anglaise des seuls champs à traduire. `localize(entrée, 'en')`
 * superpose ce bloc au français :
 *  – un champ absent du bloc `en` garde sa valeur française (repli sûr : une
 *    traduction oubliée n'efface rien, elle reste en français) ;
 *  – une liste de textes (`body`, `tags`…) est remplacée en entier ;
 *  – une liste d'objets (`gallery`…) est complétée élément par élément,
 *    dans le même ordre : il suffit d'y mettre `alt` et `caption`.
 */

const isPlain = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

function merge(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    return base.some(isPlain) ? base.map((item, i) => merge(item, over[i])) : over;
  }
  if (isPlain(base) && isPlain(over)) {
    const out = { ...base };
    for (const key of Object.keys(over)) out[key] = merge(base[key], over[key]);
    return out;
  }
  return over;
}

/**
 * @template {object} T
 * @param {T & { en?: unknown }} item
 * @param {'fr' | 'en'} lang
 * @returns {Omit<T, 'en'>}
 */
export function localize(item, lang) {
  const { en, ...base } = /** @type {any} */ (item);
  return /** @type {any} */ (lang === 'en' ? merge(base, en) : base);
}
