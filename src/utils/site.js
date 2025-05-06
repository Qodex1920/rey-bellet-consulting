/**
 * Fonctionnalités principales du site Rey-Bellet Consulting
 * Gère l'initialisation des modules et des comportements globaux
 */

// Mode strict pour éviter les erreurs courantes
"use strict";

// Import des utilitaires et fonctions
import { getTemplate } from "./templates.js";
import { initComponentSystem } from "./componentInjector.js";
import { initContactForm } from "./formHandler.js";
import { initBackgroundTransition } from "../components/effects/BackgroundTransition.js";
import { initScrollAnimations, isElementInViewport } from "./animations.js";

/**
 * Fonction d'initialisation du site
 */
export const initSite = async () => {
  console.log("Initialisation des fonctionnalités du site");

  // Initialisation du système de composants
  await initComponentSystem();

  // Injecter les composants depuis templates.js
  injectTemplateComponents();

  // Initialisation du formulaire de contact
  initContactForm();

  // Animation des éléments au scroll
  initScrollAnimations();

  // Initialisation du bouton back-to-top
  initBackToTopButton();

  // Gestion des menus mobiles et dropdowns
  initNavigation();

  // Initialiser la transition de fond
  initBackgroundTransition();

  console.log("Fonctionnalités initialisées avec succès");
};

/**
 * Fonction utilitaire pour vérifier si un élément est dans le viewport
 */
export const isInViewport = isElementInViewport;

/**
 * Initialise le bouton retour en haut
 */
export const initBackToTopButton = () => {
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    // Afficher/masquer le bouton en fonction du scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("opacity-100", "visible");
      } else {
        backToTopButton.classList.remove("opacity-100", "visible");
      }
    });

    // Action de retour en haut au clic
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
};

/**
 * Initialise la navigation et les éléments interactifs du menu
 */
export const initNavigation = () => {
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
};

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
  } else {
    console.warn("Alpine.js non détecté lors de l'injection des composants");
  }
} 