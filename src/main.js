/**
 * Point d'entrée principal du site Rey-Bellet Consulting
 * Ce fichier initialise toutes les fonctionnalités du site
 */

// Mode strict pour éviter les erreurs courantes
"use strict";

// Importation des styles
import './styles/main.css';
import './styles/decorative-elements.css';

// Initialisation d'Alpine.js via notre fichier dédié (DOIT être en premier)
import Alpine from './main-alpine.js';

// Importation et initialisation des comportements Alpine
import { initAlpineBehaviors } from './utils/alpine-behaviors.js';
initAlpineBehaviors();

// Importation du gestionnaire de cache
import { initCacheManager } from './utils/cache-manager.js';

// Importation des utilitaires et composants nécessaires
import { getTemplate } from './utils/templates.js';
import { initComponentSystem } from './utils/componentInjector.js';
import { initContactForm } from './utils/formHandler.js';
import initComponents from './utils/initComponents.js';
import { injectServicesSectionTo } from './components/sections/ServicesSection.js';

// Attendre le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le gestionnaire de cache en premier
  initCacheManager();
  
  // Initialiser toutes les fonctionnalités du site
  initSite();
});

/**
 * Initialise les animations au défilement
 */
function initScrollAnimations() {
  // Sélectionner tous les éléments avec les classes d'animation
  const animatedElements = document.querySelectorAll('.reveal-anim');
  
  // Si aucun élément à animer, sortir
  if (animatedElements.length === 0) {
    return;
  }
  
  // Vérifier si l'utilisateur préfère réduire les animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Si oui, ajouter directement la classe revealed à tous les éléments
    animatedElements.forEach(el => el.classList.add('revealed'));
    return;
  }
  
  // Configuration de l'observateur d'intersection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si l'élément est visible, ajouter la classe revealed
        entry.target.classList.add('revealed');
        // Une fois animé, ne plus observer cet élément
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,        // Déclencher quand 10% de l'élément est visible
    rootMargin: '0px 0px -5% 0px'  // Déclencher un peu avant que l'élément soit visible
  });
  
  // Observer chaque élément avec la classe d'animation
  animatedElements.forEach(el => {
    observer.observe(el);
  });
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
    
    // Injecter la section de services
    injectServicesSection();
    
    // Initialiser les animations au défilement
    initScrollAnimations();
    
    // Initialiser les composants interactifs
    initComponents();
    
    // Initialiser les éléments décoratifs parallaxe
    initDecorativeElements();
    
    // Initialiser les icônes Lord Icon avec les bonnes couleurs
    initLordIcons();
    
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
  }

  // Injecter le footer
  const footerElement = document.getElementById("app-footer");
  if (footerElement) {
    const footerTemplate = getTemplate("footer");
    footerElement.replaceWith(footerTemplate);
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

/**
 * Initialise les éléments décoratifs avec effet de parallaxe
 */
function initDecorativeElements() {
  // Importer dynamiquement le script de parallaxe
  import('./utils/parallax.js')
    .then(() => {
      
      // Ajout d'un effet supplémentaire au défilement pour certains éléments décoratifs
      const decorativeElements = document.querySelectorAll('.decorative-square, .decorative-line');
      
      window.addEventListener('scroll', () => {
        // Obtenir la position de défilement
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Modifier l'opacité des éléments en fonction de la position
        decorativeElements.forEach(element => {
          // Ne pas affecter les éléments qui ont déjà une classe d'animation
          if (!element.classList.contains('shine') && !element.classList.contains('floating')) {
            // Calculer un facteur d'opacité basé sur la position
            const elementPosition = element.getBoundingClientRect().top + scrollPosition;
            const distanceFromTop = Math.abs(scrollPosition - elementPosition);
            
            // Plus l'élément est proche du viewport, plus il est visible
            const maxDistance = viewportHeight * 2;
            const opacity = Math.max(0.1, 1 - (distanceFromTop / maxDistance));
            
            // Appliquer l'opacité
            element.style.opacity = Math.min(element.classList.contains('opacity-10') ? 0.1 : 
                                             element.classList.contains('opacity-20') ? 0.2 : 
                                             element.classList.contains('opacity-30') ? 0.3 : 
                                             element.classList.contains('opacity-40') ? 0.4 : 0.2, 
                                             opacity);
          }
        });
      }, { passive: true });
    })
    .catch(error => {
      console.error("Erreur lors du chargement des effets de parallaxe:", error);
    });
}

/**
 * Injecte la section de services directement dans la page
 */
function injectServicesSection() {
  const servicesContainer = document.getElementById('services');
  
  if (servicesContainer) {
    try {
      // Injecter le composant sans options supplémentaires (utilise les valeurs par défaut)
      injectServicesSectionTo('#services')
        .then(() => {
          
          // Définir l'onglet "Particuliers" comme actif par défaut
          setTimeout(() => {
            const servicesSection = document.querySelector('#services [x-data]');
            if (servicesSection && window.Alpine) {
              try {
                const scope = Alpine.$data(servicesSection);
                if (scope && scope.activeTab !== undefined) {
                  scope.activeTab = 'personal';
                }
              } catch (error) {
                console.warn('Erreur lors de la manipulation Alpine:', error);
              }
            }
          }, 100);
        });
    } catch (error) {
      console.error('Erreur lors de l\'injection de la section services:', error);
    }
      }
}

/**
 * Initialise les icônes Lord Icon avec les bonnes couleurs
 */
function initLordIcons() {
  // S'assurer que lordicon est chargé
  if (typeof window.lordIconElement === 'undefined') {
    
    // Vérifier si le script de Lord Icon est présent
    const lordIconScript = document.querySelector('script[src*="lordicon.js"]');
    if (!lordIconScript) {
      const script = document.createElement('script');
      script.src = "https://cdn.lordicon.com/lordicon.js";
      document.head.appendChild(script);
    }
    
    // Attendre le chargement de Lord Icon puis initialiser
    const checkLordIcon = setInterval(() => {
      if (typeof window.lordIconElement !== 'undefined') {
        clearInterval(checkLordIcon);
        configureLordIcons();
      }
    }, 200);
    
    // Timeout de sécurité après 5 secondes
    setTimeout(() => {
      clearInterval(checkLordIcon);
    }, 5000);
  } else {
    configureLordIcons();
  }
}

/**
 * Configure les couleurs des icônes Lord Icon
 */
function configureLordIcons() {
  
  // Fonction pour configurer les icônes
  const configureIcons = () => {
    // Trouver toutes les icônes lord-icon
    const lordIcons = document.querySelectorAll('lord-icon');
    
    if (lordIcons.length === 0) {
      setTimeout(configureIcons, 500);
      return;
    }
    
    lordIcons.forEach(icon => {
      // Définir les couleurs directement
      icon.setAttribute('colors', 'primary:#FFFFFF,secondary:#FFD700');
      icon.setAttribute('trigger', 'in');
      
      // Forcer le rafraîchissement de l'icône
      if (typeof icon.refresh === 'function') {
        icon.refresh();
      } else if (typeof icon.load === 'function') {
        icon.load();
      } else {
        // Tenter de recharger l'icône en la remplaçant
        const parent = icon.parentNode;
        const src = icon.getAttribute('src');
        if (parent && src) {
          const newIcon = document.createElement('lord-icon');
          newIcon.setAttribute('src', src);
          newIcon.setAttribute('colors', 'primary:#FFFFFF,secondary:#FFD700');
          newIcon.setAttribute('trigger', 'in');
          newIcon.setAttribute('state', 'in-reveal');
          newIcon.setAttribute('delay', '200');
          newIcon.setAttribute('style', icon.getAttribute('style') || 'width:52px;height:52px');
          parent.replaceChild(newIcon, icon);
        }
      }
    });
    
    // Programmer une vérification finale après un délai
    setTimeout(() => {
      const unconfiguredIcons = document.querySelectorAll('lord-icon:not([colors="primary:#FFFFFF,secondary:#FFD700"])');
      if (unconfiguredIcons.length > 0) {
        unconfiguredIcons.forEach(icon => {
          icon.setAttribute('colors', 'primary:#FFFFFF,secondary:#FFD700');
        });
      }
    }, 1000);
  };
  
  // Lancer la configuration initiale
  configureIcons();
} 