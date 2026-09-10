/**
 * Tests d'interaction du site (filtres, accordéon, comparateur, navigation
 * mobile, mouvement réduit, fonctionnement sans JavaScript).
 *
 *   npm run build && npm run preview   # dans un terminal
 *   node scripts/test-interactions.mjs # dans un autre
 *
 * Aucun envoi réel n'est effectué vers Basin : la requête est interceptée.
 */
import { chromium } from 'playwright';

const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = process.env.SHOT_DIR || '/tmp';

const browser = await chromium.launch({ executablePath: EXE });
const fails = [];
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) fails.push(label);
};

// ─── 1. Filtres + voir plus ──────────────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/realisations', { waitUntil: 'networkidle' });
  const visible = () => page.$$eval('[data-project]:not([hidden])', (n) => n.length);
  const count = () => page.$eval('[data-project-count]', (n) => n.textContent.trim());
  const moreHidden = () => page.$eval('[data-project-more]', (n) => n.hidden);

  console.log('\n— Réalisations : filtres et « voir plus »');
  ok('6 projets visibles au chargement', (await visible()) === 6, `vu ${await visible()}`);
  ok('compteur = 7 projets', (await count()) === '7 projets', await count());
  ok('bouton « voir plus » visible', (await moreHidden()) === false);

  await page.click('[data-project-more-button]');
  await page.waitForTimeout(200);
  ok('7 projets après « voir plus »', (await visible()) === 7, `vu ${await visible()}`);
  ok('bouton masqué une fois épuisé', (await moreHidden()) === true);

  await page.click('[data-filter="sante"]');
  await page.waitForTimeout(250);
  ok('filtre Santé : 2 projets', (await visible()) === 2, `vu ${await visible()}`);
  ok('compteur suit le filtre', (await count()) === '2 projets', await count());
  ok('limite réinitialisée (bouton masqué)', (await moreHidden()) === true);
  ok('URL partageable', page.url().includes('secteur=sante'), page.url());

  await page.click('[data-filter="hotellerie"]');
  await page.waitForTimeout(200);
  ok('filtre parcourt tout le jeu de données', (await visible()) === 1, `vu ${await visible()}`);

  await page.click('[data-filter="tous"]');
  await page.waitForTimeout(200);
  ok('retour à Tous : limite remise à 6', (await visible()) === 6, `vu ${await visible()}`);

  await page.evaluate(() => {
    document.querySelectorAll('[data-project]').forEach((c) => (c.dataset.sector = 'inexistant'));
  });
  await page.click('[data-filter="sante"]');
  await page.waitForTimeout(250);
  ok('état vide affiché', (await page.$eval('[data-project-empty]', (n) => n.hidden)) === false);
  ok('compteur à 0', (await count()) === '0 projet', await count());
  await page.close();
}

