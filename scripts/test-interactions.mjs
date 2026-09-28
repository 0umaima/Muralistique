/**
 * Tests d'interaction du site (filtres, accordéon, comparateur, navigation
 * mobile, mouvement réduit, fonctionnement sans JavaScript, version anglaise
 * et sélecteur de langue).
 *
 *   npm run build && npm run preview   # dans un terminal
 *   node scripts/test-interactions.mjs # dans un autre
 *
 * Aucun envoi réel n'est effectué vers Basin : la requête est interceptée.
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = process.env.SHOT_DIR || '/tmp';

const browser = await launchBrowser();
const fails = [];
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) fails.push(label);
};

// ─── 1. Filtres + grille ─────────────────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/realisations', { waitUntil: 'networkidle' });
  const visible = () => page.$$eval('[data-project]:not([hidden])', (n) => n.length);
  const count = () => page.$eval('[data-project-count]', (n) => n.textContent.trim());
  const moreHidden = () => page.$eval('[data-project-more]', (n) => n.hidden);
  const wide = () => page.$$eval('[data-project].is-wide:not([hidden])', (n) => n.map((e) => e.dataset.index));

  console.log('\n— Réalisations : filtres et grille');
  ok('7 projets visibles au chargement', (await visible()) === 7, `vu ${await visible()}`);
  ok('compteur = 7 projets', (await count()) === '7 projets', await count());
  ok('bouton « voir plus » masqué (tout tient sur une page)', (await moreHidden()) === true);
  ok('nombre impair : 1re tuile en pleine largeur', (await wide()).join() === '0', (await wide()).join());

  const sizes = await page.$$eval('[data-project]:not([hidden]):not(.is-wide)', (n) =>
    n.map((e) => `${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`)
  );
  ok('toutes les autres tuiles ont la même taille', new Set(sizes).size === 1, [...new Set(sizes)].join(' '));

  await page.click('[data-filter="sante"]');
  await page.waitForTimeout(250);
  ok('filtre Santé : 1 projet', (await visible()) === 1, `vu ${await visible()}`);
  ok('compteur suit le filtre', (await count()) === '1 projet', await count());
  ok('URL partageable', page.url().includes('secteur=sante'), page.url());

  await page.click('[data-filter="bureaux"]');
  await page.waitForTimeout(250);
  ok('filtre Bureaux : 2 projets', (await visible()) === 2, `vu ${await visible()}`);
  ok('nombre pair : aucune tuile pleine largeur', (await wide()).length === 0, (await wide()).join());

  await page.click('[data-filter="hotellerie"]');
  await page.waitForTimeout(200);
  ok('filtre parcourt tout le jeu de données', (await visible()) === 1, `vu ${await visible()}`);

  await page.click('[data-filter="tous"]');
  await page.waitForTimeout(200);
  ok('retour à Tous : 7 projets', (await visible()) === 7, `vu ${await visible()}`);

  const tile = await page.$('[data-project]:not(.is-wide) .tile__link');
  await tile.scrollIntoViewIfNeeded();
  await page.mouse.move(5, 5); // pointeur sur l'en-tête, hors des tuiles
  await page.waitForTimeout(1300);
  const hidden = await tile.$eval('.tile__title', (n) => getComputedStyle(n).opacity);
  await tile.hover();
  await page.waitForTimeout(700);
  const shown = await tile.$eval('.tile__title', (n) => getComputedStyle(n).opacity);
  ok('infos du projet masquées puis affichées au survol', hidden === '0' && shown === '1', `${hidden} -> ${shown}`);

  await page.evaluate(() => {
    document.querySelectorAll('[data-project]').forEach((c) => (c.dataset.sector = 'inexistant'));
  });
  await page.click('[data-filter="sante"]');
  await page.waitForTimeout(250);
  ok('état vide affiché', (await page.$eval('[data-project-empty]', (n) => n.hidden)) === false);
  ok('compteur à 0', (await count()) === '0 projet', await count());
  await page.close();
}

// ─── 1b. Page projet : visionneuse ──────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/realisations/ecole-les-tilleuls', { waitUntil: 'networkidle' });
  console.log('\n— Page projet : visionneuse');
  const isOpen = () => page.$eval('[data-lightbox]', (n) => n.open);
  const first = await page.$('[data-lightbox-item]');
  await first.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await first.click();
  await page.waitForTimeout(300);
  ok('ouverture au clic', await isOpen());
  const src1 = await page.$eval('[data-lightbox-img]', (n) => n.getAttribute('src'));
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);
  const src2 = await page.$eval('[data-lightbox-img]', (n) => n.getAttribute('src'));
  ok('flèche → : image suivante', src1 !== src2 && Boolean(src2));
  ok('compteur « 2 / 2 »', (await page.$eval('[data-lightbox-count]', (n) => n.textContent)) === '2 / 2');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok('Échap referme', !(await isOpen()));
  ok('focus rendu à la vignette', await page.evaluate(() => document.activeElement?.hasAttribute('data-lightbox-item')));
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

  const order = await page.$$eval('main > section[id], main > section', (n) =>
    n.map((s) => s.id || s.className.split(' ')[0])
  );
  const want = ['transformations', 'services', 'secteurs', 'contact', 'retours'];
  const got = order.filter((id) => want.includes(id));
  ok('ordre des sections', got.join() === want.join(), got.join(' > '));

  // Carrousel des secteurs : flèches, compteur, glisser sans ouvrir de carte.
  await page.evaluate(() => document.querySelector('#secteurs').scrollIntoView());
  await page.waitForTimeout(600);
  const current = () => page.$eval('[data-carousel-current]', (n) => n.textContent);
  ok('carrousel : flèche précédente inactive au départ', await page.$eval('[data-carousel-prev]', (n) => n.disabled));
  await page.click('[data-carousel-next]');
  await page.waitForTimeout(700);
  ok('carrousel : flèche suivante avance', (await current()) === '02', await current());
  const rail = await (await page.$('[data-carousel-viewport]')).boundingBox();
  const before = await page.$eval('[data-carousel-viewport]', (n) => n.scrollLeft);
  await page.mouse.move(rail.x + rail.width * 0.7, rail.y + rail.height / 2);
  await page.mouse.down();
  await page.mouse.move(rail.x + rail.width * 0.3, rail.y + rail.height / 2, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  const after = await page.$eval('[data-carousel-viewport]', (n) => n.scrollLeft);
  ok('carrousel : glisser à la souris fait défiler', after > before, `${before} -> ${after}`);
  ok('carrousel : un glisser n’ouvre pas la carte', new URL(page.url()).pathname === '/', page.url());
  const cards = await page.$$eval('.sectors__card', (n) => n.map((c) => getComputedStyle(c).borderTopLeftRadius));
  ok('cartes secteurs à angles francs', cards.every((r) => r === '0px'), cards.join());
  const imgs = await page.$$eval('.sectors__card img', (n) => n.map((i) => i.currentSrc || i.src));
  ok('cartes secteurs : aucune image de remplacement', imgs.every((src) => !/sectors\//.test(src)), imgs.length + ' images');

  await page.close();
}

// ─── 2b. Décalage du défilement par ancre ───────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.goto(BASE + '/#services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const top = await page.$eval('#services', (n) => n.getBoundingClientRect().top);
  const hh = await page.$eval('[data-header]', (n) => n.getBoundingClientRect().height);
  ok(
    'ancre #services juste sous l’en-tête',
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
  const hidden = await page.$$eval('[data-reveal]', (n) =>
    n.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length
  );
  ok('aucun contenu masqué', hidden === 0, `${hidden} éléments à opacité < 1`);
  const stats = await page.$$eval('[data-count]', (n) => n.map((e) => e.textContent.trim()));
  ok('compteurs affichent la valeur finale', stats.join('|') === '120+|6|100%|15 j', stats.join('|'));
  await page.evaluate(() => document.querySelector('#secteurs').scrollIntoView());
  await page.click('[data-carousel-next]');
  await page.waitForTimeout(300);
  ok(
    'carrousel sans effet de mouvement',
    (await page.$eval('[data-carousel-track]', (n) => n.style.transform)) === '' &&
      (await page.$$eval('[data-carousel-parallax]', (n) => n.every((e) => !e.style.getPropertyValue('--px'))))
  );
  const clipped = await page.$$eval('[data-reveal-clip] > *', (n) =>
    n.filter((e) => getComputedStyle(e).clipPath !== 'none').length
  );
  ok('aucune image découpée', clipped === 0, `${clipped} images découpées`);
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
  const full = await page.$eval('[data-project]', (n) => Math.round(n.getBoundingClientRect().width));
  const grid = await page.$eval('[data-project-grid]', (n) => Math.round(n.clientWidth));
  ok('1re tuile pleine largeur sans JavaScript', full > grid * 0.9, `${full}/${grid}`);

  await page.goto(BASE + '/', { waitUntil: 'load' });
  const dim = await page.$$eval('[data-reveal]', (n) =>
    n.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length
  );
  ok('aucune section masquée sur l’accueil', dim === 0, `${dim} éléments à opacité < 1`);
  const closed = await page.$$eval('[data-accordion-panel]', (n) =>
    n.filter((e) => getComputedStyle(e).gridTemplateRows.startsWith('0')).length
  );
  ok('panneaux services tous ouverts', closed === 0, `${closed} fermés`);

  await page.goto(BASE + '/devis', { waitUntil: 'load' });
  const action = await page.$eval('[data-quote-form]', (n) => n.getAttribute('action'));
  const enctype = await page.$eval('[data-quote-form]', (n) => n.enctype);
  ok('formulaire postable nativement vers Basin', action === 'https://usebasin.com/f/ba3ae17d310d', action);
  ok('encodage par défaut des formulaires', enctype === 'application/x-www-form-urlencoded', enctype);
  ok('validation native active sans JavaScript', await page.$eval('[data-quote-form]', (n) => !n.noValidate));
  const required = await page.$$eval('[data-quote-form] [required]', (n) => n.map((e) => e.name));
  ok('seul le téléphone est exigé', required.join() === 'phone', required.join());
  await ctx.close();
}

// ─── 6. Version anglaise et sélecteur de langue ─────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  console.log('\n— Version anglaise');

  // La bascule garde le filtre en cours
  await page.goto(BASE + '/realisations?secteur=bureaux', { waitUntil: 'networkidle' });
  ok('sélecteur visible dans l’en-tête', await page.isVisible('[data-header] [data-lang-switch]'));
  await Promise.all([page.waitForURL('**/en/projects?secteur=bureaux'), page.click('[data-lang-link]')]);
  ok('FR → EN garde le filtre', page.url().endsWith('/en/projects?secteur=bureaux'), page.url());
  ok('page anglaise : <html lang="en">', (await page.evaluate(() => document.documentElement.lang)) === 'en');
  ok(
    'filtre et compteur traduits',
    (await page.$eval('.filter.is-active', (n) => n.firstChild.textContent.trim())) === 'Offices' &&
      (await page.$eval('[data-project-count]', (n) => n.textContent.trim())) === '2 projects'
  );
  await page.click('[data-filter="tous"]');
  ok('« All » : 7 projects', (await page.$eval('[data-project-count]', (n) => n.textContent.trim())) === '7 projects');
  ok('curseur sur EN', (await page.$eval('[data-lang-switch]', (n) => n.dataset.active)) === 'en');

  // Retour arrière : le curseur revient sur FR
  await page.goBack({ waitUntil: 'networkidle' });
  ok(
    'retour arrière : page et curseur en français',
    page.url().endsWith('/realisations?secteur=bureaux') &&
      (await page.$eval('[data-lang-switch]', (n) => n.dataset.active)) === 'fr',
    page.url()
  );

  // Au clavier, et retour EN → FR avec l'ancre
  await page.goto(BASE + '/studio', { waitUntil: 'networkidle' });
  await page.focus('[data-lang-link]');
  await Promise.all([page.waitForURL('**/en/studio'), page.keyboard.press('Enter')]);
  ok('bascule au clavier', page.url().endsWith('/en/studio'), page.url());
  await page.goto(BASE + '/en#contact', { waitUntil: 'networkidle' });
  await Promise.all([page.waitForURL((url) => url.pathname === '/'), page.click('[data-lang-link]')]);
  ok('EN → FR garde l’ancre', page.url().endsWith('/#contact'), page.url());

  // Aucun lien interne d'une page anglaise ne renvoie vers le site français
  // (hors sélecteur de langue et images grand format de la galerie)
  for (const path of ['/en', '/en/projects', '/en/projects/cafe-nord', '/en/studio', '/en/quote', '/en/legal-notice', '/en/404']) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    const leaks = await page.$$eval('a[href^="/"]:not([data-lang-link]):not([href^="/_astro/"])', (n) =>
      n.map((a) => a.getAttribute('href')).filter((href) => href !== '/en' && !href.startsWith('/en/') && !href.startsWith('/en#') && !href.startsWith('/en?'))
    );
    ok(`${path} — liens internes en anglais`, leaks.length === 0, leaks.slice(0, 3).join(', '));
  }
  ok('404 anglaise', (await page.$eval('h1', (n) => n.textContent.trim())) === 'This wall doesn’t exist.');

  // Formulaire anglais : messages traduits, langue transmise à l'atelier
  await page.goto(BASE + '/en/quote', { waitUntil: 'networkidle' });
  await page.click('[data-submit]');
  ok(
    'erreur de validation en anglais',
    (await page.$eval('[data-error-for="phone"]', (n) => n.textContent)).startsWith('Please enter your phone number')
  );
  let body = '';
  await page.route('https://usebasin.com/**', (route) => {
    body = route.request().postData() || '';
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await page.fill('#qf-phone', '+212 6 12 34 56 78');
  await page.click('[data-submit]');
  await page.waitForSelector('[data-form-status][data-tone="success"]');
  ok('langue « English » envoyée avec la demande', new URLSearchParams(body).get('language') === 'English', body.slice(0, 80));
  ok('confirmation en anglais', (await page.$eval('[data-form-status]', (n) => n.textContent)).includes('Thank you'));
  await page.close();
}

// ─── 7. Sélecteur de langue sans JavaScript ─────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/devis', { waitUntil: 'load' });
  console.log('\n— Sélecteur de langue sans JavaScript');
  ok('visible en mobile sans JavaScript', await page.isVisible('[data-lang-switch]'));
  await Promise.all([page.waitForURL('**/en/quote'), page.click('[data-lang-link]')]);
  ok('lien simple vers la page anglaise', page.url().endsWith('/en/quote'), page.url());
  await ctx.close();
}

console.log(fails.length ? `\n✗ ${fails.length} échec(s) : ${fails.join(' | ')}` : '\n✓ tous les tests passent');
await browser.close();
process.exit(fails.length ? 1 : 0);
