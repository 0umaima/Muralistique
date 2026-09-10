/**
 * Lancement du navigateur pour les scripts de test et de capture.
 *
 * En temps normal, Playwright sait où trouver son propre Chromium :
 *
 *     npx playwright install chromium
 *
 * On ne force un chemin que si la variable d'environnement CHROME est
 * définie, ou si un Chromium préinstallé existe à l'emplacement conventionnel
 * de certains environnements d'intégration continue.
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const PREINSTALLED = [
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
];

export function executablePath() {
  if (process.env.CHROME) return process.env.CHROME;
  return PREINSTALLED.find((path) => existsSync(path));
}

export async function launchBrowser(options = {}) {
  const path = executablePath();
  try {
    return await chromium.launch(path ? { executablePath: path, ...options } : options);
  } catch (error) {
    console.error(
      '\nImpossible de lancer Chromium.\n' +
        'Installez-le une fois pour toutes avec :\n\n    npx playwright install chromium\n\n' +
        'ou indiquez un binaire existant :  CHROME=/chemin/vers/chrome node scripts/…\n'
    );
    throw error;
  }
}
