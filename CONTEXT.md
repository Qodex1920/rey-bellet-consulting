# 🧠 CONTEXT.md – Starter Cursor (Vite + TailwindCSS 4.1) – Site vitrine statique

Ce fichier définit à la fois les **informations client** utiles pour démarrer le projet, et les **principes techniques** à suivre pour garantir une structure propre, maintenable et compatible avec Tailwind CSS v4.1.

---

## 🎯 Contexte projet

## Présentation du client

Rey-Bellet Consulting est dirigée par Laure Rey-Bellet, spécialiste en gestion du changement proposant des services aux entreprises et particuliers. Ce n'est pas une consultante traditionnelle - elle veut briser les codes du conseil avec un personal branding décalé et impactant.

coordonnées :
Rey-Bellet Consulting
laure@reybellet.com
reybellet.com

## Positionnement unique

"Le changement n'est pas une option. C'est une force, un levier, un passage obligé vers l'évolution."

Laure se positionne comme une force disruptive qui transforme la vision du changement:

Elle ne rassure pas, elle provoque et structure
Elle aide à façonner le changement, pas à le subir
Son parcours personnel (grand saut en indépendante en 2023) est au cœur de son approche

## Objectifs du site web

### Objectifs principaux

1. **Créer un impact visuel immédiat** - Design percutant, non conventionnel (noir et or)
2. **Présenter ses services distinctifs** - Offres pour entreprises ET particuliers (rare dans le secteur)
3. **Refléter sa personnalité authentique** - Ton direct, parfois provocateur, touches d'humour
4. **Générer des leads qualifiés** - CTAs stratégiques pour demandes de devis/contact
5. **Raconter son histoire** - Parcours personnel présenté comme un récit inspirant

### Objectifs secondaires

1. **Établir sa crédibilité** - Via la section "À propos" qui racontera son parcours professionnel.
2. **Simplifier la prise de contact** - Formulaire de contact épuré sans surcharge d'informations.
3. **Faciliter la navigation** - Structure claire avec menus déroulants pour une expérience utilisateur intuitive.

## Identité de marque

## 🎨 Direction visuelle

- **Fond noir avec éléments or/dorés** (poudre d'or, particules, effets de lumière)
- **Contraste fort** entre noir profond et touches dorées éclatantes
- **Charte graphique**: Noir (#000000), Blanc (#FFFFFF), Doré (#FFD700), Bleu (#1848A0)
- **Typographie**: Montserrat (titres, gras), Lato (sous-titres), Poppins (citations impactantes)
- **Éléments distinctifs**: Lignes diagonales montantes, effets de particules dorées, textures premium

- **Direct et percutant** - "On ne subit pas le changement - on le façonne"
- **Authentique et personnel** - Narration à la première personne
- **Touches d'humour** - Mention de son chien Mia comme "meilleure négociatrice"
- **Phrases courtes et impactantes** - "Rester immobile, c'est renoncer à toute évolution"

## Structure du site

1. **Page d'accueil** (page principale contenant toutes les sections)
    - Option interactive texte animé pour l'introduction
    - Section hero introduction personnalisée de Laure
    - Section tab **Services pour entreprises** / **Services pour particuliers**
        - Introduction aux services et présentation des programmes
    - Section **À propos**
        - Histoire personnelle de Laure "Le choix de ne plus subir"
    -Section **CTA**
    - Section **contact**
        - Formulaire de contact simple et épuré avec formulaire
        - Sans coordonnées directes

## Ton et style de communication

- **Direct et percutant** - "On ne subit pas le changement - on le façonne"
- **Authentique et personnel** - Narration à la première personne
- **Touches d'humour** - Mention de son chien Mia comme "meilleure négociatrice"
- **Phrases courtes et impactantes** - "Rester immobile, c'est renoncer à toute évolution"

## Fonctionnalités clés

1. **Animations de texte** pour les messages forts
2. **Effets visuels premium** (particules or, transitions dynamiques)
3. **CTAs distinctifs** avec design non conventionnel
4. **Formulaire de contact** sur fond sombre avec éléments or
5. **Navigation fluide** entre les sections

## 🌟 Ce qui rendra ce site unique

La combinaison entre une esthétique premium (noir/or), un ton direct et personnel qui sort du cadre corporate traditionnel, et une présentation narrative de ses services qui place le changement comme une force positive à maîtriser plutôt qu'une contrainte à subir.

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

- Ne pas injecter de sections complètes HTML via JavaScript (seulement des composant dynamique)
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
