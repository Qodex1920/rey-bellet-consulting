# 📘 Documentation Technique – Project Starter Cursor

Cette documentation complète accompagne le fichier `CONTEXT.md` en décrivant les **spécificités techniques**, **conventions avancées**, et **bonnes pratiques** à respecter dans tous les projets utilisant le Starter Cursor. Elle sert de référence pour guider l'IA (Cursor) et tout développeur à produire un code cohérent, maintenable et conforme à la philosophie du template.

---

## 🧱 Stack Technique Résumée

- **Build tool** : Vite
- **Langages** : HTML + JavaScript Vanilla (ou Alpine.js si nécessaire)
- **CSS** : Tailwind CSS v4.1 – approche CSS-first sans fichier `tailwind.config.js`
- **Hébergement cible** : Infomaniak (FTP)
- **Spécificité** : Projet statique, pas de CMS, pas de backend, pas de framework JS complet

---

## 🧩 Architecture recommandée

```bash
project-starter/
├── public/                 # Fichiers statiques publics (PWA, .htaccess, robots.txt)
├── src/
│   ├── assets/            # Images, favicons, vidéos...
│   ├── components/        # Composants réutilisables (header, footer, cookie...)
│   ├── pages/             # Pages HTML statiques (index.html, contact.html...)
│   ├── styles/            # main.css (directives Tailwind + thème + @apply)
│   ├── utils/             # JS utilitaire (formulaires, animations, cookies...)
│   └── main.js            # Entrée JavaScript (import composants + init JS)
├── scripts/               # Scripts de configuration et déploiement
└── dist/                  # Build de production
```

---

## 🎨 Tailwind CSS v4.1 – CSS-first

- Pas de `tailwind.config.js`
- Configuration directement dans `styles/main.css` via `@theme`, `@layer`, `@plugin`
- Exemple minimal de structure :

```css
@import "tailwindcss";

@theme {
  --color-primary: #1d4ed8;
  --font-base: 'Inter', sans-serif;
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-[--color-primary] text-white rounded;
  }
}
```

- Personnalisation complète possible uniquement via CSS, évitant la lourdeur des fichiers JS de config

---

## 🔧 JavaScript – Organisation & Bonnes Pratiques

- JS minimal, uniquement pour les comportements dynamiques utiles
- Utiliser `src/utils/` pour :
  - `cookieConsent.js`
  - `formHandler.js`
  - `initComponents.js`
- Pas de code injectant du HTML principal : le contenu des pages doit rester en HTML statique dans `/pages/`

```js
// src/main.js
import './styles/main.css';
import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

import './components/notification/CookieConsent';
import './utils/initComponents';
```

---

## ✅ Composants autorisés dans /components

| Catégorie     | Exemple de fichiers autorisés             |
|---------------|-------------------------------------------|
| layout/       | Header.js, Footer.js                      |
| notification/ | CookieConsent.js                          |
| common/       | Accordion.js, Tabs.js, Toast.js           |
| sections/     | UNIQUEMENT si besoin exceptionnel         |

> **💡 Recommandation :** Garder le HTML des pages dans `/pages/`. N'utiliser les sections JS que si elles sont complexes ou réutilisables.

---

## 🚫 Interdictions & pièges fréquents

- ❌ Pas de `tailwind.config.js`
- ❌ Pas de React/Vue/Svelte
- ❌ Pas d'injection de sections dans le DOM (`innerHTML`) depuis le JS
- ❌ Pas de composants de pages dans `src/components/sections/` sauf cas d’exception
- ❌ Ne pas dupliquer le fichier `main.css`

---

## 🚀 Build & Scripts

- `npm run dev` → développement
- `npm run build` → production (dist/)
- `npm run preview` → prévisualisation
- `npm run deploy` → déploiement FTP vers Infomaniak

### Automatisation

- `scripts/setup-tailwind.js` : installe/configure Tailwind CSS v4.1 CSS-first
- `scripts/post-build.js` : copie des fichiers dans `dist/`, nettoyage

---

## 🧠 Directives Cursor (IA)

- Générer du code HTML clair et lisible
- Éviter le JS inutile, toujours privilégier HTML statique
- S’assurer que les balises HTML sont sémantiques et bien structurées
- Ne pas générer de fichiers non conformes à l’arborescence définie
- S’assurer que le CSS reste centralisé dans `main.css`

---

## 📄 Annexes utiles

- **SEO** : utiliser `<meta>` complets, `robots.txt`, `sitemap.xml`
- **Accessibilité** : attributs `alt`, `aria-*`, contrastes suffisants, navigation clavier
- **Performance** : images en WebP, lazy loading, cache via SW
- **Sécurité** : headers dans `.htaccess`, audit via `npm run security:audit`

---

Cette documentation technique complète complète les fichiers `README.md`, `CONTEXT.md` et `GLOBALRULES.md` pour garantir une exécution rigoureuse et fiable de chaque projet.

**À relire systématiquement en cas de doute ou de bug persistant.**

