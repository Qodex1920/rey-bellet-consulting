/**
 * Fichier principal d'initialisation pour le site Rey-Bellet Consulting
 * Fonctionnalités de base pour le site statique
 */

// Mode strict pour éviter les erreurs courantes
"use strict";

// Import des utilitaires et fonctions
import { getTemplate } from './templates.js';
import { initComponentSystem } from './componentInjector.js';
import { initContactForm } from './formHandler.js';

/**
 * Fonction d'initialisation du site
 */
export const initSite = async () => {
  console.log('Initialisation du site Rey-Bellet Consulting');
  
  // Initialisation du système de composants
  await initComponentSystem();
  
  // Injecter les composants depuis templates.js
  injectTemplateComponents();
  
  // Initialisation du formulaire de contact via le module externe
  initContactForm();
  
  // Animation des éléments au scroll
  initScrollAnimations();
  
  // Initialisation du bouton back-to-top
  initBackToTopButton();
  
  // Gestion des menus mobiles et dropdowns
  initNavigation();
};

/**
 * Fonction utilitaire pour vérifier si un élément est dans le viewport
 */
export const isInViewport = (element, offset = 100) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
};

/**
 * Animation des éléments au scroll avec IntersectionObserver
 */
export const initScrollAnimations = () => {
  // Éviter les animations pour les utilisateurs qui préfèrent les réduire
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // Configurer l'observateur d'intersection pour les animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add('animated');
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observer tous les éléments à animer
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
  });
};

/**
 * Initialise le bouton retour en haut
 */
export const initBackToTopButton = () => {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (backToTopButton) {
    // Afficher/masquer le bouton en fonction du scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('opacity-100', 'visible');
      } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
      }
    });
    
    // Action de retour en haut au clic
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Initialisation du site quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initSite);

/**
 * Initialise la navigation et les éléments interactifs du menu
 */
export const initNavigation = () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeButton = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && closeButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
    });
    
    closeButton.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
    });
  }
  
  // Fonction pour les sous-menus mobiles (définie globalement pour être accessible via inline onclick)
  window.toggleMobileSubmenu = (id) => {
    const submenu = document.getElementById('submenu-' + id);
    const icon = document.getElementById('icon-' + id);
    
    if (submenu && icon) {
      if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        submenu.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    }
  };
};

/**
 * Injecte les composants depuis les templates JS
 */
export function injectTemplateComponents() {
  // Injecter le header
  const headerElement = document.getElementById('app-header');
  if (headerElement) {
    const headerTemplate = getTemplate('header');
    headerElement.replaceWith(headerTemplate);
    console.log('Header injecté via template JS');
  }
  
  // Injecter le footer
  const footerElement = document.getElementById('app-footer');
  if (footerElement) {
    const footerTemplate = getTemplate('footer');
    footerElement.replaceWith(footerTemplate);
    console.log('Footer injecté via template JS');
  }
  
  // Initialiser les comportements Alpine après injection
  if (window.Alpine) {
    console.log('Alpine.js détecté, initialisation...');
    try {
      window.Alpine.initTree(document.body);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation d\'Alpine.js:', error);
    }
  } else {
    console.warn('Alpine.js non détecté lors de l\'injection des composants');
    // Attendre que le script Alpine.js soit chargé avant d'initialiser
    document.addEventListener('alpine:init', () => {
      console.log('Événement alpine:init détecté - Les composants sont maintenant définis dans index.html');
    });
  }
}

// Alpine.js components
document.addEventListener('alpine:init', () => {
  // Ces composants sont maintenant définis directement dans le HTML principal
  console.log('Événement alpine:init détecté - Les composants sont maintenant définis dans index.html');
}); 