import type { ImageMetadata } from 'astro';

/**
 * Résout un chemin d'image relatif à src/assets/images/ vers les métadonnées
 * Astro (largeur, hauteur, format), pour que <Image> puisse l'optimiser.
 *
 * Les chemins sont stockés en texte dans src/data/ ; ce module fait le pont.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpeg,jpg,png,webp,avif}',
  { eager: true }
);

export function asset(path: string): ImageMetadata {
  const key = `/src/assets/images/${path.replace(/^\/+/, '')}`;
  const mod = modules[key];
  if (!mod) {
    throw new Error(
      `Image introuvable : src/assets/images/${path}\n` +
        `Vérifiez le chemin dans src/data/ ou déposez le fichier au bon endroit.`
    );
  }
  return mod.default;
}

export function hasAsset(path: string): boolean {
  return `/src/assets/images/${path.replace(/^\/+/, '')}` in modules;
}
