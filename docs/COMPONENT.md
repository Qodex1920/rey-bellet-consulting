# 📆 Documentation : Système de Composants avec Alpine.js pour Starter Cursor (Vite + TailwindCSS 4.1)

Cette documentation présente une **architecture optimisée** pour gérer les composants dans vos projets statiques avec Cursor, en tirant pleinement parti d'Alpine.js pour combiner simplicité, performance et réactivité.

## 🧩 1. Types de Composants

### 1.1 Composants Fonctionnels Alpine.js
* Pour les éléments UI réutilisables qui nécessitent une interactivité (dropdowns, accordéons, modales, etc.)
* Créés sous forme de **fonctions JS** qui génèrent le HTML avec directives Alpine.js intégrées
* Paramétrables via des options pour différentes variantes et configurations

### 1.2 Comportements Alpine Réutilisables
* Logique interactive réutilisable via `Alpine.data()`
* Permet de partager les comportements communs entre composants
* Centralise la logique pour éviter la duplication de code

### 1.3 Templates HTML Centralisés
* Pour les sections statiques ou semi-statiques (à contenu fixe)
* Centralisés dans un fichier `templates.js` pour faciliter la maintenance
* Stockés sous forme de chaînes de caractères littérales
* Possibilité d'y injecter des données dynamiques via une fonction de rendu

## 📁 2. Structure des Fichiers

```
src/
├── components/
│   ├── common/           # Éléments UI réutilisables
│   │   ├── Button.js
│   │   ├── Dropdown.js
│   │   └── Modal.js
│   ├── layout/           # Éléments de structure
│   │   ├── Header.js
│   │   └── Footer.js
│   └── sections/         # Sections de page (optionnel)
│       └── dynamic/      # Sections dynamiques
│           ├── Testimonials.js
│           └── FAQ.js
├── utils/
│   ├── alpine-behaviors.js  # Comportements Alpine réutilisables
│   └── templates.js         # Bibliothèque centralisée de templates HTML
└── pages/
    ├── index.html
    └── contact.html
```

## 💻 3. Implémentation des Composants

### 3.1 Composants Fonctionnels Alpine.js

**`src/components/common/Dropdown.js`**

```javascript
/**
 * Crée un menu déroulant interactif
 * @param {Object} options - Options de configuration
 * @param {string} options.title - Titre du menu
 * @param {Array<{label: string, url: string}>} options.items - Éléments du menu
 * @param {string} options.variant - Variante visuelle ('primary', 'secondary')
 * @returns {HTMLElement} - L'élément DOM du dropdown
 */
export function createDropdown({ title = 'Menu', items = [], variant = 'primary' } = {}) {
  const dropdownHTML = `
    <div x-data="dropdown" class="relative">
      <button 
        @click="toggle" 
        class="btn-dropdown btn-${variant}"
        :aria-expanded="open"
      >
        ${title} <span x-text="open ? '▲' : '▼'" class="ml-2"></span>
      </button>
      <div 
        x-show="open" 
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="dropdown-menu"
      >
        ${items.map(item => `<a href="${item.url}" class="dropdown-item">${item.label}</a>`).join('')}
      </div>
    </div>
  `;
  
  const template = document.createElement('template');
  template.innerHTML = dropdownHTML.trim();
  return template.content.firstChild;
}
```

### 3.2 Comportements Alpine Réutilisables

**`src/utils/alpine-behaviors.js`**

```javascript
// Initialiser les comportements Alpine réutilisables
document.addEventListener('alpine:init', () => {
  // Comportement de base pour toggle (ouverture/fermeture)
  Alpine.data('dropdown', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
    show() {
      this.open = true;
    },
    hide() {
      this.open = false;
    },
    // Fermer si clic en dehors
    init() {
      this.$nextTick(() => {
        document.addEventListener('click', (e) => {
          if (!this.$el.contains(e.target) && this.open) {
            this.open = false;
          }
        });
      });
    }
  }));
  
  // Comportement pour accordéon
  Alpine.data('accordion', (initiallyOpen = false) => ({
    open: initiallyOpen,
    toggle() {
      this.open = !this.open;
    }
  }));
  
  // Comportement pour onglets
  Alpine.data('tabs', () => ({
    activeTab: 0,
    setActiveTab(index) {
      this.activeTab = index;
    }
  }));
});
```

### 3.3 Gestion des sections HTML (Approche simplifiée)

L'importation dynamique de templates HTML peut parfois causer des problèmes de compatibilité entre les modules ESM et CommonJS. Voici une approche simplifiée et plus fiable :

**`src/utils/templates.js`**

