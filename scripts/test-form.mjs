/**
 * Tests du formulaire de devis.
 *
 * ⚠ AUCUN ENVOI RÉEL n'est effectué : toutes les requêtes vers Basin sont
 *   interceptées par Playwright et remplacées par des réponses simulées.
 *
 *   npm run build && npm run preview
 *   node scripts/test-form.mjs
 */
import { chromium } from 'playwright';

const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = process.env.SHOT_DIR || '/tmp';
const ENDPOINT = 'https://usebasin.com/f/**';

const browser = await chromium.launch({ executablePath: EXE });
const fails = [];
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) fails.push(label);
};

/** Ouvre /devis avec l'endpoint Basin simulé. `respond` reçoit la route. */
async function open(respond) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
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
  return { page, captured };
}

const fill = async (page, over = {}) => {
  const data = {
    '#qf-name': 'Camille Dupont',
    '#qf-email': 'camille@exemple.fr',
    '#qf-city': 'Marseille',
    '#qf-message': 'Un mur de 12 m dans le hall, ambiance végétale, chantier en soirée.',
    ...over,
  };
  for (const [selector, value] of Object.entries(data)) {
    if (value === null) continue;
    await page.fill(selector, value);
  }
  await page.check('[name="consent"]');
};

const statusText = (page) => page.$eval('[data-form-status]', (n) => (n.hidden ? '' : n.textContent.trim()));

// ─── 1. Validation française côté client ─────────────────────────────────
{
  const { page, captured } = await open((route) => route.fulfill({ status: 200, body: '{}' }));
  console.log('\n— Validation (aucun envoi ne doit partir)');

  await page.click('[data-submit]');
  await page.waitForTimeout(200);
  const errors = await page.$$eval('[data-error-for]', (n) =>
    n.map((e) => [e.dataset.errorFor, e.textContent.trim()]).filter(([, t]) => t)
  );
  const named = Object.fromEntries(errors);
  ok('nom obligatoire signalé', Boolean(named.name), named.name);
  ok('e-mail obligatoire signalé', Boolean(named.email), named.email);
  ok('ville obligatoire signalée', Boolean(named.city), named.city);
  ok('projet obligatoire signalé', Boolean(named.message), named.message);
  ok('consentement obligatoire signalé', Boolean(named.consent), named.consent);
  ok('messages en français', Object.values(named).every((t) => /[éèêàûô]|Ce champ|Merci|Indiquez|Décrivez/.test(t)));
  ok('aucune requête envoyée', captured.length === 0, `${captured.length} requête(s)`);
  ok('focus placé sur le premier champ invalide', await page.evaluate(() => document.activeElement?.id === 'qf-name'));
  ok('aria-invalid posé', (await page.$eval('#qf-name', (n) => n.getAttribute('aria-invalid'))) === 'true');

  await page.fill('#qf-email', 'pas-une-adresse');
  await fill(page, { '#qf-email': null });
  await page.fill('#qf-email', 'pas-une-adresse');
  await page.click('[data-submit]');
  await page.waitForTimeout(200);
  const emailError = await page.$eval('[data-error-for="email"]', (n) => n.textContent.trim());
  ok('format d’e-mail vérifié', /valide/.test(emailError), emailError);
  ok('toujours aucune requête', captured.length === 0);
  await page.screenshot({ path: `${OUT}/form-validation.png`, fullPage: false });
  await page.close();
}

