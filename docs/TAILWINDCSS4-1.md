# Documentation Tailwind CSS v4.1 pour Starter Cursor

Ce document décrit la manière recommandée d'intégrer Tailwind CSS v4.1 dans tes projets statiques basés sur Cursor. Tu pourras l'inclure dans ton starter et le réutiliser pour tous tes sites.

## 1. Vue d'ensemble

Tailwind CSS v4.1 propose une configuration CSS‑first sans nécessité d'un fichier tailwind.config.js. L'approche CSS‑first permet :

- Une personnalisation du thème directement dans ton CSS.
- Une détection automatique des fichiers sources.
- Un build ultra‑rapide (plugin Vite inclus).

## 2. Prérequis

Avant de démarrer, assure-toi d'avoir :

- Node.js (>= 18.x) et npm/yarn installés.
- Un projet Cursor initialisé (structure classique : src/, public/, etc.).

## 3. Installation des dépendances

Dans la racine de ton projet, installe :

```bash
npm install -D tailwindcss@^4.1 postcss autoprefixer @tailwindcss/vite
```

⚙️ **Optionnel** : ajoute aussi les plugins officiels (forms, typography…) si tu en as besoin :

```bash
npm install -D @tailwindcss/forms @tailwindcss/typography
```

## 4. Fichier CSS principal (src/styles.css)

Crée ou remplace ton fichier CSS principal par :

```css
/* 1. Charger la config JS si nécessaire */
/* @config "./tailwind.config.js"; */

/* 2. Importer Tailwind */
@import "tailwindcss";

/* 3. Définir ton thème et tes variables */
@theme {
  --font-sans: "Satoshi", sans-serif;
  --breakpoint-xl: 1280px;
  --color-primary-500: oklch(0.7 0.1 130);
  /* Ajoute ici tes couleurs, typographies, espacements… */
}

/* 4. Ajouter les plugins (CSS‑first) */
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

/* 5. Scanner d'autres sources d'utilitaires (lib UI externe) */
@source "../node_modules/ma‑lib-ui";
```

### Explications des directives :
- `@import` : initialise Tailwind.
- `@theme` : transforme tes variables CSS en classes utilitaires.
- `@plugin` et `@source` : ajout de fonctionnalités et détection de sources sans JS.

## 5. Intégration avec Vite (vite.config.ts)

Pour un build ultra‑rapide et le mode Watch :

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  root: 'src',       // si Cursor utilise src comme racine
  publicDir: '../public',
});
```

Puis dans ton package.json, ajoute :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  }
}
```

## 6. Build via PostCSS CLI (sans Vite)

Si tu n'utilises pas Vite, tu peux générer ton CSS avec PostCSS :

```javascript
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Et dans package.json :

```json
{
  "scripts": {
    "build:css": "tailwindcss -i src/styles.css -o public/dist/styles.css --minify",
    "watch:css": "tailwindcss -i src/styles.css -o public/dist/styles.css --watch"
  }
}
```

## 7. Optionnel : conserver tailwind.config.js

Si tu préfères la configuration JS :

Crée manuellement tailwind.config.js à la racine :

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,vue}', './public/index.html'],
  theme: { extend: { colors: { primary: { 500: '#1e40af' } } } },
  plugins: [require('@tailwindcss/forms')],
};
```

Lie-le dans ton CSS :

```css
@config "./tailwind.config.js";
@import "tailwindcss";
```

Lance la CLI avec l'option -c :

```bash
npx tailwindcss -c tailwind.config.js -i src/styles.css -o public/dist/styles.css
```

## 8. Commandes de build récapitulatives

- En dev (Vite) : `npm run dev`
- Build prod (Vite) : `npm run build`
- Watch CSS (PostCSS) : `npm run watch:css`
- Build CSS (PostCSS) : `npm run build:css`

## 9. Conseils et dépannage

- **Styles manquants** : supprime l'ancien cache (node_modules/.cache) et redémarre le watcher.
- **Classes non générées** : assure-toi que tes fichiers sont inclus (via heuristiques ou @source).
- **Conflits config JS/CSS** : choisis une seule méthode (CSS‑first ou JS‑based).
- **Plugins pas pris en compte** : active-les dans ton CSS (@plugin) ou dans la clé plugins du JS.