// ─── 2. Accueil : accordéon, comparateur, compteurs, thème d'en-tête ────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  console.log('\n— Accueil : accordéon, comparateur, compteurs, en-tête');

  const open = () => page.$$eval('[data-accordion-panel]', (n) => n.map((p) => p.dataset.open));
  ok('1er panneau ouvert au chargement', (await open())[0] === 'true', (await open()).join());
  await page.click('#svc-trigger-1');
  await page.waitForTimeout(500);
  ok('ouverture du 2e panneau', (await open())[1] === 'true');
  ok('fermeture du 1er (un seul ouvert)', (await open())[0] === 'false');
  ok(
    'aria-expanded suivi',
    (await page.$eval('#svc-trigger-1', (n) => n.getAttribute('aria-expanded'))) === 'true'
  );

  const ba = await page.$('[data-ba]');
  await ba.scrollIntoViewIfNeeded();
  await page.focus('#home-ba-range');
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const pos = await page.$eval('[data-ba]', (n) => n.style.getPropertyValue('--ba-pos'));
  ok('comparateur pilotable au clavier', pos === '60%', pos);

  const box = await ba.boundingBox();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.78, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(150);
  const pos2 = await page.$eval('[data-ba]', (n) => n.style.getPropertyValue('--ba-pos'));
  ok('comparateur pilotable à la souris', parseFloat(pos2) > 70, pos2);

  await page.evaluate(() => document.querySelector('.stats').scrollIntoView());
  await page.waitForTimeout(2200);
  const stats = await page.$$eval('[data-count]', (n) => n.map((e) => e.textContent.trim()));
  ok('compteurs terminés sur la valeur exacte', stats.join('|') === '120+|6|100%|15 j', stats.join('|'));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  ok('en-tête encre en haut de page', (await page.$eval('[data-header]', (n) => n.dataset.theme)) === 'ink');
  await page.evaluate(() => {
    const s = document.querySelector('#secteurs');
    window.scrollTo({ top: s.offsetTop + s.offsetHeight / 2, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  ok('en-tête ivoire sur section claire', (await page.$eval('[data-header]', (n) => n.dataset.theme)) === 'ivory');
  await page.evaluate(() => {
    const s = document.querySelector('#services');
    window.scrollTo({ top: s.offsetTop + s.offsetHeight / 2, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  ok('en-tête encre sur section sombre', (await page.$eval('[data-header]', (n) => n.dataset.theme)) === 'ink');

  await page.close();
}

// ─── 2b. Décalage du défilement par ancre ───────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/#processus', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const top = await page.$eval('#processus', (n) => n.getBoundingClientRect().top);
  const hh = await page.$eval('[data-header]', (n) => n.getBoundingClientRect().height);
  ok(
    'ancre #processus juste sous l’en-tête',
    top >= hh - 2 && top < hh + 40,
    `top=${Math.round(top)} header=${Math.round(hh)}`
  );
  await page.close();
}

// ─── 3. Navigation mobile ────────────────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 360, height: 720 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  console.log('\n— Navigation mobile (360 px)');
  ok('panneau fermé au départ', await page.$eval('[data-nav-panel]', (n) => n.hidden));
  await page.click('[data-nav-toggle]');
  await page.waitForTimeout(300);
  ok('panneau ouvert', (await page.$eval('[data-nav-panel]', (n) => n.hidden)) === false);
  ok(
    'aria-expanded = true',
    (await page.$eval('[data-nav-toggle]', (n) => n.getAttribute('aria-expanded'))) === 'true'
  );
  ok('défilement de page bloqué', (await page.evaluate(() => document.body.style.overflow)) === 'hidden');
  ok(
    'focus sur le 1er lien',
    await page.evaluate(() => document.activeElement?.classList.contains('header__panel-link'))
  );
  await page.screenshot({ path: `${OUT}/test-mobile-nav.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  ok('Échap referme', await page.$eval('[data-nav-panel]', (n) => n.hidden));
  ok('focus rendu au bouton', await page.evaluate(() => document.activeElement?.hasAttribute('data-nav-toggle')));
  ok('défilement rétabli', (await page.evaluate(() => document.body.style.overflow)) === '');
  await page.close();
}

// ─── 4. Mouvement réduit ─────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  console.log('\n— prefers-reduced-motion: reduce');
  const hidden = await page.$$eval('[data-reveal], [data-reveal-rotate]', (n) =>
    n.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length
  );
  ok('aucun contenu masqué', hidden === 0, `${hidden} éléments à opacité < 1`);
  const stats = await page.$$eval('[data-count]', (n) => n.map((e) => e.textContent.trim()));
  ok('compteurs affichent la valeur finale', stats.join('|') === '120+|6|100%|15 j', stats.join('|'));
  ok('carrousel en pause', (await page.$eval('[data-marquee]', (n) => n.dataset.paused)) === 'true');
  await ctx.close();
}

// ─── 5. Sans JavaScript ──────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/realisations', { waitUntil: 'load' });
  console.log('\n— JavaScript désactivé');
  const links = await page.$$eval('[data-project] a[href]', (n) => n.length);
  const visibleCards = await page.$$eval(
    '[data-project]',
    (n) => n.filter((e) => e.getBoundingClientRect().height > 0).length
  );
  ok('les 7 liens projet sont présents', links === 7, `${links} liens`);
  ok('les 7 cartes sont visibles', visibleCards === 7, `${visibleCards} visibles`);
  ok('barre de filtres masquée', await page.$eval('.browser__filters', (n) => getComputedStyle(n).display === 'none'));
  ok('bouton « voir plus » masqué', await page.$eval('[data-project-more]', (n) => getComputedStyle(n).display === 'none'));

  await page.goto(BASE + '/', { waitUntil: 'load' });
  const dim = await page.$$eval('[data-reveal], [data-reveal-rotate]', (n) =>
    n.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length
  );
  ok('aucune section masquée sur l’accueil', dim === 0, `${dim} éléments à opacité < 1`);
  const closed = await page.$$eval('[data-accordion-panel]', (n) =>
    n.filter((e) => getComputedStyle(e).gridTemplateRows.startsWith('0')).length
  );
  ok('panneaux services tous ouverts', closed === 0, `${closed} fermés`);

  await page.goto(BASE + '/devis', { waitUntil: 'load' });
  const action = await page.$eval('[data-quote-form]', (n) => n.getAttribute('action'));
  const enctype = await page.$eval('[data-quote-form]', (n) => n.getAttribute('enctype'));
  ok('formulaire postable nativement vers Basin', action === 'https://usebasin.com/f/ba3ae17d310d', action);
  ok('enctype multipart/form-data', enctype === 'multipart/form-data', enctype);
  await ctx.close();
}

console.log(fails.length ? `\n✗ ${fails.length} échec(s) : ${fails.join(' | ')}` : '\n✓ tous les tests passent');
await browser.close();
process.exit(fails.length ? 1 : 0);
