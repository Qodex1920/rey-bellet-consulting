/**
 * @file ServicesSection.js
 * @description Composant pour créer une section de services interactive avec onglets Entreprises/Particuliers.
 * Utilise Alpine.js pour la gestion des onglets et intègre les composants ServiceCard.
 */

'use strict';

import { initAlpine } from '../../utils/componentInjector.js';
import { createServiceCardEnterprise, createServiceCardPersonal } from '../common/ServiceCard.js';
import { isInViewport } from '../../utils/viewport.js';
import { initScrollAnimations } from '../../utils/animations.js';

// Options par défaut pour la section de services
const defaultOptions = {
  sectionId: 'services-section',
  title: 'Nos Services',
  subtitle: 'Des solutions adaptées pour entreprises et particuliers',
  images: {
    enterprise: 'assets/images/reunion_1080.webp',
    personal: 'assets/images/coaching-fauteuil_1080.webp'
  },
  enterpriseSectionTitle: 'Services pour entreprises',
  personalSectionTitle: 'Services pour particuliers',
  enterpriseServices: [
    {
      title: 'Conseil Stratégique',
      description: 'Accompagnement personnalisé pour définir et mettre en œuvre votre stratégie digitale',
      features: ['Analyse de situation', 'Définition d\'objectifs', 'Plan d\'action détaillé'],
      icon: 'strategy'
    },
    {
      title: 'Développement Sur Mesure',
      description: 'Création d\'applications web et mobiles selon vos spécifications exactes',
      features: ['Architecture robuste', 'Interface intuitive', 'Maintenance évolutive'],
      icon: 'development'
    }
  ],
  personalServices: [
    {
      title: 'Formation Personnalisée',
      description: 'Développez vos compétences numériques avec un programme adapté à votre niveau',
      features: ['Évaluation initiale', 'Sessions personnalisées', 'Suivi post-formation'],
      icon: 'training'
    },
    {
      title: 'Création de Site Web',
      description: 'Obtenez un site web professionnel qui met en valeur votre activité ou votre portfolio',
      features: ['Design sur mesure', 'Optimisation SEO', 'Responsive design'],
      icon: 'website'
    }
  ]
};

/**
 * Crée le HTML pour une section de services avec onglets
 * @param {Object} options - Options de personnalisation
 * @returns {string} Le HTML de la section de services
 */
