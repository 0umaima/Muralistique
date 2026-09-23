/**
 * Télécharge les polices (Big Shoulders Display + Manrope) depuis Google Fonts
 * vers public/fonts/, pour les héberger avec le site.
 *
 * ▶ À relancer uniquement si vous voulez mettre à jour les fichiers :
 *      node scripts/fetch-fonts.mjs
 *   Les .woff2 sont versionnés, le site n'appelle jamais Google en production.
 */
import { writeFile, mkdir } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const OUT = new URL('../public/fonts/', import.meta.url);
const KEEP = new Set(['latin', 'latin-ext']);

const FAMILIES = [
  { css: 'Big+Shoulders+Display:wght@500..900', family: 'Big Shoulders Display', slug: 'big-shoulders-display' },
  { css: 'Manrope:wght@400..700', family: 'Manrope', slug: 'manrope' },
];

await mkdir(OUT, { recursive: true });
const faces = [];

for (const { css, family, slug } of FAMILIES) {
  const sheet = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${css}&display=swap`, { headers: { 'User-Agent': UA } })
  ).text();

  const blocks = sheet.split('@font-face').slice(1);
  let previousComment = '';
  const commented = sheet.split('@font-face');
  for (let i = 0; i < blocks.length; i++) {
    const subsetMatch = commented[i].match(/\/\*\s*([a-z-]+)\s*\*\/\s*$/);
    previousComment = subsetMatch ? subsetMatch[1] : previousComment;
    if (!KEEP.has(previousComment)) continue;

    const url = blocks[i].match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
    const weight = blocks[i].match(/font-weight:\s*([^;]+);/)?.[1].trim() ?? '400';
    const range = blocks[i].match(/unicode-range:\s*([^;]+);/)?.[1].trim();
    if (!url) continue;

    const file = `${slug}-${previousComment}.woff2`;
    const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
    await writeFile(new URL(file, OUT), buf);
    faces.push({ family, file, weight, range, subset: previousComment, bytes: buf.length });
  }
}

const css = `/* Polices auto-hébergées — généré par scripts/fetch-fonts.mjs, ne pas éditer à la main. */
${faces
  .map(
    (f) => `@font-face {
  font-family: '${f.family}';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('/fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`
  )
  .join('\n')}
`;
await writeFile(new URL('../src/styles/fonts.css', import.meta.url), css);

console.table(faces.map(({ file, subset, weight, bytes }) => ({ file, subset, weight, ko: Math.round(bytes / 1024) })));
