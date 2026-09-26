/**
 * Tests du formulaire de devis.
 *
 * ⚠ AUCUN ENVOI RÉEL n'est effectué : toutes les requêtes vers Basin sont
 *   interceptées par Playwright et remplacées par des réponses simulées.
 *
 *   npm run build && npm run preview
 *   node scripts/test-form.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = process.env.SHOT_DIR || '/tmp';
const ENDPOINT = 'https://usebasin.com/f/**';

const browser = await launchBrowser();
const fails = [];
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) fails.push(label);
};

/** Ouvre /devis avec l'endpoint Basin simulé. `respond` reçoit la route. */
async function open(respond) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  const captured = [];
  await page.route(ENDPOINT, async (route) => {
    const request = route.request();
    captured.push({
      method: request.method(),
      contentType: request.headers()['content-type'] || '',
      accept: request.headers()['accept'] || '',
      body: request.postData() || '',
    });
    await respond(route);
  });
  await page.goto(BASE + '/devis', { waitUntil: 'networkidle' });
  const close = () => context.close();
  return { page, captured, context, close };
}

const fill = async (page, over = {}) => {
  const data = {
    '#qf-name': 'Salma Bennani',
    '#qf-phone': '06 12 34 56 78',
    '#qf-email': 'salma@exemple.ma',
    '#qf-city': 'Casablanca',
    '#qf-message': 'Un mur de 4 m dans le hall, ambiance végétale, chantier en soirée.',
    ...over,
  };
  for (const [selector, value] of Object.entries(data)) {
    if (value === null) continue;
    await page.fill(selector, value);
  }
};

const statusText = (page) => page.$eval('[data-form-status]', (n) => (n.hidden ? '' : n.textContent.trim()));
const fallbackLinks = (page) =>
  page.$$eval('[data-form-status] .qf-status__fallback a', (n) => n.map((a) => a.getAttribute('href')));

// ─── 1. Validation : seul le téléphone est obligatoire ───────────────────
{
  const { page, captured, close } = await open((route) => route.fulfill({ status: 200, body: '{}' }));
  console.log('\n— Validation (aucun envoi ne doit partir)');

  ok('validation native désactivée par le script', await page.$eval('[data-quote-form]', (n) => n.noValidate));
  ok('aucune zone d’envoi de photos', (await page.$$('input[type="file"]')).length === 0);
  ok('aucune case à cocher obligatoire', (await page.$$('[data-quote-form] input[type="checkbox"]')).length === 0);

  const placeholders = await page.$$eval('[data-quote-form] [placeholder]', (n) => n.map((e) => e.placeholder).join(' | '));
  ok('exemples marocains', /\+212/.test(placeholders) && /Casablanca/.test(placeholders) && /\.ma\b/.test(placeholders), placeholders);
  ok('plus d’exemples français', !/\+33|Marseille|\.fr\b/.test(placeholders), placeholders);

  await page.click('[data-submit]');
  await page.waitForTimeout(200);
  const errors = await page.$$eval('[data-error-for]', (n) =>
    n.map((e) => [e.dataset.errorFor, e.textContent.trim()]).filter(([, t]) => t)
  );
  ok('seul le téléphone est signalé', errors.length === 1 && errors[0][0] === 'phone', JSON.stringify(errors));
  ok('message en français', /téléphone/.test(errors[0]?.[1] || ''), errors[0]?.[1]);
  ok('aucune requête envoyée', captured.length === 0, `${captured.length} requête(s)`);
  ok('focus placé sur le téléphone', await page.evaluate(() => document.activeElement?.id === 'qf-phone'));
  ok('aria-invalid posé', (await page.$eval('#qf-phone', (n) => n.getAttribute('aria-invalid'))) === 'true');

  await page.fill('#qf-phone', '12 34');
  await page.click('[data-submit]');
  await page.waitForTimeout(200);
  const phoneError = await page.$eval('[data-error-for="phone"]', (n) => n.textContent.trim());
  ok('numéro trop court refusé', /incomplet/.test(phoneError), phoneError);

  await page.fill('#qf-phone', '+212 6 12 34 56 78');
  await page.fill('#qf-email', 'pas-une-adresse');
  await page.click('[data-submit]');
  await page.waitForTimeout(200);
  const emailError = await page.$eval('[data-error-for="email"]', (n) => n.textContent.trim());
  ok('e-mail facultatif, mais vérifié s’il est rempli', /laissez le champ vide/.test(emailError), emailError);
  ok('toujours aucune requête', captured.length === 0);
  await page.screenshot({ path: `${OUT}/form-validation.png`, fullPage: false });
  await close();
}

