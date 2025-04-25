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

// Importation des composants de layout
import './components/layout/Header';
import './components/layout/Footer';

// Importation des composants communs interactifs
import './components/common/Accordion';
import './components/common/Tabs';
import './components/common/Carousel';
import './components/common/Toast';
import './components/notification/CookieConsent';

// Importation des utilitaires
import initComponents from './utils/initComponents.js';
import initContactForm from './utils/formHandler';

// Rendre les utilitaires disponibles globalement
window.initContactForm = initContactForm;

// Démarrer Alpine.js
Alpine.start();

// Fonction pour initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM chargé, initialisation de l\'application...');

  // Récupérer les éléments DOM
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  
  // Remplir l'en-tête et le pied de page
  import('./components/layout/Header').then(headerModule => {
    if (header && headerModule.default) {
      header.innerHTML = headerModule.default;
    }
  }).catch(error => {
    console.error('Erreur lors du chargement du header:', error);
  });
  
  import('./components/layout/Footer').then(footerModule => {
    if (footer && footerModule.default) {
      footer.innerHTML = footerModule.default;
    }
  }).catch(error => {
    console.error('Erreur lors du chargement du footer:', error);
  });
  
  // Initialiser les composants interactifs (y compris la bannière de cookies)
  try {
    initComponents();
    console.log('Composants interactifs initialisés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des composants:', error);
  }
  
  // Initialiser le formulaire de contact si présent sur la page
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    initContactForm();
  }
}); 