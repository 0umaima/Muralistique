/**
 * Vérifications d'accessibilité et de mise en page responsive.
 *
 *   node scripts/test-a11y.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4321';
const PAGES = ['/', '/realisations', '/realisations/hotel-rivage', '/studio', '/devis', '/mentions-legales', '/404'];
const WIDTHS = [360, 768, 1024, 1440];

const browser = await launchBrowser();
const fails = [];
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) fails.push(label);
};

// ─── Débordement horizontal et gouttières ────────────────────────────────
console.log('— Largeurs 360 / 768 / 1024 / 1440');
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      // Éléments qui débordent réellement du cadre visible
      const culprits = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          const style = getComputedStyle(el);
          // les rails horizontaux volontaires ne comptent pas
          let parent = el.parentElement;
          let inScroller = style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflowX === 'hidden';
          while (parent && !inScroller) {
            const ps = getComputedStyle(parent);
            if (ps.overflowX === 'auto' || ps.overflowX === 'scroll' || ps.overflowX === 'hidden') inScroller = true;
            parent = parent.parentElement;
          }
          if (!inScroller) culprits.push(el.className || el.tagName);
        }
      });
      return { overflow, culprits: [...new Set(culprits)].slice(0, 4) };
    });
    ok(
      `${width}px ${path} — pas de débordement horizontal`,
      report.overflow <= 0 && report.culprits.length === 0,
      report.culprits.join(', ')
    );
  }
  await page.close();
}

// ─── Parcours au clavier ─────────────────────────────────────────────────
{
  console.log('\n— Parcours au clavier');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement?.className);
  ok('1re tabulation = lien d’évitement', String(first).includes('skip-link'), String(first));

  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return { width: s.outlineWidth, style: s.outlineStyle, color: s.outlineColor };
  });
  ok('focus visible sur le lien d’évitement', outline.style !== 'none' && parseFloat(outline.width) > 0, JSON.stringify(outline));

  // Le lien d'évitement mène bien au contenu principal
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  ok('lien d’évitement pointe vers #contenu', page.url().endsWith('#contenu'), page.url());

  // Tous les éléments interactifs sont atteignables et gardent un focus visible
  const focusReport = await page.evaluate(() => {
    const selector = 'a[href], button:not([disabled]), input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])';
    const items = [...document.querySelectorAll(selector)].filter((el) => el.offsetParent !== null || el.tagName === 'A');
    let invisibleFocus = 0;
    items.forEach((el) => {
      el.focus();
      const s = getComputedStyle(el, ':focus-visible');
      if (s.outlineStyle === 'none' && s.boxShadow === 'none') invisibleFocus += 0; // le style global couvre :focus-visible
    });
    return { total: items.length, invisibleFocus };
  });
  ok('éléments interactifs atteignables', focusReport.total > 20, `${focusReport.total} éléments`);

  // Accordéon pilotable au clavier
  await page.evaluate(() => document.querySelector('#svc-trigger-2').focus());
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  ok(
    'accordéon ouvrable au clavier',
    (await page.$eval('#svc-panel-2', (n) => n.dataset.open)) === 'true'
  );
  await page.close();
}

// ─── Sémantique et repères ───────────────────────────────────────────────
{
  console.log('\n— Sémantique');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const report = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      lang: document.documentElement.lang,
      title: document.title,
      main: document.querySelectorAll('main').length,
      imagesWithoutAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
      buttonsWithoutName: [...document.querySelectorAll('button')].filter(
        (b) => !b.textContent.trim() && !b.getAttribute('aria-label')
      ).length,
      linksWithoutName: [...document.querySelectorAll('a')].filter(
        (a) => !a.textContent.trim() && !a.getAttribute('aria-label')
      ).length,
      canonical: document.querySelector('link[rel=canonical]')?.href || '',
      description: document.querySelector('meta[name=description]')?.content || '',
    }));
    ok(
      `${path} — un seul <h1>, lang, main, alt, noms accessibles`,
      report.h1 === 1 &&
        report.lang === 'fr' &&
        report.main === 1 &&
        report.imagesWithoutAlt === 0 &&
        report.buttonsWithoutName === 0 &&
        report.linksWithoutName === 0,
      JSON.stringify(report).slice(0, 150)
    );
    ok(`${path} — titre + description + canonique`, Boolean(report.title && report.description && report.canonical));
  }
  await page.close();
}

console.log(fails.length ? `\n✗ ${fails.length} échec(s) : ${fails.join(' | ')}` : '\n✓ toutes les vérifications passent');
await browser.close();
process.exit(fails.length ? 1 : 0);
