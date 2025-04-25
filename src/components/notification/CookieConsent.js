/**
 * Composant de bannière de consentement aux cookies (RGPD)
 * Ce composant permet de gérer le consentement des utilisateurs pour les cookies
 * conformément aux exigences du RGPD (Règlement Général sur la Protection des Données)
 */

import { getFromLocalStorage, saveToLocalStorage } from '../../utils/storage.js';

// Configuration par défaut - peut être personnalisée lors de l'intégration
const defaultConfig = {
  storageKey: 'cookie-consent-preferences',
  policyUrl: '/politique-de-confidentialite.html',
  companyName: 'Notre Entreprise',
  cookieExpiration: 180, // jours
  cookieCategories: [
    {
      id: 'necessary',
      name: 'Nécessaires',
      description: 'Indispensables au fonctionnement du site.',
      required: true
    },
    {
      id: 'functional',
      name: 'Fonctionnels',
      description: 'Permettent d\'améliorer les fonctionnalités du site.',
      required: false
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
};

// HTML du composant
const CookieConsent = `
<div 
  id="cookie-consent-banner" 
  x-data="cookieConsent"
  x-init="init()"
  x-show="isVisible"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0 scale-95"
  x-transition:enter-end="opacity-100 scale-100"
  x-transition:leave="transition ease-in duration-200"
  x-transition:leave-start="opacity-100 scale-100"
  x-transition:leave-end="opacity-0 scale-95"
  class="fixed bottom-3 right-3 z-50 max-w-sm rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden"
>
  <!-- Bannière principale -->
  <div x-show="!showDetails" class="p-3">
    <div class="flex flex-col gap-2">
      <p class="text-gray-700 text-xs">
        <span class="font-medium">🍪</span> 
        Nous utilisons des cookies pour améliorer votre expérience.
      </p>
      <div class="flex flex-wrap gap-1 items-center text-xs">
        <button 
          @click="rejectAll" 
          class="btn btn-small btn-outline"
        >
          Refuser
        </button>
        <button 
          @click="acceptAll" 
          class="btn btn-small btn-primary"
        >
          Accepter
        </button>
        <a href="#" @click.prevent="showDetails = true" class="text-primary-600 hover:underline text-xs ml-1">
          Personnaliser
        </a>
      </div>
    </div>
  </div>

  <!-- Panneau détaillé pour personnaliser les choix - version simplifiée -->
  <div x-show="showDetails" class="p-3 overflow-auto" style="max-height: 90vh;">
    <div class="bg-white">
      <div class="mb-2">
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-medium text-gray-900">Paramètres cookies</h3>
          <button 
            @click="showDetails = false" 
            class="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-xs text-gray-500">
          <a :href="config.policyUrl" class="text-primary-600 hover:underline" target="_blank">Politique de confidentialité</a>
        </p>
      </div>

      <!-- Liste des catégories de cookies (version compacte) -->
      <div class="space-y-1 mb-3">
        <template x-for="category in config.cookieCategories" :key="category.id">
          <div class="flex items-center border border-gray-200 rounded-sm px-2 py-1.5">
            <div class="flex-1">
              <p class="text-xs font-medium" x-text="category.name"></p>
              <p class="text-xs text-gray-500 mt-0.5 leading-tight" x-text="category.description"></p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer ml-1">
              <input 
                type="checkbox"
                :id="'cookie-' + category.id"
                :disabled="category.required" 
                :checked="category.required || preferences[category.id]"
                @change="updatePreference(category.id, $event.target.checked)"
                class="sr-only peer"
              >
              <div class="relative w-7 h-4 bg-gray-200 peer-focus:ring-1 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
          </div>
        </template>
      </div>

      <!-- Boutons d'action -->
      <div class="flex flex-wrap gap-1 justify-end">
        <button 
          @click="rejectAll" 
          class="btn btn-small btn-outline"
        >
          Refuser tout
        </button>
        <button 
          @click="savePreferences" 
          class="btn btn-small btn-primary"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>

  <!-- Bouton flottant pour réouvrir la bannière (affiché uniquement après fermeture) -->
  <div 
    x-show="!isVisible && hasConsented"
    x-transition
    @click="reopenBanner"
    class="fixed bottom-3 right-3 bg-white rounded-full p-2 shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition z-50"
    title="Gérer les cookies"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </div>
</div>
`;

export default CookieConsent; 