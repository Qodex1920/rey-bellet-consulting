/**
 * @file ServicesSection.js
 * @description Composant pour créer une section de services simplifiée sans onglets.
 * Présente 3 services directement avec les cartes ServiceCard existantes.
 */

'use strict';

import { createServiceCardEnterprise, createServiceCardPersonal } from '../common/ServiceCard.js';
import { initScrollAnimations } from '../../utils/animations.js';

// Options par défaut pour la section de services simplifiée
const defaultOptions = {
  sectionId: 'services',
  title: 'Mes Offres',
  services: [
    {
      title: 'REPRENDS LES COMMANDES DE TA TRAJECTOIRE',
      description: 'Clarté. Décision. Action. Ta prochaine étape, on la structure ensemble.',
      objective: 'Débloquer le flou professionnel, clarifier ta trajectoire et structurer une évolution alignée avec tes valeurs.',
      concernedText: 'Tu es concerné si :',
      features: [
        'Tu sais que tu dois changer, mais tu ne sais pas vers quoi',
        'Tu veux un job ou une carrière qui te ressemble vraiment',
        'Tu cherches à reconnecter ton activité avec tes vraies ambitions'
      ],
      icon: 'career',
      additionalInfo: '4 semaines',
      price: 'CHF 1\'500.-',
      ctaIntroText: 'Prêt à tracer une trajectoire claire et assumée ?',
      ctaText: 'Réserve ton appel découverte maintenant',
      ctaUrl: '#contact',
      type: 'personal'
    },
    {
      title: 'BÂTIS UN BUSINESS QUI IMPACTE VRAIMENT',
      description: 'Stop aux hésitations. Un business solide, une stratégie imparable.',
      objective: 'Créer une activité indépendante solide et rentable.',
      concernedText: 'Tu es concerné si :',
      features: [
        'Tu veux te lancer en indépendant, mais sans improviser',
        'Tu cherches à structurer ton business pour assurer sa pérennité',
        'Tu veux une stratégie claire et un positionnement percutant dès le départ'
      ],
      icon: 'strategy',
      additionalInfo: '6 semaines',
      price: 'CHF 2\'000.-',
      ctaIntroText: 'Prêt à monter un business qui marque ?',
      ctaText: 'Réserve ton appel découverte maintenant',
      ctaUrl: '#contact',
      type: 'enterprise'
    },
    {
      title: 'OPTIMISE ET DOMINE TON BUSINESS',
      description: 'Repositionne, ajuste, accélère. On transforme ton activité en machine de croissance.',
      objective: 'Ajuster le positionnement, optimiser la gestion et structurer une croissance maîtrisée.',
      concernedText: 'Tu es concerné si :',
      features: [
        'Ton activité fonctionne mais quelque chose coince',
        'Ton positionnement est flou, tu sens que tu dois ajuster ta stratégie',
        'La gestion est chaotique, tu veux stabiliser et structurer ta croissance'
      ],
      icon: 'planning',
      additionalInfo: 'Accompagnement et devis personnalisé',
      ctaIntroText: 'Prêt à passer au niveau supérieur ?',
      ctaText: 'Réserve ton appel découverte maintenant',
      ctaUrl: '#contact',
      type: 'enterprise'
    }
  ]
};

/**
 * Crée le HTML pour une section de services simplifiée
 * @param {Object} options - Options de personnalisation
 * @returns {string} Le HTML de la section de services
 */
export function createServicesSection(options = {}) {
  // Fusionner les options par défaut avec les options fournies
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    services: options.services || defaultOptions.services
  };
  
  const { sectionId, title, services } = mergedOptions;

  // Fonction pour générer le HTML d'une carte de service selon son type
  const createServiceCard = (service) => {
    if (service.type === 'enterprise') {
      return createServiceCardEnterprise({
        ...service
      });
    } else {
      return createServiceCardPersonal({
        ...service
      });
    }
  };

  // Générer les cartes de services
  const serviceCardsHTML = services
    .map((service, index) => {
      const delay = 300 + (index * 100);
      return `<div class="reveal-anim reveal-slide-up delay-${delay} h-full">
        ${createServiceCard(service)}
      </div>`;
    })
    .join('');

  // Construire le HTML complet de la section simplifiée
  return `
    <section id="${sectionId}" class="py-16 text-white reveal-anim reveal-fade">
      <div class="container mx-auto px-4">
        <div class="section-title text-center mb-16 reveal-anim reveal-fade">
          <h2 class="section-title-heading highlight-text-animated text-4xl md:text-5xl reveal-anim reveal-fade">${title}</h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto gap-8 reveal-anim reveal-fade delay-200">
          ${serviceCardsHTML}
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