/**
 * @file service-card.js
 * @description Composants pour générer les cartes de services pour entreprises et particuliers.
 * Fournit des fonctions pour créer des cartes de services avec des styles et des structures différents.
 */

'use strict';

/**
 * Crée une carte de service pour entreprises
 * @param {Object} options - Options de configuration
 * @param {string} options.title - Titre du service
 * @param {string} options.description - Description du service
 * @param {Array<string>} options.features - Liste des fonctionnalités ou caractéristiques
 * @param {string} options.icon - Identifiant de l'icône (utilisé pour choisir l'icône à afficher)
 * @param {string} options.ctaText - Texte du bouton d'appel à l'action
 * @param {string} options.ctaUrl - URL de destination du bouton d'appel à l'action
 * @returns {string} HTML de la carte de service entreprise
 */
export function createServiceCardEnterprise({
  title = 'Titre du service',
  description = 'Description du service',
  features = [],
  icon = 'default',
  ctaText = 'En savoir plus',
  ctaUrl = '#'
} = {}) {
  // Mappings des icônes avec leurs sources Lord-icon
  const iconSources = {
    'strategy': 'https://cdn.lordicon.com/jdgfsfzr.json',
    'planning': 'https://cdn.lordicon.com/wsvtrygf.json',
    'activate': 'https://cdn.lordicon.com/oiveszhb.json',
    'custom': 'https://cdn.lordicon.com/lagziwcr.json',
    'development': 'https://cdn.lordicon.com/lkrxcxtf.json',
    'default': 'https://cdn.lordicon.com/yxpxfegf.json'
  };
  
  const iconSource = iconSources[icon] || iconSources.default;
  
  // Générer les éléments de fonctionnalités
  const featuresHTML = features.map(feature => `
    <li class="service-card-feature flex items-center">
      <svg class="service-card-feature-icon h-5 w-5 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-gray-300 group-hover:text-white transition-colors duration-300">${feature}</span>
    </li>
  `).join('');
  
  // Construire le HTML complet de la carte
  return `
    <div 
      class="service-card-enterprise bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-500/20 relative overflow-hidden group"
      x-data="{ hovered: false }"
      x-on:mouseenter="hovered = true"
      x-on:mouseleave="hovered = false">
      
      <!-- Élément décoratif doré supérieur -->
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-600/20 via-accent-500 to-accent-600/20"></div>
      
      <!-- Élément décoratif doré latéral, visible au survol -->
      <div class="absolute top-0 right-0 w-1.5 h-0 bg-accent-500 transition-all duration-700 ease-out group-hover:h-full"></div>
      
      <!-- Effet rayonnant dans le coin -->
      <div class="absolute -top-12 -left-12 w-24 h-24 bg-accent-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      <div class="service-card-header mb-5 flex items-start">
        <div class="service-card-icon text-accent-500 mr-4 transform transition-all duration-500 ease-out group-hover:scale-110">
          <lord-icon
            src="${iconSource}"
            trigger="hover"
            colors="primary:#ffd700,secondary:#1848a0"
            style="width:48px;height:48px">
          </lord-icon>
        </div>
        <h3 class="service-card-title text-2xl font-bold text-white mb-0 group-hover:text-accent-500 transition-colors duration-300">${title}</h3>
      </div>
      
      <p class="service-card-description text-gray-400 mb-6 transition-all duration-300 group-hover:text-gray-300">
        ${description}
      </p>
      
      ${features.length > 0 ? `
        <ul class="service-card-features space-y-3 mb-6">
          ${featuresHTML}
        </ul>
      ` : ''}
      
      ${ctaText && ctaUrl ? `
        <a href="${ctaUrl}" class="inline-flex items-center text-accent-500 font-medium hover:text-accent-400 transition-colors">
          ${ctaText}
          <svg class="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      ` : ''}
      
      <!-- Effet brillant subtil dans le coin -->
      <div 
        class="absolute -bottom-16 -right-16 w-32 h-32 opacity-20 rounded-full bg-accent-500 blur-xl transform scale-0 transition-all duration-700 ease-out" 
        :class="{'scale-100': hovered, 'scale-0': !hovered}"
        ></div>
    </div>
  `;
}

/**
 * Crée une carte de service pour particuliers
 * @param {Object} options - Options de configuration
 * @param {string} options.title - Titre du programme
 * @param {string} options.description - Description du programme
 * @param {Array<string>} options.features - Liste des caractéristiques ou avantages
 * @param {string} options.icon - Identifiant de l'icône (utilisé pour les tags)
 * @param {string} options.ctaText - Texte du bouton d'appel à l'action
 * @param {string} options.ctaUrl - URL de destination du bouton d'appel à l'action
 * @returns {string} HTML de la carte de service particulier
 */
export function createServiceCardPersonal({
  title = 'Titre du programme',
  description = 'Description du programme',
  features = [],
  icon = 'default',
  ctaText = 'En savoir plus',
  ctaUrl = '#'
} = {}) {
  // Mappings des icônes vers des tags affichés sur la carte
  const iconToTags = {
    'potential': ['Coaching', 'Développement', 'Potentiel'],
    'ambition': ['Objectifs', 'Transformation', 'Ambition'],
    'custom': ['Personnalisé', 'Sur mesure', 'Accompagnement'],
    'default': ['Coaching', 'Développement', 'Transformation']
  };
  
  const tags = iconToTags[icon] || iconToTags.default;
  
  // Générer les tags
  const tagsHTML = tags.map(tag => `
    <span class="inline-block bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">${tag}</span>
  `).join('');
  
  // Construire le HTML complet de la carte
  return `
    <div 
      class="service-card-personal relative overflow-hidden bg-gray-900 rounded-xl border border-gray-800 p-8 transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-500/20 group"
      x-data="{ hovered: false }"
      x-on:mouseenter="hovered = true"
      x-on:mouseleave="hovered = false">
      
      <!-- Élément décoratif doré supérieur -->
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-600/20 via-accent-500 to-accent-600/20"></div>
      
      <!-- Élément décoratif doré latéral, visible au survol -->
      <div class="absolute top-0 left-0 h-full w-1.5 bg-accent-500 transform scale-y-0 origin-bottom transition-transform duration-700 ease-out group-hover:scale-y-100"></div>
      
      <!-- Effet brillant dans le coin -->
      <div 
        class="absolute -top-16 -right-16 w-32 h-32 opacity-20 rounded-full bg-accent-500 blur-xl transform scale-0 transition-all duration-700 ease-out" 
        :class="{'scale-100': hovered, 'scale-0': !hovered}"></div>
      
      <!-- Badge premium pour programmes spéciaux -->
      <div class="absolute top-4 right-4 bg-accent-500 bg-opacity-10 text-accent-500 text-xs px-2 py-1 rounded-full font-medium">Premium</div>
      
      <h3 class="service-card-personal-title text-2xl font-bold text-white mb-4 group-hover:text-accent-500 transition-colors duration-300 pr-16">${title}</h3>
      
      <p class="service-card-personal-description text-gray-400 mb-6 transition-all duration-300 group-hover:text-gray-300">
        ${description}
      </p>
      
      ${tags.length > 0 ? `
        <div class="flex flex-wrap gap-3 mb-6">
          ${tagsHTML}
        </div>
      ` : ''}
      
      ${ctaText && ctaUrl ? `
        <a href="${ctaUrl}" class="service-card-personal-link group/link inline-flex items-center text-accent-500 font-medium hover:text-accent-400 transition-colors">
          ${ctaText}
          <svg class="service-card-personal-link-icon ml-2 w-5 h-5 transform transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      ` : ''}
      
      <!-- Élément décoratif en bas -->
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-accent-500 group-hover:w-full transition-all duration-700 ease-out"></div>
    </div>
  `;
}

// Export par défaut pour faciliter l'importation
export default {
  createServiceCardEnterprise,
  createServiceCardPersonal
}; 