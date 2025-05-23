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
  sectionId: 'services',
  title: 'Mes Services',
  subtitle: 'Chaque évolution mérite un plan solide. Découvrez les offres qui vous aideront à structurer votre trajectoire et à avancer avec clarté.',
  images: {
    enterprise: 'assets/images/reunion_1080.webp',
    personal: 'assets/images/coaching-fauteuil_1080.webp'
  },
  enterpriseSectionTitle: 'Structure et propulse ton business',
  personalSectionTitle: 'Reprends le contrôle',
  enterpriseIntroText: 'Un business solide ne s\'improvise pas. Il se construit avec stratégie et impact. Que ce soit un repositionnement ou un lancement, l\'objectif est clair : créer une activité rentable, fluide et alignée',
  personalIntroText: 'Stop au flou. Stop aux choix subis. Il est temps de reprendre les commandes. Mes offres te permettent de structurer ta trajectoire, aligner tes décisions et passer à l\'action avec clarté et puissance.',
  enterpriseServices: [
    {
      title: 'BÂTIS UNE BASE IMBATTABLE – ASSURE TON SUCCÈS',
      description: 'Une activité sans structure = instabilité garantie. On pose les bases solides. On clarifie. On optimise.',
      features: [
        'Audit de ta situation et de tes blocages',
        'Définition d\'un positionnement clair et percutant',
        'Structuration d\'un plan d\'action béton pour assurer la rentabilité et la pérennité'
      ],
      icon: 'strategy',
      additionalInfo: 'Accompagnement et devis personnalisé',
      ctaText: 'Prêt à bâtir un business qui cartonne ? Réserve ton appel découverte',
      ctaUrl: '#contact'
    },
    {
      title: 'OPTIMISE TON BUSINESS – ACCÉLÈRE TA CROISSANCE',
      description: 'Ton activité fonctionne, mais quelque chose coince. Croissance chaotique, gestion floue, perte de repères ? On remet de l\'ordre.',
      features: [
        'Audit global pour comprendre où sont les vrais leviers de performance',
        'Définition d\'une stratégie claire et actionnable',
        'Optimisation des processus pour structurer une croissance durable'
      ],
      icon: 'planning',
      additionalInfo: 'Accompagnement et devis personnalisé',
      ctaText: 'Assez de tâtonnements. Construisons une gestion carrée. Réserve ton appel découverte',
      ctaUrl: '#contact'
    }
  ],
  personalServices: [
    {
      title: 'REPRENDS LE CONTRÔLE – CHOISIS TA DIRECTION',
      description: 'Trop d\'options, zéro certitude. L\'heure n\'est plus aux hésitations',
      features: [
        'On décortique tes motivations et tes aspirations', 
        'On clarifie une direction qui fait sens', 
        'On structure un plan d\'évolution qui te correspond vraiment'
      ],
      icon: 'career',
      additionalInfo: '5 semaines – 1 séance/sem + exercices pratiques et méthodologie sur mesure.',
      price: 'CHF 1\'500.-',
      ctaText: 'Prêt à passer du flou à l\'action ? Réserve ton appel découverte',
      ctaUrl: '#contact'
    },
    {
      title: 'ARRÊTE D\'HÉSITER – ACTIVE TON PLAN DE CROISSANCE',
      description: 'Tu sais ce que tu veux. Mais comment concrétiser ? Un projet sans plan d\'action, c\'est juste une idée qui tourne en rond.',
      features: [
        'On crée une feuille de route ultra claire', 
        'On optimise chaque étape pour que ça roule', 
        'On sécurise ton passage à l\'action avec une méthode qui fonctionne'
      ],
      icon: 'activate',
      additionalInfo: '6 semaines – 1 séance/sem + support stratégique et ajustements.',
      price: 'CHF 2\'000.-',
      ctaText: 'Assez réfléchi. Passons à l\'action. Réserve ton appel découverte',
      ctaUrl: '#contact'
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
    enterpriseIntroText, personalIntroText,
    enterpriseServices, personalServices
  } = mergedOptions;

  // Fonction pour générer le HTML d'une carte de service
  const createServiceCard = (type, service) => {
    if (type === 'enterprise') {
      return createServiceCardEnterprise({
        ...service
      });
    } else {
      return createServiceCardPersonal({
        ...service
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
    <section id="${sectionId}" class="py-16 text-white reveal-anim reveal-fade" x-data="{ activeTab: 'personal' }">
      <div class="container mx-auto px-4">
        <div class="section-title text-center mb-12 reveal-anim reveal-fade">
          <h2 class="section-title-heading highlight-text-animated text-4xl md:text-5xl reveal-anim reveal-fade">${title}</h2>
          ${subtitle ? `<p class="section-title-subtitle reveal-anim reveal-fade delay-200">${subtitle}</p>` : ''}
        </div>
        
        <div class="flex justify-center mb-12 border-b border-gray-700 reveal-anim reveal-scale delay-300">
          <button 
            @click="activeTab = 'personal'" 
            :class="activeTab === 'personal' ? 'border-accent text-accent bg-accent/10' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'" 
            class="py-5 px-8 font-semibold text-xl border-b-4 transition-colors reveal-anim reveal-slide-up delay-300 rounded-t-lg"
          >
            Particuliers
          </button>
          <button 
            @click="activeTab = 'enterprise'" 
            :class="activeTab === 'enterprise' ? 'border-accent text-accent bg-accent/10' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'" 
            class="py-5 px-8 font-semibold text-xl border-b-4 transition-colors reveal-anim reveal-slide-up delay-400 rounded-t-lg"
          >
            Entreprises
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
            <div class="mb-16 relative mx-auto max-w-4xl overflow-hidden reveal-anim reveal-slide-up delay-300">
              <div class="rounded-lg overflow-hidden shadow-md relative">
                <img 
                  src="${images.enterprise}" 
                  alt="Services pour entreprises" 
                  class="w-full h-60 md:h-72 object-cover reveal-anim reveal-fade delay-300"
                >
                <!-- Overlay subtil avec dégradé -->
                <div class="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent opacity-60"></div>
                <!-- Titre bleu, fond blanc, sans bordure, sur une seule ligne -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg px-6 sm:px-8 py-3 flex items-center justify-center reveal-anim reveal-slide-up delay-400 w-4/5 sm:w-auto">
                  <h3 class="text-xl md:text-2xl font-bold text-primary-500 m-0 text-center hyphens-auto">${enterpriseSectionTitle}</h3>
                </div>
              </div>
              <!-- Texte d'introduction pour les services entreprises -->
              <div class="mt-8 mb-10 text-center text-gray-200 reveal-anim reveal-fade delay-400">
                <p class="max-w-3xl mx-auto text-lg">${enterpriseIntroText}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-10 reveal-anim reveal-fade delay-400">
              ${enterpriseServices.map((service, index) => {
                // Ajouter des délais échelonnés aux cartes
                const delay = 400 + (index * 100);
                return `<div class="reveal-anim reveal-slide-up delay-${delay} h-full">
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
            <div class="mb-16 relative mx-auto max-w-4xl overflow-hidden reveal-anim reveal-slide-up delay-300">
              <div class="rounded-lg overflow-hidden shadow-md relative">
                <img 
                  src="${images.personal}" 
                  alt="Services pour particuliers" 
                  class="w-full h-60 md:h-72 object-cover reveal-anim reveal-fade delay-300"
                >
                <!-- Overlay subtil avec dégradé -->
                <div class="absolute inset-0 bg-gradient-to-bl from-accent/20 to-transparent opacity-60"></div>
                <!-- Titre bleu, fond blanc, sans bordure, sur une seule ligne -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg px-6 sm:px-8 py-3 flex items-center justify-center reveal-anim reveal-slide-up delay-400 w-4/5 sm:w-auto">
                  <h3 class="text-xl md:text-2xl font-bold text-primary-500 m-0 text-center hyphens-auto">${personalSectionTitle}</h3>
                </div>
              </div>
              <!-- Texte d'introduction pour les services particuliers -->
              <div class="mt-8 mb-10 text-center text-gray-200 reveal-anim reveal-fade delay-400">
                <p class="max-w-3xl mx-auto text-lg">${personalIntroText}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-10 reveal-anim reveal-fade delay-400">
              ${personalServices.map((service, index) => {
                // Ajouter des délais échelonnés aux cartes
                const delay = 400 + (index * 100);
                return `<div class="reveal-anim reveal-slide-up delay-${delay} h-full">
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