// ─── 2. Succès — confirmé seulement après acceptation par Basin ──────────
{
  let resolveHold;
  const hold = new Promise((r) => (resolveHold = r));
  const { page, captured } = await open(async (route) => {
    await hold; // on garde la requête en vol pour observer l'état « envoi »
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
  console.log('\n— Envoi accepté');

  await fill(page);
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
  ok('corps multipart/form-data', captured[0].contentType.startsWith('multipart/form-data'), captured[0].contentType);
  ok('limite multipart posée par le navigateur', captured[0].contentType.includes('boundary='));
  ok('en-tête Accept: application/json', captured[0].accept.includes('application/json'), captured[0].accept);
  ok('champs présents dans le corps', /name="name"/.test(captured[0].body) && /Camille Dupont/.test(captured[0].body));
  ok('consentement transmis', /name="consent"/.test(captured[0].body));
  ok('piège à robots transmis vide', /name="_gotcha"/.test(captured[0].body));
  ok('bouton verrouillé après succès', await page.$eval('[data-submit]', (n) => n.disabled));

  await page.click('[data-submit]', { force: true }).catch(() => {});
  await page.waitForTimeout(300);
  ok('renvoi impossible après succès', captured.length === 1, `${captured.length} requête(s)`);
  await page.screenshot({ path: `${OUT}/form-success.png` });
  await page.close();
}

// ─── 3. Erreurs serveur ──────────────────────────────────────────────────
const errorCases = [
  { label: 'quota atteint (429)', status: 429, body: '{"error":"rate limited"}', expect: /limite du service|plus de nouvelles demandes/i },
  { label: 'limite de formule (402)', status: 402, body: '{}', expect: /limite du service|plus de nouvelles demandes/i },
  { label: 'fichiers trop lourds (413)', status: 413, body: '{}', expect: /trop lourds/i },
  { label: 'erreur serveur (500)', status: 500, body: '{}', expect: /n’a pas abouti/i },
];

console.log('\n— Réponses en erreur (les saisies doivent être conservées)');
for (const testCase of errorCases) {
  const { page, captured } = await open((route) =>
    route.fulfill({ status: testCase.status, contentType: 'application/json', body: testCase.body })
  );
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(500);
  const text = await statusText(page);
  ok(testCase.label, testCase.expect.test(text), text.slice(0, 90));
  ok(`  ↳ saisies conservées`, (await page.$eval('#qf-name', (n) => n.value)) === 'Camille Dupont');
  ok(`  ↳ nouvel essai possible`, (await page.$eval('[data-submit]', (n) => n.disabled)) === false);
  await page.click('[data-submit]');
  await page.waitForTimeout(400);
  ok(`  ↳ un nouvel envoi part bien`, captured.length === 2, `${captured.length} requête(s)`);
  if (testCase.status === 429) await page.screenshot({ path: `${OUT}/form-error.png` });
  await page.close();
}

// ─── 4. Erreurs de validation renvoyées par Basin (422) ──────────────────
{
  const { page } = await open((route) =>
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
  await page.close();
}

// ─── 5. Réponse 2xx mais succès explicitement faux ───────────────────────
{
  const { page } = await open((route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'Formulaire désactivé' }) })
  );
  console.log('\n— Réponse 200 avec success: false');
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(500);
  const text = await statusText(page);
  ok('pas de faux succès', !text.includes('bien arrivée'), text.slice(0, 80));
  ok('message d’erreur du service repris', text.includes('Formulaire désactivé'), text.slice(0, 80));
  await page.close();
}

// ─── 6. Panne réseau ─────────────────────────────────────────────────────
{
  const { page } = await open((route) => route.abort('failed'));
  console.log('\n— Réseau coupé');
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(600);
  const text = await statusText(page);
  ok('message réseau affiché', /connexion/i.test(text), text.slice(0, 80));
  ok('saisies conservées', (await page.$eval('#qf-message', (n) => n.value)).startsWith('Un mur de 12 m'));
  ok('nouvel essai possible', (await page.$eval('[data-submit]', (n) => n.disabled)) === false);
  await page.close();
}

