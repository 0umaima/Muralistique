# Muralistique — site vitrine

Portfolio de l'atelier de fresques murales **Muralistique**, construit en
[Astro](https://astro.build) avec du CSS écrit à la main et un minimum de
JavaScript natif. Sortie **100 % statique** : aucun CMS, aucune base de
données, ni React ni Tailwind ni bibliothèque d'animation.

## Démarrage rapide

**Prérequis :** [Node.js](https://nodejs.org) **20.3 ou plus récent** (22 LTS
recommandé, voir `.nvmrc`). Vérifiez avec `node --version`.

```bash
npm install      # une seule fois, installe les dépendances
npm run dev      # développement : http://localhost:4321, rechargement à chaud
```

Les trois étapes complètes (développement → construction → vérification →
mise en ligne) sont détaillées au §7.

---

## 1. Ce qu'il faut remplacer avant la mise en ligne

Tout ce qui suit est un **espace réservé**. Rien n'a été inventé : les
coordonnées, chiffres et témoignages viennent de la maquette et doivent être
confirmés ou remplacés.

| À faire | Où | Effet si oublié |
| --- | --- | --- |
| **Numéro WhatsApp** | `src/data/site.mjs` → `contact.whatsappNumber` | Un encadré d'avertissement s'affiche à la place du bouton, sur toutes les pages |
| **Numéro de téléphone** | `src/data/site.mjs` → `contact.phoneDisplay` / `phoneHref` | La mention « à remplacer » apparaît dans le pied de page et sur `/devis` |
| **Adresse e-mail** | `src/data/site.mjs` → `contact.email` | Les liens `mailto:` pointent vers l'adresse d'exemple |
| **Lien Instagram** (et autres réseaux) | `src/data/site.mjs` → `social` | La mention « lien à renseigner » apparaît dans le pied de page ; les icônes des réseaux vides sont masquées |
| **Domaine définitif** | `src/data/site.mjs` → `url` | Sitemap, `robots.txt` et URL canoniques pointent vers le mauvais domaine |
| **Mentions légales** | `src/data/site.mjs` → `legal` | La page `/mentions-legales` affiche « à compléter » et reste `noindex` tant qu'il manque une information |
| **Chiffres clés** (120+, 6, 100 %, 15 j) | `src/data/content.ts` → `stats` | Chiffres de la maquette, non vérifiés |
| **Nombre de projets par secteur** | `src/data/sectors.ts` → `count` | Chiffres de la maquette, non vérifiés |
| **Témoignage client** | `src/data/content.ts` → `testimonial` | Passez `enabled: false` pour masquer le bloc tant que le témoignage n'est pas validé |
| **Fourchettes de budget** | `src/data/content.ts` → `quoteOptions.budgets` | Montants en dirhams repris de la maquette, à adapter |
| **Vos projets** | `src/data/projects.ts` | Les 7 projets sont ceux de la maquette, textes marqués « TEXTE À REMPLACER » |
| **Toutes les images** | `src/assets/images/` | Voir §3 |

---

## 2. Où se modifie quoi

Tout le contenu éditable vit dans **`src/data/`**. Aucun texte n'est codé en
dur dans les composants.

```
src/data/
  site.mjs      Coordonnées, WhatsApp, réseaux, domaine, réglages du formulaire, mentions légales
  projects.ts   Les projets (page Réalisations + pages projet + avant/après de l'accueil)
  sectors.ts    Les six secteurs (carrousel de l'accueil + filtres des Réalisations)
  content.ts    Chiffres clés, processus, services, témoignage, page Studio, options du formulaire
  nav.ts        Liens du menu et du pied de page
```

### Ajouter un projet

1. Copiez un bloc dans `src/data/projects.ts`.
2. Changez `slug` — il devient l'URL `/realisations/<slug>`, la page est
   générée automatiquement.
3. Déposez vos photos dans `src/assets/images/projects/<slug>/` et renseignez
   les chemins (`cover`, `beforeAfter`, `gallery`).
4. `sector` doit correspondre à un `slug` de `src/data/sectors.ts`.
5. Les champs `facts` (surface, durée, année, client) laissés vides (`''`) ne
   sont **pas affichés** — n'inventez pas de chiffres.

### Options utiles

- `wide: true` → carte pleine largeur dans la grille (format panoramique).
- `featuredOnHome: true` + `beforeAfter` → alimente le comparateur de l'accueil.
- `featuredInHero: true` → apparaît dans les trois liens du hero des Réalisations
  (les trois premiers sont retenus).
- `ratio` → proportion de la carte dans la grille, reprise de la maquette.

---

## 3. Remplacer les images

Chaque fichier de `src/assets/images/` est un placeholder aux **bonnes
dimensions**. Pour mettre les vôtres : **remplacez le fichier en gardant
exactement le même nom**. Rien d'autre à modifier.

`src/assets/images/README.md` liste chaque fichier avec sa taille conseillée.
Résumé :

| Dossier | Contenu |
| --- | --- |
| `brand/` | `logo.png` (256 × 256, fond transparent) et `og.jpg` (1200 × 630, partage réseaux sociaux) |
| `home/` | Fond du hero + les trois vignettes (gauche, centre, droite) |
| `sectors/` | Une image par secteur (6) |
| `process/` | Croquis, tracé, mise en couleur |
| `services/` | Fresque, toile, performance |
| `people/` | Portrait du témoignage |
| `portfolio/` | Fond du hero de la page Réalisations |
| `studio/` | Hero, portrait secondaire, 4 images de galerie |
| `projects/<slug>/` | `cover.jpg`, `avant.jpg`, `apres.jpg`, `1.jpg`, `2.jpg` |

Le favicon est `public/favicon.png` (copie du logo — pensez à le remplacer aussi).

**Textes alternatifs :** ils se modifient dans `src/data/`, à côté du chemin de
chaque image. Ils sont obligatoires pour l'accessibilité et le référencement.

**Optimisation :** Astro s'en charge au build — tailles responsives, AVIF/WebP,
dimensions explicites (pas de saut de mise en page) et chargement différé pour
tout ce qui est sous la ligne de flottaison. L'image centrale du hero est
prioritaire (`priority`). Fournissez des originaux au **double** des dimensions
d'affichage, en JPEG ou PNG de bonne qualité.

Pour régénérer les placeholders (si vous en supprimez un par erreur) :

```
node scripts/generate-placeholders.mjs
```

---

## 4. Formulaire de devis

**Point de terminaison :** `https://usebasin.com/f/ba3ae17d310d`
(modifiable dans `src/data/site.mjs` → `form.endpoint`).

### Fonctionnement

- Envoi en `POST` **`multipart/form-data`** — indispensable pour les pièces
  jointes. Le `Content-Type` n'est jamais fixé à la main : c'est le navigateur
  qui écrit la limite (« boundary ») multipart.
- En-tête `Accept: application/json` pour obtenir une réponse JSON.
- **Le succès n'est annoncé qu'après acceptation par Basin.** Une réponse
  d'erreur, une réponse `success: false` ou une coupure réseau affichent un
  message d'échec, jamais une confirmation.
- **Sans JavaScript**, le formulaire reste un `<form action="…" method="post">`
  classique : le navigateur l'envoie lui-même et Basin affiche sa page de
  confirmation.
- Champs obligatoires : **nom, e-mail, ville, description, consentement**.
  Validation en français, focus placé sur le premier champ en défaut,
  `aria-invalid` et messages liés par `aria-describedby`.
- **Aucun double envoi** : le bouton est verrouillé pendant la requête et après
  un succès.
- **Les saisies sont conservées** en cas d'échec — rien à ressaisir.
- Champ piège anti-spam `_gotcha`, invisible pour les visiteurs.

### Pièces jointes

Limites appliquées **dans le navigateur**, configurables dans
`src/data/site.mjs` → `form.uploads` :

- 2 photos maximum ;
- 750 Ko par photo ;
- 1,5 Mo au total ;
- JPEG, PNG ou WebP uniquement.

Un fichier hors limites est **refusé à l'ajout** avec la raison précise, et
chaque photo acceptée peut être retirée d'un clic.

> ⚠️ Ces limites servent à éviter les envois trop lourds. **Elles ne remplacent
> pas et ne garantissent pas** le plafond de stockage du compte Basin, qui
> reste défini côté Basin. Vérifiez-le dans votre tableau de bord.

### Quota et coupure du formulaire

Il n'y a **aucun compteur mensuel simulé** dans le site : afficher « il reste
X demandes ce mois-ci » sans accès à l'état réel de Basin serait faux. À la
place :

- les réponses d'erreur documentées sont traduites en messages clairs —
  `429` / `402` / `403` → « limite du service atteinte », `413` → fichiers trop
  lourds, `422` → erreurs de champ reportées sur les champs concernés ;
- un **interrupteur manuel** permet de fermer le formulaire :

  ```js
  // src/data/site.mjs
  form: { formEnabled: false, disabledMessage: '…' }
  ```

  Le formulaire est alors remplacé par votre message et les contacts directs.

Dans tous les cas d'échec, l'alternative **WhatsApp / e-mail** reste proposée.

### Vérification non effectuée

La documentation officielle de Basin (`usebasin.com` et `docs.usebasin.com`)
est **bloquée par le proxy réseau de l'environnement de développement** : elle
n'a pas pu être consultée pendant l'intégration. Le code suit le comportement
publié et documenté de Basin (endpoint `usebasin.com/f/<id>`, `multipart/form-data`,
`Accept: application/json`) et reste **volontairement défensif** : il n'annonce
un succès que sur une réponse 2xx sans `success: false`, et gère plusieurs
formes de corps d'erreur.

**Aucun envoi réel n'a été effectué vers Basin.** Les tests utilisent des
réponses simulées. Avant la mise en ligne, faites **un envoi de test manuel**
et vérifiez :

1. que la demande arrive bien dans le tableau de bord Basin ;
2. que la photo jointe est bien reçue ;
3. les libellés des champs (`name`, `phone`, `email`, `city`, `space_type`,
   `budget`, `start_date`, `message`, `photos[]`, `consent`) ;
4. le comportement réel en cas de quota atteint, et ajustez au besoin les codes
   d'erreur dans `src/scripts/quote-form.ts` (fonction `describeFailure`).

---

## 5. Vidéos YouTube — évolution prévue

La maquette prévoit une courte vidéo (ou GIF) au centre du hero de l'accueil.
**Elle est aujourd'hui remplacée par une image fixe**, volontairement : une
vidéo en lecture automatique pèse lourd, casse le score de performance et,
intégrée via l'iframe YouTube classique, dépose des cookies tiers avant tout
consentement.

L'évolution recommandée est le **clic-pour-charger** (« facade ») :

1. Afficher la miniature (l'image actuelle) avec un bouton de lecture visible
   — le cadre est déjà au bon format dans `src/components/home/Hero.astro`.
2. Au clic **seulement**, remplacer la miniature par une iframe
   `https://www.youtube-nocookie.com/embed/<ID>?autoplay=1` créée en JavaScript.
3. Tant qu'on n'a pas cliqué : aucune requête vers YouTube, aucun cookie, aucun
   script tiers — donc aucune bannière de consentement nécessaire pour cela.
4. Prévoir `title` sur l'iframe, `loading="lazy"`, et un lien de repli vers la
   vidéo pour les navigateurs sans JavaScript.

Concrètement : ajouter un champ `youtubeId` dans `src/data/content.ts`, et dans
`Hero.astro` remplacer le repère « Emplacement vidéo » par un `<button>` qui
injecte l'iframe. Le reste du site n'est pas concerné.

---

## 6. Architecture

```
src/
  components/        Composants réutilisables (.astro)
    home/            Sections de l'accueil
  layouts/           Gabarit de page (métadonnées, en-tête, pied de page)
  pages/             Une page = un fichier
    realisations/[slug].astro   Pages projet générées depuis les données
    robots.txt.ts               robots.txt généré (domaine configurable)
  scripts/           JavaScript natif, chargé par page
  styles/global.css  Jetons de design : palette, échelle typographique, rythme
  data/              Contenu (voir §2)
  assets/images/     Images optimisées par Astro
public/fonts/        Bricolage Grotesque + Manrope auto-hébergées
scripts/             Outils de développement (placeholders, captures, tests)
```

### Design

- Palette **ivoire / encre / blush** et typographies **Bricolage Grotesque**
  (titres) + **Manrope** (textes), conformes à la maquette.
- Toutes les valeurs sont des variables CSS en haut de `src/styles/global.css` :
  changez-les là et tout le site suit.
- Échelle typographique fluide en `clamp()` : la borne haute correspond
  exactement aux tailles de la maquette à 1440 px.
- **Polices auto-hébergées** (`public/fonts/`) : aucun appel à Google Fonts en
  production — plus rapide, et rien à demander au visiteur côté RGPD. Pour les
  mettre à jour : `node scripts/fetch-fonts.mjs`.
- Icônes **Lucide** recopiées en SVG dans `src/components/Icon.astro` (aucune
  dépendance). Marques officielles des réseaux sociaux dans `BrandIcon.astro`.
  Aucun emoji.

### En-tête

Barre collante à **hauteur stable** (82 px, 62 px en mobile). Son fond bascule
entre ivoire et encre selon la section qui passe dessous : chaque section
déclare explicitement `data-section-theme="ink|ivory"` — rien n'est deviné, ce
qui évite les clignotements aux frontières. Les ancres s'arrêtent juste sous
l'en-tête (`scroll-margin-top`).

Navigation mobile : panneau plein écran, `aria-expanded`, piège de focus,
fermeture par Échap, focus rendu au bouton, défilement de page bloqué.

### Animations

- Apparitions au défilement : fondu + 24 px vers le haut, 700 ms, léger
  décalage en cascade, **une seule fois par chargement**.
- Vignettes du hero : entrée par les côtés opposés, 900 ms, jusqu'à leur
  inclinaison de référence (−5° / +5°).
- Chiffres clés : comptage jusqu'à la valeur exacte à la première apparition,
  suffixes conservés (`+`, `%`, ` j`).
- Cartes du processus : légère rotation au départ, alignement à l'arrivée.
- Studio : volet blush qui s'efface, révélation de la photo au clip, entrée du
  titre. Accordéon en `grid-template-rows`. Survol des cartes projet.

Tout est en CSS + `IntersectionObserver`. `prefers-reduced-motion: reduce`
désactive l'ensemble, et **si le JavaScript échoue ou est désactivé, aucun
contenu n'est masqué** (les règles d'apparition ne s'appliquent que si
`<html class="js">` est posé). Un filet de sécurité révèle tout au bout de 3 s.

### Réalisations

Filtres par secteur et bouton « voir plus », entièrement côté client :
6 projets au départ, 6 de plus par clic. Le filtre parcourt **tout** le jeu de
données et **remet la limite à la première page** ; le compteur suit, le bouton
disparaît quand il n'y a plus rien à montrer, et un état vide s'affiche s'il
n'y a aucun résultat. L'URL reste partageable (`?secteur=sante`).

**Sans JavaScript**, toutes les cartes sont affichées : **tous les liens projet
restent accessibles** ; seuls les filtres et le bouton « voir plus » sont
masqués.

---

## 7. Commandes, pas à pas

### a. Développement

```bash
npm install        # une seule fois
npm run dev        # http://localhost:4321
```

Le serveur recharge la page à chaque enregistrement. C'est le mode à utiliser
pour changer des textes, remplacer des images ou ajuster le style.

> Les images sont optimisées à la volée en développement : le premier
> chargement d'une page peut prendre une seconde de plus. C'est normal.

### b. Construction (build)

```bash
npm run build      # écrit le site dans dist/
```

Astro génère 13 pages HTML statiques, convertit toutes les images en AVIF/WebP
aux différentes tailles, et produit `sitemap-index.xml`, `robots.txt` et la
page `404`. Le dossier `dist/` fait environ 4 Mo avec les images d'exemple.

Avant de construire pour de bon, renseignez `site.url` dans
`src/data/site.mjs` : le sitemap et les URL canoniques en dépendent.

### c. Vérification locale du site construit (« prod »)

```bash
npm run preview    # sert dist/ sur http://localhost:4321
```

C'est **exactement** ce qui sera mis en ligne : mêmes fichiers, mêmes images,
même JavaScript minifié. Utilisez ce mode pour la vérification finale.

Pour tester depuis un téléphone sur le même réseau :

```bash
npm run preview -- --host
```

### d. Tests automatisés (facultatif)

Une seule fois, installez le navigateur utilisé par les tests :

```bash
npx playwright install chromium
```

Puis, **avec `npm run preview` lancé dans un autre terminal** :

```bash
npm run test:interactions   # filtres, « voir plus », accordéon, comparateur,
                            # navigation mobile, mouvement réduit, sans JavaScript
npm run test:form           # formulaire : validation, états d'envoi, limites de
                            # fichiers, erreurs serveur — réponses SIMULÉES
npm run test:a11y           # 360/768/1024/1440 px, clavier, sémantique, métadonnées
```

Les trois suites passent. **Aucun envoi réel n'est effectué vers Basin.**

Autres outils :

```bash
npm run placeholders        # régénère les images d'espace réservé
npm run fonts               # retélécharge les polices dans public/fonts/
PAGES=/,/studio WIDTHS=360,1440 node scripts/shoot.mjs   # captures pleine page
```

Ces scripts servent au développement ; ils ne font pas partie du site livré.

---

## 8. Mise en ligne sur Cloudflare Pages (offre gratuite)

`npm run build` produit un dossier `dist/` entièrement statique : il n'y a ni
serveur ni base de données à héberger. L'offre **gratuite** de Cloudflare Pages
suffit largement (builds illimités en nombre de sites, 500 builds par mois,
bande passante illimitée, HTTPS et CDN mondial inclus).

### Méthode recommandée — build automatique depuis GitHub

Chaque `git push` reconstruit et publie le site.

1. **Poussez le projet sur GitHub** (dépôt public ou privé, les deux
   fonctionnent avec l'offre gratuite).

2. Sur [dash.cloudflare.com](https://dash.cloudflare.com) →
   **Workers & Pages** → **Create** → onglet **Pages** →
   **Connect to Git** → autorisez GitHub → choisissez le dépôt.

3. Renseignez les réglages de build :

   | Champ | Valeur |
   | --- | --- |
   | Framework preset | **Astro** (ou *None*, les valeurs ci-dessous suffisent) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(laisser vide)* |

4. **Variables d'environnement** → ajoutez, pour la production **et** la
   prévisualisation :

   ```
   NODE_VERSION = 22
   ```

   Le fichier `.nvmrc` du dépôt indique déjà `22`, mais poser la variable évite
   toute ambiguïté. Astro 7 exige Node 20.3 ou plus.

5. **Save and Deploy.** Le premier build prend 1 à 3 minutes. Le site est
   ensuite servi sur `https://<nom-du-projet>.pages.dev`.

À partir de là, chaque push sur la branche principale déclenche une mise en
ligne, et chaque pull request obtient sa propre URL de prévisualisation.

### Méthode alternative — envoi direct du dossier

Sans dépôt Git, ou pour un essai rapide :

- **Par glisser-déposer :** Workers & Pages → Create → Pages →
  **Upload assets**, puis déposez le dossier `dist/` (construit au préalable
  avec `npm run build`).
- **En ligne de commande :**

  ```bash
  npm run build
  npx wrangler pages deploy dist --project-name=muralistique
  ```

  La première exécution ouvre une page d'authentification Cloudflare.

Cette méthode n'a pas de build automatique : il faut reconstruire et renvoyer
le dossier à chaque modification.

### Brancher votre nom de domaine

1. Projet Pages → onglet **Custom domains** → **Set up a custom domain**.
2. Saisissez `muralistique.fr` puis recommencez pour `www.muralistique.fr`.
3. Si le domaine est déjà géré par Cloudflare, les enregistrements DNS sont
   créés automatiquement. Sinon, Cloudflare affiche l'enregistrement `CNAME` à
   ajouter chez votre registraire.
4. Le certificat HTTPS est émis automatiquement (quelques minutes).
5. **Important :** mettez `site.url` (dans `src/data/site.mjs`) à l'adresse
   définitive, puis reconstruisez — sinon le sitemap et les URL canoniques
   pointeront vers le mauvais domaine.

Pour rediriger `muralistique.fr` vers `www.muralistique.fr` (ou l'inverse),
utilisez **Rules → Redirect Rules** dans le tableau de bord du domaine ; c'est
inclus dans l'offre gratuite.

### En-têtes HTTP

Le fichier **`public/_headers`** est copié dans `dist/` au build et lu
automatiquement par Cloudflare Pages. Il définit :

- un cache d'un an pour `/_astro/*` et `/fonts/*` (noms de fichiers versionnés,
  donc sans risque) ;
- une revalidation systématique des pages HTML ;
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` et `Cross-Origin-Opener-Policy`.

**Content-Security-Policy n'y figure pas volontairement.** Astro intègre
plusieurs petits scripts directement dans le HTML : une politique
`script-src 'self'` casserait le site, et une politique par empreintes
(`'sha256-…'`) changerait à chaque build — donc se briserait en silence sans
que personne ne s'en aperçoive. Si vous souhaitez tout de même une CSP, la
directive utile et sans risque à ajouter est celle qui borne la destination du
formulaire :

```
Content-Security-Policy: form-action 'self' https://usebasin.com; frame-ancestors 'none'; base-uri 'self'
```

### Autres hébergeurs

Le dossier `dist/` fonctionne tel quel sur Netlify (qui lit le même format
`_headers`), Vercel, GitHub Pages ou n'importe quel serveur de fichiers.

---

## 9. Ce qui est généré automatiquement

`sitemap-index.xml`, `sitemap-0.xml`, `robots.txt`, la page `404`, les
métadonnées Open Graph et Twitter Card de chaque page, et les variantes
d'images (AVIF/WebP, plusieurs largeurs).
