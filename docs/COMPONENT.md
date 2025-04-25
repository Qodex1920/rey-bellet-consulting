# 📦 Documentation : Utilisation des Composants dans le Starter Cursor

Cette documentation définit comment structurer, créer, animer et utiliser les composants HTML dans le starter Cursor basé sur Vite + Tailwind CSS 4.1 (CSS-first). Elle sert de référence pour garantir de bonnes pratiques, une uniformité dans les projets, et une intégration fluide avec Alpine.js ou JavaScript Vanilla.

---

## 🔧 1. Qu'est-ce qu'un composant ?

Un composant est un **fichier HTML autonome** représentant une **partie réutilisable de l'interface** (ex: bouton, titre de section, CTA, header, footer, bannière cookies...). Il est stocké dans `src/components/`.

Structure typique :
```bash
src/
├── components/
│   ├── common/         # Composants UI génériques (bouton, tabs, etc.)
│   ├── layout/         # Structure : Header, Footer, etc.
│   ├── notification/   # Bannières : Cookie, Alertes...
│   └── sections/       # Sections entières réutilisables (CTA, SectionTitle...)
```

---

## 🧱 2. Bonnes pratiques de création

- **Nom de fichier** : toujours en kebab-case (ex : `cta.html`, `section-title.html`)
- **Sémantique** : utiliser des balises sémantiques (`<section>`, `<h2>`, `<button>`, etc.)
- **Aucun script inline** : la logique interactive va dans `src/utils/`
- **Tailwind-only** : uniquement des classes utilitaires Tailwind pour le style
- **Accessibilité** : toujours inclure `alt`, `aria-*` si nécessaire
- **Responsiveness** : penser mobile-first via Tailwind

---

## 🧠 3. Utilisation dans une page HTML

Tu peux inclure un composant manuellement en copiant son code HTML dans une page, ou automatiser l'injection via un moteur de template.

```html
<!-- Exemple d'inclusion dans index.html -->
<header>
  <!-- Include Header -->
</header>

<main>
  <!-- Include Section Title -->
  <section>
    <!-- code du composant section-title.html -->
  </section>
</main>
```

> ✅ Il est recommandé de copier-coller le code du composant dans la page HTML pour plus de clarté dans un site statique (sans moteur de template).

---

## ✨ 4. Animation des composants

### A. Animation au chargement (via Alpine.js)
```html
<h2
  x-data="{ show: false }"
  x-init="setTimeout(() => show = true, 100)"
  x-show="show"
  x-transition:enter="transition ease-out duration-700"
  x-transition:enter-start="opacity-0 -translate-y-4"
  x-transition:enter-end="opacity-100 translate-y-0"
>
  Nos Services
</h2>
```

> ✅ Pratique pour un effet d'entrée dès le chargement de la page

### B. Animation au scroll (via IntersectionObserver)
Dans `src/utils/animation.js` :
```js
export function animateOnScroll(selector, animationClass = 'animate-fade-in-up') {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  });
  elements.forEach(el => observer.observe(el));
}
```

Puis dans `main.js` :
```js
import { animateOnScroll } from './utils/animation';
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll('.section-title');
});
```

Et dans le composant :
```html
<h2 class="section-title opacity-0 transition-all duration-700">
  Notre Mission
</h2>
```

> ✅ Recommandé pour des animations au scroll : performances + réutilisabilité

---

## 📚 5. Types de composants recommandés dans le starter

- `button.html` (avec variantes : primaire, secondaire, ghost)
- `section-title.html`
- `cta.html` (call to action global)
- `header.html` / `footer.html`
- `cookie-consent.html`
- `accordion.html`, `tabs.html`, `toast.html` (si besoin d'interaction légère)

---

## 🔁 6. Maintenance des composants

- Éviter la duplication : si tu réutilises le même bloc souvent → crée un composant
- Isoler uniquement ce qui est **visuellement ou fonctionnellement récurrent**
- Documenter l’usage dans un commentaire au début du fichier si besoin

```html
<!-- Composant : CTA
     Usage : Bas de page pour inciter à contact
     Variantes : light/dark (gérées via classes Tailwind)
-->
```

---

## ✅ Résumé

- Crée des composants HTML simples, accessibles et stylés avec Tailwind
- Évite le JavaScript sauf pour de l’interaction (et seulement vanilla ou Alpine.js)
- Utilise `animation.js` pour les effets au scroll, et Alpine pour les effets au chargement
- Réutilise, commente et maintiens-les dans des sous-dossiers bien organisés

---

> Ce guide est évolutif. Mets-le à jour dès que tu ajoutes un nouveau type de composant réutilisable ou un nouveau style d'animation.