```javascript
/**
 * Bibliothèque centralisée de templates HTML
 * Avantage: aucun problème d'importation, fonctionne dans tous les environnements
 */
export const templates = {
  // Section "À propos"
  'about-us': `
    <section class="py-16 bg-gray-50" id="about-us">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-6">Qui sommes-nous</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <p class="text-lg mb-4">Nous sommes une agence spécialisée dans la création de sites web sur mesure...</p>
            <p class="text-lg">Notre approche se concentre sur la qualité et l'expérience utilisateur...</p>
          </div>
          <div>
            <img src="/images/team.jpg" alt="Notre équipe" class="rounded-lg shadow-lg">
          </div>
        </div>
      </div>
    </section>
  `,
  
  // Section "Services"
  'services': `
    <section class="py-16" id="services">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-6">Nos services</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-3">Service 1</h3>
            <p>Description du service...</p>
          </div>
          <!-- Autres services -->
        </div>
      </div>
    </section>
  `,
  
  // Ajoutez d'autres sections selon vos besoins
};

/**
 * Récupère un template HTML depuis la bibliothèque de templates
 * @param {string} id - Identifiant du template
 * @returns {DocumentFragment} Fragment DOM contenant le template
 */
export function getTemplate(id) {
  const template = document.createElement('template');
  template.innerHTML = (templates[id] || '').trim();
  return template.content;
}

/**
 * Récupère un template et y injecte des données
 * @param {string} id - Identifiant du template
 * @param {Object} data - Données à injecter dans le template
 * @returns {DocumentFragment} Fragment DOM avec les données injectées
 */
export function renderTemplate(id, data = {}) {
  const templateString = templates[id] || '';
  
  // Remplacer les variables {{nom}} par leurs valeurs
  const renderedHTML = templateString.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
  
  const fragment = document.createElement('template');
  fragment.innerHTML = renderedHTML.trim();
  return fragment.content;
}
```

### 3.4 Sections HTML (Optionnel)

Si vous préférez quand même gérer vos sections dans des fichiers HTML séparés, voici une approche alternative à considérer pour les projets plus importants. Notez que cette méthode est **optionnelle** et l'approche simplifiée précédente est généralement suffisante pour la plupart des projets.

**`src/components/sections/templates/about-us.html`**

```html
<section class="py-16 bg-gray-50" id="about-us">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold mb-6">Qui sommes-nous</h2>
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <p class="text-lg mb-4">Nous sommes une agence spécialisée dans la création de sites web sur mesure...</p>
        <p class="text-lg">Notre approche se concentre sur la qualité et l'expérience utilisateur...</p>
      </div>
      <div>
        <img src="/images/team.jpg" alt="Notre équipe" class="rounded-lg shadow-lg">
      </div>
    </div>
  </div>
</section>
```

Pour les projets plus complexes, vous pourriez envisager un plugin Vite personnalisé qui gérerait ces importations. Cependant, pour la plupart des sites statiques, l'approche centralisée avec `templates.js` est recommandée pour sa simplicité et sa fiabilité.

## 4. Utilisation des Composants

### 4.1 Initialisation Alpine et Comportements

**`src/main.js`**

```javascript
import Alpine from 'alpinejs';
import './utils/alpine-behaviors.js'; // Importer les comportements Alpine

window.Alpine = Alpine;
Alpine.start();
```

### 4.2 Intégration des Composants Fonctionnels et Templates

**`src/pages/index.js`** (importé dans votre HTML)

```javascript
import { createDropdown } from '../components/common/Dropdown.js';
import { createModal } from '../components/common/Modal.js';
import { getTemplate, renderTemplate } from '../utils/templates.js';

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  // Injecter un composant fonctionnel Alpine.js
  const navContainer = document.querySelector('#nav-container');
  const servicesDropdown = createDropdown({
    title: 'Nos Services',
    items: [
      { label: 'Développement Web', url: '/services/web' },
      { label: 'Design UI/UX', url: '/services/design' },
      { label: 'SEO', url: '/services/seo' }
    ],
    variant: 'primary'
  });
  navContainer.appendChild(servicesDropdown);
  
  // Injecter une section depuis la bibliothèque de templates
  const mainContent = document.querySelector('#main-content');
  
  // Exemple sans données dynamiques
  const aboutSection = getTemplate('about-us');
  mainContent.appendChild(aboutSection);
  
  // Exemple avec données dynamiques
  const servicesSection = renderTemplate('services', {
    title: 'Nos solutions sur mesure',
    subtitle: 'Pour répondre à tous vos besoins'
  });
  mainContent.appendChild(servicesSection);
  
  // Créer et configurer une modale
  const contactButton = document.querySelector('#contact-button');
  const contactModal = createModal({
    title: 'Contactez-nous',
    content: `
      <form>
        <div class="mb-4">
          <label class="block mb-2">Email</label>
          <input type="email" class="w-full p-2 border rounded">
        </div>
        <div class="mb-4">
          <label class="block mb-2">Message</label>
          <textarea class="w-full p-2 border rounded"></textarea>
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Envoyer</button>
      </form>
    `,
    size: 'medium'
  });
  document.body.appendChild(contactModal);
  
  // Configurer l'ouverture de la modale
  contactButton.addEventListener('click', () => {
    // Utilise le comportement Alpine du modal
    Alpine.store('modal').open('contact-modal');
  });
});
```

