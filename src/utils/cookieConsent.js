/**
 * Module de gestion du consentement aux cookies
 * Définit la fonctionnalité de la bannière de cookies avec Alpine.js
 */

"use strict";

// Configuration des cookies
const cookieConfig = {
  policyUrl: "/politique-confidentialite",
  cookieExpireDays: 365,
  cookieCategories: [
    {
      id: "essential",
      name: "Cookies essentiels",
      description: "Nécessaires au bon fonctionnement du site",
      required: true
    },
    {
      id: "analytics",
      name: "Cookies analytiques",
      description: "Nous aident à comprendre comment vous utilisez le site",
      required: false
    },
    {
      id: "marketing",
      name: "Cookies marketing",
      description: "Utilisés pour la publicité ciblée",
      required: false
    }
  ]
};

// Initialisation du composant Alpine.js pour le consentement aux cookies
document.addEventListener('alpine:init', () => {
  Alpine.data('cookieConsent', () => ({
    isVisible: false,
    showDetails: false,
    hasConsented: false,
    config: cookieConfig,
    preferences: {},

    init() {
      // Vérifier si l'utilisateur a déjà défini ses préférences
      const savedPrefs = this.getCookie('cookie_consent_prefs');
      
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
        // Afficher la bannière
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
      this.isVisible = false;
    },

    rejectAll() {
      this.resetPreferences();
      this.savePreferences();
      this.isVisible = false;
    },

    savePreferences() {
      // Enregistrer les préférences
      this.setCookie('cookie_consent_prefs', JSON.stringify(this.preferences), this.config.cookieExpireDays);
      this.hasConsented = true;
      this.isVisible = false;
      
      // Émettre un événement pour que d'autres scripts puissent réagir
      window.dispatchEvent(new CustomEvent('cookieconsent', { 
        detail: { preferences: this.preferences } 
      }));
    },

    reopenBanner() {
      this.isVisible = true;
    },

    setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    },

    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
  }));
});

// Exporter la configuration pour utilisation dans d'autres modules
export { cookieConfig }; 