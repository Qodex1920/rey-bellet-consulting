/**
 * ServiceCard.js - Composant réutilisable pour les cartes de services
 * Génère des cartes de services avec différentes variantes (enterprise, personal, simple)
 * et des options de personnalisation.
 */

"use strict";

/**
 * Icônes prédéfinies pour les cartes de service
 */
export const serviceIcons = {
  consulting: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>`,
  training: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>`,
  coaching: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>`,
  growth: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>`,
  custom: 'https://cdn.lordicon.com/lagziwcr.json',
  // Ajout des icônes Lord-icon pour les variantes améliorées
  strategy: 'https://cdn.lordicon.com/jdgfsfzr.json',
  planning: 'https://cdn.lordicon.com/wsvtrygf.json',
  activate: 'https://cdn.lordicon.com/oiveszhb.json',
  development: 'https://cdn.lordicon.com/lagziwcr.json',
  potential: 'https://cdn.lordicon.com/yxpxfegf.json',
  ambition: 'https://cdn.lordicon.com/yxpxfegf.json'
};

/**
 * Crée une carte de service
 * @param {Object} settings Configuration de la carte
 * @param {string} settings.title Titre de la carte
 * @param {string} settings.description Description du service
 * @param {string} settings.variant Type de carte ('enterprise', 'personal', 'simple', 'enterprise-modern', 'personal-modern')
 * @param {Array<string>} [settings.features] Liste des fonctionnalités ou caractéristiques
 * @param {Array<string>} [settings.tags] Liste des tags (pour personal)
 * @param {string} [settings.icon] Icône ou identifiant d'icône
 * @param {boolean} [settings.isPremium] Indique si c'est un service premium (pour personal)
 * @returns {string} HTML de la carte de service
 */
export function createServiceCard(settings) {
  // Configuration par défaut
  const config = {
    title: '',
    description: '',
    variant: 'simple', // 'enterprise', 'personal', 'simple', 'enterprise-modern', 'personal-modern'
    features: [],
    tags: [],
    icon: '',
    isPremium: false,
    ...settings
  };

  // Sélection du template selon la variante
  switch (config.variant) {
    case 'enterprise':
      return createEnterpriseServiceCard(config);
    case 'personal':
      return createPersonalServiceCard(config);
    case 'enterprise-modern':
      return createEnterpriseModernServiceCard(config);
    case 'personal-modern':
      return createPersonalModernServiceCard(config);
    case 'simple':
    default:
      return createSimpleServiceCard(config);
  }
}

/**
 * Crée une carte de service pour entreprises (style original)
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte pour entreprises
 */
function createEnterpriseServiceCard(config) {
  // Génération de la liste de fonctionnalités
  const featuresList = config.features.length 
    ? `<ul class="mt-4 space-y-2">
        ${config.features.map(feature => `
          <li class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>${feature}</span>
          </li>
        `).join('')}
      </ul>`
    : '';

  return `
    <div class="relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-accent-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative bg-gray-900 rounded-lg p-6 h-full flex flex-col">
        <div class="flex items-center justify-between">
          <div class="text-primary-500 mb-4">
            ${config.icon || serviceIcons.consulting}
          </div>
          <div class="h-px w-16 bg-gradient-to-r from-accent-500 to-accent-400"></div>
        </div>
        
        <h3 class="text-xl font-bold text-primary-500 mb-2">${config.title}</h3>
        <p class="text-gray-400 text-sm mb-4 flex-grow">${config.description}</p>
        
        ${featuresList}
      </div>
    </div>
  `;
}

/**
 * Crée une carte de service pour particuliers (style original)
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte pour particuliers
 */
function createPersonalServiceCard(config) {
  // Génération des tags
  const tagsHtml = config.tags.length
    ? `<div class="flex flex-wrap gap-2 mt-3 mb-4">
        ${config.tags.map(tag => `
          <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">${tag}</span>
        `).join('')}
      </div>`
    : '';

  // Badge premium conditionnel
  const premiumBadge = config.isPremium
    ? `<div class="absolute top-0 right-0 -mt-2 -mr-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent-500 to-accent-300 text-xs font-bold text-black">PRO</span>
      </div>`
    : '';

  return `
    <div class="relative group overflow-hidden rounded-lg border border-gray-200 hover:border-primary-400 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
      ${premiumBadge}
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h3 class="text-xl font-bold text-primary-500 group-hover:text-primary-600 transition-colors duration-200">${config.title}</h3>
          <div class="w-8 h-1 bg-primary-500 rounded"></div>
        </div>
        
        <p class="mt-3 text-gray-600">${config.description}</p>
        
        ${tagsHtml}
      </div>
      
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
    </div>
  `;
}

/**
 * Crée une carte de service simple
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte simple
 */
function createSimpleServiceCard(config) {
  return `
    <div class="bg-white p-5 rounded-lg border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow transition-all duration-200">
      <div class="text-primary-600 mb-3">
        ${config.icon || serviceIcons.custom}
      </div>
      
      <h3 class="text-lg font-semibold text-primary-500 mb-2">${config.title}</h3>
      <p class="text-gray-600 text-sm mb-4">${config.description}</p>
    </div>
  `;
}

/**
 * Crée une carte de service pour entreprises avec design moderne
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte moderne pour entreprises
 */
