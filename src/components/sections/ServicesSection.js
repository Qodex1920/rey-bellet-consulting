/**
 * @file ServicesSection.js
 * @description Composant pour créer une section de services interactive avec onglets Entreprises/Particuliers.
 * Utilise Alpine.js pour la gestion des onglets et intègre les composants ServiceCard.
 */

'use strict';

import { initAlpine } from '../../utils/componentInjector.js';
import { createServiceCardEnterprise, createServiceCardPersonal } from '../common/ServiceCard.js';
import { isInViewport } from '../../utils/viewport.js';

// Options par défaut pour la section de services
const defaultOptions = {
  sectionId: 'services-section',
  title: 'Nos Services',
  subtitle: 'Des solutions adaptées pour entreprises et particuliers',
  images: {
    enterprise: 'assets/images/reunion-2_1080.webp',
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
    <section id="${sectionId}" class="py-16 text-white" x-data="{ activeTab: 'enterprise' }">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12" data-scroll-animation>
          <h2 class="text-3xl font-bold text-white mb-4">${title}</h2>
          ${subtitle ? `<p class="text-lg text-gray-300 max-w-3xl mx-auto">${subtitle}</p>` : ''}
        </div>
        
        <div class="flex justify-center mb-8 border-b border-gray-700" data-scroll-animation>
          <button 
            @click="activeTab = 'enterprise'" 
            :class="activeTab === 'enterprise' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'" 
            class="py-4 px-6 font-medium text-lg border-b-2 transition-colors"
          >
            Entreprises
          </button>
          <button 
            @click="activeTab = 'personal'" 
            :class="activeTab === 'personal' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'" 
            class="py-4 px-6 font-medium text-lg border-b-2 transition-colors"
          >
            Particuliers
          </button>
        </div>
        
        <div class="mt-8">
          <!-- Onglet Services Entreprises -->
          <div x-show="activeTab === 'enterprise'" 
               x-transition:enter="transition ease-out duration-300" 
               x-transition:enter-start="opacity-0 transform translate-y-4" 
               x-transition:enter-end="opacity-100 transform translate-y-0"
               class="rounded-xl p-8">
            
            <!-- Titre de la section entreprises -->
            <h3 class="text-2xl font-semibold text-white text-center mb-6">${enterpriseSectionTitle}</h3>
            
            <!-- Image d'introduction entreprises -->
            <div class="mb-12 relative mx-auto max-w-4xl overflow-hidden">
              <div class="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="${images.enterprise}" 
                  alt="Services pour entreprises" 
                  class="w-full h-48 md:h-64 object-cover"
                >
                <!-- Overlay subtil avec dégradé -->
                <div class="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent opacity-60"></div>
              </div>
              
              <!-- Décoration graphique -->
              <div class="absolute -bottom-3 -right-3 w-32 h-32 rounded-full border-4 border-accent-500/30 -z-10"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              ${enterpriseCardsHTML}
            </div>
          </div>
          
          <!-- Onglet Services Particuliers -->
          <div x-show="activeTab === 'personal'" 
               x-transition:enter="transition ease-out duration-300" 
               x-transition:enter-start="opacity-0 transform translate-y-4" 
               x-transition:enter-end="opacity-100 transform translate-y-0">
            
            <!-- Titre de la section particuliers -->
            <h3 class="text-2xl font-semibold text-white text-center mb-6">${personalSectionTitle}</h3>
            
            <!-- Image d'introduction particuliers -->
            <div class="mb-12 relative mx-auto max-w-4xl overflow-hidden">
              <div class="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="${images.personal}" 
                  alt="Services pour particuliers" 
                  class="w-full h-48 md:h-64 object-cover"
                >
                <!-- Overlay subtil avec dégradé -->
                <div class="absolute inset-0 bg-gradient-to-bl from-accent-500/20 to-transparent opacity-60"></div>
              </div>
              
              <!-- Décoration graphique -->
              <div class="absolute -bottom-3 -left-3 w-32 h-32 rounded-full border-4 border-primary-500/30 -z-10"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(personalServices.length, 3)} gap-8">
              ${personalCardsHTML}
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

/**
 * Initialise les animations au défilement pour les éléments avec l'attribut data-scroll-animation
 * @private
 */
function initScrollAnimations() {
  // Vérifier si l'utilisateur préfère réduire les animations
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Rendre tous les éléments visibles sans animation
    document.querySelectorAll('[data-scroll-animation]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }
  
  // Créer un observateur d'intersection pour animer les éléments quand ils entrent dans le viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observer tous les éléments avec l'attribut data-scroll-animation
  document.querySelectorAll('[data-scroll-animation]').forEach(element => {
    observer.observe(element);
  });
}

// Export par défaut pour faciliter l'importation
export default {
  createServicesSection,
  injectServicesSectionTo
}; 