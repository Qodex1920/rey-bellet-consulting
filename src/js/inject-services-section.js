/**
 * @file inject-services-section.js
 * @description Script pour injecter le composant ServicesSection dans la page d'accueil
 */

"use strict";

import { injectServicesSectionTo } from '../components/sections/ServicesSection.js';

// Options personnalisées pour la section services
const servicesOptions = {
  sectionId: 'services',
  title: 'Mes Services',
  subtitle: 'Des solutions adaptées pour entreprises et particuliers, combinant consulting, coaching et formation selon vos besoins',
  enterpriseServices: [
    {
      title: 'Comprendre',
      description: 'Diagnostic complet de votre organisation pour identifier les opportunités de transformation et les défis à relever.',
      features: ['Analyse de la culture d\'entreprise', 'Audit des processus et workflows', 'Évaluation des compétences'],
      icon: 'strategy',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=comprendre'
    },
    {
      title: 'Planifier',
      description: 'Élaboration d\'une stratégie de changement sur mesure avec un plan d\'action détaillé et des indicateurs de succès.',
      features: ['Définition des objectifs et KPIs', 'Feuille de route détaillée', 'Gestion des risques'],
      icon: 'planning',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=planifier'
    },
    {
      title: 'Activer',
      description: 'Implémentation du changement avec accompagnement des équipes et adaptation continue du plan d\'action.',
      features: ['Formation des équipes', 'Communication interne', 'Suivi et ajustement'],
      icon: 'activate',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=activer'
    },
    {
      title: 'Sur mesure',
      description: 'Des services adaptés à vos besoins spécifiques, combinant consulting, coaching et formation selon vos priorités.',
      features: ['Coaching de dirigeants', 'Ateliers de team building', 'Accompagnement sur mesure'],
      icon: 'custom',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=sur-mesure'
    }
  ],
  personalServices: [
    {
      title: 'Révéler ton potentiel',
      description: 'Un programme de coaching individuel pour découvrir et exploiter vos talents et forces naturelles.',
      features: ['Bilan de compétences', 'Découverte de vos talents', 'Plan de développement personnel'],
      icon: 'potential',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=reveler'
    },
    {
      title: 'Donner vie à tes ambitions',
      description: 'Un accompagnement pour définir vos objectifs professionnels et élaborer un plan d\'action concret.',
      features: ['Définition d\'objectifs', 'Élimination des obstacles', 'Stratégies de réussite'],
      icon: 'ambition',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=ambitions'
    },
    {
      title: 'Sur mesure',
      description: 'Un programme personnalisé selon vos besoins spécifiques et vos objectifs de développement personnel.',
      features: ['Coaching sur mesure', 'Formations personnalisées', 'Suivi adapté à vos besoins'],
      icon: 'custom',
      ctaText: 'En savoir plus',
      ctaUrl: '/contact.html?service=sur-mesure-perso'
    }
  ],
  ctaButtons: {
    enterprise: {
      text: 'Demande de devis',
      url: '/contact.html?service=entreprise'
    },
    personal: {
      text: 'Me contacter',
      url: '/contact.html?service=particulier'
    }
  }
};

/**
 * Injecte la section Services dans la page
 */
function injectServicesSection() {
  // Vérifier que la section Services n'a pas déjà été injectée
  if (document.querySelector('#services .services-section-container')) {
    console.log('Section Services déjà injectée, opération ignorée');
    return;
  }
  
  // Chercher le conteneur de services
  const servicesContainer = document.getElementById('services');
  
  if (servicesContainer) {
    try {
      // Injecter le composant dans le conteneur
      injectServicesSectionTo('#services', servicesOptions);
      console.log('Composant ServicesSection injecté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'injection du composant ServicesSection:', error);
    }
  } else {
    console.warn('Aucun conteneur #services trouvé dans la page');
  }
}

// Attendre que le DOM soit chargé et exécuter l'injection
document.addEventListener('DOMContentLoaded', injectServicesSection); 