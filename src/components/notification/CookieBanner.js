/**
 * Composant de bannière de consentement aux cookies (RGPD)
 * Implémenté selon l'architecture des composants Alpine.js
 */

"use strict";

/**
 * Configuration par défaut pour la bannière de cookies
 */
const defaultConfig = {
  storageKey: 'cookie-consent-preferences',
  policyUrl: '/politique-de-confidentialite.html',
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

/**
 * Flag pour suivre si la bannière a déjà été initialisée
 */
let isBannerInitialized = false;

/**
 * Vérifie si une catégorie de cookies est acceptée
 * @param {string} categoryId - Identifiant de la catégorie
 * @returns {boolean} - True si acceptée, false sinon
 */
export function isCookieCategoryAccepted(categoryId) {
  const savedPrefs = localStorage.getItem(defaultConfig.storageKey);
  
  if (!savedPrefs) return false;
  
  try {
    const preferences = JSON.parse(savedPrefs);
    return !!preferences[categoryId];
  } catch (e) {
    return false;
  }
}

/**
 * Ouvre la bannière de gestion des cookies
 */
export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('open-cookie-settings'));
}

/**
 * Initialise la bannière de consentement aux cookies
 * @param {Object} customConfig - Configuration personnalisée (optionnelle)
 */
export function initCookieBanner(customConfig = {}) {
  // Éviter la double initialisation
  if (isBannerInitialized || document.getElementById('cookie-consent-banner')) {
    return;
  }
  
  isBannerInitialized = true;
  
  // Fusionner la configuration personnalisée avec la configuration par défaut
  const config = { ...defaultConfig, ...customConfig };
  if (customConfig.cookieCategories) {
    config.cookieCategories = customConfig.cookieCategories;
  }
  
  // S'assurer que Alpine.js est disponible
  if (!window.Alpine) {
    console.error('Alpine.js est nécessaire pour la bannière de cookies');
    return;
  }
  
  // Définir le comportement Alpine pour le consentement aux cookies
  window.Alpine.data('cookieConsent', () => ({
    isVisible: false,
    showDetails: false,
    hasConsented: false,
    config: config,
    preferences: {},
    
    init() {
      // Réagir à l'événement pour ouvrir les paramètres
      window.addEventListener('open-cookie-settings', () => {
        this.reopenBanner();
      });
      
      // Vérifier si l'utilisateur a déjà défini ses préférences
      const savedPrefs = localStorage.getItem(this.config.storageKey);
      
      if (savedPrefs) {
        try {
          this.preferences = JSON.parse(savedPrefs);
          this.hasConsented = true;
          this.isVisible = false;
        } catch (e) {
          this.resetPreferences();
          this.isVisible = true;
        }
      } else {
        // Initialiser les préférences par défaut (requis seulement)
        this.resetPreferences();
        // Afficher la bannière après un court délai
        setTimeout(() => {
          this.isVisible = true;
        }, 1000);
      }
    },
    
    resetPreferences() {
      // Initialiser avec uniquement les cookies essentiels
      this.preferences = {};
      
      this.config.cookieCategories.forEach(category => {
        this.preferences[category.id] = category.required;
      });
    },
    
    updatePreference(categoryId, value) {
      this.preferences[categoryId] = value;
    },
    
    acceptAll() {
      this.config.cookieCategories.forEach(category => {
        this.preferences[category.id] = true;
      });
      
      this.savePreferences();
    },
    
    rejectAll() {
      this.resetPreferences();
      this.savePreferences();
    },
    
    savePreferences() {
      // Enregistrer les préférences
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.preferences));
      this.hasConsented = true;
      this.isVisible = false;
      
      // Émettre un événement pour que d'autres scripts puissent réagir
      window.dispatchEvent(new CustomEvent('cookieconsent', { 
        detail: { preferences: this.preferences } 
      }));
      
      // Appliquer les préférences
      this.applyPreferences();
    },
    
    reopenBanner() {
      this.isVisible = true;
    },
    
    /**
     * Applique les préférences de cookies (à personnaliser selon les besoins)
     */
    applyPreferences() {
      // Exemple : Google Analytics
      if (this.preferences.analytics) {
        // Analytics activé
      } else {
        // Analytics désactivé
      }
      
      // Exemple : cookies marketing
      if (this.preferences.marketing) {
        // Marketing activé
      } else {
        // Marketing désactivé
      }
    }
  }));
  
  // Fonction pour injecter le HTML dans le DOM
  const injectBanner = () => {
    if (document.getElementById('cookie-consent-banner')) {
      return; // Déjà injecté
    }
    
    const bannerElement = document.createElement('div');
    bannerElement.innerHTML = getCookieBannerHTML();
    document.body.appendChild(bannerElement.firstElementChild);
    
    // Initialiser les déclencheurs pour ouvrir la bannière
    setTimeout(() => {
      const triggers = document.querySelectorAll('.cookie-settings-trigger, [data-cookie-settings]');
      
      triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('open-cookie-settings'));
        });
      });
    }, 100);
  };
  
  // Injecter la bannière immédiatement si le DOM est déjà chargé
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectBanner();
  } else {
    // Sinon, attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', injectBanner);
  }
  
  // Exporter la configuration pour utilisation externe si nécessaire
  return config;
}

/**
 * Récupère le HTML de la bannière de cookies
 * @returns {string} HTML de la bannière
 */
function getCookieBannerHTML() {
  return `
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

  <!-- Panneau détaillé pour personnaliser les choix -->
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

      <!-- Liste des catégories de cookies -->
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

  <!-- Bouton flottant pour réouvrir la bannière -->
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
}

// Auto-initialisation du composant - uniquement si Alpine est disponible
if (typeof window !== 'undefined' && window.Alpine) {
  setTimeout(() => {
    // Vérifier si la bannière n'a pas déjà été initialisée par le code externe
    if (!document.getElementById('cookie-consent-banner') && !isBannerInitialized) {
      initCookieBanner();
    }
  }, 500); // Petit délai pour laisser le temps à l'initialisation externe
}

// Exporter les fonctions pour utilisation externe
export default {
  initCookieBanner,
  isCookieCategoryAccepted,
  openCookieSettings
}; 