function createEnterpriseModernServiceCard(config) {
  // Vérifier si l'icône est une URL Lord-icon ou une icône SVG
  let iconHTML = '';
  if (typeof config.icon === 'string' && serviceIcons[config.icon] && serviceIcons[config.icon].startsWith('http')) {
    // C'est une URL Lord-icon
    iconHTML = `
      <lord-icon
        src="${serviceIcons[config.icon]}"
        trigger="in"
        colors="primary:var(--color-primary-500),secondary:var(--color-accent-500)"
        delay="300"
        state="in-reveal"
        style="width:48px;height:48px">
      </lord-icon>
    `;
  } else {
    // C'est une icône SVG ou une icône par défaut
    iconHTML = config.icon || serviceIcons.consulting;
  }

  // Génération des éléments de fonctionnalités
  const featuresHTML = config.features.map(feature => `
    <li class="service-card-feature">
      <svg class="service-card-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-gray-300 transition-colors duration-300">${feature}</span>
    </li>
  `).join('');

  return `
    <div class="service-card group">
      <!-- Élément décoratif doré supérieur -->
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-500/20 via-accent-500 to-accent-500/20"></div>
      
      <!-- Élément décoratif doré latéral, visible au survol -->
      <div class="absolute top-0 right-0 w-1.5 h-0 bg-accent-500 transition-all duration-700 ease-out group-hover:h-full"></div>
      
      <!-- Effet rayonnant dans le coin -->
      <div class="absolute -top-12 -left-12 w-24 h-24 bg-accent-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      <div class="flex items-start mb-5">
        <div class="service-card-icon text-primary-500 mr-4 transform transition-all duration-500 ease-out group-hover:scale-110">
          ${iconHTML}
        </div>
        <h3 class="service-card-title text-primary-500 transition-colors duration-300 group-hover:text-primary-400">${config.title}</h3>
      </div>
      
      <p class="service-card-description">
        ${config.description}
      </p>
      
      ${config.features.length > 0 ? `
        <ul class="service-card-features">
          ${featuresHTML}
        </ul>
      ` : ''}
      
      <!-- Effet brillant subtil dans le coin -->
      <div class="gold-decor-shimmer absolute -bottom-16 -right-16 opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-700 ease-out"></div>
    </div>
  `;
}

/**
 * Crée une carte de service pour particuliers avec design moderne
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte moderne pour particuliers
 */
function createPersonalModernServiceCard(config) {
  // Vérifier si l'icône est une URL Lord-icon ou une icône SVG
  let iconHTML = '';
  if (typeof config.icon === 'string' && serviceIcons[config.icon] && serviceIcons[config.icon].startsWith('http')) {
    // C'est une URL Lord-icon
    iconHTML = `
      <lord-icon
        src="${serviceIcons[config.icon]}"
        trigger="in"
        colors="primary:var(--color-primary-500),secondary:var(--color-accent-500)"
        delay="300"
        state="in-reveal"
        style="width:48px;height:48px">
      </lord-icon>
    `;
  } else {
    // C'est une icône SVG ou une icône par défaut
    iconHTML = config.icon || serviceIcons.consulting;
  }

  // Génération des tags
  const tagsHtml = config.tags && config.tags.length > 0
    ? `<div class="flex flex-wrap gap-2 mt-4">
        ${config.tags.map(tag => `
          <span class="px-3 py-1 text-xs bg-primary-500/10 text-primary-500 rounded-full">${tag}</span>
        `).join('')}
      </div>`
    : '';

  // Génération des éléments de fonctionnalités
  const featuresHTML = config.features.map(feature => `
    <li class="service-card-feature">
      <svg class="service-card-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-black">${feature}</span>
    </li>
  `).join('');

  // Badge premium conditionnel
  const premiumBadge = config.isPremium
    ? `<div class="absolute top-0 right-0 -mt-2 -mr-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent-500 to-accent-300 text-xs font-bold text-black">PRO</span>
      </div>`
    : '';

  return `
    <div class="service-card card group relative">
      ${premiumBadge}
      
      <!-- Élément décoratif supérieur -->
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500/20 via-primary-500 to-primary-500/20"></div>
      
      <div class="flex items-start mb-5">
        <div class="service-card-icon text-primary-500 mr-4 transition-transform duration-500 ease-out group-hover:scale-110">
          ${iconHTML}
        </div>
        <h3 class="service-card-title text-primary-500 group-hover:text-primary-400">${config.title}</h3>
      </div>
      
      <p class="service-card-description">
        ${config.description}
      </p>
      
      ${tagsHtml}
      
      ${config.features.length > 0 ? `
        <ul class="service-card-features mt-4">
          ${featuresHTML}
        </ul>
      ` : ''}
      
      <!-- Effet lumineux subtil dans le coin -->
      <div class="gold-decor-shimmer absolute -bottom-12 -right-12 opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-700 ease-out"></div>
    </div>
  `;
}

/**
 * Injecte une carte de service dans un conteneur spécifié
 * @param {string} selector Sélecteur du conteneur cible
 * @param {Object} settings Configuration de la carte de service
 */
export function addServiceCardTo(selector, settings) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`ServiceCard: Conteneur ${selector} non trouvé`);
    return;
  }
  
  container.innerHTML = createServiceCard(settings);
}

// Exports de fonctions spécialisées pour faciliter l'usage
export const createServiceCardEnterprise = (options) => createServiceCard({...options, variant: 'enterprise-modern'});
export const createServiceCardPersonal = (options) => createServiceCard({...options, variant: 'personal-modern'});

// Export des fonctions et constantes
export default {
  createServiceCard,
  createServiceCardEnterprise,
  createServiceCardPersonal,
  addServiceCardTo,
  serviceIcons
}; 