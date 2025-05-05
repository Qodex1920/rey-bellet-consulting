/**
 * Module d'injection de composants HTML structurels
 * 
 * REMARQUE IMPORTANTE:
 * Ce fichier s'occupe de l'INJECTION des composants HTML structurels
 * comme l'en-tête (header) et le pied de page (footer) depuis des fichiers HTML externes.
 * 
 * Il est distinct de initComponents.js qui initialise les composants 
 * INTERACTIFS comme la bannière de cookies, accordéons, etc.
 * 
 * Ces deux fichiers forment ensemble l'architecture des composants du site :
 * 1. componentInjector.js : structure HTML (layout)
 * 2. initComponents.js : comportement interactif
 */

"use strict";

/**
 * Vérifie si Alpine.js est disponible
 * Utilise une approche simplifiée compatible avec le chargement CDN
 * @returns {Promise<boolean>} - Indique si Alpine.js est disponible
 */
export async function initAlpine() {
  // Vérifier si Alpine.js est déjà chargé ou en cours de chargement via CDN
  if (window.Alpine) {
    console.log('Alpine.js est déjà chargé via CDN');
    return true;
  }

  // Si Alpine.js n'est pas détecté, afficher un avertissement mais ne pas essayer de le charger
  // puisqu'il devrait déjà être inclus via CDN dans le HTML
  console.warn('Alpine.js n\'a pas été détecté. Vérifiez que le script CDN est correctement inclus dans le HTML.');
  return false;
}

/**
 * Charge un composant HTML depuis un fichier
 * @param {string} componentPath - Chemin vers le fichier du composant
 * @returns {Promise<string>} - Contenu HTML du composant
 */
async function loadComponent(componentPath) {
  try {
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      throw new Error(`Impossible de charger le composant: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Erreur lors du chargement du composant ${componentPath}:`, error);
    return '';
  }
}

/**
 * Injecte les composants header et footer dans la page
 * @returns {Promise<void>}
 */
export async function injectComponents() {
  // Injection du header
  const headerPlaceholder = document.getElementById('app-header');
  if (headerPlaceholder) {
    // Vérifier si le header a déjà été injecté
    if (headerPlaceholder.children.length === 0) {
      const headerContent = await loadComponent('/components/header.html');
      if (headerContent) {
        headerPlaceholder.innerHTML = headerContent;
        console.log('Header injecté avec succès par componentInjector');
        setupMobileMenu();
      }
    } else {
      console.log('Header déjà injecté, skip');
    }
  } else {
    console.warn('Aucun emplacement #app-header trouvé dans la page');
  }
  
  // Injection du footer
  const footerPlaceholder = document.getElementById('app-footer');
  if (footerPlaceholder) {
    // Vérifier si le footer a déjà été injecté
    if (footerPlaceholder.children.length === 0) {
      const footerContent = await loadComponent('/components/footer.html');
      if (footerContent) {
        footerPlaceholder.innerHTML = footerContent;
        console.log('Footer injecté avec succès par componentInjector');
      }
    } else {
      console.log('Footer déjà injecté, skip');
    }
  } else {
    console.warn('Aucun emplacement #app-footer trouvé dans la page');
  }
}

/**
 * Configure le menu mobile après l'injection du header
 */
function setupMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      // Utiliser classList.toggle pour ajouter/supprimer la classe 'hidden'
      mobileMenu.classList.toggle('hidden');
      
      // Mettre à jour l'état d'aria-expanded
      const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
      mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * Détecte et charge d'autres composants marqués avec data-component
 * @returns {Promise<void>}
 */
async function detectOtherComponents() {
  const componentPlaceholders = document.querySelectorAll('[data-component]');
  
  for (const placeholder of componentPlaceholders) {
    const componentName = placeholder.getAttribute('data-component');
    if (componentName) {
      const componentContent = await loadComponent(`/components/${componentName}.html`);
      if (componentContent) {
        placeholder.innerHTML = componentContent;
        console.log(`Composant ${componentName} injecté avec succès`);
      }
    }
  }
}

/**
 * Initialise le système de composants en vérifiant Alpine.js et en injectant les composants
 * @returns {Promise<void>}
 */
export async function initComponentSystem() {
  console.log('Initialisation du système de composants...');
  
  // Vérifier Alpine.js
  await initAlpine();
  
  // Injecter les composants de base (header et footer)
  await injectComponents();
  
  // Détecter et charger d'autres composants
  await detectOtherComponents();
  
  console.log('Système de composants initialisé');
} 