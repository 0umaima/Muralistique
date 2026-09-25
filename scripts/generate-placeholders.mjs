/**
 * Génère les images d'espace réservé (placeholders) de src/assets/images/.
 *
 * ▶  Vous n'avez PAS besoin de relancer ce script : les fichiers générés sont
 *    versionnés. Il sert uniquement à recréer un placeholder si vous en
 *    supprimez un par erreur, ou à en ajouter de nouveaux formats.
 *
 *    node scripts/generate-placeholders.mjs
 *
 * ▶  Pour mettre VOS photos : remplacez simplement le fichier .jpg
 *    correspondant dans src/assets/images/ en gardant le même nom.
 *    Astro régénère automatiquement les tailles et formats modernes.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const ROOT = new URL('../src/assets/images/', import.meta.url).pathname;

// Palette du site (voir src/styles/global.css) : noir, blanc, gris neutre,
// vermillon d'accent.
const INK = '#0B0B0B';
const IVORY = '#FFFFFF';
const IVORY_2 = '#F3F3F2';
const ACCENT = '#FF4A1C';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Fabrique un SVG « emplacement photo » aux dimensions demandées. */
function svg(w, h, label, { tone = 'light' } = {}) {
  const bg = tone === 'dark' ? INK : IVORY_2;
  const fg = tone === 'dark' ? IVORY : INK;
  const s = Math.min(w, h);
  const unit = s / 100;
  const title = Math.max(13, Math.min(34, unit * 5.2));
  const meta = Math.max(10, Math.min(18, unit * 2.8));
  const stroke = Math.max(1, unit * 0.18);
  const markR = Math.max(18, unit * 11);
  const cy = h / 2 - title * 1.6;

  // Découpe le libellé sur deux lignes si nécessaire.
  const words = label.split(' ');
  const lines = [];
  let line = '';
  const maxChars = Math.max(12, Math.floor(w / (title * 0.52)));
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) { lines.push(line.trim()); line = word; }
    else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 3);

  const textY = cy + markR + title * 1.5;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="hatch" width="${unit * 9}" height="${unit * 9}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="${unit * 9}" stroke="${fg}" stroke-width="${stroke}" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="url(#hatch)"/>
  <rect x="${stroke * 3}" y="${stroke * 3}" width="${w - stroke * 6}" height="${h - stroke * 6}"
        fill="none" stroke="${fg}" stroke-width="${stroke}" opacity="0.35"/>
  <circle cx="${w / 2}" cy="${cy}" r="${markR}" fill="${ACCENT}"/>
  <path d="M ${w / 2 - markR * 0.42} ${cy + markR * 0.3}
           L ${w / 2 - markR * 0.1} ${cy - markR * 0.18}
           L ${w / 2 + markR * 0.12} ${cy + markR * 0.12}
           L ${w / 2 + markR * 0.28} ${cy - markR * 0.06}
           L ${w / 2 + markR * 0.45} ${cy + markR * 0.3} Z"
        fill="none" stroke="${INK}" stroke-width="${Math.max(1.2, unit * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${w / 2 + markR * 0.3}" cy="${cy - markR * 0.38}" r="${markR * 0.12}" fill="${INK}"/>
  ${shown
    .map(
      (l, i) =>
        `<text x="${w / 2}" y="${textY + i * title * 1.2}" text-anchor="middle" fill="${fg}"
           font-family="Manrope, Helvetica, Arial, sans-serif" font-size="${title}" font-weight="700"
           letter-spacing="${-title * 0.02}">${esc(l)}</text>`
    )
    .join('\n  ')}
  <text x="${w / 2}" y="${textY + shown.length * title * 1.2 + meta * 1.4}" text-anchor="middle" fill="${fg}"
        font-family="Manrope, Helvetica, Arial, sans-serif" font-size="${meta}" font-weight="600"
        letter-spacing="${meta * 0.16}" opacity="0.6">${w} × ${h}</text>
  <text x="${w / 2}" y="${textY + shown.length * title * 1.2 + meta * 3.2}" text-anchor="middle" fill="${fg}"
        font-family="Manrope, Helvetica, Arial, sans-serif" font-size="${meta}" font-weight="500"
        opacity="0.55">IMAGE À REMPLACER</text>
</svg>`;
}

async function emit(rel, w, h, label, opts = {}) {
  const out = join(ROOT, rel);
  await mkdir(dirname(out), { recursive: true });
  const buf = Buffer.from(svg(w, h, label, opts));
  if (rel.endsWith('.png')) {
    await sharp(buf).png({ compressionLevel: 9 }).toFile(out);
  } else {
    await sharp(buf).jpeg({ quality: 78, mozjpeg: true }).toFile(out);
  }
  return rel;
}

/** Image de partage social (Open Graph). */
async function emitOg() {
  const w = 1200, h = 630;
  const body = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${INK}"/>
    <path d="M60 520c120-40 170-180 280-290S560 60 760 92" fill="none" stroke="${ACCENT}" stroke-width="6" stroke-linecap="round" opacity="0.75"/>
    <path d="M620 150c60 20 86 74 74 132" fill="none" stroke="${IVORY}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>
    <text x="72" y="330" fill="${IVORY}" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="700" letter-spacing="-3">Muralistique</text>
    <text x="72" y="392" fill="${ACCENT}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="600" letter-spacing="6">FRESQUES MURALES SUR MESURE</text>
    <text x="72" y="560" fill="#A9A9A9" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500">Image de partage à remplacer — src/assets/images/brand/og.jpg</text>
  </svg>`;
  const out = join(ROOT, 'brand/og.jpg');
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(body)).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
}

