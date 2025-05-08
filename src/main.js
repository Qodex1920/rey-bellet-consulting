/**
 * Point d'entrée principal du site Rey-Bellet Consulting
 * Ce fichier initialise toutes les fonctionnalités du site
 */

// Mode strict pour éviter les erreurs courantes
"use strict";

// Importation des styles
import './styles/main.css';

// Importation Alpine.js (uniquement si pas chargé via CDN)
// import Alpine from 'alpinejs';
// import intersect from '@alpinejs/intersect';

// Importation des utilitaires et composants nécessaires
import { getTemplate } from './utils/templates.js';
import { initComponentSystem } from './utils/componentInjector.js';
import { initAlpineBehaviors } from './utils/alpine-behaviors.js';
import { initContactForm } from './utils/formHandler.js';
import { initBackgroundTransition } from './components/effects/BackgroundTransition.js';
import initComponents from './utils/initComponents.js';

// Attendre le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initialisation du site Rey-Bellet Consulting");
  
  // Initialiser Alpine.js si nécessaire (uniquement si pas chargé via CDN)
  initAlpine();
  
  // Initialiser toutes les fonctionnalités du site
  initSite();
});

/**
 * Initialise et configure Alpine.js
 */
async function initAlpine() {
  // Vérifier si Alpine.js est déjà disponible via CDN
  if (typeof window.Alpine === 'undefined') {
    console.warn("Alpine.js n'est pas chargé via CDN - vérifiez que les scripts sont présents dans le HTML");
    
    // Si vous souhaitez charger Alpine.js dynamiquement en cas d'absence du CDN, 
    // décommentez les lignes suivantes:
    /*
    try {
      const Alpine = await import('alpinejs');
      const intersect = await import('@alpinejs/intersect');
      
      window.Alpine = Alpine.default;
      Alpine.default.plugin(intersect.default);
      Alpine.default.start();
      
      console.log("Alpine.js chargé dynamiquement avec succès");
    } catch (error) {
      console.error("Erreur lors du chargement dynamique d'Alpine.js:", error);
    }
    */
  } else {
    console.log("Alpine.js détecté via CDN");
    
    // Initialiser les comportements Alpine.js
    initAlpineBehaviors();
  }
}

/**
 * Initialise toutes les fonctionnalités du site
 */
async function initSite() {
  try {
    // Système de composants (doit être le premier)
    await initComponentSystem();
    
    // Injecter les composants header et footer
    injectTemplateComponents();
    
    // Initialiser le formulaire de contact
    initContactForm();
    
    // Initialiser le bouton retour en haut
    initBackToTopButton();
    
    // Initialiser la navigation
    initNavigation();
    
    // Initialiser la transition de fond
    initBackgroundTransition();
    
    // Initialiser les composants interactifs
    initComponents();
    
    console.log("Site initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du site:", error);
  }
}

/**
 * Injecte les composants depuis les templates JS
 */
function injectTemplateComponents() {
  // Injecter le header
  const headerElement = document.getElementById("app-header");
  if (headerElement) {
    const headerTemplate = getTemplate("header");
    headerElement.replaceWith(headerTemplate);
    console.log("Header injecté via template JS");
  }

  // Injecter le footer
  const footerElement = document.getElementById("app-footer");
  if (footerElement) {
    const footerTemplate = getTemplate("footer");
    footerElement.replaceWith(footerTemplate);
    console.log("Footer injecté via template JS");
  }

  // Initialiser les comportements Alpine après injection
  if (window.Alpine) {
    try {
      window.Alpine.initTree(document.body);
    } catch (error) {
      console.error("Erreur lors de l'initialisation d'Alpine.js:", error);
    }
  }
}

/**
 * Initialise le bouton retour en haut
 */
function initBackToTopButton() {
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    // Afficher/masquer le bouton en fonction du scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("opacity-100", "visible");
      } else {
        backToTopButton.classList.remove("opacity-100", "visible");
      }
    }, { passive: true });

    // Action de retour en haut au clic
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

/**
 * Initialise la navigation et les éléments interactifs du menu
 */
function initNavigation() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const closeButton = document.getElementById("close-mobile-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && closeButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
    });

    closeButton.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
    });
  }

  // Fonction pour les sous-menus mobiles
  window.toggleMobileSubmenu = (id) => {
    const submenu = document.getElementById("submenu-" + id);
    const icon = document.getElementById("icon-" + id);

    if (submenu && icon) {
      if (submenu.classList.contains("hidden")) {
        submenu.classList.remove("hidden");
        icon.classList.add("rotate-180");
      } else {
        submenu.classList.add("hidden");
        icon.classList.remove("rotate-180");
      }
    }
  };
} 