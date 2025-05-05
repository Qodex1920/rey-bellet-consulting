# Documentation de la Bannière RGPD

Cette documentation explique comment utiliser et personnaliser la bannière de consentement aux cookies dans votre projet.

## Présentation

La bannière RGPD est un composant Alpine.js qui permet de gérer le consentement des utilisateurs pour les cookies, conformément aux exigences du Règlement Général sur la Protection des Données (RGPD).

## Structure simplifiée

La bannière utilise une architecture légère avec un seul fichier principal :

```
src/
└── components/
    └── notification/
        └── CookieBanner.js      # Composant complet (HTML + logique)
```

## Installation et utilisation

La bannière est déjà intégrée dans le projet et s'initialise automatiquement via `initComponents.js`. Aucune action n'est requise pour l'utilisation de base.

### Intégration dans un nouveau projet

1. Copiez le fichier `CookieBanner.js` dans votre dossier `src/components/notification/`.
2. Assurez-vous qu'Alpine.js est installé dans votre projet.
3. Importez et initialisez le composant dans votre fichier principal:

```javascript
// Dans main.js
import { initCookieBanner } from './components/notification/CookieBanner.js';

// S'assurer qu'Alpine.js est initialisé avant
window.Alpine = Alpine;
Alpine.start();

// Initialiser la bannière
initCookieBanner();
```

### Personnalisation

Si vous souhaitez personnaliser la bannière:

```javascript
import { initCookieBanner } from './components/notification/CookieBanner.js';

// Personnalisation de la bannière
initCookieBanner({
  policyUrl: '/mentions-legales.html',
  cookieCategories: [
    // Vos catégories personnalisées...
  ]
});
```

## Options de configuration

| Option | Type | Description |
|--------|------|-------------|
| `storageKey` | string | Clé de stockage dans le localStorage |
| `policyUrl` | string | URL de la politique de confidentialité |
| `cookieCategories` | array | Liste des catégories de cookies |

Exemple de configuration complète :

```javascript
initCookieBanner({
  storageKey: 'mon-site-cookie-prefs',
  policyUrl: '/mentions-legales.html',
  cookieCategories: [
    {
      id: 'necessary',
      name: 'Nécessaires',
      description: 'Indispensables au fonctionnement du site.',
      required: true
    },
    {
      id: 'analytics',
      name: 'Statistiques',
      description: 'Nous aident à comprendre l\'utilisation du site.',
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Permettent d\'afficher des publicités pertinentes.',
      required: false
    }
  ]
});
```

## Vérification du consentement

Pour vérifier si l'utilisateur a accepté une catégorie de cookies :

```javascript
import { isCookieCategoryAccepted } from './components/notification/CookieBanner.js';

if (isCookieCategoryAccepted('analytics')) {
  // Initialiser Google Analytics
}
```

### Exemple d'intégration avec Google Analytics

```javascript
// Dans un fichier analytics.js
import { isCookieCategoryAccepted } from './components/notification/CookieBanner.js';

export function initAnalytics() {
  // Vérifier le consentement avant de charger Google Analytics
  if (isCookieCategoryAccepted('analytics')) {
    // Charger le script GA
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID`;
    script.async = true;
    document.head.appendChild(script);
    
    // Initialiser GA
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VOTRE-ID');
    
    console.log('Google Analytics activé');
  } else {
    console.log('Google Analytics désactivé - consentement refusé');
  }
}

// Écouter l'événement de changement de préférences
document.addEventListener('cookieconsent', (event) => {
  const { preferences } = event.detail;
  
  if (preferences.analytics) {
    initAnalytics();
  }
});
```

## Ajout d'un bouton "Gérer les cookies"

Ajoutez simplement un élément avec la classe `cookie-settings-trigger` :

```html
<button class="cookie-settings-trigger">Gérer les cookies</button>
```

Ou utilisez l'API JavaScript :

```javascript
import { openCookieSettings } from './components/notification/CookieBanner.js';

document.getElementById('mon-bouton').addEventListener('click', () => {
  openCookieSettings();
});
```

### Exemple d'intégration dans le footer

```html
<footer>
  <div class="container">
    <div class="footer-links">
      <!-- Autres liens -->
      <a href="/mentions-legales">Mentions légales</a>
      <button class="cookie-settings-trigger text-sm underline">Gérer les cookies</button>
    </div>
  </div>
</footer>
```

## Personnalisation graphique

Pour modifier l'apparence de la bannière, modifiez les classes Tailwind dans la fonction `getCookieBannerHTML()` du composant CookieBanner.js.

### Exemple de personnalisation de couleurs

Modifiez dans `CookieBanner.js`:

```javascript
// De:
class="fixed bottom-3 right-3 z-50 max-w-sm rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden"

// À:
class="fixed bottom-3 right-3 z-50 max-w-sm rounded-lg shadow-lg border border-blue-200 bg-blue-50 overflow-hidden"
```

## Comportement personnalisé

Si vous souhaitez modifier le comportement lors du changement de préférences, modifiez la méthode `applyPreferences()` dans le composant Alpine :

```javascript
// Dans CookieBanner.js
applyPreferences() {
  if (this.preferences.analytics) {
    // Code pour activer Google Analytics
    window.gtag = /* ... */;
  }
}
```

## Erreurs courantes et solutions

### Erreur: "Alpine is not defined"
**Solution**: Assurez-vous d'importer et d'initialiser Alpine.js avant d'initialiser la bannière.

```javascript
import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

// Puis seulement après:
initCookieBanner();
```

### Erreur: "Bannière non visible"
**Solutions possibles**:
1. Vérifiez que le fichier est correctement importé
2. Vérifiez si des erreurs JavaScript bloquent l'exécution
3. Vérifiez que le localStorage n'a pas déjà des préférences enregistrées:
   ```javascript
   // Dans la console pour tester:
   localStorage.removeItem('cookie-consent-preferences');
   // Puis rechargez la page
   ```

### Erreur: "Import path error"
**Solution**: Vérifiez le chemin d'importation. Les chemins relatifs commencent par `./` ou `../`:
```javascript
// Correct:
import { initCookieBanner } from './components/notification/CookieBanner.js';

// Incorrect:
import { initCookieBanner } from 'components/notification/CookieBanner.js';
```

## Compatibilité avec les frameworks

### Vue.js
Pour utiliser avec Vue, initialisez la bannière après le montage de l'application:
```javascript
import { createApp } from 'vue';
import { initCookieBanner } from './components/notification/CookieBanner.js';

const app = createApp(App);
app.mount('#app');

// Après le montage
initCookieBanner();
```

### React
Pour React, utilisez un effet:
```javascript
import { useEffect } from 'react';
import { initCookieBanner } from './components/notification/CookieBanner.js';

function App() {
  useEffect(() => {
    initCookieBanner();
  }, []);
  
  return (/* ... */);
}
```

## Liste de vérification rapide

- [ ] Alpine.js est importé et initialisé
- [ ] CookieBanner.js est correctement importé
- [ ] initCookieBanner() est appelé après l'initialisation d'Alpine
- [ ] La politique de confidentialité est à jour et accessible
- [ ] Tous les scripts analytiques vérifient le consentement avant de s'exécuter 