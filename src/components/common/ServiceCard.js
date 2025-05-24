/**
 * ServiceCard.js - Composant réutilisable pour les cartes de services
 * Génère des cartes de services avec différentes variantes (enterprise, personal, simple)
 * et des options de personnalisation.
 */

"use strict";

import { createButton, buttonIcons } from './Button.js';



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
      return createModernServiceCard(config);
    case 'personal-modern':
      return createModernServiceCard(config);
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
            <svg class="w-4 h-4 mr-2 text-accent" viewBox="0 0 20 20" fill="var(--color-accent)">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>${feature}</span>
          </li>
        `).join('')}
      </ul>`
    : '';

  return `
    <div class="relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent/80 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative bg-gray-900 rounded-lg p-6 h-full flex flex-col">
        <div class="flex items-center justify-between">
          <div class="h-px w-16 bg-gradient-to-r from-accent to-accent/80"></div>
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
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent/80 text-xs font-bold text-black">PRO</span>
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
      <h3 class="text-lg font-semibold text-primary-500 mb-2">${config.title}</h3>
      <p class="text-gray-600 text-sm mb-4">${config.description}</p>
    </div>
  `;
}

/**
 * Crée une carte de service moderne unifiée pour entreprises et particuliers
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte moderne
 */
function createModernServiceCard(config) {

  // Génération des tags (uniquement pour les services particuliers)
  const tagsHtml = config.tags && config.tags.length > 0
    ? `<div class="flex flex-wrap gap-2 mt-3">
        ${config.tags.map(tag => `
          <span class="px-3 py-1 text-xs bg-accent/20 text-white font-medium rounded-full backdrop-blur-sm">${tag}</span>
        `).join('')}
      </div>`
    : '';

  // Génération des éléments de fonctionnalités
  const featuresHTML = config.features.map(feature => `
    <li class="service-card-feature flex items-start mb-2">
      <svg class="service-card-feature-icon flex-shrink-0 w-5 h-5 mr-3 mt-0.5" fill="none" stroke="var(--color-accent)" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-white text-base transition-colors duration-300">${feature}</span>
    </li>
  `).join('');

  // Badge premium conditionnel (uniquement pour les services particuliers)
  const premiumBadge = config.isPremium
    ? `<div class="absolute top-0 right-0 -mt-2 -mr-2 z-20">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent/80 text-xs font-bold text-black">PRO</span>
      </div>`
    : '';
    
  // Affichage conditionnel des informations additionnelles
  const additionalInfoHTML = config.additionalInfo 
    ? `<div class="mt-4 mb-2 ${config.additionalInfo.includes('Accompagnement et devis personnalisé') 
        ? 'text-accent text-lg font-bold text-center' 
        : 'text-white/90 text-sm font-medium'} border-t border-white/10 pt-3">${config.additionalInfo}</div>` 
    : '';
    
  // Affichage conditionnel du prix
  const priceHTML = config.price 
    ? `<div class="mt-2 mb-3 text-accent text-2xl font-bold">${config.price}</div>` 
    : '';
    
  // Affichage conditionnel du bouton CTA
  const ctaHTML = config.ctaText 
    ? `${config.ctaIntroText ? `<p class="text-white/90 text-center text-sm mb-3 font-medium">${config.ctaIntroText}</p>` : ''}
       ${createButton({
        text: config.ctaText,
        type: 'accent',
        url: config.ctaUrl || '#contact',
        icon: buttonIcons.arrowRight,
        size: 'default',
        attributes: {
          class: 'w-full'
        }
      })}`
    : '';

  return `
    <div class="service-card group backdrop-blur-md bg-white/10 border border-accent/30 shadow-lg hover:shadow-xl rounded-lg p-6 relative overflow-hidden transition-all duration-300 h-full flex flex-col">
      ${premiumBadge}
      
      <!-- Effet glassmorphism subtil -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-[#1848A0]/5 opacity-30 mix-blend-overlay"></div>
      
      <!-- Reflet supérieur renforcé pour effet verre et contraste du titre -->
      <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent"></div>
      
      <!-- Élément décoratif supérieur -->
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20"></div>
      
      <!-- Élément décoratif doré latéral, visible au survol -->
      <div class="absolute top-0 right-0 w-1.5 h-0 bg-accent transition-all duration-700 ease-out group-hover:h-full"></div>
      
      <!-- Effet rayonnant dans le coin -->
      <div class="absolute -top-12 -left-12 w-24 h-24 bg-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      <!-- Conteneur du titre avec effet léger -->
      <div class="relative z-10 mb-4">
        <h3 class="service-card-title text-white text-xl md:text-2xl group-hover:text-white/90 font-bold tracking-wide filter drop-shadow-md">${config.title}</h3>
        <!-- Ligne décorative sous le titre -->
        <div class="h-0.5 w-1/4 bg-gradient-to-r from-accent to-transparent mt-1 mb-3"></div>
        
        <p class="service-card-description text-white relative z-10 text-base md:text-lg leading-relaxed italic">
          ${config.description}
        </p>
        
        ${config.objective ? `
          <div class="mt-3 mb-1">
            <h4 class="text-accent font-semibold text-sm uppercase tracking-wider">Objectif :</h4>
            <p class="text-white/90 text-sm mt-1">${config.objective}</p>
          </div>
        ` : ''}
      </div>
      
      ${tagsHtml}
      
      ${config.features.length > 0 ? `
        <div class="mt-2 relative z-10 flex-grow">
          ${config.concernedText ? `
            <p class="text-accent font-semibold text-sm uppercase tracking-wider mb-3">${config.concernedText}</p>
          ` : ''}
          <ul class="service-card-features space-y-0">
            ${featuresHTML}
          </ul>
        </div>
      ` : ''}
      
      <div class="mt-auto">
        ${additionalInfoHTML}
        ${priceHTML}
        ${ctaHTML}
      </div>
      
      <!-- Effet lumineux subtil dans le coin -->
      <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-40 transform scale-0 group-hover:scale-100 transition-all duration-700 ease-out"></div>
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
  addServiceCardTo
}; 