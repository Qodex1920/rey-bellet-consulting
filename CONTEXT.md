# 🧠 CONTEXT.md – Starter Cursor (Vite + TailwindCSS 4.1) – Site vitrine statique

Ce fichier définit à la fois les **informations client** utiles pour démarrer le projet, et les **principes techniques** à suivre pour garantir une structure propre, maintenable et compatible avec Tailwind CSS v4.1.

---

## 🎯 Contexte projet

## Présentation du client

**Rey-Bellet Consulting** est une entreprise indépendante de conseil dirigée par Laure Rey-Bellet, spécialiste en gestion du changement qui propose ses services à la fois aux entreprises et aux particuliers. Son approche combine consulting, coaching et formation pour accompagner ses clients dans leurs transformations professionnelles et personnelles.

coordonnées :
Rey-Bellet Consulting
Pré Court 16
1893 Muraz
+41 78 256 22 61
laure@reybellet.com
reybellet.com

## Objectifs du site web

### Objectifs principaux

1. **Présenter l'expertise professionnelle** - Mettre en valeur les compétences de Laure en tant que consultante, coach et formatrice spécialisée en gestion du changement.
2. **Différencier ses services** - Distinguer clairement ses offres pour entreprises et particuliers avec des modules adaptés à chaque public. Valoriser la capacité à servir entreprises ET particuliers, peu commune dans le secteur
3. **Générer des demandes de devis et contacts** - Faciliter la conversion des visiteurs en prospects via des boutons d'appel à l'action stratégiquement placés.
4. **Refléter sa personnalité** - Créer une expérience utilisateur interactive (texte animé ou pop-up d'accueil) qui humanise la marque et établit une connexion émotionnelle.
5. **Servir de support marketing intégré** - Prévoir une landing page accessible via QR code pour les campagnes marketing offline.

### Objectifs secondaires

1. **Établir sa crédibilité** - Via la section "À propos" qui racontera son parcours professionnel.
2. **Simplifier la prise de contact** - Formulaire de contact épuré sans surcharge d'informations.
3. **Faciliter la navigation** - Structure claire avec menus déroulants pour une expérience utilisateur intuitive.
4. **Flexibilité pour l'évolution des services** - Structure permettant d'ajouter/modifier les offres mentionnées comme "à affiner".

## Identité de marque

Rey-Bellet Consulting se positionne comme une marque **professionnelle, premium et dynamique**. L'identité visuelle doit refléter:

- **Professionnalisme**: Utilisation de lignes épurées, typographie moderne et structure claire
- **Premium**: Accent sur des détails dorés, espacement généreux et qualité visuelle soignée
- **Dynamisme**: Utilisation de lignes diagonales montantes symbolisant le mouvement et la progression

## Structure du site

Le site sera simplifié et organisé selon la structure suivante:

1. **Page d'accueil** (page principale contenant toutes les sections)
    - Option interactive (pop-up ou texte animé) pour l'introduction
    - Section introduction personnalisée de Laure
    - Section **Services pour entreprises**
        - Introduction aux services
        - Présentation des 4 modules (Comprendre, Planifier, Activer, Sur mesure)
        - Bouton "Demande de devis"
    - Section **Services pour particuliers**
        - Introduction aux services
        - Présentation des 3 programmes (Révéler ton potentiel, Donner vie à tes ambitions, Sur mesure)
        - Bouton "Contact"
    - Section **À propos**
        - Histoire personnelle et professionnelle de Laure (créer un storytelling)
        - Photographie professionnelle
        - Valeurs et approche
2. **Page de contact**
    - Formulaire de contact simple et épuré
    - Sans coordonnées directes
    - Message de confirmation après envoi
3. **Landing page** (non visible dans la navigation principale)
    - Page accessible uniquement via QR code pour campagnes marketing

## Éléments visuels à intégrer

### Palette de couleurs

Charte graphique à respecter strictement dans le fichier STYLGUIDE.md à la racine du projet

- **Noir (#000000)**: Fond principal sur certains supports, texte premium pour titres
- **Blanc (#FFFFFF)**: Fond principal pour la lisibilité, texte sur fond noir
- **Doré (#FFD700)**: Accent graphique haut de gamme, détails premium
- **Bleu (#1848A0)**: Texte secondaire, éléments structurants
- **Gris clair et foncé**: Éléments secondaires et textes alternatifs

### Typographie

- Titres: Montserrat (gras, majuscule)
- Sous-titres: Lato (normal, minuscule)
- Corps de texte: Montserrat (normal, minuscule)
- Citations et slogans: Poppins (majuscule, normal)

### Éléments graphiques distinctifs

- Lignes diagonales parallèles montantes (doré et bleu)
- Utilisation modérée de transparence pour les éléments graphiques
- Design épuré avec espaces négatifs généreux
- Iconographie minimaliste pour illustrer les services

## Ton et style de communication

Le site doit véhiculer un ton:

- Professionnel mais chaleureux
- Expert sans être intimidant
- Direct et orienté solutions
- Personnel et authentique

## Fonctionnalités spécifiques à intégrer

1. **Texte animé** pour créer une première impression mémorable
2. **Menu déroulant pour les services** distinguant entreprises et particuliers
3. **Boutons d'appel à l'action** stratégiquement placés (demande de devis, contact)
4. **Formulaire de contact** simple mais efficace
5. **Intégration possible avec LinkedIn** pour renforcer la crédibilité professionnelle

Ce site doit être conçu comme un outil de personal branding efficace, reflétant la personnalité de Laure Rey-Bellet tout en présentant clairement ses services et en facilitant la génération de leads.

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