// ─── 2. Succès — téléphone seul, confirmé après acceptation par Basin ────
{
  let resolveHold;
  const hold = new Promise((r) => (resolveHold = r));
  const { page, captured, close } = await open(async (route) => {
    await hold; // on garde la requête en vol pour observer l'état « envoi »
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
  console.log('\n— Envoi accepté (téléphone seul)');

  await page.fill('#qf-phone', '0612345678');
  await page.click('[data-submit]');
  await page.waitForTimeout(300);

  ok('bouton désactivé pendant l’envoi', await page.$eval('[data-submit]', (n) => n.disabled));
  ok('libellé « Envoi en cours… »', (await page.$eval('[data-submit-label]', (n) => n.textContent)).includes('Envoi'));
  ok('aria-busy pendant l’envoi', (await page.$eval('[data-submit]', (n) => n.getAttribute('aria-busy'))) === 'true');
  ok('aucun succès annoncé avant la réponse', !(await statusText(page)).includes('bien arrivée'));

  // second clic pendant l'envoi : ne doit pas produire de requête en double
  await page.click('[data-submit]', { force: true }).catch(() => {});
  resolveHold();
  await page.waitForTimeout(600);

  ok('succès annoncé après acceptation', (await statusText(page)).includes('bien arrivée'), await statusText(page));
  ok('une seule requête envoyée', captured.length === 1, `${captured.length} requête(s)`);
  ok('méthode POST', captured[0].method === 'POST', captured[0].method);
  ok(
    'corps application/x-www-form-urlencoded',
    captured[0].contentType.startsWith('application/x-www-form-urlencoded'),
    captured[0].contentType
  );
  ok('en-tête Accept: application/json', captured[0].accept.includes('application/json'), captured[0].accept);
  const sent = new URLSearchParams(captured[0].body);
  ok('téléphone transmis', sent.get('phone') === '0612345678', sent.get('phone'));
  ok('champs facultatifs transmis vides', sent.has('name') && sent.get('name') === '');
  ok('piège à robots transmis vide', sent.has('_gotcha') && sent.get('_gotcha') === '');
  ok('bouton verrouillé après succès', await page.$eval('[data-submit]', (n) => n.disabled));
  ok('brouillon effacé après succès', (await page.evaluate(() => sessionStorage.getItem('muralistique:devis'))) === null);

  await page.click('[data-submit]', { force: true }).catch(() => {});
  await page.waitForTimeout(300);
  ok('renvoi impossible après succès', captured.length === 1, `${captured.length} requête(s)`);
  await page.screenshot({ path: `${OUT}/form-success.png` });
  await close();
}

// ─── 3. Erreurs serveur : saisie conservée + secours WhatsApp / e-mail ───
const errorCases = [
  { label: 'quota atteint (429)', status: 429, body: '{"error":"rate limited"}', expect: /limite du service|plus de nouvelles demandes/i },
  { label: 'limite de formule (402)', status: 402, body: '{}', expect: /limite du service|plus de nouvelles demandes/i },
  { label: 'erreur serveur (500)', status: 500, body: '{}', expect: /n’a pas abouti/i },
];

console.log('\n— Réponses en erreur (les saisies doivent être conservées)');
for (const testCase of errorCases) {
  const { page, captured, close } = await open((route) =>
    route.fulfill({ status: testCase.status, contentType: 'application/json', body: testCase.body })
  );
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(500);
  const text = await statusText(page);
  ok(testCase.label, testCase.expect.test(text), text.slice(0, 90));
  ok(`  ↳ saisies conservées`, (await page.$eval('#qf-name', (n) => n.value)) === 'Salma Bennani');
  const links = await fallbackLinks(page);
  const wa = links.find((href) => href.startsWith('https://wa.me/')) || '';
  const mail = links.find((href) => href.startsWith('mailto:')) || '';
  ok(`  ↳ secours WhatsApp pré-rempli`, /^https:\/\/wa\.me\/\d{8,}\?text=/.test(wa) && decodeURIComponent(wa).includes('06 12 34 56 78'), wa.slice(0, 60));
  ok(`  ↳ secours e-mail pré-rempli`, mail.includes('@') && decodeURIComponent(mail).includes('Salma Bennani'), mail.slice(0, 60));
  ok(`  ↳ nouvel essai possible`, (await page.$eval('[data-submit]', (n) => n.disabled)) === false);
  await page.click('[data-submit]');
  await page.waitForTimeout(400);
  ok(`  ↳ un nouvel envoi part bien`, captured.length === 2, `${captured.length} requête(s)`);
  if (testCase.status === 429) await page.screenshot({ path: `${OUT}/form-error.png` });
  await close();
}

// ─── 4. Erreurs de validation renvoyées par Basin (422) ──────────────────
{
  const { page, close } = await open((route) =>
    route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({ errors: { email: ['n’est pas une adresse valide'] } }),
    })
  );
  console.log('\n— Erreurs de validation renvoyées par Basin');
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(500);
  const emailError = await page.$eval('[data-error-for="email"]', (n) => n.textContent.trim());
  ok('erreur reportée sur le champ concerné', emailError.includes('adresse valide'), emailError);
  ok('récapitulatif affiché', (await statusText(page)).includes('n’ont pas été acceptés'));
  await close();
}

