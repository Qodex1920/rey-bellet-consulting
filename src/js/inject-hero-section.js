/**
 * Script d'injection de la section Hero
 * Ce script crée et injecte la section Hero dans la page
 */

import { createHeroSection, injectHeroSection } from '../components/sections/Hero.js';

/**
 * Injecte la section Hero dans la page
 */
function injectHero() {
  // Vérifier que la section Hero n'existe pas déjà
  if (document.getElementById('hero-section')) {
    console.log('Section Hero déjà présente, injection ignorée');
    return;
  }

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
      typingTexts: ['Consultante.', 'Coach.', 'Formatrice.', 'Architecte du changement.'],
      description: "Le changement ? Tu le prends ou tu le subis. Pas juste du blabla, du vrai mouvement. On casse les vieux schémas, on construit du neuf, on avance !",
      ctaButton: {
        text: 'Explore tes options',
        url: '#services'
      },
      // Les autres options utilisent les valeurs par défaut
    });
    
    console.log('Section Hero injectée avec succès');

    // Réinitialiser les effets de parallaxe après l'injection du Hero
    if (typeof window.reinitParallax === 'function') {
      // léger délai pour s'assurer que le DOM est mis à jour par le navigateur
      setTimeout(window.reinitParallax, 100);
    } else {
      console.warn('La fonction window.reinitParallax n\'est pas disponible.');
    }

  } else {
    console.error('Élément main non trouvé ou vide pour injecter la section Hero');
  }
}

// Attendre que le DOM soit chargé et exécuter l'injection
document.addEventListener('DOMContentLoaded', injectHero); 