## 🧠 5. Techniques Avancées

### 5.1 Store Alpine pour État Global

```javascript
// Dans alpine-behaviors.js
Alpine.store('modal', {
  active: null,
  
  open(id) {
    this.active = id;
  },
  
  close() {
    this.active = null;
  },
  
  isOpen(id) {
    return this.active === id;
  }
});

// Dans Modal.js
export function createModal({ id, title, content }) {
  return `
    <div 
      x-data
      x-show="$store.modal.isOpen('${id}')"
      @keydown.escape.window="$store.modal.close()"
      class="modal-container"
    >
      <!-- Contenu de la modale -->
    </div>
  `;
}
```

### 5.2 Templates avec Interpolation

Pour les templates qui nécessitent des données dynamiques mais pas d'interactivité complète :

```javascript
/**
 * Remplace les variables dans un template par leurs valeurs
 * @param {string|DocumentFragment} template - Template HTML (chaîne ou fragment)
 * @param {Object} data - Données à injecter dans le template
 * @returns {DocumentFragment} Fragment HTML avec les données injectées
 */
export function renderTemplate(template, data) {
  // Si template est un fragment, le convertir en chaîne
  const templateString = template instanceof DocumentFragment 
    ? new XMLSerializer().serializeToString(template)
    : template.toString();
  
  // Remplacer les variables {{nom}} par leurs valeurs
  const renderedHTML = templateString.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
  
  // Convertir en fragment
  const fragment = document.createElement('template');
  fragment.innerHTML = renderedHTML.trim();
  return fragment.content;
}

// Utilisation
const templateFragment = await loadTemplate('team');
const teamSection = renderTemplate(templateFragment, {
  title: 'Notre équipe exceptionnelle',
  subtitle: 'Des experts passionnés'
});
```

## ✅ 6. Bonnes Pratiques

| 🔺 Faire | 🔻 Ne pas faire |
|---------|----------------|
| Séparer HTML/CSS de la logique interactive | Mélanger la logique métier avec l'UI |
| Réutiliser les comportements Alpine | Dupliquer la même logique interactive |
| Documenter les options des composants | Créer des composants sans documentation |
| Centraliser les templates HTML dans templates.js | Mélanger les templates avec la logique d'affichage |
| Utiliser les composants fonctionnels pour les éléments interactifs | Créer des fonctions géantes qui font trop de choses |
| Centraliser les styles dans Tailwind | Ajouter des styles inline |
| Utiliser des animations Alpine fluides | Créer des animations JS personnalisées complexes |
| Rendre vos composants accessibles | Ignorer les attributs ARIA et l'accessibilité |

## 🚀 Intégration avec Vite

Avec l'approche simplifiée pour les templates, vous n'avez pas besoin de configuration Vite particulière pour l'importation des templates HTML. Votre configuration Vite standard pour un projet statique suffit :

**`vite.config.js`**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        // Ajoutez ici d'autres pages si nécessaire
      }
    }
  }
});
```

Cette configuration basique est tout ce dont vous avez besoin, car notre approche ne repose plus sur l'importation de fichiers HTML externes avec le suffixe `?raw`.
```

## 📝 Conclusion

Cette architecture vous offre :

1. **Flexibilité maximale** - Choisissez l'approche adaptée à chaque besoin
2. **Performances optimales** - Alpine.js pour l'interactivité sans surcharge
3. **Maintenabilité** - Organisation claire avec séparation des responsabilités
4. **Réutilisabilité** - Composants et comportements facilement partageables
5. **Évolutivité** - Architecture qui évolue facilement avec les besoins du projet
6. **Compatibilité garantie** - Fonctionne dans tous les environnements Vite sans configuration spéciale
7. **Développement simplifié** - Pas de problèmes d'importation ESM/CommonJS

En combinant les composants fonctionnels Alpine.js, les comportements réutilisables et les templates HTML centralisés, vous obtenez un système robuste, performant et élégant pour vos projets statiques avec Cursor, Vite et TailwindCSS.

### Exemples de composants courants

Pour vous aider à démarrer, voici quelques composants courants que vous pourriez implémenter avec cette architecture :

- Accordéon
- Carrousel/Slider
- Tabs (onglets)
- Tooltips
- Modales et dialogs
- Notifications/Toasts
- Menu mobile responsive
- Formulaires avec validation

Chacun de ces composants bénéficiera grandement de l'approche par comportements réutilisables d'Alpine.js tout en maintenant une structure de code claire et maintenable.