// ─── 5. Réponse 2xx mais succès explicitement faux ───────────────────────
{
  const { page, close } = await open((route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: '<b>Formulaire désactivé</b>' }),
    })
  );
  console.log('\n— Réponse 200 avec success: false');
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(500);
  const text = await statusText(page);
  ok('pas de faux succès', !text.includes('bien arrivée'), text.slice(0, 80));
  ok('message d’erreur du service repris', text.includes('Formulaire désactivé'), text.slice(0, 80));
  ok('message du service affiché comme texte, jamais comme HTML', (await page.$$('[data-form-status] b')).length === 0);
  await close();
}

// ─── 6. Panne réseau ─────────────────────────────────────────────────────
{
  const { page, close } = await open((route) => route.abort('failed'));
  console.log('\n— Réseau coupé');
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(600);
  const text = await statusText(page);
  ok('message réseau affiché', /connexion/i.test(text), text.slice(0, 80));
  ok('secours proposé', (await fallbackLinks(page)).length === 2);
  ok('saisies conservées', (await page.$eval('#qf-message', (n) => n.value)).startsWith('Un mur de 4 m'));
  ok('nouvel essai possible', (await page.$eval('[data-submit]', (n) => n.disabled)) === false);
  await close();
}

// ─── 7. Hors connexion : rien ne part, le secours est proposé ────────────
{
  const { page, captured, context, close } = await open((route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
  );
  console.log('\n— Hors connexion');
  await fill(page);
  await context.setOffline(true);
  await page.click('[data-submit]');
  await page.waitForTimeout(300);
  const text = await statusText(page);
  ok('message hors connexion', /hors connexion/i.test(text), text.slice(0, 80));
  ok('aucune requête tentée', captured.length === 0, `${captured.length} requête(s)`);
  ok('bouton toujours actif', (await page.$eval('[data-submit]', (n) => n.disabled)) === false);
  await context.setOffline(false);
  await close();
}

// ─── 8. Service muet : on n'attend pas indéfiniment ──────────────────────
{
  const { page, close } = await open(() => new Promise(() => {})); // jamais de réponse
  console.log('\n— Service qui ne répond pas (≈ 20 s)');
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(21000);
  const text = await statusText(page);
  ok('délai dépassé annoncé', /ne répond pas/.test(text), text.slice(0, 80));
  ok('secours proposé', (await fallbackLinks(page)).length === 2);
  ok('nouvel essai possible', (await page.$eval('[data-submit]', (n) => n.disabled)) === false);
  await close();
}

// ─── 9. Brouillon : la saisie survit à un rechargement de l'onglet ───────
{
  const { page, close } = await open((route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
  );
  console.log('\n— Brouillon conservé au rechargement');
  await fill(page);
  await page.click('.qf__budgets label:nth-child(3)');
  await page.reload({ waitUntil: 'networkidle' });
  ok('téléphone restauré', (await page.$eval('#qf-phone', (n) => n.value)) === '06 12 34 56 78');
  ok('projet restauré', (await page.$eval('#qf-message', (n) => n.value)).startsWith('Un mur de 4 m'));
  ok('budget restauré', (await page.$eval('input[name="budget"]:checked', (n) => n.value).catch(() => '')) === '5 000 à 10 000 Dh');
  await close();
}

console.log(fails.length ? `\n✗ ${fails.length} échec(s) : ${fails.join(' | ')}` : '\n✓ tous les tests du formulaire passent');
await browser.close();
process.exit(fails.length ? 1 : 0);
