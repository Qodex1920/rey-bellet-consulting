// Importation des styles
import './styles/main.css';

// Importation des utilitaires d'animation
import * as animations from './utils/animations.js';
window.animations = animations;

// Importation de la fonction d'initialisation principale
import { initSite } from './utils/main.js';
import initComponents from './utils/initComponents.js';

// Attendre le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initialisation du site");
  
  // Vérifier si Alpine.js est disponible via CDN
  if (typeof window.Alpine === 'undefined') {
    console.error("Alpine.js n'est pas chargé - vérifiez que les scripts CDN sont présents dans le HTML");
  } else {
    console.log("Alpine.js détecté via CDN");
    
    // Rendre les animations disponibles pour Alpine
    if (!window.Alpine.magic('animations')) {
      window.Alpine.magic('animations', () => animations);
    }
  }
  
  // Initialiser le site
  initSite();
  
  // Initialiser les composants (dont la bannière de cookies)
  initComponents();
}); 