export function createServicesSection(options = {}) {
  // Fusionner les options par défaut avec les options fournies
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    enterpriseServices: options.enterpriseServices || defaultOptions.enterpriseServices,
    personalServices: options.personalServices || defaultOptions.personalServices,
    images: {
      ...defaultOptions.images,
      ...(options.images || {})
    }
  };
  
  const { 
    sectionId, title, subtitle, images,
    enterpriseSectionTitle, personalSectionTitle,
    enterpriseServices, personalServices
  } = mergedOptions;

  // Fonction pour générer le HTML d'une carte de service
  const createServiceCard = (type, service) => {
    if (type === 'enterprise') {
      return createServiceCardEnterprise({
        title: service.title,
        description: service.description,
        features: service.features,
        icon: service.icon
      });
    } else {
      return createServiceCardPersonal({
        title: service.title,
        description: service.description,
        features: service.features,
        icon: service.icon
      });
    }
  };

  // Générer les cartes de services pour entreprises
  const enterpriseCardsHTML = enterpriseServices
    .map(service => createServiceCard('enterprise', service))
    .join('');

  // Générer les cartes de services pour particuliers
  const personalCardsHTML = personalServices
    .map(service => createServiceCard('personal', service))
    .join('');

  // Construire le HTML complet de la section avec onglets Alpine.js
  return `
    <section id="${sectionId}" class="py-16 text-white reveal-anim reveal-fade" x-data="{ activeTab: 'enterprise' }">
      <div class="container mx-auto px-4">
        <div class="section-title text-center mb-12 reveal-anim reveal-fade">
          <h2 class="section-title-heading highlight-text-animated text-4xl md:text-5xl reveal-anim reveal-fade">${title}</h2>
          ${subtitle ? `<p class="section-title-subtitle reveal-anim reveal-fade delay-200">${subtitle}</p>` : ''}
        </div>
        
        <div class="flex justify-center mb-8 border-b border-gray-700 reveal-anim reveal-scale delay-300">
          <button 
            @click="activeTab = 'enterprise'" 
            :class="activeTab === 'enterprise' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'" 
            class="py-4 px-6 font-medium text-lg border-b-2 transition-colors reveal-anim reveal-slide-up delay-300"
          >
            Entreprises
          </button>
          <button 
            @click="activeTab = 'personal'" 
            :class="activeTab === 'personal' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'" 
            class="py-4 px-6 font-medium text-lg border-b-2 transition-colors reveal-anim reveal-slide-up delay-400"
          >
            Particuliers
          </button>
        </div>
        
        <div class="mt-8 reveal-anim reveal-fade delay-200">
          <!-- Onglet Services Entreprises -->
          <div x-show="activeTab === 'enterprise'" 
               x-transition:enter="transition ease-out duration-300" 
               x-transition:enter-start="opacity-0 transform translate-y-4" 
               x-transition:enter-end="opacity-100 transform translate-y-0"
               class="rounded-xl p-8 reveal-anim reveal-fade delay-300">
            
            <!-- Image d'introduction entreprises avec titre intégré -->
            <div class="mb-12 relative mx-auto max-w-4xl overflow-hidden reveal-anim reveal-slide-up delay-300">
              <div class="rounded-lg overflow-hidden shadow-md relative">
                <img 
                  src="${images.enterprise}" 
                  alt="Services pour entreprises" 
                  class="w-full h-48 md:h-64 object-cover reveal-anim reveal-fade delay-300"
                >
                <!-- Overlay subtil avec dégradé -->
                <div class="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent opacity-60"></div>
                <!-- Titre bleu, fond blanc, sans bordure, sur une seule ligne -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg px-6 py-2 flex items-center justify-center reveal-anim reveal-slide-up delay-400">
                  <h3 class="text-xl md:text-2xl font-bold text-primary-500 m-0 whitespace-nowrap truncate">${enterpriseSectionTitle}</h3>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 reveal-anim reveal-fade delay-400">
              ${enterpriseServices.map((service, index) => {
                // Ajouter des délais échelonnés aux cartes
                const delay = 400 + (index * 100);
                return `<div class="reveal-anim reveal-slide-up delay-${delay}">
                  ${createServiceCard('enterprise', service)}
                </div>`;
              }).join('')}
            </div>
          </div>
          
          <!-- Onglet Services Particuliers -->
          <div x-show="activeTab === 'personal'" 
               x-transition:enter="transition ease-out duration-300" 
               x-transition:enter-start="opacity-0 transform translate-y-4" 
               x-transition:enter-end="opacity-100 transform translate-y-0"
               class="reveal-anim reveal-fade delay-300">
            
            <!-- Image d'introduction particuliers avec titre intégré -->
            <div class="mb-12 relative mx-auto max-w-4xl overflow-hidden reveal-anim reveal-slide-up delay-300">
              <div class="rounded-lg overflow-hidden shadow-md relative">
                <img 
                  src="${images.personal}" 
                  alt="Services pour particuliers" 
                  class="w-full h-48 md:h-64 object-cover reveal-anim reveal-fade delay-300"
                >
                <!-- Overlay subtil avec dégradé -->
                <div class="absolute inset-0 bg-gradient-to-bl from-accent-500/20 to-transparent opacity-60"></div>
                <!-- Titre bleu, fond blanc, sans bordure, sur une seule ligne -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg px-6 py-2 flex items-center justify-center reveal-anim reveal-slide-up delay-400">
                  <h3 class="text-xl md:text-2xl font-bold text-primary-500 m-0 whitespace-nowrap truncate">${personalSectionTitle}</h3>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-anim reveal-fade delay-400">
              ${personalServices.map((service, index) => {
                // Ajouter des délais échelonnés aux cartes
                const delay = 400 + (index * 100);
                return `<div class="reveal-anim reveal-slide-up delay-${delay}">
                  ${createServiceCard('personal', service)}
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Injecte une section de services dans un conteneur spécifié
 * @param {string} selector - Sélecteur du conteneur cible
 * @param {Object} options - Options pour personnaliser la section
 * @returns {Promise<boolean>} - Promesse résolue quand l'injection est terminée
 */
export async function injectServicesSectionTo(selector, options = {}) {
  try {
    const container = document.querySelector(selector);
    if (!container) {
      console.warn(`ServicesSection: Conteneur ${selector} non trouvé dans le DOM`);
      return false;
    }
    
    // Générer le HTML de la section
    const sectionHTML = createServicesSection(options);
    
    // Injecter le HTML dans le conteneur
    container.innerHTML = sectionHTML;
    
    // Initialiser les animations au défilement
    initScrollAnimations();
    
    // Initialiser Alpine.js si nécessaire
    await initAlpine();
    
    return true;
  } catch (error) {
    console.error('ServicesSection: Erreur lors de l\'injection de la section', error);
    throw error;
  }
}

// Export par défaut pour faciliter l'importation
export default {
  createServicesSection,
  injectServicesSectionTo
}; 