const PROJECT_SLUGS = [
  ['hotel-rivage', 1200, 1600, 'Hôtel Rivage'],
  ['clinique-vision-sud', 1400, 1600, 'Clinique Vision Sud'],
  ['ecole-les-tilleuls', 1200, 1600, 'École Les Tilleuls'],
  ['cafe-nord', 1280, 1600, 'Café Nord'],
  ['studio-habitat', 1680, 1600, 'Studio Habitat'],
  ['cabinet-dentaire-opale', 1280, 1600, 'Cabinet Dentaire Opale'],
  ['siege-aurea', 2640, 1280, 'Siège Aurea'],
];

const WITH_BEFORE_AFTER = new Set(['hotel-rivage', 'clinique-vision-sud']);

const JOBS = [
  // — Accueil ——————————————————————————————————————————————
  ['home/hero-bg.jpg', 2560, 1440, 'Fond du hero — atelier ou mur', { tone: 'dark' }],
  ['home/hero-left.jpg', 816, 1020, 'Chantier ou croquis', { tone: 'dark' }],
  ['home/hero-center.jpg', 1176, 1410, 'Geste de peinture', { tone: 'dark' }],
  ['home/hero-right.jpg', 816, 1020, 'Mur fini ou détail', { tone: 'dark' }],
  // — Services ————————————————————————————————————————————
  ['services/fresque.jpg', 1236, 680, 'Fresque', { tone: 'dark' }],
  ['services/toile.jpg', 1236, 680, 'Toile', { tone: 'dark' }],
  ['services/performance.jpg', 1236, 680, 'Performance', { tone: 'dark' }],
  // — Témoignage ————————————————————————————————————————
  ['people/temoignage.jpg', 520, 520, 'Portrait client'],
  // — Studio ————————————————————————————————————————————
  ['studio/hero.jpg', 2132, 1760, 'Amine en train de peindre', { tone: 'dark' }],
  ['studio/founder.jpg', 1440, 1640, 'Amine en train de dessiner'],
  ['studio/croquis.jpg', 1776, 960, 'Croquis'],
  ['studio/couleurs.jpg', 816, 960, 'Mélange des couleurs'],
  ['studio/trace.jpg', 816, 880, 'Tracé au mur'],
  ['studio/travail.jpg', 1776, 880, 'Amine en plein travail'],
];

for (const [slug, w, h, label] of PROJECT_SLUGS) {
  JOBS.push([`projects/${slug}/cover.jpg`, w, h, label]);
  JOBS.push([`projects/${slug}/1.jpg`, 1600, 1200, `${label} — détail`]);
  JOBS.push([`projects/${slug}/2.jpg`, 1600, 1067, `${label} — vue d’ensemble`]);
  if (WITH_BEFORE_AFTER.has(slug)) {
    JOBS.push([`projects/${slug}/avant.jpg`, 2400, 1200, `${label} — avant`]);
    JOBS.push([`projects/${slug}/apres.jpg`, 2400, 1200, `${label} — après`]);
  }
}

await emitOg();
for (const [rel, w, h, label, opts] of JOBS) await emit(rel, w, h, label, opts);

await writeFile(
  join(ROOT, 'README.md'),
  `# Images du site\n\nChaque fichier ici est un **espace réservé** généré par \`scripts/generate-placeholders.mjs\`.\n\n**Pour mettre vos photos :** remplacez le fichier par le vôtre **en gardant exactement le même nom**.\nAstro se charge du redimensionnement, des formats modernes (AVIF/WebP) et du chargement différé.\n\nFormats d'origine conseillés (le double des dimensions d'affichage, JPEG ou PNG de bonne qualité) :\n\n${[...JOBS]
    .map(([rel, w, h, label]) => `- \`${rel}\` — ${w} × ${h} px — ${label}`)
    .join('\n')}\n- \`brand/og.jpg\` — 1200 × 630 px — image de partage sur les réseaux sociaux\n\nLes textes alternatifs (\`alt\`) se modifient dans \`src/data/\`.\n`
);

console.log(`✓ ${JOBS.length + 1} placeholders générés dans src/assets/images/`);
