# Documentation - Bannière RGPD de Consentement aux Cookies

Cette documentation explique comment intégrer, configurer et personnaliser la bannière de consentement aux cookies RGPD dans votre projet.

## Table des matières

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Intégration](#intégration)
5. [Personnalisation](#personnalisation)
6. [API](#api)
7. [Exemples d'utilisation](#exemples-dutilisation)
8. [FAQ](#faq)

## Introduction

La bannière de consentement aux cookies est un composant modulaire conçu pour respecter les exigences du RGPD (Règlement Général sur la Protection des Données). Elle permet aux utilisateurs de gérer leurs préférences concernant les cookies et le suivi sur votre site.

**Fonctionnalités principales :**
- Affichage au premier chargement (avant tout dépôt de cookies non essentiels)
- Catégorisation des cookies (nécessaires, fonctionnels, statistiques, marketing)
- Options d'accepter tout, refuser tout, ou personnaliser les choix
- Interface détaillée pour personnaliser les préférences par catégorie
- Stockage persistant des préférences (localStorage)
- Mécanisme pour modifier les préférences ultérieurement
- Lien vers la politique de confidentialité

## Installation

Le composant est déjà intégré dans le template starter. Les fichiers principaux sont :

- `src/components/CookieConsent.js` - Le composant HTML/UI
- `src/utils/cookieConsent.js` - La logique et les utilitaires

## Prérequis

Le composant nécessite :
- Alpine.js
- Tailwind CSS
- JavaScript Vanilla (ES6+)

## Configuration

Vous pouvez personnaliser la bannière via l'objet de configuration passé à `initCookieConsent()`. Voici les options disponibles :

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `storageKey` | string | `'cookie-consent-preferences'` | Clé utilisée pour stocker les préférences dans localStorage |
| `policyUrl` | string | `'/politique-de-confidentialite.html'` | URL de la politique de confidentialité |
| `companyName` | string | `'Notre Entreprise'` | Nom de l'entreprise affiché dans la bannière |
| `cookieExpiration` | number | `180` | Durée de validité des préférences en jours |
| `cookieCategories` | array | *voir ci-dessous* | Catégories de cookies proposées aux utilisateurs |

### Configuration par défaut des catégories

```javascript
cookieCategories: [
  {
    id: 'necessary',
    name: 'Nécessaires',
    description: 'Ces cookies sont indispensables au bon fonctionnement du site et ne peuvent pas être désactivés.',
    required: true
  },
  {
    id: 'functional',
    name: 'Fonctionnels',
    description: 'Ces cookies permettent d\'améliorer les fonctionnalités et la personnalisation du site.',
    required: false
  },
  {
    id: 'analytics',
    name: 'Statistiques',
    description: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site.',
    required: false
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Ces cookies sont utilisés pour suivre les visiteurs sur les sites web et afficher des publicités pertinentes.',
    required: false
  }
]
```

## Intégration

### 1. S'assurer que Alpine.js est chargé

Vous devez avoir Alpine.js chargé sur votre page. Si ce n'est pas déjà fait, vous pouvez l'ajouter via CDN dans votre `index.html` :

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 2. Importer le composant dans main.js

S'il n'est pas déjà importé, ajoutez l'import à votre fichier main.js :

```javascript
import './components/notification/CookieConsent';
```

### 3. Initialisation 

L'initialisation est déjà faite dans `initComponents.js`, mais vous pouvez personnaliser la configuration :

```javascript
import { initCookieConsent } from './utils/cookieConsent.js';

// Dans votre fonction d'initialisation
initCookieConsent({
  companyName: 'Nom de votre entreprise',
  policyUrl: '/politique-de-confidentialite.html',
  cookieExpiration: 365 // Valide pour 1 an
});
```

## Personnalisation

### Styles Tailwind

Les styles utilisent exclusivement Tailwind CSS. Vous pouvez personnaliser l'apparence en modifiant les classes dans `CookieConsent.js`.

### Ajouter des catégories de cookies

Pour ajouter ou modifier les catégories de cookies, mettez à jour la configuration :

```javascript
initCookieConsent({
  // ...autres options
  cookieCategories: [
    // Catégories existantes...
    {
      id: 'personalization',
      name: 'Personnalisation',
      description: 'Ces cookies permettent d\'adapter le contenu à vos préférences.',
      required: false
    }
  ]
});
```

### Personnaliser la gestion des cookies

Vous pouvez modifier la fonction `applyPreferences()` dans `cookieConsent.js` pour adapter la gestion des cookies à vos besoins spécifiques :

```javascript
applyPreferences() {
  // Exemple : Activer/désactiver Google Analytics
  if (this.preferences.analytics) {
    // Initialiser Google Analytics
    this.initGoogleAnalytics();
  } else {
    // Désactiver Google Analytics
    window['ga-disable-YOUR-GA-ID'] = true;
  }
  
  // Exemple : Gérer les cookies marketing
  if (this.preferences.marketing) {
    // Initialiser les scripts de marketing
  } else {
    // Supprimer les cookies marketing existants
    this.deleteCookiesByCategory('marketing');
  }
}
```

## API

### Fonctions principales

#### `initCookieConsent(config)`
Initialise la bannière de consentement avec une configuration personnalisée.

#### `isCookieCategoryAccepted(category)`
Vérifie si une catégorie de cookies est acceptée par l'utilisateur.

```javascript
import { isCookieCategoryAccepted } from './utils/cookieConsent.js';

// Avant de charger un script d'analyse
if (isCookieCategoryAccepted('analytics')) {
  // Initialiser l'outil d'analyse
}
```

#### `openCookieSettings()`
Ouvre la bannière de gestion des cookies.

```javascript
import { openCookieSettings } from './utils/cookieConsent.js';

// Ajouter un gestionnaire d'événements à un lien "Gérer les cookies"
document.getElementById('gerer-cookies').addEventListener('click', () => {
  openCookieSettings();
});
```

## Exemples d'utilisation

### Vérifier le consentement avant de charger un script

```javascript
import { isCookieCategoryAccepted } from './utils/cookieConsent.js';

// Charger Google Analytics uniquement si l'utilisateur a accepté
if (isCookieCategoryAccepted('analytics')) {
  // Code pour charger Google Analytics
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X';
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXX-X');
}
```

### Ajouter un lien "Gérer les cookies" dans le footer

```javascript
import { openCookieSettings } from './utils/cookieConsent.js';

// Dans votre composant Footer.js
const Footer = `
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4">
      <!-- Contenu du footer -->
      <div class="mt-4 text-sm text-gray-400">
        <a href="#" id="manage-cookies" class="hover:underline">Gérer les cookies</a>
      </div>
    </div>
  </footer>
`;

// Puis dans un script d'initialisation
document.addEventListener('DOMContentLoaded', () => {
  const manageLink = document.getElementById('manage-cookies');
  if (manageLink) {
    manageLink.addEventListener('click', (e) => {
      e.preventDefault();
      openCookieSettings();
    });
  }
});
```

## FAQ

### Les préférences sont-elles persistantes après fermeture du navigateur ?
Oui, les préférences sont stockées dans le localStorage qui persiste entre les sessions.

### Comment modifier la durée de validité des préférences ?
Modifiez l'option `cookieExpiration` lors de l'initialisation (valeur en jours).

### Comment ajouter une nouvelle catégorie de cookies ?
Ajoutez une nouvelle entrée dans le tableau `cookieCategories` de la configuration.

### Comment tester si les cookies sont correctement bloqués ?
Utilisez les outils de développement de votre navigateur pour vérifier les cookies stockés après avoir défini vos préférences.

### Comment modifier l'apparence de la bannière ?
Modifiez les classes Tailwind dans le fichier `CookieConsent.js`.

### Comment intégrer la bannière avec un outil d'analyse spécifique ?
Personnalisez la fonction `applyPreferences()` dans `cookieConsent.js` pour initialiser ou désactiver votre outil en fonction des préférences utilisateur.

---

## Dépannage avancé

Cette section couvre les problèmes fréquemment rencontrés lors de l'intégration de la bannière de cookies dans de nouveaux projets et propose des solutions détaillées.

### Problème : La bannière ne s'affiche pas au chargement de la page

**Causes possibles et solutions :**

1. **Alpine.js n'est pas correctement chargé**
   ```javascript
   // Vérifiez dans la console si Alpine.js est disponible
   console.log(window.Alpine);
   ```
   Si `undefined` s'affiche, assurez-vous qu'Alpine.js est importé et initialisé dans votre main.js :
   ```javascript
   import Alpine from 'alpinejs';
   window.Alpine = Alpine;
   Alpine.start();
   ```

2. **Ordre d'initialisation incorrect**
   Assurez-vous que l'ordre suivant est respecté :
   - Alpine.js est initialisé (Alpine.start())
   - La bannière est injectée (injectCookieConsent())
   - Le composant est initialisé (initCookieConsent())

3. **Préférences déjà stockées dans localStorage**
   Si l'utilisateur a déjà défini ses préférences, la bannière ne s'affichera pas automatiquement.
   ```javascript
   // Pour tester, effacez les préférences stockées
   localStorage.removeItem('cookie-consent-preferences');
   // Puis rechargez la page
   ```

4. **Erreurs JavaScript bloquantes**
   Vérifiez la console pour détecter des erreurs JavaScript qui pourraient empêcher l'initialisation.

### Problème : Les boutons de la bannière ne fonctionnent pas

**Causes possibles et solutions :**

1. **Événements non attachés correctement**
   Vérifiez que les gestionnaires d'événements sont attachés aux boutons :
   ```javascript
   // Dans la console, inspectez un bouton et vérifiez les événements
   console.log(document.querySelector('.cookie-consent-banner button'));
   ```

2. **Problème avec Alpine.js**
   Vérifiez que les directives Alpine (`x-data`, `@click`, etc.) sont correctement interprétées :
   ```javascript
   // Forcer un clic sur le bouton Accepter
   document.querySelector('[x-data="cookieConsent"] [data-action="accept"]').click();
   ```

### Problème : La fenêtre de personnalisation n'affiche pas les options

**Causes possibles et solutions :**

1. **Composant non initialisé correctement**
   Le problème peut venir de l'initialisation du composant Alpine.js :
   ```javascript
   // Vérifiez que le composant Alpine est correctement initialisé
   console.log(document.getElementById('cookie-consent-banner').__x);
   ```

2. **Configuration incorrecte**
   Assurez-vous que la configuration des catégories de cookies est correcte :
   ```javascript
   // Vérifiez la configuration passée à initCookieConsent
   console.log(window.Alpine.store('cookieConsent').config);
   ```

3. **Erreur dans les templates Alpine**
   Vérifiez les templates Alpine (directives `x-for`) qui affichent les catégories.

### Problème : Le lien "Gérer les cookies" dans le footer ne fonctionne pas

**Causes possibles et solutions :**

1. **Sélecteurs CSS incorrects**
   Assurez-vous que les sélecteurs utilisés dans initCookieSettingsTriggers() correspondent à vos éléments HTML :
   ```javascript
   // Vérifiez si les déclencheurs sont trouvés dans le DOM
   console.log(document.querySelectorAll('.cookie-settings-trigger, #manage-cookies-link').length);
   ```

2. **Événement personnalisé non capturé**
   Testez si l'événement personnalisé fonctionne correctement :
   ```javascript
   // Déclencher manuellement l'événement
   window.dispatchEvent(new CustomEvent('open-cookie-settings'));
   ```

3. **Initialisation trop précoce**
   Les déclencheurs peuvent être initialisés avant que le DOM ne soit prêt. Assurez-vous d'utiliser setTimeout :
   ```javascript
   setTimeout(() => {
     initCookieSettingsTriggers();
   }, 100);
   ```

### Solution d'urgence pour forcer l'affichage

Si vous avez besoin d'une solution rapide en production, ajoutez ce code à la fin de votre main.js :

```javascript
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Forcer l'affichage de la bannière
    const banner = document.getElementById('cookie-consent-banner');
    if (banner && banner.__x) {
      banner.__x.$data.isVisible = true;
      console.log('Bannière forcée à s\'afficher');
    }
  }, 1000);
});
```

### Problème : Les chemins d'importation incorrects

**Causes possibles et solutions :**

1. **Structure de fichiers différente**
   Si votre nouveau projet a une structure différente, vérifiez que les chemins d'importation sont corrects :
   ```javascript
   // Vérifiez les chemins d'importation dans les fichiers suivants
   // - src/utils/cookieConsentInjector.js
   // - src/utils/cookieConsent.js
   // - src/utils/initComponents.js
   ```

2. **Fichiers manquants**
   Assurez-vous que tous les fichiers nécessaires ont été copiés :
   - src/components/notification/CookieConsent.js
   - src/utils/cookieConsent.js
   - src/utils/cookieConsentInjector.js
   - src/utils/storage.js

### Liste de contrôle complète pour débogage

Pour un diagnostic systématique, suivez cette liste de contrôle :

1. **Vérifier les imports et dépendances**
   - Alpine.js est correctement importé et initialisé
   - Tous les fichiers nécessaires sont présents
   - Les chemins d'importation sont corrects

2. **Vérifier l'initialisation**
   - L'ordre d'initialisation est correct
   - Alpine.js est démarré avant l'injection de la bannière
   - Aucune erreur JavaScript dans la console

3. **Vérifier le DOM et les données**
   - La bannière est correctement injectée dans le DOM
   - Le composant Alpine.js est correctement initialisé
   - Les données et la configuration sont correctes

4. **Vérifier les événements**
   - Les gestionnaires d'événements sont correctement attachés
   - Les événements personnalisés fonctionnent

5. **Vérifier le localStorage**
   - Effacer le localStorage pour tester l'affichage initial
   - Vérifier si les préférences sont correctement enregistrées

Si tous ces contrôles ne permettent pas de résoudre le problème, il peut être nécessaire d'examiner le code source plus en détail ou de recréer la bannière à partir de zéro.

---

Pour toute question ou assistance supplémentaire concernant la bannière de consentement RGPD, veuillez contacter l'équipe de développement. 