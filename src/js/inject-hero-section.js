/**
 * Script d'injection de la section Hero
 * Ce script crée et injecte la section Hero dans la page
 */

import { createHeroSection, injectHeroSection } from '../components/sections/Hero.js';

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  // Configurer et injecter la section Hero au début du main
  const mainElement = document.querySelector('main');
  if (mainElement && mainElement.firstChild) {
    // Créer un élément conteneur pour la section Hero
    const heroContainer = document.createElement('div');
    heroContainer.id = 'hero-section';
    
    // Insérer le conteneur au début du main
    mainElement.insertBefore(heroContainer, mainElement.firstChild);
    
    // Injecter le Hero avec les options personnalisées
    injectHeroSection('#hero-section', {
      name: 'Laure Rey-Bellet',
      prefix: 'Je suis',
      typingTexts: ['Consultante.', 'Coach.', 'Formatrice.'],
      description: "Le changement ? Tu le prends ou tu le subis. Pas juste du blabla, du vrai mouvement. On casse les vieux schémas, on construit du neuf, on avance !",
      // Les autres options utilisent les valeurs par défaut
    });
    
    // Note: Le bouton CTA sera injecté par le script existant
    // car il réutilise le même ID de conteneur 'hero-cta-button'
  } else {
    console.error('Élément main non trouvé ou vide pour injecter la section Hero');
  }
}); 