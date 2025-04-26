// Importation des styles
import './styles/main.css';

// Importation d'Alpine.js
import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';
window.Alpine = Alpine;

// Enregistrement du plugin Intersect
Alpine.plugin(intersect);

// Importation des utilitaires d'animation
import * as animations from './utils/animations.js';
window.animations = animations;

// Importation des utilitaires
import initComponents from './utils/initComponents.js';
import { initContactForm, initScrollAnimations, initNavigation } from './utils/main.js';

// Rendre les utilitaires disponibles globalement
window.initContactForm = initContactForm;

// Démarrer Alpine.js
Alpine.start();

// Fonction pour initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM chargé, initialisation de l\'application...');
  
  // Initialiser la navigation
  initNavigation();
  
  // Initialiser les composants interactifs
  try {
    initComponents();
    console.log('Composants interactifs initialisés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des composants:', error);
  }
  
  // Activer les animations au scroll
  initScrollAnimations();
  
  // Initialiser le formulaire de contact si présent sur la page
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    initContactForm();
  }
}); 