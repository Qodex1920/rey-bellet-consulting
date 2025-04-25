# 🧠 CONTEXT.md – Starter Cursor (Vite + TailwindCSS 4.1) – Site vitrine statique

Ce fichier définit à la fois les **informations client** utiles pour démarrer le projet, et les **principes techniques** à suivre pour garantir une structure propre, maintenable et compatible avec Tailwind CSS v4.1.

---

## 🎯 Contexte projet (à adapter pour chaque client)

- **Nom du client + informations générales** : *(à renseigner)*
- **Objectif du site** : *(ex. : présentation, génération de leads, vitrine simple, etc.)*
- **Pages prévues** : *(ex. : Accueil, Services, Contact, Mentions légales)*
- **Contenus importants** : *(formulaire, vidéo, galerie, témoignages... à adapter)*
- **Particularités** : *(ex. : PWA, mode offline, animations, SEO prioritaire, design mobile first)*

> 💡 Mettre à jour cette section à chaque nouveau projet pour contextualiser le développement.

---

## ⚙️ Stack technique (starter simplifié)

- **Vite** : build rapide pour sites statiques
- **Tailwind CSS v4.1 (CSS-first)** : pas de `tailwind.config.js`, tout est configuré dans `styles/main.css`
- **Vanilla JavaScript** ou **Alpine.js** : pour les interactions simples
- **Pas de CMS ni backend**
- **Structure HTML statique uniquement** (pas de composants JavaScript pour injecter des pages entières)

---

## 📁 Structure du projet

```
project-starter/
├── public/               → Fichiers publics (manifeste, favicon, htaccess...)
├── src/
│   ├── assets/           → Images et icônes
│   ├── components/
│   │   ├── layout/       → Header, Footer, CookieBanner, etc.
│   ├── pages/            → Pages HTML statiques (index.html, contact.html...)
│   ├── utils/            → JS utiles (formulaires, cookies...)
│   └── styles/
│       └── main.css      → Tailwind + @theme + @apply
└── scripts/              → Déploiement et post-build
```

---

## ✅ Bonnes pratiques générales

- Utiliser **HTML sémantique** (`<header>`, `<main>`, `<footer>`, etc.)
- Les composants JS ne doivent être utilisés **que pour des besoins réels d'interaction et/ou de réutilisation**
- Styliser avec les \*\*classes Tailwind V4.1 uniquement \*\*
- Centraliser toutes les personnalisations dans `main.css` avec `@theme` et `@apply`
- Conserver le projet **simple, lisible et statique**

---

## 📌 À ne pas faire

- Ne pas injecter de sections HTML via JavaScript
- Ne pas ajouter de frameworks JS (React, Vue...)
- Ne pas créer de fichiers de configuration inutiles (pas de `tailwind.config.js`)
- main.js ne doit pas gérer l’injection de contenu des pages, juste les composants utilitaires + init.

---

## 🔁 À personnaliser pour chaque projet

Mettre à jour :

- `index.html` (SEO, contenu, structure)
- `main.css` (thème Tailwind CSS)
- `favicon`, `site.webmanifest`, `robots.txt`
- `CONTEXT.md` (section projet/client ci-dessus)