// ─── 7. Limites de fichiers ──────────────────────────────────────────────
{
  const { page, captured } = await open((route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
  );
  console.log('\n— Photos jointes');

  const makeFile = (name, bytes, mime = 'image/jpeg') => ({
    name,
    mimeType: mime,
    buffer: Buffer.alloc(bytes, 1),
  });

  const clearFiles = async () => {
    await page.evaluate(() => {
      let button;
      while ((button = document.querySelector('.qf-files__remove'))) button.click();
    });
    await page.waitForTimeout(150);
  };

  // fichier trop lourd
  await page.setInputFiles('#qf-photos', [makeFile('mur-lourd.jpg', 900 * 1024)]);
  await page.waitForTimeout(250);
  let error = await page.$eval('[data-error-for="photos"]', (n) => n.textContent.trim());
  ok('fichier > 750 Ko refusé', /750 Ko|maximum/.test(error), error.slice(0, 80));
  ok('  ↳ non ajouté à la liste', (await page.$$eval('.qf-files__item', (n) => n.length)) === 0);

  // mauvais format
  await page.setInputFiles('#qf-photos', [makeFile('plan.pdf', 10 * 1024, 'application/pdf')]);
  await page.waitForTimeout(250);
  error = await page.$eval('[data-error-for="photos"]', (n) => n.textContent.trim());
  ok('format non accepté refusé', /bon format/.test(error), error.slice(0, 80));
  ok('  ↳ non ajouté à la liste', (await page.$$eval('.qf-files__item', (n) => n.length)) === 0);

  // deux fichiers valides
  await clearFiles();
  await page.setInputFiles('#qf-photos', [makeFile('mur-1.jpg', 300 * 1024), makeFile('mur-2.png', 300 * 1024, 'image/png')]);
  await page.waitForTimeout(300);
  let items = await page.$$eval('.qf-files__item', (n) => n.length);
  ok('deux photos listées', items === 2, `${items}`);
  ok('aucune erreur', (await page.$eval('[data-error-for="photos"]', (n) => n.textContent.trim())) === '');
  const summary = await page.$eval('[data-file-list]', (n) => n.textContent);
  ok('récapitulatif de poids affiché', /sur 1,5 Mo/.test(summary), summary.slice(-40));

  // troisième fichier refusé (limite de 2)
  await page.setInputFiles('#qf-photos', [makeFile('mur-3.jpg', 100 * 1024)]);
  await page.waitForTimeout(300);
  items = await page.$$eval('.qf-files__item', (n) => n.length);
  ok('3e photo non ajoutée', items === 2, `${items}`);

  // retrait
  await page.click('.qf-files__item .qf-files__remove');
  await page.waitForTimeout(250);
  items = await page.$$eval('.qf-files__item', (n) => n.length);
  ok('retrait d’une photo', items === 1, `${items}`);
  await page.screenshot({ path: `${OUT}/form-files.png` });

  // Total combiné : avec 2 photos à 750 Ko maximum (1 500 Ko), le plafond
  // combiné de 1,5 Mo (1 536 Ko) n'est jamais franchi — c'est la limite par
  // fichier qui borne l'envoi. On vérifie donc que le cas maximal passe et
  // que le récapitulatif affiche bien le total.
  await clearFiles();
  await page.setInputFiles('#qf-photos', [makeFile('a.jpg', 748 * 1024), makeFile('b.jpg', 748 * 1024)]);
  await page.waitForTimeout(300);
  error = await page.$eval('[data-error-for="photos"]', (n) => n.textContent.trim());
  items = await page.$$eval('.qf-files__item', (n) => n.length);
  ok('cas maximal (2 × 748 Ko) accepté', error === '' && items === 2, `${items} photo(s) — ${error}`);
  const totalText = await page.$eval('[data-file-list]', (n) => n.textContent);
  ok('total affiché par rapport au plafond', /sur 1,5 Mo/.test(totalText), totalText.slice(-30));

  // Envoi final avec une photo valide jointe.
  await clearFiles();
  await page.setInputFiles('#qf-photos', [makeFile('mur-final.jpg', 200 * 1024)]);
  await page.waitForTimeout(250);
  await fill(page);
  await page.click('[data-submit]');
  await page.waitForTimeout(800);
  ok('envoi accepté avec une photo jointe', captured.length === 1, `${captured.length} requête(s)`);
  ok('photo transmise dans le multipart', /name="photos\[\]"/.test(captured[0]?.body || ''));
  ok('nom du fichier transmis', /mur-final\.jpg/.test(captured[0]?.body || ''));
  await page.close();
}

// ─── 8. Plafond combiné ──────────────────────────────────────────────────
// Avec 2 photos à 750 Ko, le total (1 500 Ko) ne franchit jamais 1,5 Mo :
// c'est la limite par fichier qui borne l'envoi. On sert donc la page réelle
// avec un plafond combiné abaissé pour vérifier que la règle s'applique.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  page.on('pageerror', (e) => fails.push('JS error: ' + e.message));
  await page.route(BASE + '/devis', async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      /data-max-total-bytes="\d+"/,
      `data-max-total-bytes="${900 * 1024}"`
    );
    await route.fulfill({ response, body: html });
  });
  await page.goto(BASE + '/devis', { waitUntil: 'networkidle' });
  console.log('\n— Plafond combiné (page servie avec un plafond abaissé à 900 Ko)');

  const file = (name, bytes) => ({ name, mimeType: 'image/jpeg', buffer: Buffer.alloc(bytes, 1) });
  await page.setInputFiles('#qf-photos', [file('a.jpg', 600 * 1024), file('b.jpg', 600 * 1024)]);
  await page.waitForTimeout(350);
  const error = await page.$eval('[data-error-for="photos"]', (n) => n.textContent.trim());
  const items = await page.$$eval('.qf-files__item', (n) => n.length);
  ok('2e photo refusée sur le total combiné', /total autorisé/.test(error), error.slice(0, 90));
  ok('  ↳ une seule photo conservée', items === 1, `${items}`);
  await page.close();
}

console.log(fails.length ? `\n✗ ${fails.length} échec(s) : ${fails.join(' | ')}` : '\n✓ tous les tests du formulaire passent');
await browser.close();
process.exit(fails.length ? 1 : 0);
