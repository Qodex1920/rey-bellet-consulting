# Guide d'implémentation de la Bannière RGPD de Consentement aux Cookies

Ce guide vous explique comment intégrer et configurer correctement la bannière de consentement aux cookies RGPD dans vos nouveaux projets.

## Prérequis

La bannière nécessite :
- Alpine.js (v3.x ou supérieure)
- TailwindCSS (v4.x ou supérieure)

## Installation dans un nouveau projet

### 1. Assurez-vous qu'Alpine.js est bien installé et initialisé

Vérifiez que Alpine.js est bien listé dans vos dépendances package.json :

```json
"dependencies": {
  "alpinejs": "^3.14.0"
}
```

Et qu'il est correctement importé et initialisé dans votre fichier main.js :

```javascript
// Importation d'Alpine.js
import Alpine from 'alpinejs';
window.Alpine = Alpine;

// Démarrer Alpine.js
Alpine.start();
```

### 2. Copiez les fichiers depuis le starter

Assurez-vous d'inclure ces fichiers dans votre nouveau projet :

- `src/components/notification/CookieConsent.js` - Le composant HTML/UI
- `src/utils/cookieConsent.js` - La logique et les utilitaires
- `src/utils/cookieConsentInjector.js` - L'utilitaire d'injection du composant
- `src/utils/storage.js` - Les fonctions d'accès au localStorage

### 3. Vérifiez l'initialisation dans votre composant principal

Importez et initialisez la bannière dans votre fichier d'initialisation des composants :

```javascript
import { initCookieConsent } from './utils/cookieConsent.js';
import { injectCookieConsent } from './utils/cookieConsentInjector.js';

function initComponents() {
  // Vérifier si Alpine.js est disponible
  if (window.Alpine) {
    // Injecter la bannière de consentement aux cookies
    injectCookieConsent();
    
    // Initialiser le consentement aux cookies
    initCookieConsent({
      companyName: 'Nom de votre entreprise',
      policyUrl: '/politique-de-confidentialite.html',
      cookieExpiration: 180 // Valide pour 180 jours
    });
    
    // Initialiser les déclencheurs de paramètres cookies
    setTimeout(initCookieSettingsTriggers, 100);
  }
}
```

### 4. Ajoutez un lien de gestion des cookies dans votre footer

```html
<a href="#" id="manage-cookies-link" class="hover:underline cookie-settings-trigger">Gérer les cookies</a>
```

### 5. Initialisez les déclencheurs pour ce lien

```javascript
function initCookieSettingsTriggers() {
  const triggers = document.querySelectorAll('.cookie-settings-trigger, #manage-cookies-link');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    });
  });
}
```

## Personnalisation

### Configuration de la bannière

Vous pouvez personnaliser la bannière en passant un objet de configuration à `initCookieConsent()`:

```javascript
initCookieConsent({
  companyName: 'Votre Entreprise',
  policyUrl: '/votre-politique.html',
  cookieExpiration: 365, // Jours
  cookieCategories: [
    // Vous pouvez personnaliser les catégories ici
    {
      id: 'analytics',
      name: 'Analytique',
      description: 'Pour analyser le trafic du site',
      required: false
    },
    // Autres catégories...
  ]
});
```

### Personnalisation de l'aspect visuel

Le composant utilise les classes TailwindCSS. Vous pouvez modifier l'apparence en modifiant les classes dans `CookieConsent.js`.

## Utilisation avec vos scripts

Pour vérifier si une catégorie de cookies est acceptée avant de charger un script :

```javascript
import { isCookieCategoryAccepted } from './utils/cookieConsent.js';

// Utilisation dans votre code
if (isCookieCategoryAccepted('analytics')) {
  // Charger votre script d'analyse ici
  loadGoogleAnalytics();
}
```

## Dépannage

### La bannière ne s'affiche pas

1. Vérifiez que Alpine.js est bien chargé :
   ```javascript
   console.log(window.Alpine); // Ne devrait pas afficher undefined
   ```

2. Vérifiez l'injection de la bannière :
   ```javascript
   console.log(document.getElementById('cookie-consent-banner')); // Devrait renvoyer l'élément
   ```

3. Vérifiez le localStorage pour les préférences existantes :
   ```javascript
   console.log(localStorage.getItem('cookie-consent-preferences'));
   ```

### Le lien "Gérer les cookies" ne fonctionne pas

1. Vérifiez que le déclencheur est correctement initialisé :
   ```javascript
   console.log(document.querySelectorAll('.cookie-settings-trigger, #manage-cookies-link').length);
   ```

2. Essayez de déclencher l'événement manuellement :
   ```javascript
   import { openCookieSettings } from './utils/cookieConsent.js';
   openCookieSettings();
   ```

## Ressources additionnelles

Pour plus de détails, consultez la documentation complète dans `docs/cookie-consent.md`.

---

En cas de problème persistant, vérifiez les journaux de la console pour les erreurs liées à Alpine.js ou aux fonctions de consentement aux cookies. 