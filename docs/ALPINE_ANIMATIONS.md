# 🪄 Documentation Alpine.js : Animations et Intersections

Ce guide explique comment utiliser efficacement Alpine.js pour créer des animations fluides et performantes déclenchées au défilement (scroll) dans les projets Vite + TailwindCSS.

## 📋 Table des matières

1. [Configuration d'Alpine.js](#1-configuration-dalpinejs)
2. [Plugin Intersect](#2-plugin-intersect)
3. [Méthodes d'animation](#3-méthodes-danimation)
4. [Patterns recommandés](#4-patterns-recommandés)
5. [Exemples de composants](#5-exemples-de-composants)
6. [Résolution des problèmes courants](#6-résolution-des-problèmes-courants)

---

## 1. Configuration d'Alpine.js

### Installation correcte

```js
// Dans main.js
import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

// Rendre Alpine disponible globalement
window.Alpine = Alpine;

// IMPORTANT : enregistrer le plugin intersect AVANT de démarrer Alpine
Alpine.plugin(intersect);

// Démarrer Alpine APRÈS avoir enregistré tous les plugins
Alpine.start();
```

### Scripts dans le HTML

```html
<!-- Méthode CDN (assurez-vous d'inclure le plugin Intersect) -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://unpkg.com/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>
```

⚠️ **IMPORTANT** : Le plugin Intersect doit toujours être chargé si vous utilisez la directive `x-intersect`.

---

## 2. Plugin Intersect

### Qu'est-ce que c'est ?

Le plugin Intersect permet de déclencher des actions lorsqu'un élément entre ou sort du viewport (fenêtre visible). Il est idéal pour les animations au scroll.

### Options disponibles

- `x-intersect:enter` - Déclenché quand l'élément entre dans le viewport
- `x-intersect:leave` - Déclenché quand l'élément sort du viewport
- `x-intersect.once` - Ne déclenche l'animation qu'une seule fois
- `x-intersect.threshold.50` - Définit le pourcentage de visibilité nécessaire (ici 50%)
- `x-intersect.margin.-100px` - Ajoute une marge au viewport

### Exemple simple

```html
<div 
  x-data="{ shown: false }" 
  x-intersect="shown = true"
  :class="shown ? 'opacity-100' : 'opacity-0'"
  class="transition duration-700">
  Ce contenu apparaît en fondu quand il est visible
</div>
```

---

## 3. Méthodes d'animation

### A. Utilisation de classes Tailwind

Cette approche utilise uniquement les classes de transition de Tailwind et Alpine.js pour gérer l'état.

```html
<div 
  x-data="{ visible: false }" 
  x-intersect="visible = true"
  class="transition-all duration-700 ease-out"
  :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
  Je m'anime avec Tailwind
</div>
```

### B. Utilisation d'IntersectionObserver natif

Parfois, vous pourriez avoir besoin d'une approche plus personnalisée, notamment pour contrôler le timing des animations.

```html
<div 
  x-data="{ visible: false }" 
  x-init="$nextTick(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visible = true;
        }
      });
    });
    observer.observe($el);
  })"
  class="transition-all duration-700 ease-out"
  :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
  Animation avec IntersectionObserver
</div>
```

### C. Utilisation de JavaScript pour les animations

Pour des animations plus complexes, vous pouvez utiliser l'API Web Animation ou manipuler directement les styles.

```html
<div 
  x-data="{ }" 
  x-intersect="$el.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 600, fill: 'forwards' })">
  Animation avec l'API Web Animation
</div>
```

---

## 4. Patterns recommandés

### Organisation du code

#### ✅ BIEN
- Utiliser des composants Alpine réutilisables
- Centraliser la logique d'animation dans des modules
- Garder l'état d'animation dans `x-data`

#### ❌ À ÉVITER
- Mélanger plusieurs approches d'animation
- Utiliser des sélecteurs complexes dans les composants
- Coder en dur des valeurs d'animation

### Optimisations de performance

- Toujours ajouter la classe `will-change: transform, opacity` pour les animations fréquentes
- Préférer les animations CSS pour les transitions simples
- Utiliser `x-intersect.once` pour les animations qui ne doivent s'exécuter qu'une fois

### Accessibilité (a11y)

```html
<div
  x-data="{ visible: false }"
  x-intersect="visible = true"
  class="transition duration-700"
  :class="prefersReducedMotion() ? 'opacity-100' : (visible ? 'opacity-100' : 'opacity-0')">
  Animation respectueuse de l'accessibilité
</div>

<script>
  // Utilitaire pour l'accessibilité
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
</script>
```

---

## 5. Exemples de composants

### SectionTitle avec animation au scroll

```html
<div class="section-title text-center mb-12"
     x-data="{ visible: false }" 
     x-intersect="visible = true">
  <h2 class="text-3xl font-bold mb-4 transition-all duration-700 ease-out"
      :class="visible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-4'">
      Titre de la section
  </h2>
  <p class="text-gray-600 transition-all duration-700 ease-out delay-100"
     :class="visible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-4'">
     Description de la section
  </p>
</div>
```

### Témoignage avec animation séquentielle

```html
<div class="testimonial-card bg-white p-6 rounded-lg shadow-md"
     x-data="{ visible: false }"
     x-intersect="visible = true"
     style="transition: all 0.7s ease-out; transition-delay: 0.2s"
     :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
  <div class="avatar"><!-- ... --></div>
  <blockquote class="mt-4"><!-- ... --></blockquote>
</div>
```

### Call-to-Action avec animations multiples

```html
<section class="cta-section bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg"
         x-data="{ visible: false }" 
         x-intersect="visible = true"
         class="transform scale-95 opacity-0 transition-all duration-1000"
         :class="visible ? 'opacity-100 scale-100' : ''">
  <div class="max-w-4xl mx-auto text-center py-12 px-4">
    <h2 class="text-3xl font-bold mb-4 text-white transition-all duration-700 delay-200"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'">
        Titre du CTA
    </h2>
    <p class="text-white/80 mb-8 transition-all duration-700 delay-300"
       :class="visible ? 'opacity-100' : 'opacity-0'">
       Description du CTA
    </p>
    <button class="btn-primary transition-all duration-700 delay-400"
            :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
        Bouton d'action
    </button>
  </div>
</section>
```

---

## 6. Résolution des problèmes courants

### Problème : Les animations ne s'affichent pas

#### Causes possibles et solutions :

1. **Plugin Intersect non chargé**  
   ✅ Solution : Ajouter `<script defer src="https://unpkg.com/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>` avant le démarrage d'Alpine

2. **Ordre d'initialisation incorrect**  
   ✅ Solution : S'assurer que `Alpine.plugin(intersect)` est appelé avant `Alpine.start()`

3. **Erreurs de syntaxe dans les directives**  
   ✅ Solution : Vérifier la console pour les erreurs et corriger la syntaxe

4. **Conflit avec d'autres bibliothèques**  
   ✅ Solution : Utiliser l'approche native avec IntersectionObserver

### Problème : Animations saccadées

#### Causes possibles et solutions :

1. **Trop d'animations simultanées**  
   ✅ Solution : Échelonner les animations avec des délais (delay)

2. **Animations trop complexes**  
   ✅ Solution : Simplifier les animations, privilégier transform et opacity

3. **Manque d'optimisation**  
   ✅ Solution : Ajouter `will-change: transform, opacity` pour les éléments animés

### Problème : Animations non uniformes sur différentes pages

#### Solution :

Créer un module d'animation réutilisable :

```js
// /src/utils/animations.js
export function fadeInUp(element, options = {}) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    return;
  }
  
  const defaults = {
    duration: 600,
    delay: 0
  };
  
  const config = { ...defaults, ...options };
  
  return element.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: config.duration,
    delay: config.delay,
    fill: 'forwards'
  });
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

---

## Bonnes pratiques à retenir

1. **Toujours inclure le plugin Intersect** si vous utilisez `x-intersect`
2. **Respecter les préférences d'accessibilité** avec `prefers-reduced-motion`
3. **Préférer les transitions CSS** quand c'est possible
4. **Centraliser vos animations** dans un module dédié
5. **Tester sur différents appareils** pour vérifier la fluidité
6. **Documenter vos composants animés** pour une réutilisation facile

---

_Document créé pour maintenir des animations cohérentes et performantes dans les projets Vite + TailwindCSS + Alpine.js. Dernière mise à jour : [DATE]_ 