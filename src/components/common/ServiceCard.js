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
  custom: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09Z" />
  </svg>`
};

/**
 * Crée une carte de service
 * @param {Object} settings Configuration de la carte
 * @param {string} settings.title Titre de la carte
 * @param {string} settings.description Description du service
 * @param {string} settings.variant Type de carte ('enterprise', 'personal', 'simple')
 * @param {Array<string>} [settings.features] Liste des fonctionnalités (pour enterprise)
 * @param {Array<string>} [settings.tags] Liste des tags (pour personal)
 * @param {string} [settings.icon] Icône SVG à afficher
 * @param {string} [settings.ctaText] Texte du bouton d'action
 * @param {string} [settings.ctaUrl] URL de redirection
 * @param {boolean} [settings.isPremium] Indique si c'est un service premium (pour personal)
 * @returns {string} HTML de la carte de service
 */
export function createServiceCard(settings) {
  // Configuration par défaut
  const config = {
    title: '',
    description: '',
    variant: 'simple', // 'enterprise', 'personal', 'simple'
    features: [],
    tags: [],
    icon: '',
    ctaText: 'En savoir plus',
    ctaUrl: '#',
    isPremium: false,
    ...settings
  };

  // Sélection du template selon la variante
  switch (config.variant) {
    case 'enterprise':
      return createEnterpriseServiceCard(config);
    case 'personal':
      return createPersonalServiceCard(config);
    case 'simple':
    default:
      return createSimpleServiceCard(config);
  }
}

/**
 * Crée une carte de service pour entreprises
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte pour entreprises
 */
function createEnterpriseServiceCard(config) {
  // Génération de la liste de fonctionnalités
  const featuresList = config.features.length 
    ? `<ul class="mt-4 space-y-2">
        ${config.features.map(feature => `
          <li class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>${feature}</span>
          </li>
        `).join('')}
      </ul>`
    : '';

  return `
    <div class="relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative bg-gray-900 rounded-lg p-6 h-full flex flex-col">
        <div class="flex items-center justify-between">
          <div class="text-amber-400 mb-4">
            ${config.icon || serviceIcons.consulting}
          </div>
          <div class="h-px w-16 bg-gradient-to-r from-amber-500 to-amber-300"></div>
        </div>
        
        <h3 class="text-xl font-bold text-white mb-2">${config.title}</h3>
        <p class="text-gray-400 text-sm mb-4 flex-grow">${config.description}</p>
        
        ${featuresList}
        
        <a href="${config.ctaUrl}" class="mt-6 inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-gray-900 bg-amber-400 hover:bg-amber-300 transition-all duration-200 ease-in-out">
          ${config.ctaText}
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </a>
      </div>
    </div>
  `;
}

/**
 * Crée une carte de service pour particuliers
 * @param {Object} config Configuration de la carte
 * @returns {string} HTML de la carte pour particuliers
 */
function createPersonalServiceCard(config) {
  // Génération des tags
  const tagsHtml = config.tags.length
    ? `<div class="flex flex-wrap gap-2 mt-3 mb-4">
        ${config.tags.map(tag => `
          <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">${tag}</span>
        `).join('')}
      </div>`
    : '';

  // Badge premium conditionnel
  const premiumBadge = config.isPremium
    ? `<div class="absolute top-0 right-0 -mt-2 -mr-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-300 text-xs font-bold text-white">PRO</span>
      </div>`
    : '';

  return `
    <div class="relative group overflow-hidden rounded-lg border border-gray-200 hover:border-blue-400 transition-all duration-300 bg-white shadow-sm hover:shadow-md">
      ${premiumBadge}
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">${config.title}</h3>
          <div class="w-8 h-1 bg-blue-500 rounded"></div>
        </div>
        
        <p class="mt-3 text-gray-600">${config.description}</p>
        
        ${tagsHtml}
        
        <a href="${config.ctaUrl}" class="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
          ${config.ctaText}
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </a>
      </div>
      
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
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
      <div class="text-blue-600 mb-3">
        ${config.icon || serviceIcons.custom}
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2">${config.title}</h3>
      <p class="text-gray-600 text-sm mb-4">${config.description}</p>
      
      <a href="${config.ctaUrl}" class="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center">
        ${config.ctaText}
        <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </a>
    </div>
  `;
}

/**
 * Ajoute une carte de service à un conteneur
 * @param {string} selector Sélecteur CSS du conteneur
 * @param {Object} settings Configuration de la carte
 */
export function addServiceCardTo(selector, settings) {
  const container = document.querySelector(selector);
  if (container) {
    // Effacer le contenu existant
    container.innerHTML = '';
    // Ajouter la nouvelle carte
    container.innerHTML = createServiceCard(settings);
  } else {
    console.warn(`Le conteneur "${selector}" n'a pas été trouvé dans le document.`);
  }
}

// Exemples d'utilisation:
/*
import { createServiceCard, serviceIcons, addServiceCardTo } from '../components/common/ServiceCard.js';

// Carte Service Entreprise
const enterpriseCard = createServiceCard({
  title: 'Conseil en gestion du changement',
  description: 'Accompagnement des organisations dans leurs transformations stratégiques',
  variant: 'enterprise',
  features: [
    'Analyse des besoins',
    'Planification stratégique',
    'Accompagnement des équipes'
  ],
  icon: serviceIcons.consulting,
  ctaText: 'Demander un devis',
  ctaUrl: '/contact.html'
});

// Carte Service Particulier
const personalCard = createServiceCard({
  title: 'Coaching personnel',
  description: 'Développez votre potentiel et atteignez vos objectifs personnels',
  variant: 'personal',
  tags: ['Développement', 'Coaching', 'Bien-être'],
  isPremium: true,
  ctaText: 'Prendre rendez-vous',
  ctaUrl: '/contact.html'
});

// Carte Simple
const simpleCard = createServiceCard({
  title: 'Formation en leadership',
  description: 'Acquérez les compétences essentielles pour diriger efficacement',
  variant: 'simple',
  icon: serviceIcons.training,
  ctaText: 'En savoir plus',
  ctaUrl: '/services.html#formation'
});

// Ajout d'une carte à un conteneur
addServiceCardTo('#enterprise-services-container', {
  title: 'Accompagnement du changement',
  description: 'Solutions sur mesure pour faciliter les transitions organisationnelles',
  variant: 'enterprise',
  features: [
    'Diagnostic organisationnel',
    'Plan de transformation',
    'Ateliers participatifs',
    'Suivi et évaluation'
  ],
  icon: serviceIcons.custom
});
*/ 